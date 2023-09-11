import { Injectable } from '@angular/core'
import { ShoppingCartItem } from '../models/shopping-cart-item';
import { BehaviorSubject } from 'rxjs';
@Injectable({ providedIn: 'root' })

export class ShoppingCartService {
    private cartItems: ShoppingCartItem[] = [];
    private cartItemsQuantity: number = 0;
    private cartItemsTotal: number = 0;

    private cartCount = new BehaviorSubject<number>(0);
    cartCount$ = this.cartCount.asObservable();

    constructor() {
        this.loadCartItems();
    }

    get CartItems() {
        this.loadCartItems();
        return this.cartItems;
    }
    get CartItemsCount() {
        return this.cartItemsQuantity;
    }
    get CartItemsTotal() {
        return this.cartItemsTotal;
    }
    addItemToCart(cartItem: ShoppingCartItem) {
        this.loadCartItems();
        const _itemIndex = this.cartItems.findIndex(x => x.id === cartItem.id);

        if (_itemIndex > -1) {
            this.cartItems[_itemIndex].quantity += 1;
            this.cartItems[_itemIndex].totalPrice = this.cartItems[_itemIndex].quantity * this.cartItems[_itemIndex].price;
        }
        else
            this.cartItems.push(cartItem);
        this.saveCartItem();
    }
    removeItemFromCart(cartItem: ShoppingCartItem) {
        this.loadCartItems();
        const _itemIndex = this.cartItems.findIndex(x => x.id === cartItem.id && x.quantity > 1);
        if (_itemIndex > -1) {
            this.cartItems[_itemIndex].quantity += -1;
            this.cartItems[_itemIndex].totalPrice = this.cartItems[_itemIndex].quantity * this.cartItems[_itemIndex].price;
        }
        else {
            let _index = this.cartItems.findIndex(x => x.id === cartItem.id);
            this.cartItems.splice(_index, 1);
        }
        this.saveCartItem();
    }
    clearCartItems() {
        localStorage.removeItem('cart_items');
        localStorage.removeItem('cart_count');
        this.loadCartItems();
    }
    loadCartItems() {
        this.cartItems = JSON.parse(localStorage.getItem('cart_items') || '[]');
        let totalQty = 0;
        this.cartItems.forEach(_item => { totalQty += _item.quantity });
        this.cartCount.next(totalQty);
        let totalPrice = 0;
        this.cartItems.forEach(_item => { totalPrice += _item.totalPrice });
        this.cartItemsQuantity = totalQty;
        this.cartItemsTotal = totalPrice;
    }
    saveCartItem() {
        localStorage.setItem('cart_items', JSON.stringify(this.cartItems));
        localStorage.setItem('cart_count', this.cartItemsQuantity.toString());
        this.cartCount.next(this.cartItemsQuantity);
    }
}