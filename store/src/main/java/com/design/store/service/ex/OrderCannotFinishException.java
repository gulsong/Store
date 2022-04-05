package com.design.store.service.ex;

public class OrderCannotFinishException extends ServiceException {
    public OrderCannotFinishException(String message) {
        super(message);
    }
}