import { Component, OnInit, signal, WritableSignal } from '@angular/core'; // <<-- Importar signal y WritableSignal
import { ApiService } from '../../service/api-service';
import { FormsModule } from '@angular/forms';
// CommonModule no es necesario si standalone: true

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage implements OnInit {
  title = 'API Eventos Client Standalone';
  username = 'admin';
  password = 'admin1234';

  // <<-- Convertir las propiedades a Signals
  token: WritableSignal<string | null> = signal(null);
  events: WritableSignal<any[]> = signal([]);
  message: WritableSignal<string> = signal('');
  errorMessage: WritableSignal<string> = signal('');

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    // Si quieres cargar eventos públicos al inicio, descomenta:
    // this.getEventsNoAuth();
  }

  login() {
    this.message.set(''); // Usar .set() para actualizar el valor de una Signal
    this.errorMessage.set('');
    const credentials = { username: this.username, password: this.password };
    this.apiService.login(credentials).subscribe({
      next: (response) => {
        this.token.set(response.accessToken); // <<-- Actualizar Signal
        this.message.set('Login exitoso! Token obtenido.'); // <<-- Actualizar Signal
        console.log('Token (Signal):', this.token()); // Acceder al valor de la Signal con .()
        this.getEvents(); // Llama a getEvents() automáticamente
      },
      error: (err) => {
        this.errorMessage.set('Error en login: ' + (err.error?.message || err.message)); // <<-- Actualizar Signal
        console.error('Error de login:', err);
        this.token.set(null); // <<-- Actualizar Signal
        this.events.set([]); // <<-- Actualizar Signal
      }
    });
  }

  getEvents() {
    this.message.set('');
    this.errorMessage.set('');
    const currentToken = this.token(); // <<-- Acceder al valor de la Signal con .()
    if (!currentToken) {
      this.errorMessage.set('No hay token. Inicia sesión para obtener eventos.');
      this.events.set([]);
      return;
    }
    this.apiService.getEvents(currentToken).subscribe({ // <<-- Usar currentToken
      next: (response) => {
        this.events.set(response.content); // <<-- Actualizar Signal
        this.message.set(`Eventos cargados (${this.events().length} encontrados).`); // Acceder con .()
        console.log('Eventos (Signal):', this.events()); // Acceder con .()
      },
      error: (err) => {
        this.errorMessage.set('Error al obtener eventos: ' + (err.error?.message || err.message)); // <<-- Actualizar Signal
        console.error('Error al obtener eventos:', err);
        this.events.set([]); // <<-- Actualizar Signal
        if (err.status === 401 || err.status === 403) {
          this.errorMessage.set(this.errorMessage() + ' -> Posiblemente el token expiró o es inválido.'); // Acceder con .()
        }
      }
    });
  }

  logout() {
    this.token.set(null); // <<-- Actualizar Signal
    this.events.set([]); // <<-- Actualizar Signal
    this.message.set('Sesión cerrada.'); // <<-- Actualizar Signal
    this.errorMessage.set(''); // <<-- Actualizar Signal
  }
}