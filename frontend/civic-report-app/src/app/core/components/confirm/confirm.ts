import { Component, EventEmitter, inject, Output } from '@angular/core';
import { ConfirmService } from '../../services/confirm.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirm',
  imports: [MatButtonModule],
  templateUrl: './confirm.html',
  styleUrl: './confirm.scss',
})
export class Confirm {
  confirmService: ConfirmService = inject(ConfirmService);
  @Output() accepted = new EventEmitter<boolean>();

  cancel() {
    this.confirmService.show.set(false);
  }

  accept() {
    this.confirmService.show.set(false);
    this.accepted.emit(true);
  }
}
