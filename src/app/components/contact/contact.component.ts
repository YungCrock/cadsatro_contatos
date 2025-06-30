import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Category } from '../../interfaces/Category';
import { Contact } from '../../interfaces/Contact';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: false,
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent implements OnInit, OnChanges {
  @Input() contact: Contact = {} as Contact;
  @Input() categories: Category[] = [];
  @Input() isEditing: boolean = false;

  @Output() saveEmitter: EventEmitter<Contact | undefined> = new EventEmitter();

  formGroupContact: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.formGroupContact = this.formBuilder.group({
      id: [null],
      name: ['', Validators.required],
      lastname: [''],
      datebirth: [null],
      cell: [''],
      phone: [''],
      email: ['', [Validators.email]],
      address: [''],
      categoryId: [null, Validators.required],
      note: [''],
      favorite: [false],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['contact'] && changes['contact'].currentValue) {
      this.patchFormWithContact();
    }
  }

  ngOnInit(): void {
    if (this.isEditing && this.contact && this.contact.id) {
      this.patchFormWithContact();
    }
  }

  private patchFormWithContact(): void {
    let parsedDatebirth: Date | null = null;

    if (
      this.contact.datebirth !== undefined &&
      this.contact.datebirth !== null
    ) {
      if (typeof this.contact.datebirth === 'string') {
        const dateString = this.contact.datebirth;
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
            'Data de nascimento inválida recebida (string):',
            dateString
          );
          parsedDatebirth = null;
        }
      } else if (this.contact.datebirth instanceof Date) {
        parsedDatebirth = this.contact.datebirth;
        if (isNaN(parsedDatebirth.getTime())) {
          console.warn(
            'Data de nascimento inválida recebida (Date object):',
            this.contact.datebirth
          );
          parsedDatebirth = null;
        }
      } else {
        parsedDatebirth = null;
      }
    }

    this.formGroupContact.patchValue({
      id: this.contact.id ?? null,
      name: this.contact.name ?? '',
      lastname: this.contact.lastname ?? '',
      datebirth: parsedDatebirth,
      cell: this.contact.cell ?? '',
      phone: this.contact.phone ?? '',
      email: this.contact.email ?? '',
      address: this.contact.address ?? '',
      categoryId: this.contact.category?.id ?? null,
      note: this.contact.note ?? '',
      favorite: this.contact.favorite ?? false,
    });
  }

  save() {
    if (this.formGroupContact.valid) {
      const formValue = this.formGroupContact.value;

      let datebirthForBackend: string | undefined = undefined;
      if (
        formValue.datebirth instanceof Date &&
        !isNaN(formValue.datebirth.getTime())
      ) {
        datebirthForBackend = formValue.datebirth.toISOString().split('T')[0];
      } else if (
        typeof formValue.datebirth === 'string' &&
        formValue.datebirth.trim() !== ''
      ) {
        datebirthForBackend = formValue.datebirth;
      }

      const categoryObject: Category | undefined = formValue.categoryId
        ? ({ id: formValue.categoryId, name: '' } as Category)
        : undefined;

      const contatoParaBackend: Contact = {
        id: formValue.id ?? (this.isEditing ? this.contact.id : undefined),
        name: formValue.name,
        lastname: formValue.lastname,
        cell: formValue.cell ?? undefined,
        phone: formValue.phone ?? undefined,
        email: formValue.email ?? undefined,
        datebirth: datebirthForBackend,
        address: formValue.address ?? undefined,
        note: formValue.note ?? undefined,
        favorite: formValue.favorite ?? false,
        category: categoryObject,
      };

      console.log(
        'Objeto Contact COMPLETO E FORMATADO para EMISSÃO:',
        contatoParaBackend
      );
      this.saveEmitter.emit(contatoParaBackend);
    } else {
      this.formGroupContact.markAllAsTouched();
      console.error(
        'Formulário inválido. Por favor, preencha os campos obrigatórios.'
      );
    }
  }

  cancel() {
    this.saveEmitter.emit(undefined);
  }
}
