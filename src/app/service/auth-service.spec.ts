import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth-service';
import { LoginCredentials } from '../models/api-models';

const apiUrl = 'https://api-gestion-eventos-prod-b1b0.onrender.com/api/v1';

describe('AuthService', () => {
  let authService: AuthService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    authService = TestBed.inject(AuthService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should login and store the returned token', () => {
    const credentials: LoginCredentials = {
      username: 'admin',
      password: 'admin1234'
    };
    let responseToken = '';

    authService.login(credentials).subscribe((response) => {
      responseToken = response.accessToken;
    });

    const request = httpTesting.expectOne(`${apiUrl}/auth/login`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(credentials);
    request.flush({ accessToken: 'test-token', tokenType: 'Bearer' });

    expect(responseToken).toBe('test-token');
    expect(authService.getToken()).toBe('test-token');
    expect(authService.isAuthenticated()).toBeTrue();
  });

  it('should remove the token on logout', () => {
    authService.login({ username: 'admin', password: 'admin1234' }).subscribe();
    httpTesting.expectOne(`${apiUrl}/auth/login`).flush({
      accessToken: 'test-token',
      tokenType: 'Bearer'
    });

    authService.logout();

    expect(authService.getToken()).toBeNull();
    expect(authService.isAuthenticated()).toBeFalse();
  });
});
