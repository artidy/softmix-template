import { AddToCartDto, CartApi, CartItem } from '@project-lib/shared-types';

const STORAGE_KEY = 'softmix-guest-cart';

type GuestCart = {
  items: CartItem[];
};

function read(): GuestCart {
  if (typeof window === 'undefined') return { items: [] };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [] };
    const parsed = JSON.parse(raw) as GuestCart;
    if (!parsed || !Array.isArray(parsed.items)) return { items: [] };
    return { items: parsed.items };
  } catch {
    return { items: [] };
  }
}

function write(cart: GuestCart): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function calculate(items: CartItem[]): { totalItems: number; totalPrice: number } {
  return items.reduce(
    (acc, item) => ({
      totalItems: acc.totalItems + item.quantity,
      totalPrice: acc.totalPrice + item.price * item.quantity,
    }),
    { totalItems: 0, totalPrice: 0 },
  );
}

export function toCartApi(items: CartItem[] = read().items): CartApi {
  const { totalItems, totalPrice } = calculate(items);
  const now = new Date();
  return {
    id: 'guest',
    userId: 'guest',
    items,
    totalItems,
    totalPrice,
    createdAt: now,
    updatedAt: now,
  };
}

export function getGuestCart(): CartApi {
  return toCartApi();
}

export function addItem(dto: AddToCartDto): CartApi {
  const cart = read();
  const idx = cart.items.findIndex((item) => item.productId === dto.productId);
  if (idx >= 0) {
    cart.items[idx].quantity += dto.quantity;
  } else {
    cart.items.push({ ...dto });
  }
  write(cart);
  return toCartApi(cart.items);
}

export function updateItem(productId: string, quantity: number): CartApi {
  const cart = read();
  const item = cart.items.find((i) => i.productId === productId);
  if (item) {
    if (quantity <= 0) {
      cart.items = cart.items.filter((i) => i.productId !== productId);
    } else {
      item.quantity = quantity;
    }
    write(cart);
  }
  return toCartApi(cart.items);
}

export function removeItem(productId: string): CartApi {
  const cart = read();
  cart.items = cart.items.filter((i) => i.productId !== productId);
  write(cart);
  return toCartApi(cart.items);
}

export function clearGuestCart(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function hasGuestItems(): boolean {
  return read().items.length > 0;
}

export function takeGuestItems(): CartItem[] {
  const items = read().items;
  clearGuestCart();
  return items;
}
