import { enableProdMode, NgModuleRef, NgModule } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { BootController } from './boot-control';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

const init = () => {
  platformBrowserDynamic().bootstrapModule(AppModule)
  .then(() => (<any>window).appBootstrap && (<any>window).appBootstrap())
  .catch(err => console.error('NG Bootstrap Error =>', err));
}

// Init on first load
init();

// Init on reboot request
const boot = BootController.getbootControl().watchReboot().subscribe(() => init());
