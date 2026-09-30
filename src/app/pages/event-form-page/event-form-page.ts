import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Category, EventDetail, EventRequest } from '../../models/api-models';
import { ApiService } from '../../service/api-service';
import { AuthService } from '../../service/auth-service';

@Component({
  selector: 'app-event-form-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './event-form-page.html',
  styleUrl: './event-form-page.css'
})
export class EventFormPage implements OnInit {
  categories = signal<Category[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');
  message = signal('');
  eventId: number | null = null;
  isEditMode = false;
  private speakersIds: number[] = [];

  readonly eventForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    date: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
    categoryId: new FormControl<number | null>(null, [Validators.required])
  });

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.eventId = id ? Number(id) : null;
    this.isEditMode = this.eventId !== null && Number.isInteger(this.eventId) && this.eventId > 0;
    this.loadFormData();
  }

  saveEvent(): void {
    this.message.set('');
    this.errorMessage.set('');
    this.eventForm.markAllAsTouched();

    if (this.eventForm.invalid) {
      return;
    }

    const value = this.eventForm.getRawValue();
    if (value.categoryId === null) {
      return;
    }

    const eventRequest: EventRequest = {
      name: value.name ?? '',
      date: value.date ?? '',
      location: value.location ?? '',
      categoryId: value.categoryId,
      speakersIds: this.speakersIds
    };

    this.isLoading.set(true);
    const request = this.isEditMode && this.eventId !== null
      ? this.apiService.updateEvent(this.eventId, eventRequest)
      : this.apiService.createEvent(eventRequest);

    request.subscribe({
      next: (event) => {
        this.isLoading.set(false);
        this.router.navigate(['/events', event.id], {
          state: { message: this.isEditMode ? 'Evento actualizado correctamente.' : 'Evento creado correctamente.' }
        });
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.errorMessage.set(this.getRequestErrorMessage(error));
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private loadFormData(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    if (this.isEditMode && this.eventId !== null) {
      forkJoin({
        categories: this.apiService.getCategories(),
        event: this.apiService.getEvent(this.eventId)
      }).subscribe({
        next: ({ categories, event }) => {
          this.categories.set(categories);
          this.setEventValues(event);
          this.isLoading.set(false);
        },
        error: (error: HttpErrorResponse) => this.handleLoadError(error)
      });
      return;
    }

    this.apiService.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.isLoading.set(false);
      },
      error: (error: HttpErrorResponse) => this.handleLoadError(error)
    });
  }

  private handleLoadError(error: HttpErrorResponse): void {
    this.isLoading.set(false);
    this.errorMessage.set(this.getRequestErrorMessage(error));
  }

  private setEventValues(event: EventDetail): void {
    this.speakersIds = event.speakers.map((speaker) => speaker.id);
    this.eventForm.patchValue({
      name: event.name,
      date: event.date,
      location: event.location,
      categoryId: event.categoryId
    });
  }

  private getRequestErrorMessage(error: HttpErrorResponse): string {
    let message = 'Error al guardar el evento: ' + this.getErrorMessage(error);
    if (error.status === 404) {
      message = 'No se encontró el evento.';
    } else if (error.status === 401 || error.status === 403) {
      message += ' -> Posiblemente el token expiró o no tienes permisos.';
    }
    return message;
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    const responseBody = error.error as { message?: unknown } | null;
    return typeof responseBody?.message === 'string' ? responseBody.message : error.message;
  }
}
