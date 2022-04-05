package com.design.store.service.ex;

public class OrderCannotRefundException extends ServiceException {
    public OrderCannotRefundException(String message) {
        super(message);
    }
}