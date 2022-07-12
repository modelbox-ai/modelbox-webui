import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {HttpClientModule} from '@angular/common/http';
import { BasicServiceService } from './basic-service.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';


describe('BasicServiceService', () => {

      beforeEach(() => TestBed.configureTestingModule({
        imports: [HttpClientTestingModule], 
        providers: [BasicServiceService],
        schemas: [
          CUSTOM_ELEMENTS_SCHEMA, 
          NO_ERRORS_SCHEMA
        ]
      }));

       it('should be created', () => {
        const service: BasicServiceService = TestBed.get(BasicServiceService);
        expect(service).toBeTruthy();
       });

    });