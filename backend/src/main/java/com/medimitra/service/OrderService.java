package com.medimitra.service;

import com.medimitra.dto.CheckoutRequest;
import com.medimitra.model.*;
import com.medimitra.repository.AddressRepository;
import com.medimitra.repository.CartRepository;
import com.medimitra.repository.OrderRepository;
import com.medimitra.repository.StoreRepository;
import com.medimitra.repository.MedicineRepository;
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

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    public List<Order> getUserOrders(User user) {
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
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
        
        // Assign store
        if (request.getStoreId() != null) {
            Store store = storeRepository.findById(request.getStoreId())
                    .orElseThrow(() -> new RuntimeException("Store not found"));
            order.setStore(store);
        } else {
            // Assign closest active store
            Store closestStore = findClosestStore(address);
            if (closestStore != null) {
                order.setStore(closestStore);
            }
        }
        
        // Decrease medicine stock
        for (OrderItem orderItem : order.getItems()) {
            Medicine medicine = orderItem.getMedicine();
            int newStock = medicine.getStock() - orderItem.getQuantity();
            if (newStock < 0) {
                throw new RuntimeException("Insufficient stock for " + medicine.getName());
            }
            medicine.setStock(newStock);
            medicineRepository.save(medicine);
        }
        
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
    
    private Store findClosestStore(Address address) {
        List<Store> activeStores = storeRepository.findByStatus("Active");
        if (activeStores.isEmpty()) {
            return null;
        }
        
        // Simple distance calculation (can be improved with actual geocoding)
        Store closestStore = activeStores.get(0);
        double minDistance = Double.MAX_VALUE;
        
        for (Store store : activeStores) {
            // Simple distance approximation
            double distance = Math.sqrt(
                Math.pow(store.getLatitude() - 29.2183, 2) + // Default lat for Haldwani
                Math.pow(store.getLongitude() - 79.5130, 2)  // Default lon for Haldwani
            );
            
            if (distance < minDistance) {
                minDistance = distance;
                closestStore = store;
            }
        }
        
        return closestStore;
    }
    
    public List<Order> getStoreOrders(Long storeId) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Store not found"));
        return orderRepository.findByStoreOrderByCreatedAtDesc(store);
    }
    
    public List<Order> getStoreOrdersByStatus(Long storeId, Order.OrderStatus status) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Store not found"));
        return orderRepository.findByStoreAndStatusOrderByCreatedAtDesc(store, status);
    }
    
    public Order updateOrderStatus(Long orderId, Order.OrderStatus status, Long storeId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        if (storeId != null && !order.getStore().getId().equals(storeId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        order.setStatus(status);
        return orderRepository.save(order);
    }

    public void deleteStoreOrder(Long orderId, Long storeId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        if (storeId != null && !order.getStore().getId().equals(storeId)) {
            throw new RuntimeException("Unauthorized: Order does not belong to this store");
        }
        
        orderRepository.delete(order);
    }

    public void deleteUserOrder(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        if (!order.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized: Order does not belong to this user");
        }
        
        orderRepository.delete(order);
    }
}
