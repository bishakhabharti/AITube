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
            // String videoId = request.get("videoId");
            String videoTitle = request.get("videoTitle");

            // String transcript = getTranscript(videoId);

            String prompt = "You are an intelligent AI assistant helping with a YouTube video titled: '"
                    + videoTitle +
                    "'.\n\nUser question: " + message +
                    "\n\nInstructions:" +
                    "\n1. If the user asks for summary, provide a clear summary." +
                    "\n2. If the user asks about a specific concept, explain it clearly." +
                    "\n3. If the user asks about when something is explained, provide an approximate timestamp like 2:15 or 5:30."
                    +
                    "\n4. Do NOT say you cannot access YouTube." +
                    "\n5. Always answer confidently.";
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
            return "⚠ AI not connected or transcript unavailable.";
        }
    }

    private String getTranscript(String videoId) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://youtubetranscript.com/?server_vid2=" + videoId;

            String raw = restTemplate.getForObject(url, String.class);

            if (raw == null || raw.isEmpty()) {
                return "Transcript not available.";
            }

            return raw;

        } catch (Exception e) {
            return "Transcript not available.";
        }
    }
}