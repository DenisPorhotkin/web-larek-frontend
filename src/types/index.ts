import { ApiPostMethods } from "../components/base/api";

export interface IProduct {
  id: string;
  title: string;
  description: string;
  image?: string;
  category: string;
  price: number | null;
  sInCart?: boolean;
}

export interface IProductsData {
  total: number;
  items: IProduct[];
}

export interface IProductContainer {
  catalog: HTMLElement[];
  countProduct: string;
  locked: boolean;
}

export interface IBasketItem {
  product: IProduct;
}

export interface IBasketState {
  items: string[];
  total: number;
}

export interface IOrder {
  payment?: string;
  email?: string;
  phone?: string;
  address?: string;
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

export interface IContactsForm extends Record<string, string>{
  email: string;
  phone: string;
}

export interface IOrderDataForm extends Record<string, string>{
  payment: string;
  address: string;
}

export interface ISuccess {
  total: number;
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

export interface IApi {
  baseUrl: string;
  get<T>(url: string): Promise<T>;
  post<T>(url: string, data: object, metod?: ApiPostMethods): Promise<T>;
}

export interface ApiError {
  message: string;
  status?: number;
  data?: unknown;
}

export type ValidatableFields = 'payment' | 'email' | 'phone' | 'address';
export type ValidationFormErrors = Partial<Record<ValidatableFields, string>>;