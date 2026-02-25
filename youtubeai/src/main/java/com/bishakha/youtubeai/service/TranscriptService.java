package com.bishakha.youtubeai.service;

import org.springframework.stereotype.Service;

@Service
public class TranscriptService {

    public String shortenTranscript(String transcript) {

        if (transcript.length() < 4000)
            return transcript;

        return transcript.substring(0, 4000);
    }
}