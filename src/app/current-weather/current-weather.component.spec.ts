import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { CurrentWeatherComponent } from './current-weather.component';
import { WeatherService } from '../weather/weather.service';
import { WeatherServiceFake } from './../weather/weather.service.fake';
import { fakeWeather } from '../weather/weather.service.fake';
import { injectSpy } from 'angular-unit-test-helper';
import { of } from 'rxjs';

describe('CurrentWeatherComponent', () => {
  let weatherServiceMock: jasmine.SpyObj<WeatherService>;

  let component: CurrentWeatherComponent;
  let fixture: ComponentFixture<CurrentWeatherComponent>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CurrentWeatherComponent);
    component = fixture.componentInstance;
    const weatherServiceSpy =
 jasmine.createSpyObj(
 'WeatherService',
 ['getCurrentWeather']
 );
    TestBed.configureTestingModule({
      declarations: [ CurrentWeatherComponent ],

    //  imports: [HttpClientTestingModule],
    providers: [{
      provide: WeatherService, useValue: weatherServiceSpy
      }]
    })
    .compileComponents();
    weatherServiceMock = injectSpy(WeatherService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentWeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // Arrange
    weatherServiceMock.getCurrentWeather
    .and.returnValue(of(fakeWeather));
// Act
    fixture.detectChanges(); // triggers ngOnInit()
    // Assert
    expect(component.current).toBeDefined();
    expect(component.current.city).toEqual('Bethesda');
    expect(component.current.temperature).toEqual(280.32);


    expect(component).toBeTruthy();

     // Assert on DOM
    const debugEl = fixture.debugElement;
    const titleEl: HTMLElement = debugEl.query(By.css('span')).nativeElement;
    expect(titleEl.textContent).toContain('Bethesda');

  });
});
