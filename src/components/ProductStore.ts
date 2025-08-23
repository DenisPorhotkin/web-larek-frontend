import { IProduct, IProductsData } from '../types';
import { EventEmitter } from './base/events';

export class ProductStore {
    private _data: IProductsData = {
      total: 0,
      items: []
    };
    constructor(protected events: EventEmitter, initialData?: IProductsData) {
      if (initialData) {
        this._data = initialData;
      }
    }
    
    updateData(newData: Partial<IProductsData>) {
      this._data = {
        ...this._data,
        ...newData
      };
      this.events.emit('catalog:loaded');
    }

    get items(): IProduct[] {
      return this._data.items;
    }
    
    getPriceById(id: string): number {
      return this._data.items.find(item => item.id === id).price;
    }

    getProductById(id: string): IProduct | undefined {
      return this._data.items.find(item => item.id === id);
    }
}