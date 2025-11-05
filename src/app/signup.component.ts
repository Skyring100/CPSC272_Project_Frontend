import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SignUp } from './models/signup.model';

@Component({
  selector: 'app-poll',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignUpComponent {
    

    signUp(username: string, password:string){
        //Query for the username and hashed password to retrieve a user object
    }
}