import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FirstComponent } from './first.component';
import { I18nService } from '@core/i18n.service';
import { TranslateModule } from '@ngx-translate/core';
import { DataServiceService } from '@shared/services/data-service.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { OverlayContainerRef } from 'ng-devui/overlay-container';


describe('FirstComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot(),
        HttpClientModule,
      ],
      declarations: [
        FirstComponent,
      ],
      providers: [
        I18nService,
        { provide: DataServiceService, useValue: OverlayContainerRef }
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(FirstComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
