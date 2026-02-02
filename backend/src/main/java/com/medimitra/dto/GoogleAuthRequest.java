package com.medimitra.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoogleAuthRequest {
    private String credential; // Google ID token
    private String phone; // Optional phone number (required if not available from Google)
}
