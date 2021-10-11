import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector, APP_INITIALIZER, Inject, LOCALE_ID, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LOCATION_INITIALIZED } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {
  TranslateModule,
  TranslateLoader,
  TranslateService,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppComponent } from './app.component';

import { LayoutModule } from './layout/layout.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { PagesModule } from './pages/pages.module';

import * as themeConfig from '.staging/theme.json';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule, NgbPaginationModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { DevUIModule } from 'ng-devui';

export function HttpLoaderFactory(http: HttpClient) {
  const CDN_BASE = (<any>window).CDNAddress || '';
  const themeName = `${(themeConfig as any).default.company}`;
  const i18nFilePath = `${CDN_BASE}i18n/${themeName}/`;
  return new TranslateHttpLoader(http, i18nFilePath, '.json?t=' + Date.now());
}

export function appInitializerFactory(
  translate: TranslateService,
  injector: Injector
) {
  return () =>
    new Promise<any>((resolve: any) => {
      const locationInitialized = injector.get(
        LOCATION_INITIALIZED,
        Promise.resolve(null)
      );
      locationInitialized.then(() => {
        const supportedLangs = (themeConfig as any).default
          .supportLanguages || ['zh_CN', 'en_US'];
        translate.addLangs(supportedLangs);
        const langsMap = {
          'zh-cn': 'zh_CN',
          'en-us': 'en_US',
        };
        const langToSet =
          langsMap[(<any>window).cfCurrentLan || 'zh-cn'] || 'zh_CN';
        translate.use(langToSet).subscribe(
          () => { },
          () => resolve(null),
          () => resolve(null)
        );
      });
    });
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    DevUIModule,
    // imported modules
    PagesModule,
    LayoutModule,
    SharedModule,
    CoreModule,
    // http & translate
    HttpClientModule,
    RouterModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    NgbModule,
    NgbPaginationModule,
    NgbAlertModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [TranslateService, Injector],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private i18n: TranslateService, @Inject(LOCALE_ID) locale: string) {
    this.i18n.use(locale);
  }
}
