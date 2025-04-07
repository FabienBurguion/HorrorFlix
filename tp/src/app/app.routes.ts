import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MoviesComponent } from './movies/movies.component';
import { AddMovieComponent } from './movies/add-movie/add-movie.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { ConnectionComponent } from './connection/connection';
import { UserSpaceComponent } from './user-space/user-space.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { AddAvisComponent } from './add-avis/add-avis.component';
import { ListAvisComponent } from './list-avis/list-avis.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'movies', component: MoviesComponent },
    { path: 'add-movie', component: AddMovieComponent },
    { path: 'add-movie/:id', component: AddMovieComponent },
    { path: 'add-user', component: InscriptionComponent },
    { path: 'add-user/:id', component: InscriptionComponent },
    { path: 'connection', component: ConnectionComponent },
    { path: 'user-page', component: UserSpaceComponent },
    { path: 'panel-admin', component: AdminPanelComponent },
    { path: 'add-avis', component: AddAvisComponent },
    { path: 'add-avis/:id', component: AddAvisComponent },
    { path: 'list-avis', component: ListAvisComponent },
    { path: 'list-avis/:id', component: ListAvisComponent }
];
