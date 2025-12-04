import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';
// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule, ChartModule, ButtonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  datos: any[] = [];
  chartData: any;
  chartOptions: any;
  usuarioLogueado: string | null = '';

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.usuarioLogueado = localStorage.getItem('user_iot');
    if(!this.usuarioLogueado) {
      this.router.navigate(['/login']);
      return;
    }

    this.cargarDatos();
    // Actualizar cada 10s
    setInterval(() => this.cargarDatos(), 10000);
  }

  cargarDatos() {
    this.api.getDatos().subscribe({
      next: (response) => {
        this.datos = response;
        this.initChart();
      },
      error: (err) => console.error('Error cargando datos', err)
    });
  }

  initChart() {
    const ultimos = this.datos.slice(0, 20).reverse();
    
    this.chartData = {
      labels: ultimos.map(d => d.timestamp_local.substring(11, 19)), // Solo hora
      datasets: [
        {
          label: 'Temperatura',
          data: ultimos.map(d => d.temp),
          borderColor: '#FFA726',
          tension: 0.4
        },
        {
          label: 'Humedad',
          data: ultimos.map(d => d.hum),
          borderColor: '#42A5F5',
          tension: 0.4
        }
      ]
    };
  }

  logout() {
    localStorage.removeItem('user_iot');
    this.router.navigate(['/login']);
  }
}