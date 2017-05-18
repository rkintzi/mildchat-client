import { Component } from '@angular/core';

import {ChatService} from './chat.service'

@Component({
    selector: 'app',
    template: `
        <div class="wrapper">
            <navbar></navbar>
            <chat></chat>
            <create-message></create-message>
        </div>
    `,
    providers: [ChatService],
})

export class AppComponent {}
