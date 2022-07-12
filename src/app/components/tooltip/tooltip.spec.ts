import { TestBed } from "@angular/core/testing";
import { NgbdTooltipCustomclass } from "./tooltip-customclass"
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";

describe("NgbdTooltipCustomclass", () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        NgbdTooltipCustomclass
      ],
      imports: [
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA, 
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents();
  });

  it('should create the NgbdTooltipCustomclass', () => {
    const fixture = TestBed.createComponent(NgbdTooltipCustomclass);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});