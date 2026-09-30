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

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Speaker {
  id: number;
  name: string;
  email: string;
  bio: string;
}

export interface EventDetail extends Event {
  categoryId: number | null;
  categoryName: string | null;
  speakers: Speaker[];
}

export interface EventRequest {
  name: string;
  date: string;
  location: string;
  categoryId: number;
  speakersIds: number[];
}

export interface EventListResponse {
  content: Event[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
