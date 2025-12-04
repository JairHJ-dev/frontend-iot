import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://backend-iot-uteq.onrender.com/api/telemetry';

  constructor(private http: HttpClient) { }

  getDatos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}