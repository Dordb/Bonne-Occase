import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service'
import { BackendData } from '../BackendData';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  username : string;
  password : string;
  errorMessage : string;

  constructor( private auth : AuthService, private router : Router ) { 
    this.username = "";
    this.password = "";
    this.errorMessage = "";
  }

  ngOnInit(): void {
  }

  authenticate() : void{
    if (this.username.trim() == "" || this.password.trim() == ""){
      this.errorMessage = "Champ(s) vide(s)";
    }
    else{
      this.errorMessage = "";
      let x  = this.auth.sendAuthentication(this.username, this.password);
      
      x.subscribe({
        next : value => this.auth.finalizeAuthentication(value),
        complete: () => this.finalizeCheck()
      });

    }
  }


  finalizeCheck() :void {
    if(this.auth.isLoggedIn){
      this.errorMessage = "";
      if(this.auth.redirectUrl == ''){
        this.router.navigateByUrl("/admin");
      }
      else{
        this.router.navigateByUrl(this.auth.redirectUrl);
      }
    }
    else{
      this.errorMessage = "Mauvaise Combinaison";        
    }
  }

}
