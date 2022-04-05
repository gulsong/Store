package com.design.store.service.ex;

public class UsernameDuplicatedException extends ServiceException {
    public UsernameDuplicatedException(String message) {
        super(message);
    }
}