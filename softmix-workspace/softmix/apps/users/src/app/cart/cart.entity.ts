import { Cart, CartApi, CartItem } from '@project-lib/shared-types';

export class CartEntity implements Cart {
  public _id?: string;
  public userId: string;
  public items: CartItem[];
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(cart: Cart) {
    this.fillEntity(cart);
  }

  public toObject(): Cart {
    return {
      _id: this._id,
      userId: this.userId,
      items: this.items,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  public toApi(): CartApi {
    return {
      id: this._id || '',
      userId: this.userId,
      items: this.items,
      totalItems: this.calculateTotalItems(),
      totalPrice: this.calculateTotalPrice(),
      createdAt: this.createdAt || new Date(),
      updatedAt: this.updatedAt || new Date()
    };
  }

  public fillEntity(entity: Cart): void {
    this._id = entity._id;
    this.userId = entity.userId;
    this.items = entity.items || [];
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }

  public addItem(item: CartItem): void {
    const existingItem = this.items.find(i => i.productId === item.productId);

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      this.items.push(item);
    }
  }

  public updateItemQuantity(productId: string, quantity: number): boolean {
    const item = this.items.find(i => i.productId === productId);

    if (!item) {
      return false;
    }

    if (quantity <= 0) {
      this.removeItem(productId);
    } else {
      item.quantity = quantity;
    }

    return true;
  }

  public removeItem(productId: string): boolean {
    const initialLength = this.items.length;
    this.items = this.items.filter(item => item.productId !== productId);
    return this.items.length !== initialLength;
  }

  public clear(): void {
    this.items = [];
  }

  private calculateTotalItems(): number {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  private calculateTotalPrice(): number {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}
