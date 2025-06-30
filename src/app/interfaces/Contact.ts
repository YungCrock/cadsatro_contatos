import { Category } from './Category';

export interface Contact {
  id: number;
  name: string;
  lastname: string;
  cell?: string;
  phone?: string;
  email?: string;
  datebirth?: Date | string | null;
  address?: string;
  category?: Category;
  note?: string;
  favorite?: boolean;
}