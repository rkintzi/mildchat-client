import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';

import { AppComponent }  from './app.component';
import {Chat} from './chat.component';
import {CreateMessage} from './create-message.component';
import {Navbar} from './navbar.component';


@NgModule({
    imports:      [ 
        BrowserModule,
        FormsModule,
    ],
    bootstrap:    [ AppComponent ]
    declarations: [
        AppComponent,
        Navbar,
        CreateMessage,
        Chat,
    ],
})
export class AppModule { }
