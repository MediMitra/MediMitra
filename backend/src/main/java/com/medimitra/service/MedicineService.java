package com.medimitra.service;

import com.medimitra.model.Medicine;
import com.medimitra.repository.MedicineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MedicineService {

    @Autowired
    private MedicineRepository medicineRepository;

    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }

    public Medicine getMedicineById(Long id) {
        return medicineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));
    }

    public List<Medicine> searchMedicines(String query) {
        return medicineRepository.findByNameContainingIgnoreCase(query);
    }

    public List<Medicine> getMedicinesByCategory(String category) {
        return medicineRepository.findByCategory(category);
    }

    public Medicine createMedicine(Medicine medicine) {
        return medicineRepository.save(medicine);
    }

    public Medicine updateMedicine(Long id, Medicine medicine) {
        Medicine existing = getMedicineById(id);
        existing.setName(medicine.getName());
        existing.setDescription(medicine.getDescription());
        existing.setPrice(medicine.getPrice());
        existing.setStock(medicine.getStock());
        existing.setCategory(medicine.getCategory());
        existing.setManufacturer(medicine.getManufacturer());
        existing.setImageUrl(medicine.getImageUrl());
        existing.setPrescriptionRequired(medicine.getPrescriptionRequired());
        return medicineRepository.save(existing);
    }

    public void deleteMedicine(Long id) {
        medicineRepository.deleteById(id);
    }
}
