import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api'; // Asegúrate que la ruta sea correcta

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
  styleUrls: ['./dashboard.css'] // Si tienes dashboard.css vacío, no pasa nada
})
export class DashboardComponent implements OnInit {
  datos: any[] = [];
  chartData: any;
  chartOptions: any;
  usuarioLogueado: string | null = '';

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    // 1. Verificar sesión
    this.usuarioLogueado = localStorage.getItem('user_iot');
    if(!this.usuarioLogueado) {
      this.router.navigate(['/login']);
      return;
    }

    // 2. Cargar datos iniciales
    this.cargarDatos();
    
    // 3. Actualizar automáticamente cada 10 segundos
    setInterval(() => this.cargarDatos(), 10000);

    // Configuración visual de la gráfica
    this.chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                labels: { color: '#495057' }
            }
        },
        scales: {
            x: {
                ticks: { color: '#495057' },
                grid: { color: '#ebedef' }
            },
            y: {
                ticks: { color: '#495057' },
                grid: { color: '#ebedef' }
            }
        }
    };
  }

  cargarDatos() {
    this.api.getDatos().subscribe({
      next: (response) => {
        this.datos = response;
        this.actualizarGrafica();
      },
      error: (err) => console.error('Error conectando al backend:', err)
    });
  }

  actualizarGrafica() {
    const ultimos = this.datos.slice(0, 10).reverse();
    
    this.chartData = {
      labels: ultimos.map(d => {
        // CORREGIDO: Usamos timestamp_utc
        return new Date(d.timestamp_utc).toLocaleTimeString('es-MX'); 
      }),
      datasets: [
        {
          label: 'Temperatura (°C)',
          data: ultimos.map(d => d.temp),
          fill: false,
          borderColor: '#FFA726',
          tension: 0.4
        },
        {
          label: 'Humedad (%)',
          data: ultimos.map(d => d.hum),
          fill: false,
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