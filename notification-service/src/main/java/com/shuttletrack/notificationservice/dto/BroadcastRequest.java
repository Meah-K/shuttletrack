package com.shuttletrack.notificationservice.dto;

import lombok.Data;

// DTO = Data Transfer Object
// This defines the shape of the JSON body for POST /notifications/broadcast
@Data
public class BroadcastRequest {
    private String routeId;   // e.g. "route-A"
    private String title;     // e.g. "Route A delayed by 5 min"
    private String message;   // e.g. "Heavy traffic near Engineering building."
    private String type;      // DELAY, STATUS, or GENERAL
}
