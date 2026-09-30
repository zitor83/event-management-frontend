import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EventDetail } from '../../models/api-models';
import { ApiService } from '../../service/api-service';
import { AuthService } from '../../service/auth-service';

@Component({
  selector: 'app-event-detail-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './event-detail-page.html',
  styleUrl: './event-detail-page.css'
})
export class EventDetailPage implements OnInit {
  event = signal<EventDetail | null>(null);
  isLoading = signal(false);
  errorMessage = signal('');
  notFound = signal(false);

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(id) || id < 1) {
      this.notFound.set(true);
      return;
    }

    this.getEvent(id);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private getEvent(id: number): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.notFound.set(false);
    this.apiService.getEvent(id).subscribe({
      next: (event) => {
        this.event.set(event);
        this.isLoading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.event.set(null);
        this.isLoading.set(false);
        if (error.status === 404) {
          this.notFound.set(true);
          return;
        }

        this.errorMessage.set('Error al obtener el evento: ' + this.getErrorMessage(error));
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
