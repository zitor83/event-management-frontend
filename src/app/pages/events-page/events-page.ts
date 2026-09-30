import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Event } from '../../models/api-models';
import { ApiService } from '../../service/api-service';
import { AuthService } from '../../service/auth-service';

@Component({
  selector: 'app-events-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './events-page.html',
  styleUrl: './events-page.css'
})
export class EventsPage implements OnInit {
  title = 'Eventos';
  events = signal<Event[]>([]);
  message = signal('');
  errorMessage = signal('');
  isLoading = signal(false);
  currentPage = signal(0);
  totalPages = signal(0);
  searchTerm = '';
  private navigationMessage = history.state?.message ?? '';

  readonly pageSize = 10;
  readonly sort = 'name';

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getEvents();
  }

  getEvents(): void {
    this.message.set('');
    this.errorMessage.set('');
    this.isLoading.set(true);
    this.apiService.getEvents(this.searchTerm, this.currentPage(), this.pageSize, this.sort).subscribe({
      next: (response) => {
        this.events.set(response.content);
        this.totalPages.set(response.totalPages);
        this.message.set(this.navigationMessage || `Eventos cargados (${response.totalElements} encontrados).`);
        this.navigationMessage = '';
        this.isLoading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set('Error al obtener eventos: ' + this.getErrorMessage(error));
        this.events.set([]);
        this.totalPages.set(0);
        this.isLoading.set(false);
        if (error.status === 401 || error.status === 403) {
          this.errorMessage.set(this.errorMessage() + ' -> Posiblemente el token expiró o es inválido.');
        }
      }
    });
  }

  searchEvents(): void {
    this.currentPage.set(0);
    this.getEvents();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchEvents();
  }

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages() || page === this.currentPage()) {
      return;
    }

    this.currentPage.set(page);
    this.getEvents();
  }

  openEvent(id: number): void {
    this.router.navigate(['/events', id]);
  }

  openEventForm(): void {
    this.router.navigate(['/events/new']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    const responseBody = error.error as { message?: unknown } | null;
    return typeof responseBody?.message === 'string' ? responseBody.message : error.message;
  }
}
