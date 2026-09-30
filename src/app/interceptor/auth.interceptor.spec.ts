import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../service/auth-service';

const apiUrl = 'http://localhost:8080/api/v1';

describe('authInterceptor', () => {
  let httpTesting: HttpTestingController;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting()
      ]
    });

    httpTesting = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
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

  it('should logout and redirect to login on an authenticated 401', () => {
    authService.login({ username: 'admin', password: 'admin1234' }).subscribe();
    httpTesting.expectOne(`${apiUrl}/auth/login`).flush({
      accessToken: 'test-token',
      tokenType: 'Bearer'
    });
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    TestBed.inject(HttpClient).get(`${apiUrl}/events`).subscribe({ error: () => undefined });
    const request = httpTesting.expectOne(`${apiUrl}/events`);
    request.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(authService.getToken()).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should not logout or redirect on a 403', () => {
    authService.login({ username: 'admin', password: 'admin1234' }).subscribe();
    httpTesting.expectOne(`${apiUrl}/auth/login`).flush({
      accessToken: 'test-token',
      tokenType: 'Bearer'
    });
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    TestBed.inject(HttpClient).get(`${apiUrl}/events`).subscribe({ error: () => undefined });
    const request = httpTesting.expectOne(`${apiUrl}/events`);
    request.flush('Forbidden', { status: 403, statusText: 'Forbidden' });

    expect(authService.getToken()).toBe('test-token');
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should not redirect when login returns 401', () => {
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    authService.login({ username: 'admin', password: 'wrong-password' }).subscribe({ error: () => undefined });
    const request = httpTesting.expectOne(`${apiUrl}/auth/login`);
    request.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(authService.getToken()).toBeNull();
    expect(router.navigate).not.toHaveBeenCalled();
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
