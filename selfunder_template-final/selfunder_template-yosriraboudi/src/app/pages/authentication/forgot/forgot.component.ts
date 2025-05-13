import { Component } from '@angular/core';
import {UserService} from "../../../Service/user.service";
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
})
export class ForgotComponent {
  email: string = '';

  constructor(private userService: UserService, private router: Router) {}

  onSubmit(): void {
    if (!this.email) {
      Swal.fire('Warning', 'Please enter your email address.', 'warning');
      return;
    }

    this.userService.forgotPassword(this.email).subscribe({
      next: (res) => {
        if (res.success) {
          Swal.fire('Success', res.message, 'success').then(() => {
            this.router.navigate(['/auth/login']);
          });
        } else {
          Swal.fire('Error', res.message, 'error');
        }
      },
      error: (err) => {
        console.error('Forgot-password error:', err);
        Swal.fire('Error', 'Could not send email. Please try again later.', 'error');
      }
    });
  }
}
