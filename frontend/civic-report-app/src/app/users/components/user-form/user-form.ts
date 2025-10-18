import { Component, inject, OnInit, signal } from '@angular/core';
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
import { RolesService } from '../../../roles/services/roles.service';
import { UsersService } from '../../services/users.service';
import { UserDto } from '../../dtos/user.dto';
import { strongPasswordValidator } from '../../../core/validators/strong-password.validator';
import { MatSelectModule } from '@angular/material/select';
import { UpdateUserDto } from '../../dtos/update-user.dto';

@Component({
  selector: 'app-user-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatSelectModule,
    Confirm,
  ],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss',
})
export class UserForm implements OnInit {
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  pageService: PageService = inject(PageService);
  messageService: MessageService = inject(MessageService);
  confirmService: ConfirmService = inject(ConfirmService);
  rolesService: RolesService = inject(RolesService);
  usersService: UsersService = inject(UsersService);
  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [strongPasswordValidator()]),
    enabled: new FormControl(false, [Validators.required]),
    protected: new FormControl(false, [Validators.required]),
    roleIds: new FormControl<string[]>([], [Validators.required]),
  });
  type: string = 'create';
  roles: RoleDto[] = [];
  id!: string;
  user?: UserDto;
  showPassword = signal(true);

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.pageService.setPrevious('/app/users');
    this.loadRoles();
    if (this.id) {
      this.type = 'update';
      this.pageService.setTitle('Editar usuario');
      this.loadUser();
    } else {
      this.type = 'create';
      this.pageService.setTitle('Crear usuario');
    }
  }

  loadRoles() {
    this.rolesService.findAll().subscribe({
      next: async (roles: RoleDto[]) => {
        this.roles = roles;
      },
      error: (error: Error) => {
        this.router.navigate(['/app/users/list']);
      },
    });
  }

  loadUser() {
    this.usersService.findById(this.id).subscribe({
      next: async (user: UserDto) => {
        this.loadForm(user);
      },
      error: (error: Error) => {
        this.router.navigate(['/app/users/list']);
      },
    });
  }

  loadForm(user: UserDto) {
    this.user = user;
    this.form.controls['name'].setValue(user.name);
    this.form.controls['lastName'].setValue(user.lastName);
    this.form.controls['email'].setValue(user.email);
    this.form.controls['enabled'].setValue(user.enabled);
    this.form.controls['protected'].setValue(user.protected);
    if (user.roles) {
      user.roleIds = user.roles.map((role) => role.id);
    }
    this.form.controls['roleIds'].setValue(user.roleIds);
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
    this.usersService
      .create({
        name: this.form.controls['name'].value || '',
        lastName: this.form.controls['lastName'].value || '',
        email: this.form.controls['email'].value || '',
        password: this.form.controls['password'].value || '',
        enabled: this.form.controls['enabled'].value || false,
        protected: this.form.controls['protected'].value || false,
        roleIds: this.form.controls['roleIds'].value || [],
      })
      .subscribe({
        next: async (role: UserDto) => {
          this.messageService.showMessage('Usuario creado correctamente.').then(() => {
            this.router.navigate(['/app/users/list']);
          });
        },
        error: (error: Error) => {
          this.messageService.showMessage(error.message);
        },
      });
  }

  update() {
    const updateUserDto: UpdateUserDto = new UpdateUserDto();

    if (this.form.controls['name'].value) {
      updateUserDto.name = this.form.controls['name'].value;
    }
    if (this.form.controls['lastName'].value) {
      updateUserDto.lastName = this.form.controls['lastName'].value;
    }
    if (this.form.controls['email'].value) {
      updateUserDto.email = this.form.controls['email'].value;
    }
    if (this.form.controls['password'].value) {
      updateUserDto.password = this.form.controls['password'].value;
    }
    updateUserDto.enabled = this.form.controls['enabled'].value || false;
    updateUserDto.protected = this.form.controls['protected'].value || false;
    if (this.form.controls['roleIds'].value) {
      updateUserDto.roleIds = this.form.controls['roleIds'].value;
    }

    this.usersService.update(this.id, updateUserDto).subscribe({
      next: async (user: UserDto) => {
        this.form.controls['password'].setValue('');
        this.showPassword.set(false);
        this.messageService.showMessage('Usuario actualizado correctamente.');
      },
      error: (error: Error) => {
        this.messageService.showMessage(error.message);
      },
    });
  }

  delete() {
    this.confirmService.showConfirm(
      '¿Desea borrar el usuario?',
      'Se eliminara el usuario de la aplicación y el usuario no podran acceder a la aplicación.'
    );
  }

  deleteConfirmed(accepted: boolean) {
    if (accepted) {
      this.usersService.delete(this.id).subscribe({
        next: async (responseDto: ResponseDto) => {
          this.messageService.showMessage(responseDto.message).then(() => {
            this.router.navigate(['/app/users/list']);
          });
        },
        error: (error: Error) => {
          this.messageService.showMessage(error.message);
        },
      });
    }
  }

  togglePassword(event: MouseEvent) {
    this.showPassword.set(!this.showPassword());
    event.stopPropagation();
  }
}
