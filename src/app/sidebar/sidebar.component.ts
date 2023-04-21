import { Component } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  constructor(private user: UserService) {}

  get userList() {
   return this.user.usersList;
  }
}
