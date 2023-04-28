import { Component, Input } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

@Input() signedInUser: any;


constructor(private user: UserService) {}

async onSignOut() {
  const result = await this.user.signout();
  if(result === 'success') {
    location.reload();
  } else {
    console.log(result);
  }
  
}

}
