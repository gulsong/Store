package com.design.store.mapper;

import com.design.store.entity.User;
import org.apache.ibatis.annotations.Param;

import java.util.Date;
import java.util.List;

public interface UserMapper {
    Integer insert(User user);

    Integer deleteByUid(Integer uid);

    Integer updatePasswordByUid(Integer uid, String password, String modifiedUser, Date modifiedTime);

    Integer updateInfoByUid(User user);

    Integer updateUserTypeByUid(Integer uid, Integer userType, String modifiedUser, Date modifiedTime);

    Integer updateAvatarByUid(@Param("uid") Integer uid, @Param("avatar") String avatar, @Param("modifiedUser") String modifiedUser, @Param("modifiedTime") Date modifiedTime);

    User findByUid(Integer uid);

    User findByUsername(String username);

    List<User> findAll();

    List<User> findByUserType(Integer userType);

    List<User> findByKeyword(String keyword);
}