import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PingGraph } from './ping-graph';

describe('PingGraph', () => {
  let component: PingGraph;
  let fixture: ComponentFixture<PingGraph>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PingGraph],
    }).compileComponents();

    fixture = TestBed.createComponent(PingGraph);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
