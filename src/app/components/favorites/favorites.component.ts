import { Component, OnInit } from '@angular/core';
import { Contact } from '../../interfaces/Contact';
import { Category } from '../../interfaces/Category';
import { CategoryService } from '../../service/category.service';
import { ContactService } from '../../service/contact.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-favorites',
  standalone: false,
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css',
})
export class FavoritesComponent implements OnInit {
  categories: Category[] = [];

  deleteContact: Contact = {} as Contact;
  selectedContact: Contact = {} as Contact; 

  contact: Contact = {} as Contact;
  contacts: Contact[] = [];

  filtro: string = '';
  isEditing: boolean = false;
  isFormEditing: boolean = false;
  showForm: boolean = false;

  constructor(
    private categoryService: CategoryService,
    private contactService: ContactService
  ) {}

  ngOnInit(): void {
    this.loadContacts();
    this.loadCategories();
  }

  loadContacts() {
    this.contactService.getFavorite().subscribe({
      next: (data) => {
        this.contacts = data.sort((a, b) => {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
      },
      error: (error) => {
        console.error('Erro ao carregar contatos:', error);
      },
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
    });
  }

  favorite(contact: Contact): void {
    contact.favorite = !contact.favorite;
    this.contactService.updateFavorite(contact.id!)
      .subscribe({
        next: () => {
          console.log('Favorito atualizado no backend com sucesso!');
        },
        error: (error) => {
          console.error('Erro ao atualizar favorito no backend:', error);
          contact.favorite = !contact.favorite;
        }
      });
  }

  contactsFilter(): Contact[] {
    if (this.filtro.trim() === '') {
      return this.contacts;
    }
    const lowerCaseFiltro = this.filtro.toLowerCase();
    return this.contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(lowerCaseFiltro) ||
        contact.lastname.toLowerCase().includes(lowerCaseFiltro) ||
        contact.cell?.toLowerCase().includes(lowerCaseFiltro) ||
        contact.category?.name?.toLowerCase().includes(lowerCaseFiltro)
    );
  }

}