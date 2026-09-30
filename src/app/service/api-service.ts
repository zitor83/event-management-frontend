import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EventListResponse, JwtAuthResponse, LoginCredentials } from '../models/api-models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) { }

  login(credentials: LoginCredentials): Observable<JwtAuthResponse> {
    return this.http.post<JwtAuthResponse>(`${this.apiUrl}/auth/login`, credentials);
  }

  getEvents(name: string, page: number, size: number, sort: string): Observable<EventListResponse> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', sort);

    if (name.trim()) {
      params = params.set('name', name.trim());
    }

    return this.http.get<EventListResponse>(`${this.apiUrl}/events`, { params });
  }

}
