import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-login',
  standalone: true, 
  imports: [CommonModule, FormsModule, CardModule, ButtonModule, InputTextModule, PasswordModule],
  templateUrl: './login.html', 
  styleUrls: ['./login.css']   
})
export class LoginComponent { 
  usuario = '';
  password = '';
  error = '';

  constructor(private router: Router) {}

  login() {

    if ((this.usuario === 'admin' && this.password === 'admin123') || 
        (this.usuario === 'profesor' && this.password === 'uteq')) {
      
      localStorage.setItem('user_iot', this.usuario);
      this.router.navigate(['/dashboard']);
    } else {
      this.error = 'Credenciales incorrectas';
    }
  }
}