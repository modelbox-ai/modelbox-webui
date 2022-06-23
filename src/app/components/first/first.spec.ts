import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { I18nService } from '@core/i18n.service';
import { TranslateModule } from '@ngx-translate/core';
import { DataServiceService } from '@shared/services/data-service.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { OverlayContainerRef } from 'ng-devui/overlay-container';

import { FirstComponent } from './first.component';
import { OverlayContainerModule } from 'ng-devui/overlay-container';
// import { HeaderMainComponent } from '../header-main/header-main.component';

class MockedDataService extends DataServiceService {
  currentPage = "";
}

describe('FirstComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot(),
        HttpClientModule,
        OverlayContainerModule
      ],
      declarations: [
        FirstComponent,
      ],
      providers: [
        I18nService,
        DataServiceService,
        OverlayContainerRef
      ],
    }).compileComponents();
  });

  it('should create the FirstComponent', () => {
    const fixture = TestBed.createComponent(FirstComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should import DataService', () => {
    const dataService = TestBed.get(DataServiceService);
    expect(dataService).toBeTruthy();
  });

  it('currentPage should be ""', () => {
    const dataService = TestBed.get(DataServiceService);
    expect(dataService.getCurrentPage()).toEqual("");
  });
});
