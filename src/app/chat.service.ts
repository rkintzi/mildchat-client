
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import 'rxjs/add/operator/map';
import 'rxjs/add/observable/dom/webSocket'

const CHAT_URL = 'ws://localhost:8080/chat';

interface message {
    type: string;
    data: any;
};

export interface ChatMessage {
    author: string;
    body: string;
}

export interface NickMessage {
    oldName: string; 
    newName: string;
}

@Injectable()
export class ChatService {
    public messages: Observable<ChatMessage>;
    private ws: Subject<string>;
    private subject: Subject<ChatMessage>;
    constructor() {
        this.subject = new Subject<ChatMessage>()

        this.ws = Observable.webSocket(CHAT_URL);
        let subscription = this.ws.subscribe(
            (msg:any)=>{
                this.handleFrame(msg);
            },
            (err) => console.log(err),
            ()=>console.log("complete"),
        );
        let refs = 0;
        this.messages = new Observable<ChatMessage>((observer:any)=>{
            refs++;
            let sub = this.subject.subscribe(observer);
            return () => {
                refs--;
                if (refs == 0) subscription.unsubscribe();
                sub.unsubscribe();
            };
        });
    }

    private handleFrame(msg: message) {
        if (msg.type=="ChatMessage") {
            this.subject.next(msg.data);
        }
    }
    sendNickMessage(msg: NickMessage) {
        let message: message = {
            type: "NickMessage",
            data: msg,
        };
        this.ws.next(JSON.stringify(message));
    }

    sendChatMessage(msg: ChatMessage) {
        let message: message = {
            type: "ChatMessage",
            data: msg,
        };
        console.log(message, msg);
        this.ws.next(JSON.stringify(message));
    }

}

