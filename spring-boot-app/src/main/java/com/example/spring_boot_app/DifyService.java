package com.example.spring_boot_app; 

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.Map;

import org.springframework.boot.web.client.RestTemplateBuilder;
import java.time.Duration;

@Service
public class DifyService {
    @Value("${dify.api.key}")
    private String difyApiKey;

    @Value("${dify.next.api.key}")
    private String difyNextApiKey;

    private final String DIFY_API_URL = "https://api.dify.ai/v1/workflows/run";

    public String getSummary(String query) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(difyApiKey);

        Map<String, Object> body = Map.of(
            "inputs", Map.of("query", query),
            "response_mode", "blocking",
            "user", "none"
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        
        try {
            ResponseEntity<DifyResponse> response = restTemplate.postForEntity(
                DIFY_API_URL, entity, DifyResponse.class);
            return response.getBody().getData().getOutputs().get("summary");
        } catch (Exception e) {
            e.printStackTrace();
            return "要約の取得に失敗しました。" + e.getMessage();
        }
    }

    public String getErrorHandling(String errorCode) {
        RestTemplate restTemplate = new RestTemplateBuilder()
            .setConnectTimeout(Duration.ofSeconds(10))
            .setReadTimeout(Duration.ofSeconds(60)) 
            .build();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(difyNextApiKey);

        Map<String, Object> body = Map.of(
            "inputs", Map.of("errorCode", errorCode),
            "response_mode", "blocking",
            "user", "none"
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        
        try {
            ResponseEntity<DifyResponse> response = restTemplate.postForEntity(
                DIFY_API_URL, entity, DifyResponse.class);
            return response.getBody().getData().getOutputs().get("errorHandling");
        } catch (Exception e) {
            e.printStackTrace();
            return "エラー解決提案の取得に失敗しました。" + e.getMessage();
        }
    }
}