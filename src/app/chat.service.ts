
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import 'rxjs/add/operator/map';
import 'rxjs/add/observable/dom/webSocket'

const CHAT_URL = 'ws://localhost:8080/chat';

interface frame {
    type: string;
    data: any;
};

export interface Message {
    toString(): string
}

export class ChatMessage implements Message {
    author: string;
    body: string;

    toString(): string {
        return this.author+": "+this.body;
    }
}

export class NickMessage implements Message {
    oldName: string; 
    newName: string;
    
    toString(): string {
        if (this.oldName != '') {
            return this.oldName+" has changed nick to "+this.newName;
        } else {
            return this.newName + " has joined channel";
        }
    }
}

export class ErrorMessage implements Message {
    errorCode: string;
    message: string;

    toString(): string {
        return "Error (" + this.errorCode + "): " + this.message;
    }
}

@Injectable()
export class ChatService {
    public messages: Observable<Message>;
    private ws: Subject<string>;
    private subject: Subject<Message>;
    constructor() {
        this.subject = new Subject<Message>()

        this.ws = Observable.webSocket(CHAT_URL);
        let subscription = this.ws.subscribe(
            (msg:any)=>{
                this.handleFrame(msg);
            },
            (err) => console.log(err),
            ()=>console.log("complete"),
        );
        let refs = 0;
        this.messages = new Observable<Message>((observer:any)=>{
            refs++;
            let sub = this.subject.subscribe(observer);
            return () => {
                refs--;
                if (refs == 0) subscription.unsubscribe();
                sub.unsubscribe();
            };
        });
    }

    private handleFrame(frame: frame) {
        if (frame.type=="ChatMessage") {
            let msg = new ChatMessage()
            msg.author = frame.data.author;
            msg.body = frame.data.body;
            this.subject.next(msg);
        } else if (frame.type=="NickMessage") {
            let msg = new NickMessage()
            msg.oldName = frame.data.old_name;
            msg.newName = frame.data.new_name;
            this.subject.next(msg);
        } else if (frame.type=="ErrorMessage") {
            let msg = new ErrorMessage()
            msg.errorCode = frame.data.error_code;
            msg.message = frame.data.message;
            this.subject.next(msg);
        }
    }

    sendNickMessage(msg: NickMessage) {
        let frame: frame = {
            type: "NickMessage",
            data: {
                new_name: msg.newName,
            },
        };
        this.ws.next(JSON.stringify(frame));
    }

    sendChatMessage(msg: ChatMessage) {
        let frame: frame = {
            type: "ChatMessage",
            data: {
                body: msg.body,
            },
        };
        this.ws.next(JSON.stringify(frame));
    }

}

