
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import 'rxjs/add/operator/map';
import 'rxjs/add/observable/dom/webSocket'

const CHAT_URL = 'ws://localhost:8080/chat';

export interface Message {
    author: string;
    message: string;
}
@Injectable()
export class ChatService {
    public messages: Observable<Message>;
    private ws: Subject<string>;

    constructor() {
        let subject = new Subject<Message>()

        this.ws = Observable.webSocket(CHAT_URL);
        let subscription = this.ws.subscribe(
            (msg:any)=>{
                subject.next(msg);
            },
            (err) => console.log(err),
            ()=>console.log("complete"),
        );
        let refs = 0;
        this.messages = new Observable<Message>((observer:any)=>{
            refs++;
            let sub = subject.subscribe(observer);
            return () => {
                refs--;
                if (refs == 0) subscription.unsubscribe();
                sub.unsubscribe();
            };
        })
    }

    send(message:Message) {
        this.ws.next(JSON.stringify(message));
    }

}

