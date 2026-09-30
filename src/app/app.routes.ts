import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { EventsPage } from './pages/events-page/events-page';
import { LoginPage } from './pages/login-page/login-page';
import { EventDetailPage } from './pages/event-detail-page/event-detail-page';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'events',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginPage
    },
    {
        path: 'events',
        component: EventsPage,
        canActivate: [authGuard]
    },
    {
        path: 'events/:id',
        component: EventDetailPage,
        canActivate: [authGuard]
    },
    {
        path: '**',
        redirectTo: 'events'
    }
];
