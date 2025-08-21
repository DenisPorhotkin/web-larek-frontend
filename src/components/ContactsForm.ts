import { Form } from "./common/form";
import {ensureElement} from "../utils/utils";
import { EventEmitter } from "./base/events";
import { IContactsForm, ValidatableFields } from '../types';
import { validationRules } from '../utils/constants';

export class ContactsForm extends Form<IContactsForm> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container, events, validationRules);

        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);
        this.initEventListeners(); 
    }
    private initEventListeners(): void {
        this.emailInput.addEventListener('input', () => {
            this.validateField('email', this.emailInput.value);
            this.validateForm();
        });

        this.phoneInput.addEventListener('input', () => {
            this.validateField('phone', this.phoneInput.value);
            this.validateForm();
        });
    }
    protected getFormData(): IContactsForm {
        return {
            email: this.emailInput.value,
            phone: this.phoneInput.value
        };
    }

    set phone(value: string) {
        this.phoneInput.value = value;
    }

    set email(value: string) {
        this.emailInput.value = value;
    }
    
    private checkValidity(): void {
        this.valid = this.emailInput.value !== '' && this.phoneInput.value !== '';
    }
}