package com.example.spring_boot_app;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/errors")
public class ErrorHandlingController {

    @Autowired
    private DifyService difyService;

    /**
     * エラーコードに基づいてAIから解決策を取得します
     * @param requestBody エラーコードを含むリクエスト (例: {"errorCode": "404"})
     * @return AIによる解決提案
     */
    @PostMapping
    public ResponseEntity<Map<String, String>> solveError(@RequestBody Map<String, String> requestBody) {
        String errorCode = requestBody.get("errorCode");
        
        if (errorCode == null || errorCode.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "errorCode is required"));
        }

        // DifyServiceを呼び出してAIの回答を取得
        String suggestion = difyService.getErrorHandling(errorCode);

        // クライアントが扱いやすいようにMap形式で返却
        return ResponseEntity.ok(Map.of(
            "errorCode", errorCode,
            "suggestion", suggestion
        ));
    }
}