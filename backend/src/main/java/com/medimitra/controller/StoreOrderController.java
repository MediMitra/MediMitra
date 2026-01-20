package com.medimitra.controller;

import com.medimitra.model.Order;
import com.medimitra.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/store/orders")
public class StoreOrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping("/{storeId}")
    @Transactional(readOnly = true)
    public ResponseEntity<List<Order>> getStoreOrders(@PathVariable Long storeId) {
        return ResponseEntity.ok(orderService.getStoreOrders(storeId));
    }

    @GetMapping("/{storeId}/status/{status}")
    @Transactional(readOnly = true)
    public ResponseEntity<List<Order>> getStoreOrdersByStatus(
            @PathVariable Long storeId,
            @PathVariable Order.OrderStatus status) {
        return ResponseEntity.ok(orderService.getStoreOrdersByStatus(storeId, status));
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam Long storeId,
            @RequestParam Order.OrderStatus status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status, storeId));
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long orderId, @RequestParam Long storeId) {
        orderService.deleteStoreOrder(orderId, storeId);
        return ResponseEntity.ok().build();
    }
}
