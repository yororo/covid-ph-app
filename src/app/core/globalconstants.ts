export abstract class GlobalConstants {
    //#region ICasesHistorical Constants
    static readonly CASESHISTORICAL_CONFIRMED : string = 'confirmed';
    static readonly CASESHISTORICAL_DEATHS : string = 'deaths';
    static readonly CASESHISTORICAL_RECOVERED : string = 'recovered';
    //#endregion

    //#region Case Progression Chart Constants
    static readonly CHART_CASESPROG_LABEL_CONFIRMED : string = 'Confirmed';
    static readonly CHART_CASESPROG_LABEL_DEATHS : string = 'Deaths';
    static readonly CHART_CASESPROG_LABEL_RECOVERED : string = 'Recovered';
    static readonly CHART_CASESPROG_XAXIS_LABEL: string = 'Date';
    static readonly CHART_CASESPROG_YAXIS_LABEL: string = 'Cases';
    //#endregion

    //#region
    static readonly CHART_TOTALCASES_LABEL_TOTAL: string = 'Total';
    static readonly CHART_TOTALCASES_LABEL_RECOVERED: string = 'Recovered';
    static readonly CHART_TOTALCASES_LABEL_DEATHS: string = 'Deaths';
    static readonly CHART_TOTALCASES_LABEL_TESTS: string = 'Tests';
    //#endregion

    //#region Daily Cases Chart Constants
    static readonly CHART_DAILYCASES_XAXIS_LABEL: string = 'Date';
    static readonly CHART_DAILYCASES_YAXIS_LABEL: string = 'New Cases';
    //#endregion

}