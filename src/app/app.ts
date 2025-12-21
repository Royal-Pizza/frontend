import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './components/static/footer/footer';
import { LoaderComponent } from './components/layout/loader/loader';
import { PopupComponent } from './components/layout/popup/popup';
import { HeaderComponent } from './components/static/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterModule, HeaderComponent, FooterComponent, LoaderComponent, PopupComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {}
