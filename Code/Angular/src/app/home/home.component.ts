import { Component, OnInit} from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label, BaseChartDirective } from 'ng2-charts';
import { BackendData } from '../BackendData';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NULL_EXPR } from '@angular/compiler/src/output/output_ast';


interface Brand {
  Marque: string,
  count : number
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit {

  public chart: BaseChartDirective;

  today;

  InfosError : string;
  

  brands : Brand[];

  constructor( private http : HttpClient ){  }

  getAllBrands() : Observable<BackendData> {
    let data = {
    'status' : "Get All Brands"
    }
    return this.http.post<BackendData>( 'http://127.0.0.1:3000/getAllPhoneBrands', data, { withCredentials: true } );
  }

  getBrandModels(brand) : Observable<BackendData> {
    let data = {
    'Brand' : brand
    }
    return this.http.post<BackendData>( 'http://127.0.0.1:3000/getBrandModels', data, { withCredentials: true } );
  }



  ngOnInit(): void {
    let date = new Date();
    this.today = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
    let x = this.getAllBrands();
    x.subscribe({
      next : value => {
        this.brands = value.data;

        this.brands.forEach(element => {
          let x = this.getBrandModels(element['Marque'])
          x.subscribe({
            next : value => {
              let models : string[]  = value.data;
              element.count = models.length;
              let data = [];
              let labels = [];
          
              this.brands.forEach(element => {
                data.push(element.count);
                labels.push(element.Marque);
              });
          
              this.barChartData = [
                { 
                  data: data,
                  label: "Nombre de modeles suivant la marque"
                },
              ];
          
              this.barChartLabels = labels;
            }
          });
        });
      }
    });

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
