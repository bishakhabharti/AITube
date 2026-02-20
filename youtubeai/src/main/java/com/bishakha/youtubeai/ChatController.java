package com.bishakha.youtubeai;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/youtube")
@CrossOrigin("*")
public class ChatController {

    @Value("${youtube.api.key}")
    private String apiKey;

    @GetMapping("/search")
    public String searchVideos(@RequestParam String query) {

        String url = "https://www.googleapis.com/youtube/v3/search"
                + "?part=snippet"
                + "&q=" + query
                + "&type=video"
                + "&maxResults=20"
                + "&key=" + apiKey;

        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.getForObject(url, String.class);
    }
}
