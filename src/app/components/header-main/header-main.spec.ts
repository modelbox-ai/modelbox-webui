import { Location } from "@angular/common";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Router } from "@angular/router";
import { I18nService } from '@core/i18n.service';
import { HeaderMainComponent } from "./header-main.component";
import { MainComponent } from '../../pages/main/main.component';
import { FirstComponent } from '../first/first.component';
import { SolutionComponent } from '../solution/solution.component';
import { ManagementComponent } from '../management/management.component';
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpLoaderFactory } from "src/app/app.module";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../../../i18n/', '.json');
}

describe("Header-main", () => {
  let location: Location;
  let router: Router;
  let fixture;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
      ],
      declarations: [
        MainComponent,
        FirstComponent,
        SolutionComponent,
        ManagementComponent
      ],
      providers: [
        I18nService,
      ],
    }).compileComponents();
    router = TestBed.get(Router);
    location = TestBed.get(Location);

    router.initialNavigation();
  });

  it('should create the HeaderMainComponent', () => {
    const fixture = TestBed.createComponent(HeaderMainComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});