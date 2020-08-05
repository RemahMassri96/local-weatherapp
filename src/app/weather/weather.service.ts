import { environment } from './../../environments/environment';
import { PostalCodeService } from './../postal-code.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject , BehaviorSubject  } from 'rxjs';
import { ICurrentWeather } from '../interfaces';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { map , switchMap } from 'rxjs/operators';

interface ICurrentWeatherData {
  weather: [{
    description: string,
    icon: string
  }];

  main: {
    temp: number
  };
  sys: {
    country: string

  };

  dt: number;
  name: string;

}


export interface IWeatherService {
  readonly currentWeather$: BehaviorSubject<ICurrentWeather>;
  getCurrentWeather(city: string | number, country?: string):
  Observable<ICurrentWeather>;
  getCurrentWeatherByCoords(coords: Coordinates):
  Observable<ICurrentWeather>;  }

@Injectable({
  providedIn: 'root'
})
export class WeatherService  implements IWeatherService {
  // currentWeather$ is declared as read-only because its BehaviorSubject
// should not be reassigned. Any updates to the value should be sent by calling
// the .next function on the property.

  readonly currentWeather$ =
  new BehaviorSubject<ICurrentWeather>({
  city: '--',
  country: '--',
  date: Date.now(),
  image: '',
  temperature: 0,
  description: '',
  });


  constructor(private httpClient: HttpClient,  private postalCodeService: PostalCodeService) { }
  getCurrentWeather(searchText: string, country?: string): Observable<ICurrentWeather> {
    return this.postalCodeService.resolvePostalCode(searchText).pipe(
      switchMap((postalCode) => {
        if (postalCode) {
          return this.getCurrentWeatherByCoords({
            latitude: postalCode.lat,
            longitude: postalCode.lng,
          } as Coordinates)
        } else {
          const uriParams = new HttpParams().set(
            'q',
            country ? `${searchText},${country}` : searchText
          )
          return this.getCurrentWeatherHelper(uriParams)
        }
      })
    )
  }

  private getCurrentWeatherHelper(uriParams: HttpParams): Observable<ICurrentWeather>{
    uriParams = uriParams.set('appid', environment.appId);
    return this.httpClient
 .get<ICurrentWeatherData>(
 `${environment.baseUrl}api.openweathermap.org/data/2.5/weather`,
 { params: uriParams }
 )
 .pipe(map(data => this.transformToICurrentWeather(data)));

  }

    getCurrentWeatherByCoords(coords: Coordinates): Observable<ICurrentWeather>{
    const uriParams = new HttpParams()
    .set('lat', coords.latitude.toString())
    .set('lon', coords.longitude.toString());
    return this.getCurrentWeatherHelper(uriParams);
  }

  updateCurrentWeather(search: string, country?: string): void {
    this.getCurrentWeather(search, country).subscribe((weather) =>
      this.currentWeather$.next(weather)
    )
  }

  private transformToICurrentWeather(data: ICurrentWeatherData): ICurrentWeather {
    return {
      city: data.name,
      country: data.sys.country,
      date: data.dt * 1000,
      image: `http://openweathermap.org/img/w/${data.weather[0].icon}.png`,
      temperature: this.convertKelvinToFahrenheit(data.main.temp),
      description: data.weather[0].description,
    };
  }

  private convertKelvinToFahrenheit(kelvin: number): number {
    return (kelvin * 9) / 5 - 459.67;
  }




}
