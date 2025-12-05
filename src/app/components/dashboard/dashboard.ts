import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
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
export class DashboardComponent implements OnInit, OnDestroy {
  datos: any[] = [];
  chartData: any;
  chartOptions: any;
  usuarioLogueado: string | null = '';
  private refreshTimer: ReturnType<typeof setInterval> | null = null;
  private destroyed = false;

  constructor(
    private api: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // 1. Verificar sesión
    this.usuarioLogueado = localStorage.getItem('user_iot');
    if(!this.usuarioLogueado) {
      this.router.navigate(['/login']);
      return;
    }

    // 2. Configuración de la gráfica
    this.chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
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

    // 3. Cargar datos iniciales
    this.cargarDatos();
    
    // 4. Actualizar automáticamente cada 10 segundos
    this.refreshTimer = setInterval(() => this.cargarDatos(), 10000);
  }

  ngOnDestroy() {
    this.destroyed = true;
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
  }

  cargarDatos() {
    this.api.getDatos().subscribe({
      next: (response) => {
        this.datos = response;
        this.initChart();
      },
      error: (err) => console.error('Error conectando al backend:', err)
    });
  }

  initChart() {
    const ultimos = this.datos.slice(0, 10).reverse();

    setTimeout(() => {
      this.chartData = {
        labels: ultimos.map(d => {
          const fecha = new Date(d.timestamp_utc);
          return fecha.toLocaleTimeString('es-MX');
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

      if (!this.destroyed) {
        this.cdr.detectChanges();
      }
    }, 0);
  }

  logout() {
    localStorage.removeItem('user_iot');
    this.router.navigate(['/login']);
  }
}