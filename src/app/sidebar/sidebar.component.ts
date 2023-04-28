import { Component, EventEmitter, Output } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { UserService } from '../user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        left: '0',
      })),
      state('out', style({
        left: '-85vw',
      })),
      transition('in => out', animate('.75s ease-in-out')),
      transition('out => in', animate('.75s ease-in-out'))
    ])
  ]
})
export class SidebarComponent {

  constructor(private user: UserService) {}
  @Output() activeChat: EventEmitter<any> = new EventEmitter();

  get userList() {
   return this.user.usersList;
  }

  sidebarState = 'in';

  onNameClick(displayName: string) {
    this.onToggleSidebar();
    this.activeChat.emit(displayName);
    
  }

  onToggleSidebar() {
    this.sidebarState = this.sidebarState === 'in' ? 'out' : 'in';
  }
}
