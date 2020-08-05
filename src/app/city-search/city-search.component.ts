import { Component, OnInit ,  Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { WeatherService } from '../weather/weather.service';
import { debounceTime , filter, tap } from 'rxjs/operators';



@Component({
  selector: 'app-city-search',
  templateUrl: './city-search.component.html',
  styleUrls: ['./city-search.component.css']
})
export class CitySearchComponent implements OnInit {
  search = new FormControl('', [Validators.minLength(2)]);
  @Output() searchEvent = new EventEmitter<string>();

  constructor(private weatherService: WeatherService) {

    this.search.valueChanges
 .pipe(
 debounceTime(1000),
 filter(() => !this.search.invalid),
 tap((searchValue: string) => this.doSearch(searchValue))
 )
 .subscribe();
   }

  ngOnInit(): void {
  /*  this.search.valueChanges
    .pipe(debounceTime(1000)),
    filter(() => !this.search.invalid),
 tap((searchValue: string) => this.doSearch(searchValue))


    .subscribe(

    (searchValue: string) => {

    if (!this.search.invalid) {
      this.searchEvent.emit(searchValue);
      const userInput = searchValue.split(',').map(s => s.trim());
      this.weatherService.updateCurrentWeather(
        userInput[0],
        userInput.length > 1 ? userInput[1] : undefined
        )

     
    }
   }); */



}




doSearch(searchValue: string) {
  const userInput = searchValue.split(',').map(s => s.trim())
  const searchText = userInput[0]
  const country = userInput.length > 1 ? userInput[1] : undefined
  this.weatherService.updateCurrentWeather(searchText, country)
 }


getErrorMessage() {
  return this.search.hasError('minLength') ?
  'Type more than one character to search' : '';
 }
}
