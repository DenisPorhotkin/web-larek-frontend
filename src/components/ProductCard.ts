import { IProduct } from '../types';
import { EventEmitter } from './base/events';
import { CDN_URL, CATEGORY_MAPPING } from '../utils/constants';
import { View } from './base/View';

export class ProductCard extends View<IProduct> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _category: HTMLElement;
    protected button?: HTMLButtonElement;
    protected _text?: HTMLElement;
    protected productId: string;
    protected _sInCard?: boolean;
    protected otherCardData?: HTMLElement;
    private cardClickHandler: () => void;
    constructor(
        protected container: HTMLElement,
        protected events: EventEmitter
    ) {
        super(container);
        this.events = events;
        this._title = this.container.querySelector('.card__title');
        this._price = this.container.querySelector('.card__price');
        this._image = this.container.querySelector('.card__image');
        this._category = this.container.querySelector('.card__category');
        this.button = this.container.querySelector('.card__button');
        this._text =  this.container.querySelector('.card__text');
        this.otherCardData = this.container.querySelector('.basket__item-index');
       // Клик по всей карточке
        this.cardClickHandler = () => {
            events.emit('product:select', this);
        };
        this.container.addEventListener('click', this.cardClickHandler);
    }

    set id(_id) {this.productId = _id;}
    set title(text:string ) {
        if(text.length > 0){
            this._title.textContent = text;
            if(this._image)
            this._image.alt = text;
        }
    }
    set price(price: number) { this._price.textContent = this._formatPrice(price);} 
    set image(image: string) { 
        if(this._image && image){
            this._image.src = `${CDN_URL}${image}`
        };
    }
    set category(category: string) {
        if(category.length > 0 && category){
            this._category.textContent = category;
            this._category.className = `${this._category.className} ${this._categoryClass(category)}`;
        }
    }
    set description(dataText: string) {
        if (this._text && dataText) {
            this._text.textContent = dataText;
        }
    }
    set indexInBasket(indexBasket: string) {this.otherCardData.textContent = indexBasket;}

    set sInCard(inBasket: boolean) { this._sInCard = inBasket || false;}

    get inBasket() {
        return this.sInCard;
    }

    get id() {
        return this.productId;
    }

    private  _formatPrice(price: number | null): string {
        return price !== null ? `${price} синапсов` : 'Бесценно';
    }
    
    private _categoryClass(category: string): string {
        const mapping = CATEGORY_MAPPING[category as keyof typeof CATEGORY_MAPPING] || { cssClass: 'other' };
        return `card__category_${mapping.cssClass}`;
    }

    public removeCardClickListener() {
        this.container.removeEventListener('click', this.cardClickHandler);
    }
}