import { Component, inject, OnInit } from '@angular/core';
import { RolesService } from '../../services/roles.service';
import { MessageService } from '../../../core/services/message.service';
import { PageService } from '../../../core/services/page.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleDto } from '../../../users/dtos/role.dto';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ConfirmService } from '../../../core/services/confirm.service';
import { ResponseDto } from '../../../auth/dtos/response.dto';
import { Confirm } from '../../../core/components/confirm/confirm';

@Component({
  selector: 'app-role-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    Confirm,
  ],
  templateUrl: './role-form.html',
  styleUrl: './role-form.scss',
})
export class RoleForm implements OnInit {
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  pageService: PageService = inject(PageService);
  messageService: MessageService = inject(MessageService);
  confirmService: ConfirmService = inject(ConfirmService);
  rolesService: RolesService = inject(RolesService);
  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    code: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    enabled: new FormControl(false, [Validators.required]),
    protected: new FormControl(false, [Validators.required]),
    permissions: new FormGroup({
      users_create: new FormControl(false, [Validators.required]),
      users_read: new FormControl(false, [Validators.required]),
      users_update: new FormControl(false, [Validators.required]),
      users_delete: new FormControl(false, [Validators.required]),
      roles_create: new FormControl(false, [Validators.required]),
      roles_read: new FormControl(false, [Validators.required]),
      roles_update: new FormControl(false, [Validators.required]),
      roles_delete: new FormControl(false, [Validators.required]),
      reports_create: new FormControl(false, [Validators.required]),
      reports_read: new FormControl(false, [Validators.required]),
      reports_update: new FormControl(false, [Validators.required]),
      reports_delete: new FormControl(false, [Validators.required]),
    }),
  });
  options = [
    {
      name: 'Usuarios',
      code: 'users',
    },
    {
      name: 'Roles',
      code: 'roles',
    },
    {
      name: 'Reportes',
      code: 'reports',
    },
  ];
  type: string = 'create';
  id!: string;
  role?: RoleDto;

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.pageService.setPrevious('/app/roles');
    if (this.id) {
      this.type = 'update';
      this.pageService.setTitle('Editar rol');
      this.loadRole();
    } else {
      this.type = 'create';
      this.pageService.setTitle('Crear rol');
    }
  }

  loadRole() {
    this.rolesService.findById(this.id).subscribe({
      next: async (role: RoleDto) => {
        this.loadForm(role);
      },
      error: (error: Error) => {
        this.router.navigate(['/app/roles/list']);
      },
    });
  }

  loadForm(role: RoleDto) {
    this.role = role;
    this.form.controls['name'].setValue(role.name);
    this.form.controls['code'].setValue(role.code);
    this.form.controls['description'].setValue(role.description);
    this.form.controls['enabled'].setValue(role.enabled);
    this.form.controls['protected'].setValue(role.protected);
    Object.entries(this.form.controls['permissions'].controls).forEach(([name, control]) => {
      if (role.permissions?.includes(name)) {
        control.setValue(true);
      }
    });
  }

  deleteRole() {
    this.confirmService.showConfirm(
      '¿Desea borrar el rol?',
      'Se eliminara el rol de la aplicación y los usuarios no podran acceder a las opciones.'
    );
  }

  formSubmit() {
    if (this.form.valid) {
      if (this.type == 'create') {
        this.create();
      } else if (this.type == 'update') {
        this.update();
      }
    }
  }

  create() {
    const permissions = Object.entries(this.form.controls['permissions'].controls)
      .filter(([_, control]) => control.value === true)
      .map(([name]) => name);

    this.rolesService
      .create({
        name: this.form.controls['name'].value || '',
        code: this.form.controls['code'].value || '',
        description: this.form.controls['description'].value || '',
        enabled: this.form.controls['enabled'].value || false,
        protected: this.form.controls['protected'].value || false,
        permissions: permissions,
      })
      .subscribe({
        next: async (role: RoleDto) => {
          this.messageService.showMessage('Rol creado correctamente.').then(() => {
            this.router.navigate(['/app/roles/list']);
          });
        },
        error: (error: Error) => {
          this.messageService.showMessage(error.message);
        },
      });
  }

  update() {
    const permissions = Object.entries(this.form.controls['permissions'].controls)
      .filter(([_, control]) => control.value === true)
      .map(([name]) => name);

    this.rolesService
      .update(this.id, {
        name: this.form.controls['name'].value || '',
        code: this.form.controls['code'].value || '',
        description: this.form.controls['description'].value || '',
        enabled: this.form.controls['enabled'].value || false,
        protected: this.form.controls['protected'].value || false,
        permissions: permissions,
      })
      .subscribe({
        next: async (role: RoleDto) => {
          this.messageService.showMessage('Rol actualizado correctamente.');
        },
        error: (error: Error) => {
          this.messageService.showMessage(error.message);
        },
      });
  }

  delete(accepted: boolean) {
    if (accepted) {
      this.rolesService.delete(this.id).subscribe({
        next: async (responseDto: ResponseDto) => {
          this.messageService.showMessage(responseDto.message).then(() => {
            this.router.navigate(['/app/roles/list']);
          });
        },
        error: (error: Error) => {
          this.messageService.showMessage(error.message);
        },
      });
    }
  }
}
