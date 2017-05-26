import { AfterViewInit ,Component, ViewChild, ElementRef } from '@angular/core';
import { ChatService } from './chat.service';

@Component({
    selector: 'chat',
    template: `
        <div class="messages" #messagesElem>
            <p *ngFor="let msg of messages; let last = last">{{ msg }}</p>
        </div>
    `,
    styles: [
        `:host { overflow-y: scroll; flex: 1; }`,
    ]
})
export class Chat implements AfterViewInit{
    @ViewChild('messagesElem') messagesElem: ElementRef;
    messages: string[] = new Array();

    constructor(
        private chatService: ChatService,
        private elRef: ElementRef,
    ) {
        chatService.messages.subscribe(msg => {
            this.messages.push(msg.toString());
        });
    }

    ngAfterViewInit() {
        let observer = new MutationObserver(() => {
            this.elRef.nativeElement.scrollTop = this.messagesElem.nativeElement.offsetHeight;
        });
        observer.observe(this.messagesElem.nativeElement, { childList: true });
    }
}
