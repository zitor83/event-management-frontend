import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { EventsPage } from './pages/events-page/events-page';
import { LoginPage } from './pages/login-page/login-page';

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
        path: '**',
        redirectTo: 'events'
    }
];
