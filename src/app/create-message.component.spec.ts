import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By, BrowserModule } from '@angular/platform-browser';

import { CreateMessage } from './create-message.component';
import { ChatService } from './chat.service';

import { Subject } from 'rxjs/Subject';

import 'rxjs/add/operator/take';
let messages$ = new Subject();

let chatServiceStub = {
    messages: messages$,
    sendNickMessage: (msg: any) => {
        messages$.next(`nick message ${msg.newName}`);
    },
    sendChatMessage: (msg: any) => {
        messages$.next(`chat message ${msg.body}`);
    }
};

describe('CreateMessageComponent', function () {
    let fixture: ComponentFixture<CreateMessage>;
    let de: DebugElement;
    let input: HTMLInputElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ CreateMessage ],
            providers: [
                { provide: ChatService, useValue: chatServiceStub },
            ],
            imports: [
                FormsModule,
                BrowserModule,
            ]
        });

        fixture = TestBed.createComponent(CreateMessage);
        de = fixture.debugElement;
        input = fixture.debugElement.query(By.css('input')).nativeElement;

        // First detect changes kicks in ngModel
        fixture.detectChanges();
    }));

    it('should send new chat message', fakeAsync(() => {
        messages$.take(1).subscribe(msg => {
            expect(msg).toEqual('chat message first one');
        });

        input.value = 'first one';
        input.dispatchEvent(new Event('input'));

        fixture.detectChanges();
        tick();

        let submit = de.query(By.css('button[type="submit"]'));
        submit.nativeElement.click();
    }));

    it('should send new nick message', fakeAsync(() => {
        messages$.take(1).subscribe(msg => {
            expect(msg).toEqual('nick message my-nick');
        });

        input.value = '/nick my-nick';
        input.dispatchEvent(new Event('input'));

        fixture.detectChanges();
        tick();

        let submit = de.query(By.css('button[type="submit"]'));
        submit.nativeElement.click();
    }));
});
