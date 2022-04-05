package com.design.store.controller.ex;

public class FileEmptyException extends FileUploadException {
    public FileEmptyException(String message) {
        super(message);
    }
}