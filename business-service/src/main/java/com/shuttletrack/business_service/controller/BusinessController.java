package com.shuttletrack.business_service.controller;

import com.shuttletrack.business_service.model.Business;
import com.shuttletrack.business_service.repository.BusinessRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/businesses")
public class BusinessController {

    @Autowired
    private BusinessRepository businessRepository;

    @GetMapping
    public List<Business> getAllBusinesses() {
        return businessRepository.findAll();
    }

    @GetMapping("/{id}")
    public Business getBusinessById(@PathVariable UUID id) {
        return businessRepository.findById(id).orElse(null);
    }
}