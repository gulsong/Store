package com.design.store.service.ex;

public class OrderCannotCancelException extends ServiceException {
    public OrderCannotCancelException(String message) {
        super(message);
    }
}