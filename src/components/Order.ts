import { IOrder, IOrderForm, ValidationRule } from '../types';
import { IValidationRules, ValidatableFields, ValidationFormErrors } from '../types/index';
import { FormValidator } from './Validators';
import { EventEmitter } from "./base/events";

export class Order implements IOrder {
    payment?: string;
    email?: string;
    phone?: string;
    address?: string;
    total: number = 0;
    items: string[] = [];

    protected validator: FormValidator;
    private _events: EventEmitter;

    constructor(events: EventEmitter, validationRules: IValidationRules, data?: Partial<IOrder>) {
        if (data) {
            Object.assign(this, data);
        }
        this.validator = new FormValidator(validationRules);
        this._events = events;
    }

    // Валидация формы заказа
    static validateOrder(form: IOrderForm): boolean {
        const requiredFields: (keyof IOrderForm)[] = ["payment", "email", "phone", "address"];
        return requiredFields.every(field => form[field] !== undefined && form[field] !== "");
    }

    // Валидация самого заказа
    validate(): boolean {
        return this.total > 0 && 
               this.items.length > 0 && 
               Order.validateOrder(this);
    }

    // очистка заказа
    clear(): void {
        this.payment = undefined;
        this.email = undefined;
        this.phone = undefined;
        this.address = undefined;
        this.total = 0;
        this.items = [];
    }

    // Валидация всей формы
    validateForm<T extends Record<string, string>>(formData: T): boolean {
        const errors = this.validator.validateForm(formData as Partial<Record<ValidatableFields, string>>);
        this.renderErrors(errors);
        const valid = Object.keys(errors).length === 0;
        return valid;
    }

    // Валидация отдельного поля
    validateField(fieldName: ValidatableFields, value: string): void {
        const error = this.validator.validateField(fieldName, value);
        this._events.emit('order:changed', this.renderFieldError(error));
    }

    // Отображение ошибок полей
    protected renderErrors(errors: ValidationFormErrors): void {
        var _error: string = ''
        Object.entries(errors).forEach(([field, error]) => {
            if (error) {
                _error = error;
            } 
        });
        this._events.emit('order:changed', this.renderFieldError(_error));
    }

    // для отображение ошибки конкретного поля
    protected renderFieldError(error: string): ValidationRule {
        return {
            message: error
        };
    }
}