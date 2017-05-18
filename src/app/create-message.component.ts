
import { Component } from '@angular/core';
import {ChatService, ChatMessage} from './chat.service'

@Component({
    selector: 'create-message',
    template: `
        <form #sendMsg="ngForm" (ngSubmit)="onSubmit($event)">
            <div class="input-group col-xs-8">
                <input
                    [(ngModel)]="message.body"
                    ngControl="msg"
                    required
                    name="message"
                    type="text"
                    class="form-control"
                    placeholder="message...">
                <span class="input-group-btn">
                    <button
                        [disabled]="!sendMsg.form.valid"
                        class="btn btn-secondary"
                        type="submit">send</button>
                </span>
            </div>
        </form>
    `,
})

export class CreateMessage {
    private submitted = false;
    private message: ChatMessage = {
        body: '',
    }

    constructor(private chatService: ChatService) {}

    private onSubmit(event: Event) {
        this.chatService.sendChatMessage(this.message);
        this.message.body = '';
        event.preventDefault();
    }
}
