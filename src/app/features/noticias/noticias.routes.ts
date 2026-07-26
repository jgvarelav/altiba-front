import { Routes } from '@angular/router';
import { NoticiasList } from './pages/noticias-list/noticias-list';
import { NoticiaDetail } from './pages/noticia-detail/noticia-detail';

export const NOTICIAS_ROUTES: Routes = [
  { path: '', component: NoticiasList },
  { path: ':documentId', component: NoticiaDetail },
];
