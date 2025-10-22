import { Routes } from '@angular/router';
import { AccountComponent } from './account.component';
import { PollComponent } from './poll.component';

export const routes: Routes = [
    // Currently redirecting our default landing page to /poll
    { path: '',    redirectTo: '/poll', pathMatch: 'full'  },

    // What we'll probably have in the future for account
    // { path: 'account/new', component: AccountComponent, title: 'Account' },
    // { path: 'account/:id', component: AccountComponent, title: 'Account' },

    // What we currrently have
    { path: 'account', component: AccountComponent, title: 'Account' },
    { path: 'poll', component: PollComponent, title: 'Polls' },

    // This last one is the wildcard route, we should probably define a simple
    // NotFoundComponent later as we will default to the homepage without it
    // { path: '**', component: NotFoundComponent }
];
