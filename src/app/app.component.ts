import { Component } from '@angular/core';

@Component({
  selector: 'cp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title: string = 'COVID-19 PH';
  footerMessage: string = 'Stay at home. Always wash hands. Keep safe. Visit https://ncovtracker.doh.gov.ph/ for more information.';
  footerCodeSource: string = 'Code: https://github.com/yororo/covid-ph-app';
  footerSources: string = 'Sources: https://covidapi.info, https://coronavirus-19-api.herokuapp.com and https://coronavirus-ph-api.herokuapp.com/#/.';
}