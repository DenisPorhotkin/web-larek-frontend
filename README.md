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

Интерфейс элемента корзины
```
export interface IBasketItem {
  product: IProduct;
  quantity: number;
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
    createdAt: string;
    items: string[];
    error?: string;
}

```

Интерфейс для работы с формами
```
export interface IOrderForm {
  payment?: string;
  email?: string;
  phone?: string;
  address?: string;
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
Валидация данных формы. Преобразование данных формы в формат API. Расчет итоговой суммы заказа.\
Конструктор класса принимает инстант брокера событиий.\
- validateOrder(form: IOrderForm): boolean - валидация.
- prepareOrder(form: IOrderForm, basketItems: string[]): IOrder - итоговая сумма.

### Классы представления
Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### View
Базовый класс для всех компонентов представления. Конструктор класса принимает id контейнера.\
T: дженерик-параметр для типизации данных, которые будет принимать представление.
- protected container: HTMLElement - хранит корневой DOM-элемент компонента.

#### CatalogView
Класс представляет компонент для отображения каталога товаров и наследует функциональность от базового класса View специализируясь для работы с массивом товаров IProduct.
- render (products: IProduct[]): void - генерация HTML.

#### BasketView
Класс отвечает за отображение корзины покупок и взаимодействие с ней. Это наследник базового класса View специализированный для работы с данными корзины IBasketItem. Конструктор принимает Инициализация DOM-элементов.
- protected _list: HTMLElement - контейнер списка товаров.
- protected _total: HTMLElement - элемент для отображения суммы.
- protected _button: HTMLButtonElement -кнопка оформления заказа.
- protected _items: HTMLElement[] = [] - кэш элементов товаров.
Так же класс реализует метод.
- render(items: IBasketItem[]): HTMLElement - рендерим каждый элемент корзины, очищаем предыдущие элементы, обновляем общую сумму.
- renderItemrenderItem(item: IBasketItem, index: number): HTMLElement - рендер отдельного элемента корзины.
- calculateTotalcalculateTotal(items: IBasketItem[]): number - расчет общей суммы.
- bindCheckout(handler: () => void) -  подписка на событие оформления заказа.
- bindRemoveItem(handler: (id: string) => void) - подписка на событие удаления товара.

### ModalView
Класс представляет компонент модального окна, реализует открытие/закрытие и управление содержимым модальных окон. Это наследник базового класса View. Конструктор принимает инициализацию DOM-элементов, назначение обработчиков событий для _closeButton, _overlay.
- protected _closeButton: HTMLButtonElement - кнопка закрытия.
- protected _content: HTMLElement - контейнер содержимого.
- protected _overlay: HTMLElement - фоновое затемнение.
Так же класс предоставляет методы для работы с модальными окнами.
- open(): void - открытие модального окна.
- close(): void - закрытие модального окна.
- setContent(content: HTMLElement | string): void - установка содержимого модального окна.
- render(data?: any): HTMLElement - рендер с открытием окна.

#### ProductCard
Все представления наследуются от базового View. Конструктор принимает корневой DOM-элемент и элементы DOM.\
- protected title: HTMLElement - заголовок товара.
- protected price: HTMLElement - цена товара.
- protected image: HTMLImageElement - изображение товара.
- protected category: HTMLElement - категория товара.
- protected button?: HTMLButtonElement -  кнопка.
Так же класс предоставляет метод.
- render (product: IProduct): HTMLElement - вызов родительского render.

### Слой коммуникации

#### AppApi
Класс является HTTP-клиентом для работы с API приложения, наследуя базовую функциональность от класса Api и добавляя типизированные методы. Конструктор принимает базовый URL и передает в родительский класс.
Класс предоставляет методы для работы с данными с сервером.
- async getProductList(): Promise<ApiListResponse\<IProduct>> - вызов родительского метода get с типизацией возвращаемого значения.
- async getProduct(id: string): Promise\<IProduct> - получение детальной информации о товаре.
- async createOrder(order: IOrder): Promise\<IOrderResult> - создание нового заказа.

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

*Список всех событий, которые могут генерироваться в системе:*\
*События изменения данных (генерируются классами моделями данных)*

- `basket:changed` -  изменение состава корзины
- `basket:locked` - блокировка корзины (на время оформления)
- `basket:error` - ошибка операции с корзиной
- `catalog:loaded` - загрузка каталога завершена
- `catalog:error` - ошибка загрузки каталог
- `order:changed` - изменение данных заказа
- `order:created` - успешное оформление
- `order:error` - ошибка оформления
- `user:changed` - изменение данных пользователя

*События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)*

- `modal:open` - Открытие модального окна
- `modal:close` - закрытие модального окна
- `tab:changed`- Изменение вкладок/разделов
- `notification:show` - Уведомление для пользователя
- `product:select`- Выбор товара
- `product:add` - Добавление в корзину
- `product:details` - Просмотр деталей
- `basket:checkout` - Клик по кнопке оформления
- `basket:remove` - Удаление товара
- `basket:quantity-change` - Изменение количества
- `form:field-change` - Изменение поля формы
- `form:valid` - Валидация формы
- `form:invalid`- Валидация формы
- `form:submit` - Отправка формы
- `navigation:basket` - Переход в корзину
- `navigation:catalog`- Открытие каталога