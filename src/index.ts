import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { ProductStore } from './components/ProductStore';
import { BasketService } from './components/BasketService';
import { IApi, IProduct, ApiError, IOrderDataForm, IContactsForm } from './types/index';
import { Order } from './components/Order';
import { API_URL, settings, validationRules } from './utils/constants';
import { AppApi } from './components/AppApi';
import { Api } from './components/base/api';
import { ProductCard } from './components/ProductCard';
import { cloneTemplate } from './utils/utils';
import { MainPageView } from './components/MainPageView';
import { Modal } from './components/common/modal';
import { ModalProductCard } from './components/ModalProduct';
import { Basket } from './components/Basket';
import { ModalProductBasket } from './components/ModalProductBasket';
import { OrderForm } from './components/OrderForm';
import { ContactsForm } from './components/ContactsForm';
import { SuccessModal } from './components/SuccessModal';


const cardTempate: HTMLTemplateElement = document.querySelector('#card-catalog');
const cardPreviewTemplate: HTMLTemplateElement = document.querySelector('#card-preview');
const cardBasketTemplate: HTMLTemplateElement = document.querySelector('#card-basket');
const modalContainer: HTMLTemplateElement = document.querySelector('#modal-container');
const modalBasket: HTMLTemplateElement = document.querySelector('#basket');
const templateOrder: HTMLTemplateElement = document.querySelector('#order');
const templateContacts: HTMLTemplateElement = document.querySelector('#contacts');
const templateSuccess: HTMLTemplateElement = document.querySelector('#success');
const mainPage: HTMLElement = document.querySelector('.page__wrapper');

const handleApiError = (error: unknown): ApiError => {
  if (error instanceof Error) {
    return { 
        message: error.message,
        ...(error as any).response?.data 
    };
  }
  return { message: 'Unknown error' };
};

const baseApi: IApi = new Api(API_URL, settings);
const api = new AppApi(baseApi);

const events = new EventEmitter();
const productStore = new ProductStore(events);
const order = new Order(events, validationRules);

const basket = new BasketService(events);

const mainView = new MainPageView(mainPage, events);
const basketView = new Basket(cloneTemplate(modalBasket), events);
const modalProduct = new Modal(modalContainer, events);

function makeBasket(): void {
    let index = 1;
    const findProducts = basket.items.map((item) => {
        const findProduct = productStore.items.find(data => data.id === item.product.id);
            const modalCard = new ModalProductBasket(cloneTemplate(cardBasketTemplate), events);
            modalCard.index = index.toString();
            index++;
            return modalCard.render(findProduct);
        })
    basketView.total = basket._total;
    basketView.items = findProducts;
    modalProduct.content = basketView.getContainer();
}

//получаем данные 
api.getProductList()
    .then(products => {
        productStore.updateData({
            items: products.items
        });
    })
    .catch((error: unknown) => {
        const apiError = handleApiError(error);
        console.error('API Error:', apiError);
        events.emit('catalog:error', apiError);
    });

// и заполняем данными главную страницу
events.on('catalog:loaded', () => {
    const cardsArray  = productStore.items.map((card) => {
        const cardInstant = new ProductCard(cloneTemplate(cardTempate), events);
        return cardInstant.render(card);
    });
    mainView.render({catalog: cardsArray});
});

// выбор товара
events.on('product:select', (product: IProduct) => { 
    const findProduct = productStore.items.find(item => item.id === product.id);
    const inBasket = basket.contains(product.id);
    const modalCard = new ModalProductCard(cloneTemplate(cardPreviewTemplate), events, inBasket);
    modalCard.render(findProduct); 
    modalProduct.content = modalCard.getContainer();
    modalProduct.editButton(".card__button", inBasket);
    modalProduct.open();
});

// добавление в корзину
events.on('product:add', (product: IProduct) => {
    const findProduct = productStore.items.find(item => item.id === product.id);
    basket.add(findProduct);
    mainView.countProduct = basket.count.toString();
    modalProduct.editButton(".card__button", basket.contains(product.id));

})

// удаление из корзины
events.on('product:remove', (product: IProduct) => {
    basket.remove(product.id);
    mainView.countProduct = basket.count.toString();
    modalProduct.editButton(".card__button", basket.contains(product.id));
})

// открываем корзину
events.on('basket:open', () => {
    makeBasket();      
    modalProduct.open();
});

// отслеживаем изменения в корзине
events.on('basket:quantity-change', () => {
    makeBasket();
});

// начало оформления заказа
events.on('basket:checkout', () => {
    order.clear();
    order.total = basket._total;
    order.items = basket.items
        .filter(item => typeof item.product.price === 'number' && item.product.price > 0)
        .map(item => item.product.id);
    const formContent = templateOrder.content.cloneNode(true) as HTMLElement;
    const formAdressPay = new OrderForm(formContent, events);
    modalProduct.content = formAdressPay.render();
    modalProduct.open();
});

//валидация формы с адресом и способа оплаты
events.on('order:changed-form', (formData: IOrderDataForm) => {
    const isValid = order.validateForm(formData);
    order.payment = formData.payment;
    order.address = formData.address;    
    events.emit('order:changed-button', { isValid });
});

//валидация формы с контактами
events.on('order:changed-contacts', (formData: IContactsForm) => {
    const isValid = order.validateForm(formData);
    order.email = formData.email;
    order.phone = formData.phone;    
    events.emit('order:changed-button', { isValid });
});

//сохраняем адрес и способ оплаты
events.on('order:submit', (formData: IOrderDataForm) => {
    order.payment = formData.payment;
    order.address = formData.address;
    const formContent = templateContacts.content.cloneNode(true) as HTMLElement;
    const formContacts = new ContactsForm(formContent, events);
    modalProduct.content = formContacts.render();
    modalProduct.render();
});

//сохраняем мыло и телефон
events.on('contacts:submit', (formData: IContactsForm) => {
    order.phone = formData.phone;
    order.email = formData.email;
    if(order.validate()){
//отправляем данные 
        api.createOrder(order)
            .then(() => {
                events.emit('order:created');
                basket.clear();
                mainView.countProduct = basket.count.toString();
            })
            .catch((error: unknown) => {
            const apiError = handleApiError(error);
            console.error('API Error:', apiError);
            events.emit('order:error', apiError);
    });        
    }
});

//оповещение о успешном заказе
events.on('order:created', () => {
    const formSuccess = new SuccessModal(cloneTemplate(templateSuccess), events);
    formSuccess.total = order.total;
    modalProduct.content = formSuccess.render();
    modalProduct.render();
});

//закрываем окно оповещения, чистим
events.on('success:submit', () => {
    order.clear();
    modalProduct.close();
})

//сообщение об ошибке при загрузке данных с сервера
events.on('catalog:error', (apiError) => {
    alert(`Ошибка: ${apiError}`);
})

//сообщение об ошибке при отправке заказа на сервер
events.on('order:error', (apiError) => {
    alert(`Ошибка: ${apiError}`);
})