package com.medimitra.controller;

import com.medimitra.dto.CheckoutRequest;
import com.medimitra.model.Order;
import com.medimitra.model.User;
import com.medimitra.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping
    public ResponseEntity<List<Order>> getUserOrders(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(orderService.getUserOrders(user));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderById(
            @AuthenticationPrincipal User user,
            @PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.getOrderById(orderId, user));
    }

    @PostMapping("/checkout")
    public ResponseEntity<Order> checkout(
            @AuthenticationPrincipal User user,
            @RequestBody CheckoutRequest request) {
        return ResponseEntity.ok(orderService.checkout(user, request));
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> deleteOrder(
            @AuthenticationPrincipal User user,
            @PathVariable Long orderId) {
        orderService.deleteUserOrder(orderId, user.getId());
        return ResponseEntity.ok().build();
    }
}
