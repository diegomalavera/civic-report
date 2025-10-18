import { Component, inject, OnInit } from '@angular/core';
import { MessageService } from '../../../core/services/message.service';
import { PageService } from '../../../core/services/page.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { UsersService } from '../../services/users.service';
import { UserDto } from '../../dtos/user.dto';

@Component({
  selector: 'app-users-list',
  imports: [FormsModule, MatFormFieldModule, MatButtonModule, MatInputModule, MatIcon],
  templateUrl: './users-list.html',
  styleUrl: './users-list.scss',
})
export class UsersList implements OnInit {
  router: Router = inject(Router);
  pageService: PageService = inject(PageService);
  messageService: MessageService = inject(MessageService);
  usersService: UsersService = inject(UsersService);
  users: UserDto[] = [];
  usersFiltered: UserDto[] = [];
  searchValue: string = '';

  ngOnInit(): void {
    this.pageService.setTitle('Usuarios');
    this.pageService.setPrevious('/app/home');
    this.loadUsers();
  }

  loadUsers() {
    this.usersService.findAll().subscribe({
      next: async (users: UserDto[]) => {
        this.users = users;
        this.usersFiltered = users;
      },
      error: (error: Error) => {
        this.messageService.showMessage(error.message);
      },
    });
  }

  search(event: Event) {
    const value = (event.target as HTMLInputElement).value.toLowerCase().trim();
    this.usersFiltered = this.users.filter((user) => user.fullName.toLowerCase().includes(value));
  }

  clearSearch() {
    this.searchValue = '';
    this.usersFiltered = this.users;
  }

  create() {
    this.router.navigate(['/app/users/create']);
  }

  update(id: string) {
    this.router.navigate(['/app/users/update', id]);
  }
}
