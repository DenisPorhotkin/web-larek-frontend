import { View } from "./base/View";
import { IProductContainer } from "../types";
import { EventEmitter } from './base/events';


export class MainPageView extends View<IProductContainer> {
    protected gallery: HTMLElement;
    protected basketButton: HTMLButtonElement;
    protected basketCounter: HTMLElement;

    constructor(
        protected container: HTMLElement,
        protected events: EventEmitter
    ) {
        super(container);
        this.events = events;
        
        this.basketButton = this.container.querySelector('.header__basket');
        this.basketCounter = this.container.querySelector('.header__basket-counter');
        this.gallery = this.container.querySelector('.gallery');
        this.basketButton.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    // передаем в рендер галерею товаров
    set catalog(items: HTMLElement[]) {
        this.gallery.replaceChildren(...items);
    }
    set countProduct(data: string) {
        this.basketCounter.textContent = data;
    }

}