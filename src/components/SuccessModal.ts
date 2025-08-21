import { View } from "./base/View";
import {ensureElement} from "../utils/utils";
import { ISuccess } from '../types';
import { EventEmitter } from "./base/events";


export class SuccessModal extends View<ISuccess> {
    protected description: HTMLElement;
    protected successButton: HTMLButtonElement;

    constructor(
        protected container: HTMLElement,
        protected events: EventEmitter
    ) {
        super(container);
        this.events = events;
        

        this.description = ensureElement<HTMLElement>('.order-success__description', container);
        this.successButton = ensureElement<HTMLButtonElement>('.order-success__close', container);
        this.successButton.addEventListener('click', () => {
            this.events.emit('success:submit');
        });
    }

    set total(value: number) {
        this.description.textContent = `Списано ${value} синапсов`;
    }
}