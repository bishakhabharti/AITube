package com.bishakha.youtubeai;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.*;

@RestController
@RequestMapping("/ai")
@CrossOrigin("*")
public class AIController {

    @PostMapping("/chat")
    public String chat(@RequestBody Map<String, String> request) {

        try {

            String message = request.get("message");
            String videoTitle = request.get("videoTitle");

            String prompt = "You are an AI assistant helping with a YouTube video titled: '"
                    + videoTitle +
                    "'. Answer clearly.\n\n"
                    + "User question: " + message;

            RestTemplate restTemplate = new RestTemplate();
            String url = "http://localhost:11434/api/generate";

            Map<String, Object> body = new HashMap<>();
            body.put("model", "phi");
            body.put("prompt", prompt);
            body.put("stream", false);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            return response.getBody().get("response").toString();

        } catch (Exception e) {
            return "⚠ AI not connected. Make sure Ollama is running.";
        }
    }
}