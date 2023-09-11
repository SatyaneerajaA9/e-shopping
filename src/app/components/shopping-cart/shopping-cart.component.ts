import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Product } from "src/app/models/product.model";
import { ShoppingCartItem } from "src/app/models/shopping-cart-item";
import { ShoppingCartService } from "src/app/services/shopping-cart.service";

@Component({
    selector: 'shopping-cart',
    templateUrl: './shopping-cart.component.html',
    styleUrls: ['./shopping-cart.component.css']
})

export class ShoppingCartComponent implements OnInit {

    cartItems: ShoppingCartItem[] = [];

    constructor(private cartService: ShoppingCartService, private router: Router) { }

    ngOnInit() {
        this.cartItems = this.cartService.CartItems;
    }
    clearCart() {
        this.cartService.clearCartItems();
        this.cartItems = this.cartService.CartItems;
    }
    addToCart(cartItem: ShoppingCartItem) {
        this.cartService.addItemToCart(cartItem);
        this.cartItems = this.cartService.CartItems;
    }
    removeFromCart(cartItem: ShoppingCartItem) {
        this.cartService.removeItemFromCart(cartItem);
        this.cartItems = this.cartService.CartItems;
    }
    checkOut() {
        this.router.navigate(['/check-out'])
    }
    getQuantity(product: Product) {
        let itemQty: number = 0;
        this.cartService.CartItems.filter(item => item.id === product.id).forEach(item => { itemQty += item.quantity })
        return itemQty;
    }
    get totalPrice() {
        return this.cartService.CartItemsTotal;
    }
    get totalItemsCount() {
        return this.cartService.CartItemsCount;
    }
}