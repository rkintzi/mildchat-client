
import { Component } from '@angular/core';
import {ChatService} from './chat.service'

@Component({
    selector: 'create-message',
    template: `
        <form #sendMsg="ngForm" (ngSubmit)="onSubmit($event)">
            <div class="input-group col-xs-8">
                <input
                    [(ngModel)]="message.message"
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
    private message = {
        author: 'gogo',
        message: '',
    }

    constructor(private chatService: ChatService) {}

    private onSubmit(event: Event) {
        this.chatService.send(this.message);
        this.message.message = '';
        event.preventDefault();
    }
}
