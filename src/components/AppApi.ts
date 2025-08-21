import { IProductsData, IOrder, IOrderResult, IApi} from "../types";

export class AppApi {
    private _baseApi: IApi;

    constructor(baseApi: IApi) {
        this._baseApi = baseApi;
    }

    async getProductList(): Promise<IProductsData> {
        return this._baseApi.get<IProductsData>('/product').then((products: IProductsData) => products);
    }

    async createOrder(order: IOrder): Promise<IOrderResult> {
            try {
                const result = await this._baseApi.post<IOrderResult>('/order', order, 'POST').then((res: IOrderResult) => res);
                
                return result;
            } catch (error) {
                // Преобразуем ошибку API в наш формат
                return {
                    id: '',
                    total: 0,
                    status: 'cancelled',
                    items: order.items,
                    error: error.message
                };
            }
        }
}

