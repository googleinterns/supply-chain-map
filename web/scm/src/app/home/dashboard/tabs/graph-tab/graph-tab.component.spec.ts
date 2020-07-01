import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphTabComponent } from './graph-tab.component';

describe('GraphTabComponent', () => {
  let component: GraphTabComponent;
  let fixture: ComponentFixture<GraphTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
