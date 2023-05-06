import { Component, HostListener } from '@angular/core';
import { UserService } from './user.service';
import { MessageService } from './message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private userService: UserService,
              private messageService: MessageService) {}

  title = 'discuss';
  activeChat: string = '';

  
  @HostListener('window:beforeunload', ['$event'])
  async setUserOffline(event: any) {
    await this.userService.changeStatus(false);
  }


  get usersList() {
    return this.userService.usersList;
  }

  get signedInUser()  {
    return this.userService.signedInUser;
  }

  get dms() {
    return this.userService.dms;
  }

  get messages() {
    return this.messageService.messages;
  }




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
    if(toUser === '') {
      this.messageService.clearMessages();
    } else {
      this.messageService.loadMessages(toUser, this.signedInUser.displayName);
    }
  }

  addToDms(user: string) {
    this.userService.addToDms(user);
  }

  removeDm(user: string) {
    this.userService.removeDm(user);
  }

}
