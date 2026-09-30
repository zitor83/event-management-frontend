import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AuthService } from '../service/auth-service';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  it('should redirect unauthenticated users to login', () => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        {
          provide: AuthService,
          useValue: { isAuthenticated: signal(false) }
        }
      ]
    });

    const result = TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));
    const router = TestBed.inject(Router);

    expect(result).toEqual(router.createUrlTree(['/login']));
  });

  it('should allow authenticated users to access events', () => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        {
          provide: AuthService,
          useValue: { isAuthenticated: signal(true) }
        }
      ]
    });

    const result = TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));

    expect(result).toBeTrue();
  });
});
