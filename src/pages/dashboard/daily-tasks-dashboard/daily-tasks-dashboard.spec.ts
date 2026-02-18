import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyTasksDashboard } from './daily-tasks-dashboard';

describe('DailyTasksDashboard', () => {
  let component: DailyTasksDashboard;
  let fixture: ComponentFixture<DailyTasksDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyTasksDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyTasksDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
