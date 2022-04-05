package com.design.store.service.ex;

public class OrderNotFoundException extends ServiceException {
    public OrderNotFoundException(String message) {
        super(message);
    }
}