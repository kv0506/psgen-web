import {Component} from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { NgIf, AsyncPipe } from '@angular/common';
import { MatProgressBar } from '@angular/material/progress-bar';
import { RouterOutlet } from '@angular/router';
import { SwIsLoadingPipe } from './shared/pipes/sw-is-loading.pipe';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.sass'],
    standalone: true,
    imports: [HeaderComponent, NgIf, MatProgressBar, RouterOutlet, AsyncPipe, SwIsLoadingPipe]
})
export class AppComponent {
}
