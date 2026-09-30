import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category, EventDetail, EventListResponse, EventRequest, JwtAuthResponse, LoginCredentials } from '../models/api-models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://api-gestion-eventos-prod-b1b0.onrender.com/api/v1';

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

  getEvent(id: number): Observable<EventDetail> {
    return this.http.get<EventDetail>(`${this.apiUrl}/events/${id}`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  createEvent(event: EventRequest): Observable<EventDetail> {
    return this.http.post<EventDetail>(`${this.apiUrl}/events`, event);
  }

  updateEvent(id: number, event: EventRequest): Observable<EventDetail> {
    return this.http.put<EventDetail>(`${this.apiUrl}/events/${id}`, event);
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/events/${id}`);
  }

}
