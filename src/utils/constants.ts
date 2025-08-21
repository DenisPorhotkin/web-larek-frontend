import { IValidationRules } from '../types';
export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {
    headers: {
        'Content-Type': 'application/json',
    },
}

export const CATEGORY_MAPPING = {
    'софт-скил': {
        cssClass: 'soft'
    },
    'хард-скил': {
        cssClass: 'hard'
    },
    'дополнительное': {
        cssClass: 'additional'
    },
    'кнопка': {
        cssClass: 'button'
    },
    'другое': {
        cssClass: 'other'
    }    
};

export const validationRules: IValidationRules = {
    payment: {
        required: true,
        message: 'Выберите способ оплаты'
    },
    email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Введите корректный email'
    },
    phone: {
        required: true,
        pattern: /^\+?[78][-\(]?\d{3}\)?-?\d{3}-?\d{2}-?\d{2}$/,
        message: 'Введите корректный номер телефона'
    },
    address: {
        required: true,
        message: 'Введите адрес доставки'
    }
};