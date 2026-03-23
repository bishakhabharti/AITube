
package com.bishakha.youtubeai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.CommandLineRunner;
import com.bishakha.youtubeai.service.LlamaService;

@SpringBootApplication
public class YoutubeaiApplication {

	public static void main(String[] args) {
		SpringApplication.run(YoutubeaiApplication.class, args);
	}
}
	//@Bean
	//CommandLineRunner runner(LlamaService llamaService) {
		//return args -> {
			//System.out.println("🔥 Warming up LLaMA model...");
			//llamaService.generate("Hello");
		//};
	//}
