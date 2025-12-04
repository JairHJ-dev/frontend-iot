import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login'; // Verifica la ruta de importación
import { DashboardComponent } from './components/dashboard/dashboard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent }, // Asegúrate que el nombre de la clase coincida con el de login.ts
    { path: 'dashboard', component: DashboardComponent }
];