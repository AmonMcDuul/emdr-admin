import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmdrScreenComponent } from './emdr-screen.component';

describe('EmdrScreenComponent', () => {
  let component: EmdrScreenComponent;
  let fixture: ComponentFixture<EmdrScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmdrScreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmdrScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
