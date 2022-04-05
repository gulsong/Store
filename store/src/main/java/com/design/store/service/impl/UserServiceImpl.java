package com.design.store.service.impl;

import com.design.store.entity.User;
import com.design.store.mapper.UserMapper;
import com.design.store.service.IUserService;
import com.design.store.service.ex.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class UserServiceImpl implements IUserService {
    private final UserMapper userMapper;

    @Autowired
    public UserServiceImpl(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    @Override
    public void reg(User user) {
        String username = user.getUsername();
        judgeUserExist(false, 0, username, true);
        String oldPassword = user.getPassword();
        String salt = UUID.randomUUID().toString().toUpperCase();
        String md5Password = getMD5Password(oldPassword, salt);
        Date date = new Date();
        user.setSalt(salt);
        user.setPassword(md5Password);
        user.setUserType(0);
        user.setGender(0);
        user.setCreatedUser(user.getUsername());
        user.setModifiedUser(user.getUsername());
        user.setCreatedTime(date);
        user.setModifiedTime(date);
        Integer rows = userMapper.insert(user);
        if (rows != 1) {
            throw new InsertException("在用户注册过程中产生未知异常");
        }
    }

    @Override
    public void addUser(User user, String modifiedUser) {
        String username = user.getUsername();
        judgeUserExist(false, 0, username, true);
        String oldPassword = user.getPassword();
        String salt = UUID.randomUUID().toString().toUpperCase();
        String md5Password = getMD5Password(oldPassword, salt);
        Date date = new Date();
        user.setSalt(salt);
        user.setPassword(md5Password);
        user.setGender(0);
        user.setCreatedUser(modifiedUser);
        user.setModifiedUser(modifiedUser);
        user.setCreatedTime(date);
        user.setModifiedTime(date);
        Integer rows = userMapper.insert(user);
        if (rows != 1) {
            throw new InsertException("添加用户产生未知异常");
        }
    }

    @Override
    public void cancelAccount(Integer uid, String password) {
        User result = judgeUserExist(true, uid, "", false);
        String oldPassword = result.getPassword();
        String salt = result.getSalt();
        String newMd5Password = getMD5Password(password, salt);
        if (!newMd5Password.equals(oldPassword)) {
            throw new PasswordNotMatchException("用户密码错误");
        }
        Integer rows = userMapper.deleteByUid(uid);
        if (rows != 1) {
            throw new DeleteException("注销用户时产生未知异常");
        }
    }

    @Override
    public void deleteUser(Integer uid) {
        judgeUserExist(true, uid, "", false);
        Integer rows = userMapper.deleteByUid(uid);
        if (rows != 1) {
            throw new DeleteException("删除用户时产生未知异常");
        }
    }

    @Override
    public void changePassword(Integer uid, String username, String oldPassword, String newPassword) {
        User result = judgeUserExist(true, uid, "", false);
        String oldMd5Password = getMD5Password(oldPassword, result.getSalt());
        if (!result.getPassword().equals(oldMd5Password)) {
            throw new PasswordNotMatchException("密码错误");
        }
        String newMd5Password = getMD5Password(newPassword, result.getSalt());
        Integer rows = userMapper.updatePasswordByUid(uid, newMd5Password, username, new Date());
        if (rows != 1) {
            throw new UpdateException("更新数据产生未知的异常");
        }
    }

    @Override
    public void changeInfo(Integer uid, String username, User user) {
        judgeUserExist(true, uid, "", false);
        user.setUid(uid);
        user.setPhone(user.getPhone().equals("") ? null : user.getPhone());
        user.setModifiedUser(username);
        user.setModifiedTime(new Date());
        Integer rows = userMapper.updateInfoByUid(user);
        if (rows != 1) {
            throw new UpdateException("更新数据时产生未知异常");
        }
    }

    @Override
    public void changeAvatar(Integer uid, String avatar, String username) {
        judgeUserExist(true, uid, "", false);
        Integer rows = userMapper.updateAvatarByUid(uid, avatar, username, new Date());
        if (rows != 1) {
            throw new UpdateException("更新用户头像时产生未知异常");
        }
    }

    @Override
    public void changeUserType(Integer uid, Integer userType, String modifiedUser) {
        judgeUserExist(true, uid, "", false);
        Integer rows = userMapper.updateUserTypeByUid(uid, userType, modifiedUser, new Date());
        if (rows != 1) {
            throw new UpdateException("更新数据时产生未知异常");
        }
    }

    @Override
    public User login(String username, String password) {
        User result = judgeUserExist(false, 0, username, false);
        String oldPassword = result.getPassword();
        String salt = result.getSalt();
        String newMd5Password = getMD5Password(password, salt);
        if (!newMd5Password.equals(oldPassword)) {
            throw new PasswordNotMatchException("用户密码错误");
        }
        User user = new User();
        user.setUid(result.getUid());
        user.setUsername(result.getUsername());
        user.setAvatar(result.getAvatar());
        user.setUserType(result.getUserType());
        return user;
    }

    @Override
    public User getByUid(Integer uid) {
        User result = judgeUserExist(true, uid, "", false);
        User user = new User();
        user.setUsername(result.getUsername());
        user.setUserType(result.getUserType());
        user.setPhone(result.getPhone());
        user.setGender(result.getGender());
        return user;
    }

    @Override
    public List<User> usersList() {
        return userMapper.findAll();
    }

    @Override
    public List<User> getByUserType(Integer userType) {
        return userMapper.findByUserType(userType);
    }

    @Override
    public List<User> getByKeyword(String keyword) {
        return userMapper.findByKeyword(keyword);
    }

    private String getMD5Password(String password, String salt) {
        for (int i = 0; i < 3; i++) {
            password = DigestUtils.md5DigestAsHex((salt + password + salt).getBytes()).toUpperCase();
        }
        return password;
    }

    private User judgeUserExist(boolean choose, Integer uid, String username, boolean exist) {
        User result = choose ? userMapper.findByUid(uid) : userMapper.findByUsername(username);
        if (exist && result != null) {
            throw new UsernameDuplicatedException("用户数据已存在");
        }
        if (!exist && result == null) {
            throw new UserNotFoundException("用户数据不存在");
        }
        return result;
    }
}