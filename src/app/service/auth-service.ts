import { Injectable, computed, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api-service';
import { JwtAuthResponse, LoginCredentials } from '../models/api-models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly token = signal<string | null>(null);
  readonly isAuthenticated = computed(() => this.token() !== null);

  constructor(private apiService: ApiService) {}

  login(credentials: LoginCredentials): Observable<JwtAuthResponse> {
    return this.apiService.login(credentials).pipe(
      tap((response) => this.token.set(response.accessToken))
    );
  }

  logout(): void {
    this.token.set(null);
  }

  getToken(): string | null {
    return this.token();
  }
}
