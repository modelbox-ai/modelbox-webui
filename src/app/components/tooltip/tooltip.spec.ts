import { TestBed } from "@angular/core/testing";
import { NgbdTooltipCustomclass } from "./tooltip-customclass"
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

describe("NgbdTooltipCustomclass", () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        NgbdTooltipCustomclass,
        NgbTooltip
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
