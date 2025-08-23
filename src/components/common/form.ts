import { View } from "../base/View";
import { EventEmitter } from "../base/events";
import { ensureElement } from "../../utils/utils";
import { ValidationRule } from '../../types/index';


export abstract class Form<T extends object> extends View<T> {
    protected submitButton: HTMLButtonElement;
    protected errorContainer: HTMLElement;
    protected formElement: HTMLFormElement;

    constructor(
        protected container: HTMLElement,
        protected events: EventEmitter    
    ) {
        super(container);    
        this.formElement = ensureElement<HTMLFormElement>('form', container);
        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this.errorContainer = ensureElement<HTMLElement>('.form__errors', container);

        this.formElement.addEventListener('submit', (e) => {
            e.preventDefault();
            this.events.emit(`${this.formElement.name}:submit`, this.getFormData());
        });
        this.events.on('order:changed', (error: ValidationRule)  => {
            this.errors = error.message;
        });
        this.events.on('order:changed-button', (data: { isValid: boolean }) => {
            this.valid = data.isValid;
        });        
    }

    protected abstract getFormData(): T;

    set errors(message: string) {
        this.errorContainer.textContent = message;
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }

    render(data?: Partial<T>): HTMLElement {
        super.render(data);
        return this.container;
    }
}