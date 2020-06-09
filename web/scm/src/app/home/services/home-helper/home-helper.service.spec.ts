import { TestBed } from '@angular/core/testing';

import { HomeHelperService } from './home-helper.service';

describe('HomeHelperService', () => {
  let service: HomeHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
