package com.design.store.service.ex;

public class ProductNotFoundException extends ServiceException {
    public ProductNotFoundException(String message) {
        super(message);
    }
}