package com.design.store.service.ex;

public class UserNotFoundException extends ServiceException {
    public UserNotFoundException(String message) {
        super(message);
    }
}