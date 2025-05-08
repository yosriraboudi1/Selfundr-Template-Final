import { TestBed } from '@angular/core/testing';

import { PortfolioPerformanceServiceService } from './portfolio-performance-service';

describe('PortfolioPerformanceServiceService', () => {
  let service: PortfolioPerformanceServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PortfolioPerformanceServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
