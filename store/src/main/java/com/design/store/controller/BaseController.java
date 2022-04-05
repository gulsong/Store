package com.design.store.controller;

import com.design.store.controller.ex.*;
import com.design.store.service.ex.*;
import com.design.store.util.JsonResult;
import org.springframework.web.bind.annotation.ExceptionHandler;

import javax.servlet.http.HttpSession;

public class BaseController {
    public static final int OK = 200;

    @ExceptionHandler({ServiceException.class, FileUploadException.class})
    public JsonResult<Void> handleException(Throwable e) {
        JsonResult<Void> result = new JsonResult<>(e);
        if (e instanceof UsernameDuplicatedException) {
            result.setState(4000);
        } else if (e instanceof UserNotFoundException) {
            result.setState(4001);
        } else if (e instanceof PasswordNotMatchException) {
            result.setState(4002);
        } else if (e instanceof AddressCountLimitException) {
            result.setState(4003);
        } else if (e instanceof AddressNotFoundException) {
            result.setState(4004);
        } else if (e instanceof AccessDeniedException) {
            result.setState(4005);
        } else if (e instanceof ProductNotFoundException) {
            result.setState(4006);
        } else if (e instanceof CartNotFoundException) {
            result.setState(4007);
        } else if (e instanceof OrderNotFoundException) {
            result.setState(4008);
        } else if (e instanceof OrderCannotPayException) {
            result.setState(4009);
        } else if (e instanceof ProductNotEnoughException) {
            result.setState(4010);
        } else if (e instanceof OrderCannotFinishException) {
            result.setState(4011);
        } else if (e instanceof OrderCannotDeleteException) {
            result.setState(4012);
        } else if (e instanceof OrderCannotCancelException) {
            result.setState(4013);
        } else if (e instanceof FavoriteDuplicatedException) {
            result.setState(4014);
        } else if (e instanceof FavoriteNotFoundException) {
            result.setState(4015);
        } else if (e instanceof MessageNotFoundException) {
            result.setState(4016);
        } else if (e instanceof OrderCannotSendException) {
            result.setState(4017);
        } else if (e instanceof OrderCannotRefundException) {
            result.setState(4018);
        } else if (e instanceof InsertException) {
            result.setState(5000);
        } else if (e instanceof UpdateException) {
            result.setState(5001);
        } else if (e instanceof DeleteException) {
            result.setState(5002);
        } else if (e instanceof FileEmptyException) {
            result.setState(6000);
        } else if (e instanceof FileSizeException) {
            result.setState(6001);
        } else if (e instanceof FileTypeException) {
            result.setState(6002);
        } else if (e instanceof FileStateException) {
            result.setState(6003);
        } else if (e instanceof FileUploadIOException) {
            result.setState(6004);
        }
        return result;
    }

    protected final Integer getuidFromSession(HttpSession session) {
        return Integer.valueOf(session.getAttribute("uid").toString());
    }

    protected final String getUsernameFromSession(HttpSession session) {
        return session.getAttribute("username").toString();
    }

    protected final Integer getUserTypeFromSession(HttpSession session) {
        return Integer.valueOf(session.getAttribute("userType").toString());
    }

    protected final Integer getAidFromSession(HttpSession session) {
        return Integer.valueOf(session.getAttribute("aid").toString());
    }
}