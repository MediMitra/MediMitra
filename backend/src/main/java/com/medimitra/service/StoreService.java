package com.medimitra.service;

import com.medimitra.model.Store;
import com.medimitra.repository.StoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class StoreService {

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Store> getAllStores() {
        return storeRepository.findAll();
    }

    public List<Store> getActiveStores() {
        return storeRepository.findByStatus("Active");
    }

    public Store getStoreById(Long id) {
        return storeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Store not found with id: " + id));
    }

    public List<Store> getStoresByCity(String city) {
        return storeRepository.findByCity(city);
    }

    public List<Store> searchStores(String name) {
        return storeRepository.findByNameContainingIgnoreCase(name);
    }

    public Store createStore(Store store) {
        return storeRepository.save(store);
    }

    public Store updateStore(Long id, Store storeDetails) {
        Store store = getStoreById(id);
        store.setName(storeDetails.getName());
        store.setAddress(storeDetails.getAddress());
        store.setCity(storeDetails.getCity());
        store.setPhone(storeDetails.getPhone());
        store.setLatitude(storeDetails.getLatitude());
        store.setLongitude(storeDetails.getLongitude());
        store.setTimings(storeDetails.getTimings());
        store.setStatus(storeDetails.getStatus());
        store.setMedicineCount(storeDetails.getMedicineCount());
        
        if (storeDetails.getEmail() != null) {
            store.setEmail(storeDetails.getEmail());
        }
        
        if (storeDetails.getPassword() != null && !storeDetails.getPassword().isEmpty()) {
            store.setPassword(passwordEncoder.encode(storeDetails.getPassword()));
        }
        
        return storeRepository.save(store);
    }
    
    public Store updateStoreCredentials(Long id, String email, String password) {
        Store store = getStoreById(id);
        
        if (email != null) {
            store.setEmail(email);
        }
        
        if (password != null && !password.isEmpty()) {
            store.setPassword(passwordEncoder.encode(password));
        }
        
        return storeRepository.save(store);
    }

    public void deleteStore(Long id) {
        Store store = getStoreById(id);
        storeRepository.delete(store);
    }

    public long getTotalStoresCount() {
        return storeRepository.count();
    }

    public long getActiveStoresCount() {
        return storeRepository.findByStatus("Active").size();
    }
}
