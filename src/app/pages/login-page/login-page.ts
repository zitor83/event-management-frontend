import { HttpErrorResponse } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginCredentials } from '../../models/api-models';
import { AuthService } from '../../service/auth-service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPage {
  title = 'API Eventos Client Standalone';
  username = 'admin';
  password = 'admin1234';
  errorMessage = signal('');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(): void {
    this.errorMessage.set('');
    const credentials: LoginCredentials = {
      username: this.username,
      password: this.password
    };

    this.authService.login(credentials).subscribe({
      next: () => this.router.navigate(['/events']),
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set('Error en login: ' + this.getErrorMessage(error));
      }
    });
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    const responseBody = error.error as { message?: unknown } | null;
    return typeof responseBody?.message === 'string' ? responseBody.message : error.message;
  }
}
