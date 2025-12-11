import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header';
import { FooterComponent } from './components/footer/footer';
import { LoaderComponent } from './components/loader/loader';
import { PopupComponent } from './components/popup/popup';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent, LoaderComponent, PopupComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {}
