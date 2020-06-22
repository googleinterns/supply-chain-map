import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { MatMenuModule } from '@angular/material/menu';
import { ScmBasicProfile, GoogleAuthService } from 'src/app/services/google-auth/google-auth.service';

class MockAuthService {
  getProfileData(): Promise<ScmBasicProfile>{
    return new Promise(() => {});
  }
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [MatMenuModule],
      providers: [
        {provide: GoogleAuthService, useClass: MockAuthService}
      ]
    })
      .compileComponents();
  }));

  afterAll(() => {
    TestBed.resetTestingModule();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
