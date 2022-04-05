package com.design.store.service.ex;

public class OrderCannotPayException extends ServiceException {
    public OrderCannotPayException(String message) {
        super(message);
    }
}