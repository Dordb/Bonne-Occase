import { Component, OnInit} from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label, BaseChartDirective } from 'ng2-charts';
import { BackendData } from '../BackendData';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NULL_EXPR } from '@angular/compiler/src/output/output_ast';


interface Brand {
  Marque: string
}

interface DeviceInfos{
  name: string,
  dimensions: string,
  weight: string,
  sim: string,
  size: string,
  resolution: string,
  card_slot: string,
  wlan: string,
  bluetooth: string,
  gps: string,
  battery: string,
  stand_by: string,
  talk_time: string,
  music_play: string,
  colors: string,
  os: string,
  primary: string,
  secondary: string,
  video: string,
  chipset: string,
  network_c: string,
  nfc: string,
  _3_5mm_jack: string,
  _2g_bands: string,
  _3g_bands: string,
  _4g_bands: string
}

interface Model{
  Modele: string
}

interface Price{
  Date : Date,
  Prix : number
}

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})

export class ChartComponent implements OnInit{
  public chart: BaseChartDirective;

  today;

  InfosError : string;
  
  months = ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"];

  brands : Brand[];
  selectedBrand :string;
  selectedModel :string;

  models : Model[];

  prices : Price[];

  infos : DeviceInfos;

  constructor( private http : HttpClient ){
    this.selectedBrand = "";
   }

  getAllBrands() : Observable<BackendData> {
    let data = {
    'status' : "je veux"
    }
    return this.http.post<BackendData>( 'http://127.0.0.1:3000/getAllPhoneBrands', data, { withCredentials: true } );
  }

  getBrandModels(brand) : Observable<BackendData> {
    let data = {
    'Brand' : brand
    }
    return this.http.post<BackendData>( 'http://127.0.0.1:3000/getBrandModels', data, { withCredentials: true } );
  }

  getDeviceInfos(brand, model) : Observable<BackendData> {
    let data = {
    'Brand' : brand,
    'Model': model
    }
    return this.http.post<BackendData>( 'http://127.0.0.1:3000/getDeviceInfos', data, { withCredentials: true } );
  }



  updateModels(){
    let y = this.getBrandModels(this.selectedBrand);
        y.subscribe({
          next : value => {
            this.models = value.data;
            this.selectedModel = this.models[0]['Modele'];
            this.updatePrices()
          }
        });
  }

  getPhonePrices(){
    let data = {
      'Brand' : this.selectedBrand,
      'Model' : this.selectedModel,
      'Site' : "TopAchat"
      }
      return this.http.post<BackendData>( 'http://127.0.0.1:3000/getPhonePrices', data, { withCredentials: true } );
  }



  updatePrices(){
    let y = this.getPhonePrices();
    y.subscribe({
      next : value => {
        this.prices = value.data;
            this.updateChartData();
      }
    });
    let i = this.getDeviceInfos(this.selectedBrand, this.selectedModel);
    i.subscribe({
      next : value => {
        if(value.status == 'error'){
          this.infos = null;
          this.InfosError = value.data.reason;
        }
        else{
          this.infos = value.data;
        }
      }
    });
  }



  updateChartData() {
    let data = []
    let labels = [];

    this.prices.forEach(element => {
      data.push(element['Prix']);
      let date : Date = new Date(element['Date']);
      let date_f = date.getDate() + " " + this.months[date.getMonth()] + " " + date.getFullYear();
      labels.push(date_f);
    });


    this.lineChartData = [
      { 
        data: data,
        label: "Evolution du prix du telephone " + this.selectedBrand + " " + this.selectedModel,
        lineTension: 0
      },
    ];
    this.lineChartLabels = labels;
}




  ngOnInit(): void {
    let date = new Date();
    this.today = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
    let x = this.getAllBrands();
    x.subscribe({
      next : value => {
        this.brands = value.data;
        this.selectedBrand = this.brands[0]['Marque'];
        this.initBarChartData();
        let y = this.getBrandModels(this.selectedBrand);
        y.subscribe({
          next : value => {
            this.models = value.data;
            this.selectedModel = this.models[0]['Modele'];
            let z = this.getPhonePrices();
            z.subscribe({
              next : value => {
                this.prices = value.data;
                this.updateChartData();
              }
            });
            let i = this.getDeviceInfos(this.selectedBrand, this.selectedModel);
            i.subscribe({
              next : value => {
                if(value.status == 'error'){
                  this.infos = null;
                  this.InfosError = value.data.reason;
                }
                else{
                  this.infos = value.data;
                }
              }
            });
          }
        });
      }
    });


  }





  lineChartData: ChartDataSets[] = [
    { 
      data: [],
      label: "",
      lineTension: 0
    },
  ];

  lineChartLabels: Label[] = [];

  lineChartOptions = {
    responsive: true,
    legend: {
      labels: { fontColor: 'white' }
    },
    scales: {
      xAxes: [{
        ticks: { fontColor: 'white' },
        gridLines: { color: 'rgba(255,255,255,0.1)' }
      }],
      yAxes: [{
        ticks: { fontColor: 'white' },
        gridLines: { color: 'rgba(255,255,255,0.1)' }
      }]
    }
  };

  lineChartColors: Color[] = [
    {
      backgroundColor: 'rgba(133, 199, 242, .2)',
      borderColor: 'rgb(133, 199, 242)',
      pointBackgroundColor: 'rgb(133, 199, 242)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(133, 199, 242, .8)'
    },
  ];

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';
  






  initBarChartData() {
    let data = []
    let labels = [];

    this.brands.forEach(element => {
      labels.push(element['Marque']);
      let x = this.getBrandModels(element['Marque'])
      x.subscribe({
        next : value => {
          let models : string[]  = value.data;
          data.push(models.length);
        }
      });
    });

    this.barChartData = [
      { 
        data: data,
        label: "Nombre de modeles suivant la marque"
      },
    ];

    this.barChartLabels = labels;
  }




  barChartData: ChartDataSets[] = [
    { 
      data: [],
      label: "",
    },
  ];

  barChartLabels: Label[] = [];

  barChartOptions = {
    responsive: true,
    legend: {
      labels: { fontColor: 'white' }
    },
    scales: {
      xAxes: [{
        ticks: { fontColor: 'white' },
        gridLines: { color: 'rgba(255,255,255,0.1)' }
      }],
      yAxes: [{
        ticks: { fontColor: 'white' },
        gridLines: { color: 'rgba(255,255,255,0.1)' }
      }]
    }
  };

  barChartColors: Color[] = [
    {
    backgroundColor: 'rgba(133, 199, 242, .2)',
    borderColor: 'rgb(133, 199, 242)',
    pointBackgroundColor: 'rgb(133, 199, 242)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(133, 199, 242, .8)'
    },
  ];

  barChartLegend = true;
  barChartPlugins = [];
  barChartType = 'bar';





}