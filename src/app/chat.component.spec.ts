import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Chat } from './chat.component';
import { ChatService } from './chat.service';

import { Subject } from 'rxjs/Subject';

let messages$ = new Subject();

let chatServiceStub = {
    messages: messages$,
};

describe('ChatComponent', function () {
    let fixture: ComponentFixture<Chat>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ Chat ],
            providers: [
                { provide: ChatService, useValue: chatServiceStub },
            ],
        })
        .compileComponents();

        fixture = TestBed.createComponent(Chat);
    }));

    it('should not have messages in the beginning', () => {
        fixture.detectChanges();
        let messages = fixture.debugElement.query(By.css('.messages p'));
        expect(messages).toBeNull();
    });

    it('should have proper amount of messages', () => {
        addMessage('message 1');
        let messages = fixture.debugElement.queryAll(By.css('.messages p'));
        expect(messages.length).toEqual(1);
        expect(messages[0].nativeElement.textContent).toEqual('message 1');

        addMessage('message 2');
        messages = fixture.debugElement.queryAll(By.css('.messages p'));
        expect(messages.length).toEqual(2);
        expect(messages[1].nativeElement.textContent).toEqual('message 2');
    });

    function addMessage(msg: string) {
        messages$.next({ toString: () => msg });
        fixture.detectChanges();
    }
});
