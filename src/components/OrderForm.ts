import { Form } from "./common/form";
import {ensureElement} from "../utils/utils";
import { EventEmitter } from "./base/events";
import { IOrderDataForm } from '../types';

export class OrderForm extends Form<IOrderDataForm> {
    protected paymentButtons: HTMLButtonElement[];
    protected addressInput: HTMLInputElement;
    protected _payment: string | undefined;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container, events);      

        this._payment = undefined;
        this.paymentButtons = Array.from(container.querySelectorAll('button[name]'));
        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);
        this.initEventListeners();
    }
    private initEventListeners(): void {
        // Обработка выбора способа оплаты
        this.paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.payment = button.name;
                this.events.emit(`order:changed-form`, this.getFormData());
            });
        });

        // Валидация адреса при вводе
        this.addressInput.addEventListener('input', () => {
            this.events.emit(`order:changed-form`, this.getFormData());
        });
    }    

    protected getFormData(): IOrderDataForm {
        return {
            payment: this.payment as string,
            address: this.addressInput.value
        };
    }

    get payment(): string | undefined {
        return this._payment;
    }

    set payment(value: string) {
        this._payment = value;
        this.paymentButtons.forEach(button => {
            button.classList.toggle('button_alt-active', button.name === value);
        });
    }

    set address(value: string) {
        this.addressInput.value = value;
    }
    
    private checkValidity(): void {
        this.valid = !!this.payment && this.addressInput.value !== '';
    }
}