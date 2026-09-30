import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../service/auth-service';

const apiUrl = 'http://localhost:8080/api/v1';

describe('authInterceptor', () => {
  let httpTesting: HttpTestingController;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideZonelessChangeDetection(),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting()
      ]
    });

    httpTesting = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should add the Authorization header when a token exists', () => {
    authService.login({ username: 'admin', password: 'admin1234' }).subscribe();
    httpTesting.expectOne(`${apiUrl}/auth/login`).flush({
      accessToken: 'test-token',
      tokenType: 'Bearer'
    });

    TestBed.inject(HttpClient).get(`${apiUrl}/events`).subscribe();
    const request = httpTesting.expectOne(`${apiUrl}/events`);

    expect(request.request.headers.get('Authorization')).toBe('Bearer test-token');
    request.flush({ content: [] });
  });

  it('should pass through without Authorization when no token exists', () => {
    TestBed.inject(HttpClient).get(`${apiUrl}/events`).subscribe();
    const request = httpTesting.expectOne(`${apiUrl}/events`);

    expect(request.request.headers.has('Authorization')).toBeFalse();
    request.flush({ content: [] });
  });

  it('should not add Authorization to the login request', () => {
    authService.login({ username: 'admin', password: 'admin1234' }).subscribe();
    const request = httpTesting.expectOne(`${apiUrl}/auth/login`);

    expect(request.request.headers.has('Authorization')).toBeFalse();
    request.flush({ accessToken: 'test-token', tokenType: 'Bearer' });
  });
});
