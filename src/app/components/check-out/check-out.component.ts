import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Order } from 'src/app/models/order.model';
import { Shipping } from 'src/app/models/shipping.model';
import { ShoppingCartItem } from 'src/app/models/shopping-cart-item';
import { OrderService } from 'src/app/services/order.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';

@Component({
    selector: 'check-out',
    templateUrl: './check-out.component.html',
    styleUrls: ['./check-out.component.css']
})
export class CheckOutComponent implements OnInit {

    cartItems: ShoppingCartItem[] = [];
    shipping = new Shipping();
    constructor(private cartService: ShoppingCartService, private router: Router, private orderService: OrderService, private toastr: ToastrService) { }

    ngOnInit() {
        this.cartItems = this.cartService.CartItems;
    }
    get totalPrice() {
        return this.cartService.CartItemsTotal;
    }
    get totalItemsCount() {
        return this.cartService.CartItemsCount;
    }
    placeOrder() {
        let order = new Order();
        order.datePlaced = new Date().getTime();
        order.amount = this.cartService.CartItemsTotal;
        order.userId = localStorage.getItem('loggedInUserId')!;
        order.items = this.cartItems;
        order.shippingDetails = {
            name: this.shipping.name,
            addressLine1: this.shipping.addressLine1,
            addressLine2: this.shipping.addressLine2,
            state: this.shipping.state,
            pincode: this.shipping.pincode,
            mobile: this.shipping.mobile
        };

        this.orderService.create(order)
            .then((response) => {
                console.log(response)
                this.cartService.clearCartItems();
                this.toastr.success('Order placed successfully...!');
                this.router.navigate(['/order-success', response.id]);
            })
            .catch((error: any) => {
                this.toastr.error('Un-handled exception occured...!');
            });
    }
}

