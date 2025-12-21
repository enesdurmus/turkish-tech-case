package com.enes.ttcase.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Turkish Tech Case")
                        .version("1.0")
                        .description("This api created for Turkish Tech Case, by Enes Durmus.")
                        .contact(new Contact()
                                .name("Enes Durmus")
                                .email("enesdurmus3738@gmail.com")));
    }
}