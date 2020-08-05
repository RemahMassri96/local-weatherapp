import { Component, OnInit , Input, OnDestroy } from '@angular/core';

import { ICurrentWeather } from '../interfaces';
import { WeatherService } from '../weather/weather.service';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-current-weather',
  templateUrl: './current-weather.component.html',
  styleUrls: ['./current-weather.component.css']
})
export class CurrentWeatherComponent implements OnInit , OnDestroy  {
  // @Input() current: ICurrentWeather // Alternate event-based implementation
    current$: Observable<ICurrentWeather>;
   currentWeatherSubscription: Subscription;
  constructor( private weatherService: WeatherService) {
    this.current$ = this.weatherService.currentWeather$;

  /*  this.current =
     {    city: '',    country: '',
        date: 0,
            image: '',
                temperature: 0,
                     description: '',
                      }; */


  }

  ngOnInit(): void {
 //  this.currentWeatherSubscription =  this.weatherService.currentWeather$
   // .subscribe(data => (this.current = data));
  }

  getOrdinal(date: number) {
    const n = new Date(date).getDate();
    return n > 0
    ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) ||
    n % 10 > 3 ? 0 : n % 10]
    : '';
    }

    ngOnDestroy(): void {
      this.currentWeatherSubscription.unsubscribe();
      }

}
