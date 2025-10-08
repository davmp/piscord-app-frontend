import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindRoomComponent } from './find-room.component';

describe('FindRoomComponent', () => {
  let component: FindRoomComponent;
  let fixture: ComponentFixture<FindRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindRoomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
