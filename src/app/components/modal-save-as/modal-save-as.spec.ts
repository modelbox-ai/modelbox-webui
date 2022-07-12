import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { ModalSaveAsComponent } from "./modal-save-as.component";

describe("ModalSaveAsComponent", () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ModalSaveAsComponent
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA, 
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents();
  });

  it('should create the ModalSaveAsComponent', () => {
    const fixture = TestBed.createComponent(ModalSaveAsComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});