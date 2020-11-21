import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { BackendData } from '../BackendData';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';



interface Phone {
  brand: string,
  model: string,
  price: number
}

interface ValidatingErrors{
  brand: string,
  model: string,
  price: string,
  error: string,
  date : string
}


@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})

export class AdminPanelComponent implements OnInit,OnDestroy {
  
  @ViewChild(DataTableDirective,{static:false})
  dtElement : DataTableDirective;
  
  @ViewChild(DataTableDirective,{static:false})
  dtElementErr : DataTableDirective;

  data : Phone[];

  dtTrigger : Subject<any> = new Subject();
  dtTriggerErr : Subject<any> = new Subject();

  editing : boolean[] = [];

  constructor( private http : HttpClient ){ }

  val_err : ValidatingErrors[];

  errors : boolean = false;

  sendrequestScrappingTopAchat() : Observable<BackendData> {
    let data = {
    'status' : "je veux"
    }
    return this.http.post<BackendData>( 'http://127.0.0.1:3000/newScrapTopAchat', data, { withCredentials: true } );
  }

  launchScrapping_TopAchat(){
  let x =this.sendrequestScrappingTopAchat(); 
  this.editing = [];
    x.subscribe({
      next : value => {
        this.data = value.data;
        this.dtTrigger.next();
        for (let index = 0; index < this.data.length; index++) {
          this.editing.push(false);
        }
      }
    });
  }


  sendScrap(toAdd) : Observable<BackendData>{
    let data = {
      'Phones' : toAdd
      }
      return this.http.post<BackendData>( 'http://127.0.0.1:3000/addScrapToDB', data, { withCredentials: true } );
  }

  validateScrap(){
    let x =this.sendScrap(this.data); 
    this.editing = [];
    x.subscribe({
      next : value => {
        this.val_err=value.data;
        this.dtTriggerErr.next();
        for (let index = 0; index < this.val_err.length; index++) {
          this.editing.push(false);
        }
        this.errors = true;
      }
    });
  }

  Edit(index){
    this.editing[index] = true;
  }

  FinishEdit(index){
    this.editing[index] = false;
  }

  Delete(index){
    this.data.splice(index,1);
    this.dtElement.dtInstance.then((dtInstance:DataTables.Api)=>{
      dtInstance.destroy();
      this.dtTrigger.next();
    })
    this.editing.splice(index,1);
  }

  DeleteError(index){
    this.val_err.splice(index,1);
    this.dtElementErr.dtInstance.then((dtInstanceErr:DataTables.Api)=>{
      dtInstanceErr.destroy();
      this.dtTriggerErr.next();
    })
    this.editing.splice(index,1);
  }

  sendPhonetoDB(brand,model) : Observable<BackendData>{
    let data = {
      'brand' : brand,
      'model' : model
      }
      return this.http.post<BackendData>( 'http://127.0.0.1:3000/addPhoneToDB', data, { withCredentials: true } );
  }

  AddPhoneToDB(brand,model,price,index){
    let x =this.sendPhonetoDB(brand,model); 
    this.editing = [];
    x.subscribe({
      next : value => {
        let data = {
          'brand' : brand,
          'model' : model,
          'price' : price
          }
        let y = this.sendScrap([data]);
        y.subscribe({
          next : value => {
            this.DeleteError(index);
          }
        });
      }
    });
  }

  refresh(): void {
    location.reload();
}

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.dtTriggerErr.unsubscribe();
  }



  dtOptions = {
    "lengthMenu": [10, 20, 50, 75, 100, 150],

  }
}
