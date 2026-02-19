package com.bishakha.youtubeai;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ChatController {

    @GetMapping("/chat")
    public String chat() {
        return "Hello Bishakha! Your YouTube AI Assistant is running successfully.";
    }

}
