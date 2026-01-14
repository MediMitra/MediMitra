package com.medimitra.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStats {
    private Long totalMedicines;
    private Long totalStores;
    private Long totalOrders;
    private Long totalUsers;
    private BigDecimal totalRevenue;
    private BigDecimal todayRevenue;
    private BigDecimal averageDailySales;
    private BigDecimal averageMonthlySales;
    private Long todayOrders;
    private Long monthlyOrders;
    private Integer lowStockMedicines;
    private Integer activeStores;
}
