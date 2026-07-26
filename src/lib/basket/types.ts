export interface BasketLineItem {
  /** basket_items.id */
  id: string;
  bookId: string;
  bookSlug: string;
  bookTitle: string;
  coverImageLabel: string;
  formatId: string;
  formatLabel: string;
  isDigital: boolean;
  unitPrice: number;
  currency: string;
  quantity: number;
}

export interface BasketSnapshot {
  items: BasketLineItem[];
  subtotal: number;
}
