import { Component } from '@angular/core';
import { UserService } from '../../../service/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loginSuccess: boolean = false;
  loginError: boolean = false;

  constructor(private userService: UserService, private router: Router) {}

  onSubmit(): void {
    if (this.email === 'admin' && this.password === 'admin') {
      // Redirection vers la page admin
      this.router.navigate(['homepage-entreproneur/homepage-entreproneur']);
      return;
    }
  
    this.userService.login(this.email, this.password).subscribe(
      (response) => {
        console.log('Login success', response);
        this.loginSuccess = true;
        this.loginError = false;
  
        localStorage.setItem('email', this.email);
  
        // Redirection utilisateur "classique"
        this.router.navigate(['/homepage-investisseur/homepage-investisseur']);
      },
      (error) => {
        console.error('Login failed', error);
        this.loginSuccess = false;
        this.loginError = true;
      }
    );
  }
}  