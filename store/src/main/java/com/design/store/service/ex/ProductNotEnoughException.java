package com.design.store.service.ex;

public class ProductNotEnoughException extends ServiceException {
    public ProductNotEnoughException(String message) {
        super(message);
    }
}