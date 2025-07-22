# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```


## Данные и типы данных, используемые в приложении

Интерфейс продукта
```
export interface IProduct {
  id: string;
  title: string;
  description: string;
  image: string;
  category: ProductCategory;
  price: number | null;
  sInCart?: boolean;
}
```

Конфигурация шаблона карточки
```
export interface ICardTemplate {
    containerSelector: string;   
    titleSelector: string;       
    priceSelector: string;       
    imageSelector: string;       
    categorySelector: string;    
    descriptionSelector?: string;
    buttonSelector?: string;     
}
```

Интерфейс элемента корзины
```
export interface IBasketItem {
  product: IProduct;
}

```
Интерфейс для формирование заказа
```
export interface IOrder {
  payment: 'online' | 'cash';
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}
```

Интерфейс для результатов заказа
```
export interface IOrderResult {
    id: string;
    total: number;
    status: 'created' | 'processing' | 'completed' | 'cancelled';
    items: string[];
    error?: string;
}

```

Интерфейс для работы с данными форм
```
export interface IOrderForm {
  payment?: string;
  email?: string;
  phone?: string;
  address?: string;
}
```

Интерфейс для работы с формой заказа
```
export interface IOrderDataForm {
    payment: string;
    address: string;
}
```

Интерфейс для работы с формой данных пользователя
```
export interface IContactsForm {
    email: string;
    phone: string;
}
```

Интерфейс для завершения звказа
```
export interface ISuccess {
    total: number;
}
```

Интерфейс для хранения товаров в каталоге, корзине, данные формы заказа
```
export interface IAppState {
  catalog: IProduct[];
  basket: IBasketItem[];
  order: IOrderForm;
}
```

Интерфейс для работы с валидацией форм
```
export interface IValidationRules {
  payment: ValidationRule;
  email: ValidationRule;
  phone: ValidationRule;
  address: ValidationRule;
}
```

Интерфейс для стурктуры валидации
```
export interface ValidationRule {
  required?: boolean;
  pattern?: RegExp;
  message: string;
}
```

Интерфейс для работы с модальными окнами
```
export interface IModal {
  open(): void;
  close(): void;
  setContent(content: HTMLElement): void;
}
```

Для хранения ошибок валидации
```
export type FormErrors = Partial<Record<keyof IOrder, string>>;
```

Категории продуктов
```
export type ProductCategory = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил';
```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP: 
- слой представления, отвечает за отображение данных на странице, 
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления с данными.

### Базовый код

#### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы: 
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие

### Слой данных

#### Класс ProductModel
Класс отвечает за хранение и логику работы карточки товара пользователя.\
Конструктор класса прнимает данные:\
-  id: string;
-  title: string;
-  description: string;
-  image: string;
-  category: ProductCategory;
-  price: number | null;

Так же клкасс предоставляет метод для взаимодействия с этими данными.
- get formattedPrice(): string  - возвращает данные о стоимости товара.
- get categoryClass(): string - возвращает каетгорию товара через дефис.

#### BasketService
Класс отвечает за сервис для управления корзиной покупок.\
Конструктор класса принимает инстант брокера событиий.\
- private items: IBasketItem[] - массив элементов корзины.
- private events: EventEmitter - экземпляр EventEmitter для уведомления об изменениях.

Так же класс предоставляет методы для взаимодействия с этими данными.
- remove(productId: string): void- удалает товар.
- add(product: IProduct): void - добавляет товар.
- clear(): void - очищает корзину полностью.
- getItems(): IBasketItem[] - возвращает копию текущего состояния корзины.
- getTotal(): number - вычисляет общую сумму корзины;
- private emitChange(): void - метод для уведомления об изменениях.

#### AppState
Хранит текущее состояние формы заказа (payment, email, phone, address).
- private order: IOrderForm - данные форм.

Так же класс предоставляет методы для взаимодействия с этими данными.
- setOrderField(field: keyof IOrderForm, value: string): void - обновляет поле в данных заказа и уведомляет об изменениях.
- getOrder(): IOrderForm - возвращает копию объекта заказа.

#### OrderService
Валидация данных формы. Преобразование данных формы в формат API. Создание нового заказа.\
Конструктор класса принимает инстант брокера событиий и API\
- validateOrder(form: IOrderForm): boolean - валидация.
- async checkout(order: IOrder) - создание нового заказа.

### Классы представления
Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### View
Базовый класс для всех компонентов представления. Конструктор класса принимает id контейнера.\
T: дженерик-параметр для типизации данных, которые будет принимать представление.
- protected container: HTMLElement - хранит корневой DOM-элемент компонента.
Реализует абстактный метод.
- abstract render(data?: T): void - этот метод должен быть реализован в дочерних классах. Он отвечает за отображение (рендеринг) представления.

#### MainPageView
Класс представляет компонент для отображения каталога товаров и наследует функциональность от базового класса View специализируясь для работы с массивом товаров.\
Установливает обработчик на кнопку корзины, обновление счетчика корзины. Конструктор принимает инстант брокера событиий, id контейнера и DOM-элементы.\
- protected gallery: HTMLElement - контейнер товаров.
- protected basketButton: HTMLButtonElement - кнопка корзины.
- protected basketCounter: HTMLElement - счётчик количества товаров в корзине.
Так же класс реализует методы.
- renderGallery(items: HTMLElement[]): void - рендер галереи товаров.
- updateBasketCounter(count: number): void  - обновление счетчика корзины.
- setBasketClickHandler(handler: () => void): void - установка обработчика на кнопку корзины.

#### BasketView
Класс отвечает за отображение корзины покупок и взаимодействие с ней. Это наследник базового класса View специализированный для работы с данными корзины. Конструктор принимает инициализацию DOM-элементов, id контейнера, принимает инстант брокера событиий.
- protected list: HTMLElement - контейнер списка товаров.
- protected total: HTMLElement - элемент для отображения суммы.
- protected button: HTMLButtonElement -кнопка оформления заказа.
Так же класс реализует методы.
- render(cardElements: HTMLElement[], total: number): void - рендерим каждый элемент корзины, очищаем предыдущие элементы, обновляем общую сумму.
- bindCheckout(handler: () => void) -  подписка на событие оформления заказа.

### ModalView
Класс представляет компонент модального окна, реализует открытие/закрытие и управление содержимым модальных окон. Это наследник базового класса View. Конструктор принимает инициализацию DOM-элементов, инстант брокера событиий.
- protected _closeButton: HTMLButtonElement - кнопка закрытия.
- protected _content: HTMLElement - контейнер содержимого.
- protected events: EventEmitter - брокер событий.
Так же класс предоставляет методы для работы с модальными окнами.
- protected bindEvents(): void - метод подписки.
- open(): void - открытие модального окна.
- close(): void - закрытие модального окна.
- setContent(content: HTMLElement | string): void - установка содержимого модального окна.
- render(data?: any): HTMLElement - рендер с открытием окна.

#### ProductCard
Класс принимает шаблон отображения карточки и действия. Все представления наследуются от базового View. Конструктор принимает корневой DOM-элемент, элементы DOM, конфиг селекторов и инстант брокера событиий.\
- protected _title: HTMLElement - заголовок товара.
- protected _price: HTMLElement - цена товара.
- protected _image: HTMLImageElement - изображение товара.
- protected _category: HTMLElement - категория товара.
- protected _button?: HTMLButtonElement -  кнопка.
- protected _description?: HTMLElement - описание товара.
Так же класс предоставляет методы.
- render (product: IProduct): HTMLElement - возвращает контейнер с карточкой.
- protected _handleAddToCart(event: MouseEvent) - обработчик добавления в корзину.
- protected _formatPrice(price: number | null): string  - форматирование цены.
- protected _getCategoryClass(category: ProductCategory): string - получение класса категории.

#### Form
Абстрактный базовый класс для создания и использования пользовательских форм при оформлении закзаа. Конструктор принимает корневой DOM-элемент, инстант брокера событиий.\
- protected submitButton: HTMLButtonElement - кнопка отправки формы.
- protected errorContainer: HTMLElement - контейнер для вывода ошибок.
- protected formElement: HTMLFormElement - элемент form (корневой элемент формы).
Так же класс предоставляет методы.
- protected abstract getFormData(): T - должен быть реализован в дочерних классах, возвращает данные формы в виде объекта типа T.
- set errors(message: string) - сеттер для ошибок.
- set valid(value: boolean) - сеттер для валидности, управляет состоянием кнопки отправки.
- render(data?: Partial\<T>): HTMLElement - переопределяет базовый метод render, возвращает корневой элемент формы.

#### OrderForm
Реализация формы заказа, наследующая базовый Form\<T>. Конструктор принимает корневой DOM-элемент, инстант брокера событиий.\
- protected paymentButtons: HTMLButtonElement[] - массив кнопок выбора способа оплаты.
- protected addressInput: HTMLInputElement - поле ввода адреса доставки.
Так же класс предоставляет методы.
- protected getFormData(): IOrderForm - возвращает текущие данные формы в виде объекта.
- set payment(value: string) - сеттер для способа оплаты.
- set address(value: string) - сеттер для адреса.

#### ContactsForm
Реализация формы для ввода контактных данных, наследующая базовый Form\<T>. Конструктор принимает корневой DOM-элемент, инстант брокера событиий.\
- protected emailInput: HTMLInputElement - поле ввода email.
- protected phoneInput: HTMLInputElement - поле ввода телефона.
Так же класс предоставляет методы.
- protected getFormData(): IContactsForm - возвращает текущие данные формы.
- set email(value: string) - сеттер для email.
- set phone(value: string) сеттер для телефона.

#### SuccessView
Класс отвечает за отображение экрана успешного оформления заказа. Конструктор принимает корневой DOM-элемент, инстант брокера событиий.\
- protected closeButton: HTMLButtonElement - кнопка формы.
- protected totalElement: HTMLElement - описание итоговой суммы.
Так же класс предоставляет метод.
- render(data: ISuccess): HTMLElement - возвращает корневой элемент формы.

### Слой коммуникации

#### AppApi
Класс является HTTP-клиентом для работы с API приложения, наследуя базовую функциональность от класса Api и добавляя типизированные методы. Конструктор принимает базовый URL и передает в родительский класс.
Класс предоставляет методы для работы с данными с сервером.
- async getProductList(): Promise<ApiListResponse\<IProduct>> - вызов родительского метода get с типизацией возвращаемого значения.
- async createOrder(order: IOrder): Promise\<IOrderResult> - создание нового заказа.

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

*Список всех событий, которые могут генерироваться в системе:*\
*События изменения данных (генерируются классами моделями данных)*

- `basket:changed` -  изменение состава корзины
- `basket:locked` - блокировка прокрутка главной страницы (на время оформления)
- `basket:error` - ошибка операции с корзиной
- `catalog:loaded` - загрузка каталога завершена
- `catalog:error` - ошибка загрузки каталог
- `order:changed` - изменение данных заказа
- `order:created` - успешное оформление
- `order:error` - ошибка оформления
- `user:changed` - изменение данных пользователя
- `form:valid` - валидация формы
- `form:invalid`- валидация формы

*События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)*

- `modal:open` - открытие модального окна
- `modal:close` - закрытие модального окна
- `tab:changed`- изменение вкладок/разделов
- `notification:show` - уведомление для пользователя
- `product:select`- выбор товара
- `product:add` - добавление в корзину
- `product:details` - просмотр деталей
- `basket:checkout` - клик по кнопке оформления
- `basket:remove` - удаление товара
- `basket:quantity-change` - изменение количества
- `form:field-change` - изменение поля формы
- `form:submit` - отправка формы
- `navigation:basket` - переход в корзину
- `navigation:catalog`- открытие каталога
- `success:close` - финальное завершение заказа
- `order:submit` - переход к форме контактов