import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { WSocialBaseModule } from './w-social-base';

describe('WSocialBaseModule', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, WSocialBaseModule]
    });
  });

  it('should create the module', () => {
    const module = TestBed.inject(WSocialBaseModule);
    expect(module).toBeDefined();
  });
});
