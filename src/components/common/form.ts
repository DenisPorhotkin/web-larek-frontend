import { View } from "../base/View";
import { EventEmitter } from "../base/events";
import { ensureElement } from "../../utils/utils";
import { IValidationRules, ValidatableFields, ValidationFormErrors } from '../../types/index';
import { FormValidator } from '../Validators';


export abstract class Form<T extends object> extends View<T> {
    protected submitButton: HTMLButtonElement;
    protected errorContainer: HTMLElement;
    protected formElement: HTMLFormElement;
    protected validator: FormValidator;
 

    constructor(
        protected container: HTMLElement,
        protected events: EventEmitter,
        validationRules: IValidationRules        
    ) {
        super(container);    
        this.formElement = ensureElement<HTMLFormElement>('form', container);
        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this.errorContainer = ensureElement<HTMLElement>('.form__errors', container);
        this.validator = new FormValidator(validationRules);

        this.formElement.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validateForm()) {
                this.events.emit(`${this.formElement.name}:submit`, this.getFormData());
            }
        });        
    }

    protected abstract getFormData(): T;

    set errors(message: string) {
        this.errorContainer.textContent = message;
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }

    // Валидация всей формы
    protected validateForm(): boolean {
        const formData = this.getFormData();
        const errors = this.validator.validateForm(formData as Partial<Record<ValidatableFields, string>>);
        this.renderErrors(errors);
        const valid = Object.keys(errors).length === 0;
        this.valid = valid;
        return valid;
    }

    // Валидация отдельного поля
    protected validateField(fieldName: ValidatableFields, value: string): string {
        const error = this.validator.validateField(fieldName, value);
        this.renderFieldError(error);
        return error;
    }

    // Отображение ошибок полей
    protected renderErrors(errors: ValidationFormErrors): void {
        this.clearErrors();
        Object.entries(errors).forEach(([field, error]) => {
            if (error) {
                this.renderFieldError(error);
            }
        });
        this.errorContainer.style.display = Object.keys(errors).length > 0 ? 'block' : 'none';
    }

    // Отображение ошибки конкретного поля
    protected renderFieldError(error: string): void {
        if (error) {
            this.errorContainer.textContent = error;
        } else {
            this.errorContainer.textContent = '';
        }
    }

    // Очистка всех ошибок
    protected clearErrors(): void {
        this.errorContainer.textContent = '';
    }

    render(data?: Partial<T>): HTMLElement {
        super.render(data);
        return this.container;
    }
}