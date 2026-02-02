package com.medimitra.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private Long id;
    private String name;
    private String email;
    private String role;
    private Long storeId;
    private String phone;
    private boolean phoneRequired; // True if user needs to provide phone number
    
    // Constructor without phone fields for backward compatibility
    public AuthResponse(String token, Long id, String name, String email, String role, Long storeId) {
        this.token = token;
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.storeId = storeId;
        this.phone = null;
        this.phoneRequired = false;
    }
}
