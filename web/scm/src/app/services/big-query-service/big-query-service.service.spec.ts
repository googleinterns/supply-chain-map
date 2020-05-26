import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { BigQueryService } from './big-query-service.service';
import { environment } from 'src/environments/environment';

describe('BigQueryService', () => {
  let service: BigQueryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(BigQueryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('returned Observable should match the right data', () => {
    const testQuery = 'SELECT 1';
    const mockResponse = {
      result: true,
      data: [{ f0_: 1 }]
    };

    service
      .runQuery(testQuery)
      .subscribe(response => {
        expect(response.result).toBeTrue();
        expect(response.data).toBeInstanceOf(Array);
      });

    const req = httpMock.expectOne(environment.cloudFunctionUrl);

    expect(req.request.method).toEqual('POST');

    req.flush(mockResponse);
  });

});
