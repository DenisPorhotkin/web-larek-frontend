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

Интерфейс списка товаров
```
export interface IProductsData {
  total: number;
  items: IProduct[];
}
```

Конфигурация для вывода товара на главную страницу
```
export interface IProductContainer {
  catalog: HTMLElement[];
  count: string;
}
```

Интерфейс элемента корзины
```
export interface IBasketItem {
  product: IProduct;
}
```

Интерфейс корзины для возврата данных при обновлении
```
export interface IBasketState {
    items: string[];
    total: number;
}
```

Интерфейс корзины для отображения
```
export interface IBasketView {
    items: HTMLElement[];
    total: number;
    selected: string[];
    index: string;
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

Интерфейс для Api запросов на сервер
```
export interface IApi{
  baseUrl: string;
  get<T>(url: string): Promise<T>;
  post<T>(url: string, data: object, metod?: ApiPostMethods): Promise<T>;
}

```

Интерфейс для ошибок с Api запросами
```
export interface ApiError {
  message: string;
  status?: number;
  data?: unknown;
}
```

Для валидации
```
export type ValidatableFields = 'payment' | 'email' | 'phone' | 'address';
export type ValidationFormErrors = Partial<Record<ValidatableFields, string>>;
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

#### ProductStore
Класс отвечает за хранение массива товаров. Конструкор принимает на вход необязательный параметр соответсвующий интерфейсу.
- private _data: IProductsData - массив данных с сервера.
Так же класс класс реализует методы.
- get items(): IProduct[] - возвращает массив товаров.
- getProductById(id: string): IProduct | undefined - возвращает данные товара по id товара.
- updateData(newData: Partial\<IProductsData>) - обновляет данные.

#### BasketService
Класс отвечает за сервис для управления корзиной покупок.\
Конструктор класса принимает инстант брокера событиий.\
- private _items: IBasketItem[] - массив элементов корзины.
- private _events: EventEmitter - экземпляр EventEmitter для уведомления об изменениях.
Так же класс предоставляет методы для взаимодействия с этими данными.
- remove(productId: string): void- удалает товар.
- add(product: IProduct): void - добавляет товар.
- clear(): void - очищает корзину полностью.
- get items(): IBasketItem[] - возвращает копию текущего состояния корзины.
- get _total(): number - возвращает общую сумму корзины.
- get count(): number - возвращает количество товара в корзине.
- get isEmpty(): boolean - проверка на пустоту.
- private _notify(): void - метод для уведомления об изменениях.
- private _getState(): IBasketState - возврыщвет массив покупок и сумму корзины.
- contains(productId: string): boolean - проверка наличия товара в корзине.

#### Order
Преобразование данных формы в требуемый формат. Создание нового заказа в требуемом формате. Конструктор принимает объект данных.\
- validateOrder(form: IOrderForm): boolean - валидация, проверка на заполненность всех полей.
- prepareOrder(form: IOrderForm, basketItems: string[], totalSum: number): IOrder - возвращает копию объекта заказа в требуемом формате.
- validate(): boolean - валидация самого заказа.
- clear(): void - очистка полей заказа.

#### FormValidator
Класс отвечает за валидацию полей форм. Конструктор принимает объект данных.\
Так же класс предоставляет методы для взаимодействия с этими данными.
- validateField(fieldName: ValidatableFields, value: string): string - валидация поля.
- validateForm(data: Partial<Record<ValidatableFields, string>>): ValidationFormErrors - валидация формы.

### Классы представления
Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### View
Базовый абстрактный класс для всех компонентов представления. Конструктор класса принимает разметку.\
T: дженерик-параметр для типизации данных, которые будет принимать представление.
Реализует методы.
- toggleClass(element: HTMLElement, className: string, force?: boolean) - переключает класс CSS.
- setText(element: HTMLElement, value: unknown) - устанавливает текстовое содержимое элемента.
- setDisabled(element: HTMLElement, state: boolean) - меняет статус блокировки элемента.
- protected setHidden(element: HTMLElement) - скрывает элемент.
- protected setVisible(element: HTMLElement) - показывает элемент.
- protected setImage(element: HTMLImageElement, src: string, alt?: string) - устанавливает изображение с алтернативным текстом.
- render(data?: Partial<T>): HTMLElement  - этот метод должен быть реализован в дочерних классах. Он отвечает за отображение (рендеринг) представления.

#### MainPageView
Класс представляет компонент для отображения каталога товаров и наследует функциональность от базового класса View специализируясь для работы с массивом товаров.\
Устанавливает обработчик на кнопку корзины, обновление счетчика корзины. Конструктор принимает инстант брокера событиий, родительский контейнер.\
- protected gallery: HTMLElement - контейнер товаров.
- protected basketButton: HTMLButtonElement - кнопка корзины.
- protected basketCounter: HTMLElement - счётчик количества товаров в корзине.
Так же класс реализует методы.
- set catalog(items: HTMLElement[]) - рендер галереи товаров.
- set count(data: string)  - обновление счетчика корзины.

#### Basket
Класс отвечает за отображение корзины покупок и взаимодействие с ней. Это наследник базового класса View специализированный для работы с данными корзины. Конструктор принимает инициализацию контейнера, инстант брокера событиий.\
- protected _list: HTMLElement - контейнер списка товаров.
- protected _total: HTMLElement - элемент для отображения суммы.
- protected _button: HTMLButtonElement -кнопка оформления заказа.
Так же класс реализует методы.
- public getContainer(): HTMLElement - возвращает экземпляр контейнера.
- public set items(items: HTMLElement[]) - сеттер для содержания корзины.
- set total(total: number) -  преобразует в нужный формат сумму заказа.

#### Modal
Класс представляет компонент модального окна, реализует открытие/закрытие и управление содержимым модальных окон. Это наследник базового класса View. Конструктор принимает инициализацию DOM-элементов, инстант брокера событиий.
- protected _closeButton: HTMLButtonElement - кнопка закрытия.
- protected _content: HTMLElement - контейнер содержимого.
Так же класс предоставляет методы для работы с модальными окнами.
- open(): void - открытие модального окна.
- close(): void - закрытие модального окна.
- set content(content: HTMLElement | string): void - установка содержимого модального окна.
- handleEscUp (evt: KeyboardEvent) - закрытие окна ESC.
- editButton(evt: string, status?: boolean) - меняет текст кнопки в зависимости от наличия товара в корзине.

#### ProductCard
Класс принимает шаблон отображения карточки. Все представления наследуются от базового View. Конструктор принимает корневой DOM-элемент и инстант брокера событиий.\
- protected element:HTMLElement - для клона теплейта.
- protected _title: HTMLElement - заголовок товара.
- protected _price: HTMLElement - цена товара.
- protected _image: HTMLImageElement - изображение товара.
- protected _category: HTMLElement - категория товара.
- protected _button?: HTMLButtonElement -  кнопка.
- protected _text?: HTMLElement - описание товара.
- protected productId: - id товара для манипуляций.
- protected _sInCard?: HTMLElement - индекс в корзине.
- protected otherCardData: Partial\<IProduct> - для сеттеров.
- private cardClickHandler: () => void - для установки слушателя на всю форму.
Так же класс предоставляет методы.
- render(data: Partial\<IProduct>) - принимает данные (может частично), присваивает данные карточки елементам карточки, вовращает отрисованый отбект.
- set id(): - для присваивания id товара.
- set title(text:string ) - название товара.
- set price(price: number) - стоимость товара.
- set image(image: string) - ссылка на картинку товара.
- set category(category: string) - катгория товара.
- set description(dataText: string) - описание товара.
- set sInCard(indexBasket: string)  - индекс товара в корзине при его наличии его ней.
- get id() - возвращает id товара.
- protected _formatPrice(price: number | null): string  - возврашщает "синапсов" или "Бесценно".
- protected _categoryClass(category: string): string - возвращает класс для сортировки.
- public removeCardClickListener(): Void - для смены слушателя формы.

#### ModalProductCard
Класс является экземпляром ProductCard, меняется слушатели формы. Конструктор принимает корневой DOM-элемент и инстант брокера событиий.\
- protected button: HTMLButtonElement - кнопка добавить в козину.
- protected _sInCard?: boolean - маркер в корзине товар или нет.
Методы.
- private cardClickListener(): Void - ссылка на обработчик клика по форме для возможности его удаления.
- public getContainer(): HTMLElement - возвращает экземпляр контейнера.

#### ModalProductBasket
Класс является экземпляром ProductCard, меняется слушатели формы. Конструктор принимает корневой DOM-элемент и инстант брокера событиий.\
- set index(data: string) - порядковый номер в корзине.
- set category(category: string) - категория товара. 
Методы.
- private cardClickListener(): Void - для изменения слушателя формы.
- public getContainer(): HTMLElement - возвращает экземпляр контейнера.

#### Form
Абстрактный базовый класс для создания и использования пользовательских форм при оформлении закзаа. Конструктор принимает корневой DOM-элемент, инстант брокера событиий.\
- protected submitButton: HTMLButtonElement - кнопка отправки формы.
- protected errorContainer: HTMLElement - контейнер для вывода ошибок.
- protected formElement: HTMLFormElement - экземпляр формы.
- protected validator: FormValidator - экземпляр класа для валидации.
Так же класс предоставляет методы.
- set errors(message: string) - сеттер для ошибок.
- set valid(value: boolean) - сеттер для валидности, управляет состоянием кнопки отправки.
- render(data?: Partial<T>): HTMLElement - собирает форму.
- protected abstract getFormData(): T - возвращает экземпляр формы.
- protected validateForm(): boolean - валидация всей формы.
- protected validateField(fieldName: ValidatableFields, value: string): string - валидация отдельного поля.
- protected renderErrors(errors: ValidationFormErrors): void - формирование ошибок.
- protected renderFieldError(error: string): void - вывод ошибок в поле.
- protected clearErrors(): void - очистка поля ошибок.

#### OrderForm
Реализация формы заказа, наследующая базовый Form\<T>. Конструктор принимает корневой DOM-элемент, инстант брокера событиий.\
- protected paymentButtons: HTMLButtonElement[] - массив кнопок выбора способа оплаты.
- protected addressInput: HTMLInputElement - поле ввода адреса доставки.
- protected _payment: string | undefined - поле для хранения значения.
Так же класс предоставляет методы.
- protected getFormData(): IOrderForm - возвращает текущие данные формы в виде объекта.
- private checkValidity(): void - валидация формы.
- set payment(value: string) - сеттер для способа оплаты.
- set address(value: string) - сеттер для адреса.
- get payment(): string | undefined - возвращает способ оплаты.

#### ContactsForm
Реализация формы для ввода контактных данных, наследующая базовый Form\<T>. Конструктор принимает корневой DOM-элемент, инстант брокера событиий.\
- protected emailInput: HTMLInputElement - поле ввода email.
- protected phoneInput: HTMLInputElement - поле ввода телефона.
Так же класс предоставляет методы.
- protected getFormData(): IContactsForm - возвращает текущие данные формы.
- set email(value: string) - сеттер для email.
- set phone(value: string) - сеттер для телефона.
- private checkValidity(): void - валидация полей формы.

#### SuccessModal
Класс отвечает за отображение экрана успешного оформления заказа. Конструктор принимает корневой DOM-элемент, инстант брокера событиий.\
- protected successButton: HTMLButtonElement - кнопка формы.
- protected description: HTMLElement - описание итоговой суммы.
Так же класс предоставляет метод.
- set total(value: number) - передаёт сумму заказа для отображения в форме.

### Слой коммуникации

#### AppApi
Класс является HTTP-клиентом для работы с API приложения, наследуя базовую функциональность от класса Api и добавляя типизированные методы. Конструктор принимает базовый URL и передает в родительский класс.
- private _baseApi: IApi - базовый URL.
Класс предоставляет методы для работы с данными с сервером.
- async getProductList(): Promise\<IProductsData> - вызов родительского метода get с типизацией возвращаемого значения.
- async createOrder(order: IOrder): Promise\<IOrderResult> - отпрака нового заказа на сервер.

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

*Список всех событий, которые могут генерироваться в системе:*\
*События изменения данных (генерируются классами моделями данных)*

- `basket:quantity-change` -  изменение состава корзины
- `catalog:loaded` - загрузка каталога завершена
- `catalog:error` - ошибка загрузки каталог
- `order:changed` - изменение данных заказа
- `order:created` - успешное оформление
- `order:error` - ошибка оформления

*События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)*

- `modal:open` - открытие модального окна
- `modal:close` - закрытие модального окна
- `product:select`- выбор товара
- `product:add` - добавление в корзину
- `basket:checkout` - клик по кнопке оформления
- `basket:remove` - удаление товара
- `basket:quantity-change` - изменение количества
- `contacts:submit` - сохранием телефон и email, отправляем данные на сервер
- `basket:open` - переход в корзину
- `success:submit` - финальное завершение заказа
- `order:submit` - переход к форме контактов