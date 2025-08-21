import { IOrder, IOrderForm } from '../types';

export class Order implements IOrder {
    payment?: string;
    email?: string;
    phone?: string;
    address?: string;
    total: number = 0;
    items: string[] = [];

    constructor(data?: Partial<IOrder>) {
        if (data) {
            Object.assign(this, data);
        }
    }

    // Валидация формы
    static validateForm(form: IOrderForm): boolean {
        const requiredFields: (keyof IOrderForm)[] = ["payment", "email", "phone", "address"];
        return requiredFields.every(field => form[field] !== undefined && form[field] !== "");
    }

    // Метод создания заказа
    static createFromForm(form: IOrderForm, basketItems: string[], totalSum: number): Order {
        return new Order({
            ...form,
            items: basketItems,
            total: totalSum
        });
    }

    // Валидация самого заказа
    validate(): boolean {
        return this.total > 0 && 
               this.items.length > 0 && 
               Order.validateForm(this);
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
}