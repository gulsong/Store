package com.design.store.service.ex;

public class PasswordNotMatchException extends ServiceException {
    public PasswordNotMatchException(String message) {
        super(message);
    }
}