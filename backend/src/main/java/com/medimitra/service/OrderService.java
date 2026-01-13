package com.medimitra.service;

import com.medimitra.dto.CheckoutRequest;
import com.medimitra.model.*;
import com.medimitra.repository.AddressRepository;
import com.medimitra.repository.CartRepository;
import com.medimitra.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private CartService cartService;

    public List<Order> getUserOrders(User user) {
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public Order getOrderById(Long orderId, User user) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        
        return order;
    }

    @Transactional
    public Order checkout(User user, CheckoutRequest request) {
        // Validate checkout request
        if (request.getAddressId() == null) {
            throw new RuntimeException("Address ID is required for checkout");
        }
        
        if (request.getPaymentMethod() == null || request.getPaymentMethod().trim().isEmpty()) {
            throw new RuntimeException("Payment method is required for checkout");
        }
        
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart is empty"));

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Address address = addressRepository.findById(request.getAddressId())
                .orElseThrow(() -> new RuntimeException("Address with ID " + request.getAddressId() + " not found. Please create an address first."));

        if (!address.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("This address does not belong to your account");
        }

        Order order = new Order();
        order.setUser(user);
        order.setAddress(address);
        order.setPaymentMethod(request.getPaymentMethod());
        order.setStatus(Order.OrderStatus.PENDING);
        order.setItems(new ArrayList<>());

        BigDecimal totalAmount = BigDecimal.ZERO;
        for (CartItem cartItem : cart.getItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setMedicine(cartItem.getMedicine());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getMedicine().getPrice());
            
            BigDecimal itemTotal = cartItem.getMedicine().getPrice()
                    .multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);
            
            order.getItems().add(orderItem);
        }

        order.setTotalAmount(totalAmount);
        
        // Save order first (this will cascade save the items)
        Order savedOrder = orderRepository.save(order);

        // Clear cart after successful order creation
        try {
            cartService.clearCart(user);
        } catch (Exception e) {
            // Log the error but don't fail the order
            System.err.println("Error clearing cart: " + e.getMessage());
        }

        return savedOrder;
    }
}
