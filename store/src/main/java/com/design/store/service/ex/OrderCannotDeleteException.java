package com.design.store.service.ex;

public class OrderCannotDeleteException extends ServiceException {
    public OrderCannotDeleteException(String message) {
        super(message);
    }
}