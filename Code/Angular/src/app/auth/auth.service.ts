import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http'
import { BackendData } from '../BackendData';


@Injectable({
  providedIn: 'root'
})

export class AuthService {

  isLoggedIn : boolean = false;
  redirectUrl : string = "";
  

  constructor( private http : HttpClient ) {  }


  
  sendAuthentication( username : string, password : string )  : Observable<BackendData> {
    
    /*var formData = new FormData();
    
    formData.append("username", username);
    formData.append("password", password);*/

    let data = {
      'username' : username,
      'password' : password
    }    

    //console.log(formData);
    
    // var request = new XMLHttpRequest();
    // request.open("POST", "http://forum/angular/checkLogin.php");
    // request.send(formData);
    
    return this.http.post<BackendData>( 'http://127.0.0.1:3000/checkLogin', data, { withCredentials: true } );

  }

    
    
  finalizeAuthentication(reponse : BackendData){

    if ( reponse.status == 'ok' ){
      this.isLoggedIn = true;
    }
    else{
      this.isLoggedIn = false;
    }

  }



}


