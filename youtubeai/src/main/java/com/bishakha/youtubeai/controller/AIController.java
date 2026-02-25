package com.bishakha.youtubeai.controller;

import com.bishakha.youtubeai.service.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.*;

@RestController
@RequestMapping("/ai")
@CrossOrigin("*")
public class AIController {

    @Autowired
    private LlamaService llamaService;

    @Autowired
    private TranscriptService transcriptService;

    @Autowired
    private SentimentService sentimentService;

    @PostMapping("/chat")
    public String chat(@RequestBody Map<String, String> request) {

        String message = request.get("message");
        String videoTitle = request.get("videoTitle");
        String transcript = request.get("transcript");

        String prompt;

        if (videoTitle != null && transcript != null && !transcript.isEmpty()) {

            String shortTranscript = transcriptService.shortenTranscript(transcript);

            prompt = "You are an intelligent AI assistant helping with a YouTube video.\n\n"
                    + "Video Title:\n" + videoTitle + "\n\n"
                    + "Video Summary Context:\n" + shortTranscript + "\n\n"
                    + "User Question:\n" + message + "\n\n"
                    + "Detect user language and reply in same language.";

        } else {

            prompt = "You are a helpful AI assistant like ChatGPT.\n\n"
                    + "Answer clearly.\n"
                    + "Detect user language and reply in same language.\n\n"
                    + "Question:\n" + message;
        }

        return llamaService.generate(prompt);
    }

    @PostMapping("/sentiment")
    public String sentiment(@RequestBody Map<String, String> request) {

        String comments = request.get("comments");

        if (comments == null || comments.isEmpty()) {
            return "No comments provided.";
        }

        String prompt = sentimentService.buildSentimentPrompt(comments);
        return llamaService.generate(prompt);
    }
}