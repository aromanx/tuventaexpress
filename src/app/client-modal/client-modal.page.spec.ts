import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientModalPage } from './client-modal.page';

describe('ClientModalPage', () => {
  let component: ClientModalPage;
  let fixture: ComponentFixture<ClientModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
