package com.medimitra.controller;

import com.medimitra.dto.DailyRevenue;
import com.medimitra.dto.DashboardStats;
import com.medimitra.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStats> getDashboardStats() {
        return ResponseEntity.ok(dashboardService.getDashboardStats());
    }

    @GetMapping("/revenue/last7days")
    public ResponseEntity<List<DailyRevenue>> getLast7DaysRevenue() {
        return ResponseEntity.ok(dashboardService.getLast7DaysRevenue());
    }
}
