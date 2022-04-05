package com.design.store.interceptor;

import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class AdministratorInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        Object obj = request.getSession().getAttribute("userType");
        if (!obj.equals(2) && !obj.equals(3)) {
            response.sendRedirect("/web/index.html");
            return false;
        }
        return true;
    }
}