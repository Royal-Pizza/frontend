import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './shared/components/layout/footer/footer';
import { LoaderComponent } from './shared/components/ui/loader/loader';
import { PopupComponent } from './shared/components/ui/popup/popup';
import { HeaderComponent } from './shared/components/layout/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterModule, HeaderComponent, FooterComponent, LoaderComponent, PopupComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {}
