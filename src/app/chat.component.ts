import { Component } from '@angular/core';

import { ChatService, Message} from './chat.service';

@Component({
    selector: 'chat',
    template: `
        <div class="messages">
            <p *ngFor="let msg of messages; let last = last">{{ msg.message }}</p>
        </div>
    `,
})
export class Chat {
    private messages: Message[] = new Array();

    constructor(private chatService: ChatService) {
        chatService.messages.subscribe(msg => {
            this.messages.push(msg);
        });
    }
}
