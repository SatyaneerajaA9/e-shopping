import { Component, OnInit } from "@angular/core";
import { Category } from "src/app/models/category.model";
import { Product } from "src/app/models/product.model";
import { ShoppingCartItem } from "src/app/models/shopping-cart-item";
import { CategoryService } from "src/app/services/category.service";
import { ProductService } from "src/app/services/product.service";
import { ShoppingCartService } from "src/app/services/shopping-cart.service";

@Component({
    selector: 'products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.css']
})

export class ProductsComponent implements OnInit {
    products: Product[] = [];
    categories: Category[] = [];
    selectedCategory: string = '';
    searchTerm: string;
    constructor(private productService: ProductService, private categoryService: CategoryService, private cartService: ShoppingCartService) {
    }
    ngOnInit(): void {
        this.loadProducts();
        this.loadCategories();
    }

    loadProducts() {
        this.productService.read(this.searchTerm, this.selectedCategory)
            .subscribe(response => {
                this.products = response.map((data) => {
                    return {
                        id: data.payload.doc.id,
                        ...data.payload.doc.data() as Product
                    }
                });
            })
    }
    loadCategories() {
        this.categoryService.read()
            .subscribe(response => {
                this.categories = response.map((data) => {
                    return {
                        id: data.payload.doc.id,
                        ...data.payload.doc.data() as Category
                    }
                });
            })
    }

    changeCategory($event: any) {
        if ($event.target.selectedIndex > 0)
            this.selectedCategory = this.categories[$event.target.selectedIndex - 1].id!;
        else
            this.selectedCategory = '';
        this.loadProducts();
    }
    addToCart(product: Product) {
        let cartItem = product as ShoppingCartItem;
        cartItem.quantity = 1;
        cartItem.totalPrice = cartItem.quantity * cartItem.price;
        this.cartService.addItemToCart(cartItem);
    }
    removeFromCart(product: Product) {
        let cartItem = product as ShoppingCartItem;
        cartItem.quantity = -1;
        this.cartService.removeItemFromCart(cartItem);
    }

    getQuantity(product: Product) {
        let itemQty: number = 0;
        this.cartService.CartItems.filter(item => item.id === product.id).forEach(item => { itemQty += item.quantity })
        return itemQty;
    }
    getCategory(categoryId: string) {
        let itemIndex = this.categories.findIndex(x => x.id === categoryId);
        return itemIndex > -1 ? this.categories[itemIndex].name : "";
    }
}