package com.medimitra.controller;

import com.medimitra.dto.CheckoutRequest;
import com.medimitra.model.Order;
import com.medimitra.model.User;
import com.medimitra.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<List<Order>> getUserOrders(@AuthenticationPrincipal User user) {
        System.out.println("=== GET /api/orders ===");
        System.out.println("User: " + (user != null ? "ID=" + user.getId() + ", Email=" + user.getEmail() : "NULL"));
        List<Order> orders = orderService.getUserOrders(user);
        System.out.println("Returning " + orders.size() + " orders");
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/all")
    @Transactional(readOnly = true)
    public ResponseEntity<List<Order>> getAllOrders(@AuthenticationPrincipal User user) {
        // Only admin can access all orders
        if (user.getRole() != User.Role.ADMIN) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/{orderId}")
    @Transactional(readOnly = true)
    public ResponseEntity<Order> getOrderById(
            @AuthenticationPrincipal User user,
            @PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.getOrderById(orderId, user));
    }

    @PostMapping("/checkout")
    public ResponseEntity<Order> checkout(
            @AuthenticationPrincipal User user,
            @RequestBody CheckoutRequest request) {
        System.out.println("=== POST /api/orders/checkout ===");
        System.out.println("User: " + (user != null ? "ID=" + user.getId() + ", Email=" + user.getEmail() : "NULL"));
        System.out.println("Request: AddressID=" + request.getAddressId() + ", PaymentMethod=" + request.getPaymentMethod());
        Order order = orderService.checkout(user, request);
        System.out.println("Order created: ID=" + order.getId() + ", Status=" + order.getStatus());
        return ResponseEntity.ok(order);
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> deleteOrder(
            @AuthenticationPrincipal User user,
            @PathVariable Long orderId) {
        orderService.deleteUserOrder(orderId, user.getId());
        return ResponseEntity.ok().build();
    }
}
