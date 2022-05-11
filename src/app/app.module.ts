/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
import { BasicServiceService } from '@shared/services/basic-service.service';
import { NgxJsonViewerModule } from 'ngx-json-viewer';


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
    NgxJsonViewerModule,
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
    BasicServiceService,
    
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private i18n: TranslateService, @Inject(LOCALE_ID) locale: string) {
    this.i18n.use(locale);
  }
}
