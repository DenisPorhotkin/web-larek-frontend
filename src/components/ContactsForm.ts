import { Form } from "./common/form";
import {ensureElement} from "../utils/utils";
import { EventEmitter } from "./base/events";
import { IContactsForm } from '../types';

export class ContactsForm extends Form<IContactsForm> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container, events);

        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);
        this.initEventListeners(); 
    }
    private initEventListeners(): void {
        this.emailInput.addEventListener('input', () => {
            this.events.emit(`order:changed-contacts`, this.getFormData());
        });

        this.phoneInput.addEventListener('input', () => {
            this.events.emit(`order:changed-contacts`, this.getFormData());
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