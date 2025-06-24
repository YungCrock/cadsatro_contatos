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
    private contactService: ContactService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadContacts();
    this.loadCategories();
  }

  loadContacts() {
    this.contactService.getFavorite().subscribe({
      next: (data) => {
        // Ordena os contatos por nome em ordem alfabética (case-insensitive)
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
    // Inverte o estado do favorito localmente para feedback imediato (otimista)
    contact.favorite = !contact.favorite;

    // Chama o serviço do Angular para atualizar no backend
    this.contactService.updateFavorite(contact.id!) // Use ! para afirmar que id não é nulo/indefinido
      .subscribe({
        next: () => {
          console.log('Favorito atualizado no backend com sucesso!');
          // Se o backend retornasse o objeto atualizado, você poderia atribuí-lo aqui.
          // Como ele retorna noContent, assumimos que a UI já está atualizada otimisticamente.
        },
        error: (error) => {
          console.error('Erro ao atualizar favorito no backend:', error);
          // Em caso de erro, você pode querer reverter o estado local do favorito
          contact.favorite = !contact.favorite; // Reverte para o estado anterior
          // Exibir mensagem de erro para o usuário (toast, etc.)
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
        contact.category?.name?.toLowerCase().includes(lowerCaseFiltro) // Adicionado '?' para category.name
    );
  }

}
