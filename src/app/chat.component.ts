import { Component } from '@angular/core';

import { ChatService, ChatMessage} from './chat.service';

@Component({
    selector: 'chat',
    template: `
        <div class="messages">
            <p *ngFor="let msg of messages; let last = last">{{ msg }}</p>
        </div>
    `,
})
export class Chat {
    private messages: string[] = new Array();

    constructor(private chatService: ChatService) {
        chatService.messages.subscribe(msg => {
            this.messages.push(msg.toString());
        });
    }
}
