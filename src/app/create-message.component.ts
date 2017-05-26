
import { Component } from '@angular/core';
import { ChatService } from './chat.service'

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
    private cmd: string;

    constructor(private chatService: ChatService) {}

    private onSubmit(event: Event) {
        this.chatService.addMessage(this.cmd);
        this.cmd = '';
        event.preventDefault();
    }
}
