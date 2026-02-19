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

        String message = request.get("message");
        String videoTitle = request.get("videoTitle");

        String prompt = "You are an AI assistant helping with a YouTube video titled: '"
                + videoTitle +
                "'. This is a famous 1987 pop song by Rick Astley. "
                + "Answer the user's question based on general knowledge about this song.\n\n"
                + "User question: " + message;

        RestTemplate restTemplate = new RestTemplate();

        String url = "http://localhost:11434/api/generate";

        Map<String, Object> body = new HashMap<>();
        body.put("model", "llama3");
        body.put("prompt", prompt);
        body.put("stream", false);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

        return response.getBody().get("response").toString();
    }
}
