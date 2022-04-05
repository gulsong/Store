package com.design.store.config;

import com.design.store.interceptor.CustomerInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class CustomerInterceptorConfigurer implements WebMvcConfigurer {
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        HandlerInterceptor interceptor = new CustomerInterceptor();
        List<String> patterns = new ArrayList<>();
        patterns.add("/web/password.html");
        patterns.add("/web/userdata.html");
        patterns.add("/web/upload.html");
        patterns.add("/web/address.html");
        patterns.add("/web/addAddress.html");
        patterns.add("/web/changeAddress.html");
        patterns.add("/web/cancelAccount.html");
        patterns.add("/web/favorites.html");
        patterns.add("/web/orders.html");
        patterns.add("/web/cart.html");
        patterns.add("/web/orderConfirm.html");
        patterns.add("/web/payment.html");
        patterns.add("/web/paySuccess.html");
        patterns.add("/addresses/**");
        patterns.add("/districts/**");
        patterns.add("/favorites/**");
        patterns.add("/carts/**");
        registry.addInterceptor(interceptor).addPathPatterns(patterns);
    }
}