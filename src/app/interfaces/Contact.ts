// interfaces/Contact.ts (A VERSÃO CORRETA E FLEXÍVEL)

import { Category } from "./Category";

export interface Contact {
    id?: number; // Opcional, pois o backend gera para novos
    name: string;
    lastname: string;
    cell?: string;
    phone?: string;
    email?: string;
    datebirth?: Date | string | null; // <--- ESTE É O PONTO CHAVE: Pode ser Date, string ou null
    address?: string;
    category?: Category | null; // <--- Pode ser Category ou null (ou undefined)
    note?: string;
    favorite?: boolean;
}