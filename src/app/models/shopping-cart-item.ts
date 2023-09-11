import { Product } from "./product.model";

export class ShoppingCartItem extends Product {
    quantity: number;
    totalPrice: number;
}