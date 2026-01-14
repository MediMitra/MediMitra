package com.medimitra.service;

import com.medimitra.dto.DailyRevenue;
import com.medimitra.dto.DashboardStats;
import com.medimitra.model.Order;
import com.medimitra.repository.MedicineRepository;
import com.medimitra.repository.OrderRepository;
import com.medimitra.repository.StoreRepository;
import com.medimitra.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    public DashboardStats getDashboardStats() {
        DashboardStats stats = new DashboardStats();

        // Basic counts
        stats.setTotalMedicines(medicineRepository.count());
        stats.setTotalStores(storeRepository.count());
        stats.setTotalOrders(orderRepository.count());
        stats.setTotalUsers(userRepository.count());

        // Active stores
        stats.setActiveStores(storeRepository.findByStatus("Active").size());

        // Low stock medicines (stock < 50)
        stats.setLowStockMedicines(medicineRepository.findAll().stream()
                .filter(m -> m.getStock() < 50)
                .toList()
                .size());

        // Calculate revenue metrics
        List<Order> allOrders = orderRepository.findAll();
        BigDecimal totalRevenue = allOrders.stream()
                .filter(order -> order.getStatus() != Order.OrderStatus.CANCELLED)
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.setTotalRevenue(totalRevenue);

        // Today's orders and revenue
        LocalDateTime startOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
        LocalDateTime endOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);
        
        List<Order> todayOrders = allOrders.stream()
                .filter(order -> order.getCreatedAt().isAfter(startOfDay) && 
                               order.getCreatedAt().isBefore(endOfDay))
                .toList();
        
        stats.setTodayOrders((long) todayOrders.size());
        
        BigDecimal todayRevenue = todayOrders.stream()
                .filter(order -> order.getStatus() != Order.OrderStatus.CANCELLED)
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.setTodayRevenue(todayRevenue);

        // This month's orders
        YearMonth currentMonth = YearMonth.now();
        LocalDateTime startOfMonth = currentMonth.atDay(1).atStartOfDay();
        LocalDateTime endOfMonth = currentMonth.atEndOfMonth().atTime(LocalTime.MAX);
        
        List<Order> monthlyOrdersList = allOrders.stream()
                .filter(order -> order.getCreatedAt().isAfter(startOfMonth) && 
                               order.getCreatedAt().isBefore(endOfMonth))
                .toList();
        
        stats.setMonthlyOrders((long) monthlyOrdersList.size());

        @SuppressWarnings("unused")
        BigDecimal monthlyRevenue = monthlyOrdersList.stream()
                .filter(order -> order.getStatus() != Order.OrderStatus.CANCELLED)
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Calculate average daily sales (based on total days with data)
        if (!allOrders.isEmpty()) {
            LocalDateTime firstOrderDate = allOrders.stream()
                    .map(Order::getCreatedAt)
                    .min(LocalDateTime::compareTo)
                    .orElse(LocalDateTime.now());
            
            long daysSinceFirstOrder = java.time.Duration.between(firstOrderDate, LocalDateTime.now()).toDays() + 1;
            BigDecimal avgDailySales = totalRevenue.divide(
                    BigDecimal.valueOf(daysSinceFirstOrder), 2, RoundingMode.HALF_UP);
            stats.setAverageDailySales(avgDailySales);

            // Calculate average monthly sales (total revenue / number of months)
            long monthsSinceFirstOrder = java.time.temporal.ChronoUnit.MONTHS.between(
                    firstOrderDate, LocalDateTime.now()) + 1;
            BigDecimal avgMonthlySales = totalRevenue.divide(
                    BigDecimal.valueOf(monthsSinceFirstOrder), 2, RoundingMode.HALF_UP);
            stats.setAverageMonthlySales(avgMonthlySales);
        } else {
            stats.setAverageDailySales(BigDecimal.ZERO);
            stats.setAverageMonthlySales(BigDecimal.ZERO);
        }

        return stats;
    }

    public List<DailyRevenue> getLast7DaysRevenue() {
        List<DailyRevenue> dailyRevenueList = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd");
        
        // Get all orders from the last 7 days
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(6).with(LocalTime.MIN);
        List<Order> recentOrders = orderRepository.findAll().stream()
                .filter(order -> order.getCreatedAt().isAfter(sevenDaysAgo))
                .filter(order -> order.getStatus() != Order.OrderStatus.CANCELLED)
                .toList();
        
        // Group orders by date and calculate revenue for each day
        for (int i = 6; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusDays(i);
            LocalDateTime startOfDay = date.atStartOfDay();
            LocalDateTime endOfDay = date.atTime(LocalTime.MAX);
            
            BigDecimal dayRevenue = recentOrders.stream()
                    .filter(order -> order.getCreatedAt().isAfter(startOfDay) && 
                                   order.getCreatedAt().isBefore(endOfDay))
                    .map(Order::getTotalAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            dailyRevenueList.add(new DailyRevenue(
                    date.format(formatter),
                    dayRevenue.doubleValue()
            ));
        }
        
        return dailyRevenueList;
    }
}
