package com.design.store.service;

import com.design.store.entity.User;

import java.util.List;

public interface IUserService {
    void reg(User user);

    void addUser(User user, String modifiedUser);

    void cancelAccount(Integer uid, String password);

    void deleteUser(Integer uid);

    void changePassword(Integer uid, String username, String oldPassword, String newPassword);

    void changeInfo(Integer uid, String username, User user);

    void changeAvatar(Integer uid, String avatar, String username);

    void changeUserType(Integer uid, Integer userType, String modifiedUser);

    User login(String username, String password);

    User getByUid(Integer uid);

    List<User> usersList();

    List<User> getByUserType(Integer userType);

    List<User> getByKeyword(String keyword);
}