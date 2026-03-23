package com.bishakha.youtubeai;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("/youtube")
@CrossOrigin("*")
public class ChatController {

    // Optional on purpose: allow the app to start even if you haven't configured the YouTube API key yet.
    // Configure via env var `YOUTUBE_API_KEY` (or property `youtube.api.key`).
    @Value("${youtube.api.key:}")
    private String apiKey;

    @GetMapping("/search")
    public String searchVideos(@RequestParam String query) {

        if (apiKey == null || apiKey.isBlank()) {
            return "{\"items\":[],\"error\":\"Missing youtube.api.key. Set env var YOUTUBE_API_KEY to enable YouTube search.\"}";
        }

        try {
            String url = UriComponentsBuilder
                    .fromHttpUrl("https://www.googleapis.com/youtube/v3/search")
                    .queryParam("part", "snippet")
                    .queryParam("q", query)
                    .queryParam("type", "video")
                    .queryParam("maxResults", 50)
                    .queryParam("key", apiKey)
                    .build()
                    .toUriString();

            RestTemplate restTemplate = new RestTemplate();
            String result = restTemplate.getForObject(url, String.class);
            if (result == null || result.isBlank()) {
                return "{\"items\":[],\"error\":\"YouTube API returned an empty response.\"}";
            }
            return result;
        } catch (Exception e) {
            return "{\"items\":[],\"error\":\"Failed to call YouTube API.\"}";
        }
    }
}
