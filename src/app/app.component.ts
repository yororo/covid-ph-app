import { Component } from '@angular/core';

@Component({
  selector: 'cp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title: string = 'PH Covid Charts';
  footerMessage: string = 'Keep safe. Stay at home. Sources: https://covidapi.info/ and https://coronavirus-ph-api.herokuapp.com/#/.';
}