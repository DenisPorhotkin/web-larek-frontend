export interface IProduct {
  id: string;
  title: string;
  description: string;
  image: string;
  category: ProductCategory;
  price: number | null;
  sInCart?: boolean;
}

export interface ICardTemplate {
    containerSelector: string;   
    titleSelector: string;       
    priceSelector: string;       
    imageSelector: string;       
    categorySelector: string;    
    descriptionSelector?: string;
    buttonSelector?: string;     
}

export interface IBasketItem {
  product: IProduct;
}

export interface IOrder {
  payment: 'online' | 'cash';
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

export interface IOrderResult {
    id: string;
    total: number;
    status: 'created' | 'processing' | 'completed' | 'cancelled';
    items: string[];
    error?: string;
}

export interface IOrderForm {
  payment?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface IContactsForm {
    email: string;
    phone: string;
}

export interface IContactsForm {
    email: string;
    phone: string;
}

export interface ISuccess {
    total: number;
}

export interface IAppState {
  catalog: IProduct[];
  basket: IBasketItem[];
  order: IOrderForm;
}

export interface IValidationRules {
  payment: ValidationRule;
  email: ValidationRule;
  phone: ValidationRule;
  address: ValidationRule;
}

export interface ValidationRule {
  required?: boolean;
  pattern?: RegExp;
  message: string;
}

export interface IModal {
  open(): void;
  close(): void;
  setContent(content: HTMLElement): void;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;
export type ProductCategory = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил';