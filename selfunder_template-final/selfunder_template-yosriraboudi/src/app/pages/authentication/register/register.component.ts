import { Component, inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, AbstractControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {UserService} from "../../../Service/user.service";
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  fieldTextType = false;
  //signupForm: UntypedFormGroup;
  submitted = false;
  otpRequested = false;
  otpError = '';
  otpCode = '';
  registrationSuccess = false;
  otpValidated = false;
  otpInputVisible = false;
  roles: string[] = ['CLIENT', 'INVESTISSEUR', 'ENTREPRENEUR']; // 👈 Liste des rôles


  private userService = inject(UserService);
  private router = inject(Router);
  public fb = inject(UntypedFormBuilder);

  constructor() {
    /* this.signupForm = this.fb.group(
       {
         nom: ['', Validators.required],
         prenom: ['', Validators.required],
         email: ['', [Validators.required, Validators.email]],
         password: ['', Validators.required],
         confirmpwd: ['', Validators.required],
         photo: [''],
         dateNaissance: ['', Validators.required],
         role: ['CLIENT'],
         cin: ['', Validators.required],
         adresse: ['', Validators.required],
         profession: ['', Validators.required],
         salaire: ['', Validators.required],
         numTel: ['', Validators.required],
         matriculeFiscale: ['', Validators.required],
       },
       { validators: this.passwordsMatchValidator }
     );*/
  }
  signupForm: FormGroup = this.fb.group({
    prenom: ['', [Validators.required, Validators.minLength(2)]],
    nom: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmpwd: ['', Validators.required],
    telephone: ['', [Validators.required, Validators.pattern('^[0-9]{8,15}$')]],
    numTel: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
    cin: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
    adresse: ['', Validators.required],
    profession: ['', Validators.required],
    salaire: ['', [Validators.required, Validators.min(0)]],
    dateNaissance: ['', Validators.required],
    matriculeFiscale: ['', Validators.required],
    role: ['', Validators.required], // 👈 Champ rôle ajouté

    photo: [null] // Géré par onFileSelected
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(form: AbstractControl) {
    const password = form.get('password')?.value;
    const confirm = form.get('confirmpwd')?.value;
    return password === confirm ? null : { mismatch: true };
  }


  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (ctx) {
            const maxWidth = 500;
            const maxHeight = 500;
            let width = img.width;
            let height = img.height;

            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            const resizedDataUrl = canvas.toDataURL(file.type);
            this.signupForm.patchValue({ photo: resizedDataUrl });
          }
        };
      };
      reader.readAsDataURL(file);
    }
  }

  changetype() {
    this.fieldTextType = !this.fieldTextType;
  }

  get form() {
    return this.signupForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.registrationSuccess = false;
    this.otpValidated = false;
    this.otpError = '';
    this.otpInputVisible = false;

    if (this.signupForm.invalid) return;

    const formValue = this.signupForm.value;
    const user: User = {
      idUser: 0,
      nom: formValue.nom,
      prenom: formValue.prenom,
      email: formValue.email,
      password: formValue.password,
      telephone: formValue.telephone,
      photo: formValue.photo,
      dateNaissance: formValue.dateNaissance,
      role: formValue.role,
      cin: +formValue.cin,
      adresse: formValue.adresse,
      profession: formValue.profession,
      salaire: +formValue.salaire,
      numTel: +formValue.numTel,
      matriculeFiscale: formValue.matriculeFiscale,
    };

    this.userService.register(user).subscribe({
      next: () => {
        this.registrationSuccess = true;
        this.otpInputVisible = true;
        localStorage.setItem('pendingEmail', user.email);
      },
      error: () => {
        this.otpError = "Erreur lors de l'inscription.";
      }
    });
  }

  validateOtp() {
    const email = localStorage.getItem('pendingEmail');
    if (!email || !this.otpCode) {
      this.otpError = 'Veuillez saisir un code OTP.';
      return;
    }

    this.userService.validateOtp(email, this.otpCode).subscribe({
      next: (res: any) => {
        if ((typeof res === 'string' && res.toLowerCase().includes('validé')) || res?.success === true || res?.status === 'OK') {
          this.otpValidated = true;
          this.otpError = '';
          localStorage.removeItem('pendingEmail');
          this.router.navigate(['/auth/login']);
        } else {
          this.otpError = 'OTP incorrect.';
        }
      },
      error: () => {
        this.otpError = 'Erreur lors de la vérification OTP.';
      }
    });
  }
}
