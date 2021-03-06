import { TestBed } from "@angular/core/testing";
import { ModalGuideComponent } from "./modal-guide.component";
import { ShowdownModule } from 'ngx-showdown';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";

describe("ModalGuideComponent", () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ModalGuideComponent
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

  it('should create the ModalGuideComponent', () => {
    const fixture = TestBed.createComponent(ModalGuideComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});