import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Category } from '../../interfaces/Category';
import { Contact } from '../../interfaces/Contact';
import { CategoryService } from '../../service/category.service';
import { ContactService } from '../../service/contact.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-contacts',
  standalone: false,
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css',
})
export class ContactsComponent implements OnInit {
  contacts: Contact[] = [];
  categories: Category[] = [];
  selectedContact: Contact = {} as Contact;
  showForm: boolean = false;
  isEditing: boolean = false;
  isFormEditing: boolean = false;
  deleteContact: Contact = {} as Contact;
  filtro: string = '';

  constructor(
    private categoryService: CategoryService,
    private contactService: ContactService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadContacts();
    this.loadCategories();
  }

  loadContacts() {
    this.contactService.getContacts().subscribe({
      next: (data) => {
        console.log('Dados recebidos do backend (loadContacts - RAW):', data);
        this.contacts = data
          .map((contact) => {
            let parsedDatebirth: Date | undefined = undefined;
            if (contact.datebirth) {
              if (typeof contact.datebirth === 'string') {
                const dateString = contact.datebirth;
                const parts = dateString.split('/');
                if (parts.length === 3) {
                  parsedDatebirth = new Date(
                    Number(parts[2]),
                    Number(parts[1]) - 1,
                    Number(parts[0])
                  );
                } else {
                  parsedDatebirth = new Date(dateString);
                }
                if (isNaN(parsedDatebirth.getTime())) {
                  console.warn(
                    'Data de nascimento inválida ao carregar:',
                    dateString
                  );
                  parsedDatebirth = undefined;
                }
              } else if (contact.datebirth instanceof Date) {
                parsedDatebirth = contact.datebirth;
              } else if (contact.datebirth === null) {
                parsedDatebirth = undefined;
              }
            }
            return {
              ...contact,
              datebirth: parsedDatebirth,
              category: contact.category ? { ...contact.category } : undefined,
              cell: contact.cell || undefined,
              phone: contact.phone || undefined,
              email: contact.email || undefined,
              address: contact.address || undefined,
              note: contact.note || undefined,
              favorite: contact.favorite ?? false,
            } as Contact;
          })
          .sort((a, b) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
          });
        this.cdr.detectChanges();
        console.log(
          'this.contacts após conversão e ordenação (loadContacts):',
          this.contacts
        );
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
      error: (error) => {
        console.error('Erro ao carregar categorias:', error);
      },
    });
  }

  trackByContact(index: number, contact: Contact): number | undefined {
    return contact.id;
  }

  saveContact(contact: Contact | undefined) {
    console.log('saveContact - Recebido contact:', contact);
    console.log('saveContact - this.isEditing:', this.isEditing);

    if (contact) {
      console.log(
        'saveContact - Contact é válido, procedendo com save/update.'
      );
      if (this.isEditing) {
        console.log('saveContact - Modo Edição.');
        if (contact.id !== undefined && contact.id !== null) {
          this.contactService.update(contact).subscribe({
            next: () => {
              const index = this.contacts.findIndex((c) => c.id === contact.id);
              if (index !== -1) {
                this.contacts[index] = { ...contact };
                this.contacts.sort((a, b) => {
                  const nameA = a.name.toLowerCase();
                  const nameB = b.name.toLowerCase();
                  if (nameA < nameB) return -1;
                  if (nameA > nameB) return 1;
                  return 0;
                });
                this.cdr.detectChanges();
                console.log('Contato atualizado com sucesso na lista!');
              } else {
                console.warn(
                  'Contato atualizado não encontrado na lista local. Recarregando todos os contatos...'
                );
                this.loadContacts();
              }
              this.resetFormState();
            },
            error: (error) => {
              console.error('Erro ao atualizar contato:', error);
              this.resetFormState();
            },
          });
        } else {
          console.error(
            'Erro: ID do contato para atualização é undefined ou null.'
          );
          this.resetFormState();
        }
      } else {
        console.log('saveContact - Modo Novo Contato.');
        this.contactService.save(contact).subscribe({
          next: (newContact) => {
            this.contacts.push(newContact);
            this.contacts.sort((a, b) => {
              const nameA = a.name.toLowerCase();
              const nameB = b.name.toLowerCase();
              if (nameA < nameB) return -1;
              if (nameA > nameB) return 1;
              return 0;
            });
            this.cdr.detectChanges();
            console.log('Novo contato salvo e adicionado à lista!');
            this.resetFormState();
          },
          error: (error) => {
            console.error('Erro ao salvar novo contato:', error);
            this.resetFormState();
          },
        });
      }
    } else {
      console.log('saveContact - Operação de formulário cancelada.');
      this.resetFormState();
    }
  }

  create() {
    this.selectedContact = {} as Contact;
    this.isEditing = false;
    this.isFormEditing = false;
    this.showForm = true;
  }

  edit(contact: Contact) {
    this.selectedContact = { ...contact };
    this.isEditing = true;
    this.isFormEditing = true;
    this.showForm = true;
  }

  delete(modal: any, contact: Contact) {
    this.deleteContact = contact;
    this.modalService
      .open(modal)
      .result.then((confirm) => {
        if (confirm) {
          if (contact.id !== undefined && contact.id !== null) {
            this.contactService.delete(contact.id).subscribe({
              next: () => {
                this.contacts = this.contacts.filter(
                  (c) => c.id !== contact.id
                );
                this.contacts.sort((a, b) => {
                  const nameA = a.name.toLowerCase();
                  const nameB = b.name.toLowerCase();
                  if (nameA < nameB) return -1;
                  if (nameA > nameB) return 1;
                  return 0;
                });
                this.cdr.detectChanges();
                console.log('Contato excluído e removido da lista!');
              },
              error: (error) => {
                console.error('Erro ao excluir contato:', error);
              },
            });
          } else {
            console.error(
              'Não foi possível excluir: ID do contato é inválido.'
            );
          }
        }
      })
      .catch(() => {
        console.log('Exclusão cancelada.');
      });
  }

  favorite(contact: Contact): void {
    const updatedContact = { ...contact, favorite: !contact.favorite };
    if (updatedContact.id !== undefined && updatedContact.id !== null) {
      this.contactService.updateFavorite(updatedContact.id).subscribe({
        next: () => {
          contact.favorite = updatedContact.favorite;
          console.log('Favorito atualizado no backend com sucesso!');
        },
        error: (error) => {
          console.error('Erro ao atualizar favorito no backend:', error);
        },
      });
    } else {
      console.error('Erro: ID do contato para favoritar é undefined ou null.');
    }
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

  private resetFormState(): void {
    this.selectedContact = {} as Contact;
    this.showForm = false;
    this.isEditing = false;
    this.isFormEditing = false;
    this.filtro = '';
  }
}
