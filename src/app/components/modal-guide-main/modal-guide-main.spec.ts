import { TestBed } from "@angular/core/testing";
import { ModalGuideMainComponent } from "./modal-guide-main.component";
import { ShowdownModule } from 'ngx-showdown';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";

describe("ModalGuideMainComponent", () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ModalGuideMainComponent
      ],
      imports: [
        ShowdownModule
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA, 
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents();
  });

  it('should create the ModalGuideMainComponent', () => {
    const fixture = TestBed.createComponent(ModalGuideMainComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});