package com.enes.ttcase.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Configuration
class ExecutorServiceConfig {

    @Bean("transportationExecutorService")
    ExecutorService transportationExecutorService() {
        return Executors.newFixedThreadPool(3);
    }
}
