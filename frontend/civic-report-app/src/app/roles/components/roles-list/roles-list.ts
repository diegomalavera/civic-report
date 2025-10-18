import { Component, inject, OnInit } from '@angular/core';
import { RoleDto } from '../../../users/dtos/role.dto';
import { RolesService } from '../../services/roles.service';
import { MessageService } from '../../../core/services/message.service';
import { PageService } from '../../../core/services/page.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-roles-list',
  imports: [FormsModule, MatFormFieldModule, MatButtonModule, MatInputModule, MatIcon],
  templateUrl: './roles-list.html',
  styleUrl: './roles-list.scss',
})
export class RolesList implements OnInit {
  router: Router = inject(Router);
  pageService: PageService = inject(PageService);
  messageService: MessageService = inject(MessageService);
  rolesService: RolesService = inject(RolesService);
  roles: RoleDto[] = [];
  rolesFiltered: RoleDto[] = [];
  searchValue: string = '';

  ngOnInit(): void {
    this.pageService.setTitle('Roles');
    this.pageService.setPrevious('/app/home');
    this.loadRoles();
  }

  loadRoles() {
    this.rolesService.findAll().subscribe({
      next: async (roles: RoleDto[]) => {
        this.roles = roles;
        this.rolesFiltered = roles;
      },
      error: (error: Error) => {
        this.messageService.showMessage(error.message);
      },
    });
  }

  search(event: Event) {
    const value = (event.target as HTMLInputElement).value.toLowerCase().trim();
    this.rolesFiltered = this.roles.filter((role) => role.name.toLowerCase().includes(value));
  }

  clearSearch() {
    this.searchValue = '';
    this.rolesFiltered = this.roles;
  }

  create() {
    this.router.navigate(['/app/roles/create']);
  }

  update(id: string) {
    this.router.navigate(['/app/roles/update', id]);
  }
}
