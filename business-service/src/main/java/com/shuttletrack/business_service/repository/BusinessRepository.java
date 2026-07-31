package com.shuttletrack.business_service.repository;

import com.shuttletrack.business_service.model.Business;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface BusinessRepository extends JpaRepository<Business, UUID> {
}