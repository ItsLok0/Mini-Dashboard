import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyQuote } from './daily-quote';

describe('DailyQuote', () => {
  let component: DailyQuote;
  let fixture: ComponentFixture<DailyQuote>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyQuote]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyQuote);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
