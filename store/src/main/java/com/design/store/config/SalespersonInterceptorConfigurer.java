package com.design.store.config;

import com.design.store.interceptor.SalespersonInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class SalespersonInterceptorConfigurer implements WebMvcConfigurer {
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        HandlerInterceptor interceptor = new SalespersonInterceptor();
        List<String> patterns = new ArrayList<>();
        patterns.add("/web/salesperson/**");
        patterns.add("/products/sale/**");
        patterns.add("/orders/sale/**");
        registry.addInterceptor(interceptor).addPathPatterns(patterns);
    }
}