import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from '../user.service';

interface User {
  displayName: string
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

@Input() signedInUser: any;
@Input() usersList: any;
@Output() addDM: EventEmitter<any> = new EventEmitter();

constructor(private user: UserService) {}

searchQuery: string = '';
searchResults: User[] = [];

filterUsers() {
  this.searchResults = this.usersList.filter((user: any) => {
    return user.displayName.toLowerCase().includes(this.searchQuery.toLowerCase());
  })
}

onSearchQueryChange() {
  this.filterUsers();
}

addToDms(user: string) {
  this.addDM.emit(user);
  this.searchQuery = '';
}

async onSignOut() {
  const result = await this.user.signout();
  if(result === 'success') {
    location.reload();
  } else {
    console.log(result);
  }
  
}

}
