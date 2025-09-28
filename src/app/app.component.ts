import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  //This class provides methods and state that the app.component.html can directly call and access

  select(){
    console.log("You selected something");
  }
}
