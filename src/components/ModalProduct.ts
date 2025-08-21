import { ProductCard } from './ProductCard';
import { EventEmitter } from './base/events';

export class ModalProductCard extends ProductCard {
    protected button: HTMLButtonElement;
    protected _sInCard?: boolean;

    constructor(
        protected container: HTMLElement,
        protected events: EventEmitter
    ) {
        super(container, events);
        
        this.button = this.container.querySelector('.card__button');
        this.removeCardClickListener();
        this._sInCard = this.sInCard;

        if (this.button) {
            // Один обработчик для обоих действий
            this.button.addEventListener('click', (event) => {
                event.stopPropagation();
                if (this._sInCard) {
                    events.emit('product:remove', this);
                    this._sInCard = false;
                } else {
                    events.emit('product:add', this);
                    this._sInCard = true;
                }
            });
        }
    }
    private cardClickListener = () => {
        this.events.emit('product:select', this);
    };

    public getContainer(): HTMLElement {
        return this.container;
    }
}