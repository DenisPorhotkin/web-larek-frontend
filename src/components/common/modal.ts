import {View} from "../base/View";
import {ensureElement} from "../../utils/utils";
import {IEvents} from "../base/events";

export class Modal <T> extends View<T> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);

        this._closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('mousedown', (evt) => {
            if(evt.target === evt.currentTarget){
                this.close();
            }
        });
        this.handleEscUp = this.handleEscUp.bind(this);
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    open() {        
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
        document.addEventListener("keyup", this.handleEscUp);
    }

    close() {
        this.container.classList.remove('modal_active');
        this.content = null;
        this.events.emit('modal:close');
        document.removeEventListener("keyup", this.handleEscUp);
    }
    handleEscUp (evt: KeyboardEvent) {
        if (evt.key === "Escape") {
            this.close();
        }
    }
    editButton(evt: string, status?: boolean) {
        const editData = this.container.querySelector(evt);
        if (editData){ 
            if(status){
                editData.textContent = 'Удалить из корзины';
            }else {editData.textContent = 'В корзину';}
        }
        return this.render();
    }
}