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
  standalone: true, // ¡Importante!
  imports: [CommonModule, FormsModule, CardModule, ButtonModule, InputTextModule, PasswordModule],
  templateUrl: './login.html', // Tu archivo se llama login.html
  styleUrls: ['./login.css']   // Tu archivo se llama login.css
})
export class LoginComponent { // El nombre de la clase puede que sea 'Login' por defecto, cámbialo a LoginComponent si quieres o déjalo como Login
  usuario = '';
  password = '';
  error = '';

  constructor(private router: Router) {}

  login() {
    // Usuarios Hardcoded (Requisito)
    if ((this.usuario === 'admin' && this.password === 'admin123') || 
        (this.usuario === 'profesor' && this.password === 'uteq')) {
      
      localStorage.setItem('user_iot', this.usuario);
      this.router.navigate(['/dashboard']);
    } else {
      this.error = 'Credenciales incorrectas';
    }
  }
}