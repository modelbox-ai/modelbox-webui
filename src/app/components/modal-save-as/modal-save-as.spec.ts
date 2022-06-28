import { TestBed } from "@angular/core/testing";
import { ModalSaveAsComponent } from "./modal-save-as.component";

describe("ModalSaveAsComponent", () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ModalSaveAsComponent
      ],
    }).compileComponents();
  });

  it('should create the ModalSaveAsComponent', () => {
    const fixture = TestBed.createComponent(ModalSaveAsComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});