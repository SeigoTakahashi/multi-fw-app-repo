package com.example.spring_boot_app;

import lombok.Data;
import java.util.Map;

@Data
public class DifyResponse {
    private DataPayload data;

    @Data
    public static class DataPayload {
        private Map<String, String> outputs;
    }
}