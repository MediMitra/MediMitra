package com.medimitra.config;

import com.medimitra.model.Medicine;
import com.medimitra.model.User;
import com.medimitra.repository.MedicineRepository;
import com.medimitra.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        initializeUsers();
        initializeMedicines();
    }

    private void initializeUsers() {
        // Create Admin user if not exists
        if (!userRepository.existsByEmail("admin@medimitra.com")) {
            User admin = new User();
            admin.setName("Admin");
            admin.setEmail("admin@medimitra.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(User.Role.ADMIN);
            userRepository.save(admin);
            System.out.println("✅ Admin user created: admin@medimitra.com / admin123");
        }

        // Create Store user if not exists
        if (!userRepository.existsByEmail("store@medimitra.com")) {
            User store = new User();
            store.setName("MediStore");
            store.setEmail("store@medimitra.com");
            store.setPassword(passwordEncoder.encode("store123"));
            store.setRole(User.Role.STORE);
            store.setStoreId(1L);
            userRepository.save(store);
            System.out.println("✅ Store user created: store@medimitra.com / store123");
        }

        // Create Demo user if not exists
        if (!userRepository.existsByEmail("user@medimitra.com")) {
            User user = new User();
            user.setName("Demo User");
            user.setEmail("user@medimitra.com");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setRole(User.Role.USER);
            userRepository.save(user);
            System.out.println("✅ Demo user created: user@medimitra.com / user123");
        }
    }

    private void initializeMedicines() {
        if (medicineRepository.count() == 0) {
            Medicine[] medicines = {
                createMedicine("Paracetamol 500mg", "Pain Relief", 50.0, "Effective pain relief and fever reducer", "PharmaCo", 100),
                createMedicine("Amoxicillin 250mg", "Antibiotic", 120.0, "Broad-spectrum antibiotic", "MediLife", 50),
                createMedicine("Cetirizine 10mg", "Allergy", 80.0, "Relieves allergy symptoms", "HealthCare", 75),
                createMedicine("Omeprazole 20mg", "Digestive", 150.0, "Treats acid reflux and heartburn", "WellMed", 30),
                createMedicine("Aspirin 75mg", "Pain Relief", 40.0, "Blood thinner and pain relief", "PharmaCo", 120),
                createMedicine("Metformin 500mg", "Diabetes", 200.0, "Controls blood sugar levels", "DiabetCare", 60),
                createMedicine("Vitamin D3 1000IU", "Supplements", 180.0, "Supports bone health", "VitaHealth", 90),
                createMedicine("Ibuprofen 400mg", "Pain Relief", 90.0, "Anti-inflammatory pain reliever", "MediLife", 0),
                createMedicine("Azithromycin 500mg", "Antibiotic", 250.0, "Treats bacterial infections", "PharmaCo", 45),
                createMedicine("Loratadine 10mg", "Allergy", 95.0, "24-hour allergy relief", "HealthCare", 80)
            };

            for (Medicine medicine : medicines) {
                medicineRepository.save(medicine);
            }
            System.out.println("✅ " + medicines.length + " medicines initialized");
        }
    }

    private Medicine createMedicine(String name, String category, Double price, String description, String manufacturer, int stock) {
        Medicine medicine = new Medicine();
        medicine.setName(name);
        medicine.setCategory(category);
        medicine.setPrice(BigDecimal.valueOf(price));
        medicine.setDescription(description);
        medicine.setManufacturer(manufacturer);
        medicine.setStock(stock);
        return medicine;
    }
}
