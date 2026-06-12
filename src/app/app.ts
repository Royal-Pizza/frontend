import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './components/footer/footer';
import { LoaderComponent } from './components/loader/loader';
import { PopupComponent } from './components/popup/popup';
import { HeaderComponent } from './components/header/header';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent, LoaderComponent, PopupComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {}
