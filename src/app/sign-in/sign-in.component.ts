import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { passwordMatchValidator, emailFormatValidator } from '../validators';
import { EventEmitter, Output } from '@angular/core';



@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {

  @Output() userSignIn: EventEmitter<any> = new EventEmitter<any>();

  get test()  {
    return this.user.signedInUser;
  }

  signIn = true;
  createAccount = false;
  errorMessage = '';

  userSignInInfo = {
    email: '',
    password: '',
  }

  createAccountForm: FormGroup;

  constructor(private user: UserService) {

    this.createAccountForm = new FormGroup({
      displayName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, emailFormatValidator]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmedPassword: new FormControl('', Validators.required)
    }, {validators: passwordMatchValidator});

  }

  createAccountToggle(e: any) {
    this.signIn = !this.signIn;
    this.createAccount = !this.createAccount;
  }

  async onSignIn() {
    const response = await this.user.signIn(this.userSignInInfo);

    if(response !== 'success') {
      this.errorMessage = response;
    } 
  }

  async onCreateAccount() {
    const user = {
      displayName: this.createAccountForm.get('displayName')!.value,
      email: this.createAccountForm.get('email')!.value,
      password: this.createAccountForm.get('password')!.value
    }
    
    const result = await this.user.createAccount(user);
    
    if(result !== 'success') this.errorMessage = result;
  }

}
