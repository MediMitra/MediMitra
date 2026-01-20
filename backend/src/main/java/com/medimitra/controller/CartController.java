package com.medimitra.controller;

import com.medimitra.dto.CartRequest;
import com.medimitra.model.Cart;
import com.medimitra.model.User;
import com.medimitra.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public ResponseEntity<Cart> getCart(@AuthenticationPrincipal User user) {
        System.out.println("=== GET /api/cart ===");
        System.out.println("User: " + (user != null ? "ID=" + user.getId() + ", Email=" + user.getEmail() : "NULL"));
        Cart cart = cartService.getOrCreateCart(user);
        System.out.println("Cart ID: " + cart.getId() + ", Items: " + (cart.getItems() != null ? cart.getItems().size() : 0));
        return ResponseEntity.ok(cart);
    }

    @PostMapping
    public ResponseEntity<Cart> addToCart(@AuthenticationPrincipal User user, @RequestBody CartRequest request) {
        System.out.println("=== POST /api/cart ===");
        System.out.println("User: " + (user != null ? "ID=" + user.getId() + ", Email=" + user.getEmail() : "NULL"));
        System.out.println("Request: Medicine ID=" + request.getMedicineId() + ", Quantity=" + request.getQuantity());
        Cart cart = cartService.addToCart(user, request);
        System.out.println("Cart after add: ID=" + cart.getId() + ", Items=" + (cart.getItems() != null ? cart.getItems().size() : 0));
        return ResponseEntity.ok(cart);
    }

    @PutMapping("/{itemId}")
    public ResponseEntity<Cart> updateCartItem(
            @AuthenticationPrincipal User user,
            @PathVariable Long itemId,
            @RequestBody CartRequest request) {
        return ResponseEntity.ok(cartService.updateCartItem(user, itemId, request.getQuantity()));
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<Cart> removeFromCart(
            @AuthenticationPrincipal User user,
            @PathVariable Long itemId) {
        return ResponseEntity.ok(cartService.removeFromCart(user, itemId));
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(@AuthenticationPrincipal User user) {
        cartService.clearCart(user);
        return ResponseEntity.noContent().build();
    }
}
