package com.medimitra.controller;

import com.medimitra.model.Store;
import com.medimitra.service.StoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/stores")
public class StoreController {

    @Autowired
    private StoreService storeService;

    @GetMapping
    public ResponseEntity<List<Store>> getAllStores() {
        return ResponseEntity.ok(storeService.getAllStores());
    }

    @GetMapping("/active")
    public ResponseEntity<List<Store>> getActiveStores() {
        return ResponseEntity.ok(storeService.getActiveStores());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Store> getStoreById(@PathVariable Long id) {
        return ResponseEntity.ok(storeService.getStoreById(id));
    }

    @GetMapping("/city/{city}")
    public ResponseEntity<List<Store>> getStoresByCity(@PathVariable String city) {
        return ResponseEntity.ok(storeService.getStoresByCity(city));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Store>> searchStores(@RequestParam String name) {
        return ResponseEntity.ok(storeService.searchStores(name));
    }

    @PostMapping
    public ResponseEntity<Store> createStore(@RequestBody Store store) {
        return ResponseEntity.ok(storeService.createStore(store));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Store> updateStore(@PathVariable Long id, @RequestBody Store store) {
        return ResponseEntity.ok(storeService.updateStore(id, store));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStore(@PathVariable Long id) {
        storeService.deleteStore(id);
        return ResponseEntity.noContent().build();
    }
}
