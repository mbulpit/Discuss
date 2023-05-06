import { Component, EventEmitter, Output, Input, ElementRef, ViewChild, SimpleChanges } from '@angular/core';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  @ViewChild('messagesContainer', {static: true}) messagesContainer!: ElementRef;

  @Output() sendMessage: EventEmitter<any> = new EventEmitter();
  @Input() activeChat: string = '';
  @Input() messages: any;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['messages']) {
      setTimeout(() => {
        this.scrollToBottom();
      }, 0);
    }
  
  }

  newMessage = '';

  scrollToBottom() {
    console.log('scrollToBottom called');
    const container = this.messagesContainer.nativeElement;
    container.scrollTop = container.scrollHeight;
  }

  onSendMessage() {
    this.sendMessage.emit(this.newMessage);
    this.newMessage = '';
  }

}
