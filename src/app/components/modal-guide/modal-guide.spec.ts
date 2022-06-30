import { TestBed } from "@angular/core/testing";
import { ModalGuideComponent } from "./modal-guide.component";

describe("ModalGuideComponent", () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ModalGuideComponent
      ],
    }).compileComponents();
  });

  it('should create the ModalGuideComponent', () => {
    const fixture = TestBed.createComponent(ModalGuideComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});