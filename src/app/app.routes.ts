import { Routes } from '@angular/router';
import { LogInComponent } from './components/login/login.component';
import { SummaryComponent } from './components/summary/summary.component';
import { SignUpComponent } from './components/signup/signup.component';
import { authGuard } from './guards/auth.guard';
import { PollListComponent } from './components/poll-list/poll-list.component';

export const routes: Routes = [
    // Currently redirecting our default landing page to /poll
    { path: '',    redirectTo: '/poll', pathMatch: 'full'  },

    // What we'll probably have in the future for account

    // What we currrently have
    { path: 'summary', component: SummaryComponent, title: 'Account Summary', canActivate: [authGuard] },
    { path: 'signup', component: SignUpComponent, title: 'Sign Up' },
    { path: 'login', component: LogInComponent, title: 'Log In' },
    { path: 'poll', component: PollListComponent, title: 'Polls' },

    // This last one is the wildcard route, we should probably define a simple
    // NotFoundComponent later as we will default to the homepage without it
    // { path: '**', component: NotFoundComponent }
];
