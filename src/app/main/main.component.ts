import { Component, EventEmitter, Output, Input, OnInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  @Output() sendMessage: EventEmitter<any> = new EventEmitter();
  @Input() activeChat: string = '';
  @Input() messages: any;

  ngOnInit() {
    this.scrollToBottom();

    this.messages.changes.subscribe(() => {
      this.scrollToBottom();
    })
  }

  newMessage = '';

  scrollToBottom() {
    if(this.messagesContainer) {
      this.messagesContainer.nativeElement.scrollToTop = this.messagesContainer.nativeElement.scrollHeight;
    }
  }

  onSendMessage() {
    this.sendMessage.emit(this.newMessage);
    this.newMessage = '';
  }

}
