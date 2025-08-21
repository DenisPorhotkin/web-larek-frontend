import { View } from "./base/View";
import { createElement, formatNumber } from "../utils/utils";
import { EventEmitter } from "./base/events";

interface IBasketView {
    items: HTMLElement[];
    total: number;
    selected: string[];
    index: string;
}

export class Basket extends View<IBasketView> {
    private _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLElement;

    constructor(protected container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._list = this.container.querySelector('.basket__list');
        this._total = this.container.querySelector('.basket__price');
        this._button = this.container.querySelector('.basket__button');
        
        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('basket:checkout');
            });
        }

        this.items = [];
    }

    public set items(items: HTMLElement[]) {
        if (items && items.length > 0) {
            this._list.replaceChildren(...items);
            this._list.style.opacity = '1';
            this.setDisabled(this._button, false);       
        } else {
            this.setDisabled(this._button, true);        
            this._list.replaceChildren(createElement('p', {
                textContent: 'Корзина пуста'
            }));
            this._list.style.opacity = '0.3';
        }
        if (this._total.textContent === '0 синапсов') {
            this.setDisabled(this._button, true); 
        }
    }

    public getContainer(): HTMLElement {
        return this.container;
    }

    set total(total: number) {
        this.setText(this._total, formatNumber(total) + ' синапсов');
    }
}