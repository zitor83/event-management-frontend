export interface LoginCredentials {
  username: string;
  password: string;
}

export interface JwtAuthResponse {
  accessToken: string;
  tokenType: string;
}

export interface Event {
  id: number;
  name: string;
  location: string;
  date: string;
}

export interface EventListResponse {
  content: Event[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
