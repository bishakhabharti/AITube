package com.bishakha.youtubeai.service;

import org.springframework.stereotype.Service;

@Service
public class SentimentService {

    public String buildSentimentPrompt(String comments) {
        return """
                Analyze the following comments.
                Give:
                - Percentage Positive
                - Percentage Negative
                - Percentage Neutral
                - Overall Mood

                Comments:
                """ + comments;
    }
}