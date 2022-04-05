package com.design.store.config;

import com.design.store.interceptor.AdministratorInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class AdministratorInterceptorConfigurer implements WebMvcConfigurer {
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        HandlerInterceptor interceptor = new AdministratorInterceptor();
        List<String> patterns = new ArrayList<>();
        patterns.add("/web/administrator/**");
        patterns.add("/users/admin/**");
        registry.addInterceptor(interceptor).addPathPatterns(patterns);
    }
}