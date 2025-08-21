import { ProductCard } from './ProductCard';
import { EventEmitter } from './base/events';


export class ModalProductBasket extends ProductCard {
    protected button: HTMLButtonElement;
    protected _sInCard?: boolean;
    protected _index: HTMLElement;

    constructor(
        protected container: HTMLElement,
        protected events: EventEmitter
    ) {
        super(container, events);
        
        this.button = this.container.querySelector('.basket__item-delete');
        this._index = this.container.querySelector('.basket__item-index');
        this.removeCardClickListener();
        this._sInCard = this.sInCard;
        this.button.addEventListener('click', (event) => {
            events.emit('product:remove', this);
            events.emit('basket:quantity-change', this);
        });
    }   
    
    set category(category: string) {}

    set index(data: string){
        this._index.textContent = data;
    }
    private cardClickListener = () => {
        this.events.emit('product:select', this);
    };

    public getContainer(): HTMLElement {
        return this.container;
    }
}