import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './components/contact/contact.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { FavoritesComponent } from './components/favorites/favorites.component';

const routes: Routes = [
  {path: 'contacts_list', component: ContactsComponent},
  {path: 'favorites', component: FavoritesComponent},
  {path: '', redirectTo: '/contacts_list', pathMatch: 'full'},
  {path: '**', redirectTo: '/contacts_list', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
