import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8080/api/v1'; // <<<<< ASEGÚRATE DE QUE COINCIDA CON EL PUERTO DE TU SPRING BOOT

  constructor(private http: HttpClient) { }

  // Método para el login
  login(credentials: any): Observable<any> {
    console.log(credentials);
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }

  // Método para obtener eventos (requiere token JWT)
  getEvents(token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/events`, { headers });
  }

  // Método para obtener eventos sin token (para probar el acceso denegado por seguridad)
  getEventsNoAuth(): Observable<any> {
    return this.http.get(`${this.apiUrl}/events`);
  }
}
