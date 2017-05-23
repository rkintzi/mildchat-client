
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription} from 'rxjs/Subscription'
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/observable/dom/webSocket'

const CHAT_URL = 'ws://localhost:8080/chat';

interface frame {
    type: string;
    data: any;
};

enum MessageType {
    Chat = 1,
    Nick,
    Error,
}

export interface Message {
    msgType(): MessageType,
    toString(): string,
}

export class ChatMessage implements Message {
    author: string;
    body: string;

    msgType(): MessageType {
        return MessageType.Chat;
    }

    toString(): string {
        return this.author+": "+this.body;
    }
}

export class NickMessage implements Message {
    oldName: string; 
    newName: string;
    
    msgType(): MessageType {
        return MessageType.Nick;
    }

    toString(): string {
        console.log(this, "A"+this.newName+"B", this.newName=="");
        if (this.newName == "" && this.oldName != "") {
            return this.oldName+" has left the channel";
        } else if (this.oldName != '') {
            return this.oldName+" has changed nick to "+this.newName;
        }  else {
            return this.newName + " has joined the channel";
        }
    }
}

export class ErrorMessage implements Message {
    errorCode: string;
    message: string;

    msgType(): MessageType {
        return MessageType.Error;
    }

    toString(): string {
        return "Error (" + this.errorCode + "): " + this.message;
    }
}

@Injectable()
export class ChatService {
    public messages: Observable<Message>;
    private ws: Subject<any>;
    constructor() {
        let subject = new Subject<Message>()

        this.ws = Observable.webSocket<frame>(CHAT_URL);
        let refs = 0;
        this.messages = new Observable<Message>((observer:Observer<any>)=>{
            let subscription: Subscription;    
            if (refs == 0) {
                subscription = this.ws
                    .map(this.parseFrame)
                    .filter(m=>m != null)
                    .subscribe(m=>subject.next(m));
            }
            refs++;
            let sub = subject.subscribe(observer);
            return () => {
                refs--;
                if (refs == 0) subscription.unsubscribe();
                sub.unsubscribe();
            };
        });
    }

    private parseFrame(frame: frame): Message {
        if (frame.type=="ChatMessage") {
            let msg = new ChatMessage()
            msg.author = frame.data.author;
            msg.body = frame.data.body;
            return msg;
        } else if (frame.type=="NickMessage") {
            let msg = new NickMessage()
            msg.oldName = frame.data.old_name;
            msg.newName = frame.data.new_name;
            return msg;
        } else if (frame.type=="ErrorMessage") {
            let msg = new ErrorMessage()
            msg.errorCode = frame.data.error_code;
            msg.message = frame.data.message;
            return msg;
        }
        return null;
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

