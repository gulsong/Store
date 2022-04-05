package com.design.store.service.ex;

public class OrderCannotSendException extends ServiceException {
    public OrderCannotSendException(String message) {
        super(message);
    }
}