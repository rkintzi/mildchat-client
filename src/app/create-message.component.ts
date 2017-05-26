
import { Component } from '@angular/core';
import { ChatService, ChatMessage, NickMessage } from './chat.service';

@Component({
    selector: 'create-message',
    template: `
        <form #sendMsg="ngForm" (ngSubmit)="onSubmit($event)">
            <div class="input-group col-xs-8">
                <input
                    [(ngModel)]="cmd"
                    ngControl="msg"
                    required
                    name="cmd"
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
    cmd: string;

    constructor(private chatService: ChatService) {}

    onSubmit(event: Event) {
        if (this.cmd.startsWith('/nick ')) {
            let msg = new NickMessage();
            msg.newName = this.cmd.substr(6);
            this.chatService.sendNickMessage(msg);
        } else {
            let msg = new ChatMessage();
            msg.body = this.cmd;
            this.chatService.sendChatMessage(msg);
        }
        this.cmd = '';
        event.preventDefault();
    }
}
