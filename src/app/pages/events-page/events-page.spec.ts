import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { EventListResponse } from '../../models/api-models';
import { ApiService } from '../../service/api-service';
import { AuthService } from '../../service/auth-service';
import { EventsPage } from './events-page';

describe('EventsPage', () => {
  let fixture: ComponentFixture<EventsPage>;
  let apiService: jasmine.SpyObj<ApiService>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const response: EventListResponse = {
      content: [
        {
          id: 1,
          name: 'Evento de prueba',
          location: 'Sala 1',
          date: '2026-10-15'
        }
      ],
      number: 0,
      size: 10,
      totalElements: 1,
      totalPages: 1
    };
    apiService = jasmine.createSpyObj<ApiService>('ApiService', ['getEvents']);
    apiService.getEvents.and.returnValue(of(response));
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['logout']);
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [EventsPage],
      providers: [
        provideZonelessChangeDetection(),
        { provide: ApiService, useValue: apiService },
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventsPage);
    fixture.detectChanges();
  });

  it('should render the events page and load events', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(apiService.getEvents).toHaveBeenCalledWith('', 0, 10, 'name');
    expect(compiled.textContent).toContain('Evento de prueba');
  });

  it('should logout and navigate to login', () => {
    fixture.componentInstance.logout();

    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
