
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import {WebSocketService} from './websocket.service';

import 'rxjs/add/operator/map';

const CHAT_URL = 'ws://localhost:8080/chat';

export interface Message {
    author: string;
    message: string;
}

@Injectable()
export class ChatService {
    public messages: Subject<Message>;

    constructor(wsService: WebSocketService) {

        this.messages = <Subject<Message>>wsService
            .connect(CHAT_URL)
            .map((response: MessageEvent): Message => {
                let data = JSON.parse(response.data);
                return {
                    author: data.author,
                    message: data.message,
                }
            });
    }
}
