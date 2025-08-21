import { IBasketItem, IProduct, IBasketState } from '../types';
import { EventEmitter } from './base/events'

export class BasketService {
// Приватное поле для хранения элементов корзины
    private _items: IBasketItem[] = [];
    private _events: EventEmitter;
    
    constructor(events: EventEmitter) {
        this._events = events;
    }

    add(product: IProduct): void {
        if (this.contains( product.id)) {
           return;
        } else {
            this._items.push({
                product
            });
        }
        
        this._notify();
    }

// Удаление товара из корзины
    remove(productId: string): void {
        this._items = this._items.filter(item => item.product.id !== productId);
        this._notify();
    }

    clear(): void {
        this._items = [];
        this._notify();
    }

// Возвращаем копию массива
    get items(): IBasketItem[] {
        return [...this._items]; 
    }
// Возвращаем размер массива
    get count(): number {
        return this._items.length; 
    }    

// Возвращаем сумму корзины
    get _total(): number {
        return this._items.reduce((sum, item) => {
            return sum + (item.product.price || 0);
        }, 0);
    }

// Проверка на пустоту
    get isEmpty(): boolean {
        return this._items.length === 0;
    }

// Уведомление системы об изменениях
    private _notify(): void {
        this._events.emit('basket:changed', this._getState());
    }

//возвращаем массив с id и итоговую сумму
    private _getState(): IBasketState {
        return {
            items: this.items.map(item => item.product.id),
            total: this._total,
        };
    }

// Проверка наличия товара в корзине
    contains(productId: string): boolean {
        return this._items.some(item => item.product.id === productId);
    }
}