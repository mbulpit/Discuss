import { AbstractControl, ValidatorFn } from "@angular/forms";

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): { [key: string]: boolean} | null => {
    const password = control.get('password');
    const confirmedPassword = control.get('confirmedPassword');
  
    if (password!.value !== confirmedPassword!.value) {
      return { 'passwordMismatch': true};
    }
    return null;
};
  
export  const emailFormatValidator: ValidatorFn = (control: AbstractControl): { [key: string]: boolean } | null => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const email = control.value;
  
    if (!emailRegex.test(email)) {
        return { 'invalidEmailFormat': true };
    }
  
    return null;
};