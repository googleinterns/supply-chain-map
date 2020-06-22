import { AppComponent } from './app.component';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ RouterTestingModule ],
            declarations: [AppComponent]
        })
        .compileComponents()
        .then(() => {
            fixture = TestBed.createComponent(AppComponent);
            component = fixture.componentInstance;
        });
    }));

    it('should create app component', () => {
        expect(component).toBeTruthy();
    });

});
