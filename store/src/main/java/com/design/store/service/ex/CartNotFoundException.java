package com.design.store.service.ex;

public class CartNotFoundException extends ServiceException {
    public CartNotFoundException(String message) {
        super(message);
    }
}