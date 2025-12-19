// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { appConfig } from './app/app.config';
bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),          // garder les providers existants
    importProvidersFrom(HttpClientModule),   // ← fournit HttpClient à tous les services root
    provideRouter(routes)                     // ← configure le routing
  ]
})
  .catch((err) => console.error(err));
