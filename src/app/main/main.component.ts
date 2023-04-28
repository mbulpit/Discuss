import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {

  @Output() sendMessage: EventEmitter<any> = new EventEmitter();
  @Input() activeChat: string = '';
  @Input() messages: any;

  newMessage = '';

  onSendMessage() {
    this.sendMessage.emit(this.newMessage);
    this.newMessage = '';
  }

}
