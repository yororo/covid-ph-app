import { Component } from '@angular/core';

@Component({
  selector: 'cp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title: string = 'COVID-19 PH';
  footerMessage: string = 'Keep safe. Stay at home. Sources: https://covidapi.info/ and https://coronavirus-ph-api.herokuapp.com/#/.';
}