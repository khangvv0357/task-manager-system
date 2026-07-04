package com.example.taskmanager;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Cho phép mọi Frontend gọi vào API này
        registry.addMapping("/**").allowedMethods("*").allowedOrigins("*");
    }
}