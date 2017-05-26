import { Injectable } from '@angular/core';

@Injectable()
export class ChatService {
    public messages :string[] = [];

    addMessage(msg: string) {
        this.messages.push(msg);
    }
}
