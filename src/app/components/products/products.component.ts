import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Category } from "src/app/models/category.model";
import { Product } from "src/app/models/product.model";
import { ShoppingCartItem } from "src/app/models/shopping-cart-item";
import { Wishlist } from "src/app/models/wishlist.model";
import { AuthService } from "src/app/services/auth.service";
import { CategoryService } from "src/app/services/category.service";
import { ProductService } from "src/app/services/product.service";
import { ShoppingCartService } from "src/app/services/shopping-cart.service";
import { WishlistService } from "src/app/services/wishlist.service";

@Component({
    selector: 'products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.css']
})

export class ProductsComponent implements OnInit {
    wishlist: Wishlist[] = [];
    products: Product[] = [];
    categories: Category[] = [];

    selectedCategory: string = '';
    searchTerm: string;
    constructor(
        private productService: ProductService,
        private categoryService: CategoryService,
        private cartService: ShoppingCartService,
        private wishlistService: WishlistService,
        private toastrService: ToastrService,
        public authService: AuthService) { }

    ngOnInit(): void {
        this.loadProducts();
        this.loadCategories();
        this.loadWishlist();
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
    loadWishlist() {
        this.wishlistService.read(this.authService.loggedInUserId!)
            .subscribe(response => {
                this.wishlist = response.map((data) => {
                    return {
                        id: data.payload.doc.id,
                        ...data.payload.doc.data() as Wishlist
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
    addToWishlist(_product: Product) {
        let wishlistItem = new Wishlist();
        wishlistItem.productId = _product.id!;
        wishlistItem.title = _product.title;
        wishlistItem.price = _product.price;
        wishlistItem.category = _product.category;
        wishlistItem.imageUrl = _product.imageUrl;
        wishlistItem.userId = this.authService.loggedInUserId!;

        this.wishlistService.create(wishlistItem)
            .then(response => {
                this.toastrService.success(`Item added to wishlist..!`);
            })
            .catch(error => {
                this.toastrService.error('Failed to add to wishlist : Internal server error..!');
            })
    }
    removeFromWishlist(productId: any) {
        let results = this.wishlist.filter(x => x.productId == productId);

        this.wishlistService.delete(results.shift()?.id!)
            .then(response => {
                this.toastrService.success(`Item removed from wishlist..!`);
            }).catch(error => {
                this.toastrService.success(`Failed to remove the item from wishlist : Internal server error..!`);
            });
    }

    getQuantity(product: Product) {
        let itemQty: number = 0;
        this.cartService.CartItems.filter(item => item.id === product.id).forEach(item => { itemQty += item.quantity })
        return itemQty;
    }
    wishlistExists(id: any): boolean {
        if (this.wishlist.length > 0) {
            let results = this.wishlist.filter(x => x.productId == id);
            return results.length > 0;
        }
        else
            return false;
    }

}