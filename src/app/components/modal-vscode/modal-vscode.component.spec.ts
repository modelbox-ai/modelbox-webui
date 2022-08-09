import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { ModalVscodeComponent } from './modal-vscode.component';

describe("ModalVscodeComponent", () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ModalVscodeComponent
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents();
  });

  it('should create the ModalVscodeComponent', () => {
    const fixture = TestBed.createComponent(ModalVscodeComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});