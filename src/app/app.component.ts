import { Component, HostListener } from '@angular/core';
import { UserService } from './user.service';
import { MessageService } from './message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'discuss';
  activeChat: string = '';

  @HostListener('window:beforeunload', ['$event'])
  async beforeUnloadHandler(event: any) {
    await this.userService.changeStatus(false);
  }

  get signedInUser()  {
    return this.userService.signedInUser;
  }

  get messages() {
    return this.messageService.messages;
  }

  constructor(private userService: UserService,
              private messageService: MessageService) {}


  saveMessage(message: string) {
    const newMessage = {
      date: Date.now().toString(),
      from: this.signedInUser.displayName,
      message: message,
      to: this.activeChat
    }
    this.messageService.saveNewMessage(newMessage);


  }

  setActiveChat(toUser: string) {
    this.activeChat = toUser;
    this.messageService.loadMessages(toUser, this.signedInUser.displayName);
  }

}
