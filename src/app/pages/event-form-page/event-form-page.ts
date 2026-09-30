import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Category } from '../../models/api-models';
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

  readonly eventForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    date: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
    categoryId: new FormControl<number | null>(null, [Validators.required])
  });

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  validateForm(): void {
    this.message.set('');
    this.eventForm.markAllAsTouched();

    if (this.eventForm.invalid) {
      return;
    }

    this.message.set('Formulario válido. El guardado todavía no está implementado.');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private loadCategories(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.apiService.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.isLoading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.errorMessage.set('Error al obtener categorías: ' + this.getErrorMessage(error));
        if (error.status === 401 || error.status === 403) {
          this.errorMessage.set(this.errorMessage() + ' -> Posiblemente el token expiró o es inválido.');
        }
      }
    });
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    const responseBody = error.error as { message?: unknown } | null;
    return typeof responseBody?.message === 'string' ? responseBody.message : error.message;
  }
}
