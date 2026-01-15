package com.medimitra.repository;

import com.medimitra.model.Order;
import com.medimitra.model.User;
import com.medimitra.model.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserOrderByCreatedAtDesc(User user);
    List<Order> findByStoreOrderByCreatedAtDesc(Store store);
    List<Order> findByStoreAndStatusOrderByCreatedAtDesc(Store store, Order.OrderStatus status);
    List<Order> findAllByOrderByCreatedAtDesc();
}
