import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './components/static/footer/footer';
import { LoaderComponent } from './components/tools/loader/loader';
import { PopupComponent } from './components/tools/popup/popup';
import { HeaderComponent } from './components/static/header/header';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent, LoaderComponent, PopupComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {}
