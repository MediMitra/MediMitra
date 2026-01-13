package com.medimitra.service;

import com.medimitra.model.Address;
import com.medimitra.model.User;
import com.medimitra.repository.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AddressService {

    @Autowired
    private AddressRepository addressRepository;

    public List<Address> getUserAddresses(User user) {
        return addressRepository.findByUser(user);
    }

    public Address createAddress(User user, Address address) {
        address.setUser(user);
        return addressRepository.save(address);
    }

    public Address updateAddress(User user, Long id, Address addressData) {
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (!address.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        address.setFullName(addressData.getFullName());
        address.setPhone(addressData.getPhone());
        address.setAddressLine1(addressData.getAddressLine1());
        address.setAddressLine2(addressData.getAddressLine2());
        address.setCity(addressData.getCity());
        address.setState(addressData.getState());
        address.setZipCode(addressData.getZipCode());
        address.setCountry(addressData.getCountry());
        address.setIsDefault(addressData.getIsDefault());

        return addressRepository.save(address);
    }

    public void deleteAddress(User user, Long id) {
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (!address.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        addressRepository.delete(address);
    }
}
