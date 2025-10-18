import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageService } from '../../../../core/services/page.service';
import { ReportsService } from '../../../services/reports.service';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MessageService } from '../../../../core/services/message.service';

@Component({
  selector: 'app-report-images-form',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './report-images-form.html',
  styleUrl: './report-images-form.scss',
})
export class ReportImagesForm implements OnInit {
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  pageService: PageService = inject(PageService);
  messageService: MessageService = inject(MessageService);
  reportsService: ReportsService = inject(ReportsService);
  images: { name: string; url: string }[] = [];
  current = signal(0);

  ngOnInit(): void {
    this.pageService.setPrevious('/app/reports/create');
    this.pageService.setTitle('Crear reporte - Fotos');
    if (this.reportsService.report.name === '' || this.reportsService.report.description === '') {
      this.router.navigate(['/app/reports/create']);
    }
  }

  save(): void {
    if (this.reportsService.report.images.length > 0) {
      this.router.navigate(['/app/reports/create/map']);
    } else {
      this.messageService.showMessage('Debes tomar al menos un foto.');
    }
  }

  async takePicture() {
    try {
      const photo: Photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
      });

      if (photo.base64String) {
        const image = `data:image/${photo.format};base64,${photo.base64String}`;

        this.images.push({
          name: 'Photo',
          url: image,
        });

        const blob: Blob = this.base64ToBlob(photo.base64String, `image/${photo.format}`);

        this.reportsService.report.images.push(blob);
      }
    } catch (error) {
      this.messageService.showMessage('Error al tomar la foto.');
    }
  }

  base64ToBlob(base64: string, type = 'image/jpeg'): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type });
  }

  next() {
    this.current.set((this.current() + 1) % this.images.length);
  }

  prev() {
    this.current.set((this.current() - 1 + this.images.length) % this.images.length);
  }
}
