package com.design.store.controller;

import com.design.store.controller.ex.*;
import com.design.store.entity.User;
import com.design.store.service.IUserService;
import com.design.store.util.JsonResult;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("users")
public class UserController extends BaseController {

    public static final int AVATAR_MAX_SIZE = 10 * 1024 * 1024;
    public static final List<String> AVATAR_TYPE = new ArrayList<>();

    static {
        AVATAR_TYPE.add("image/jpeg");
        AVATAR_TYPE.add("image/png");
        AVATAR_TYPE.add("image/bmp");
        AVATAR_TYPE.add("image/gif");
    }

    private final IUserService userService;

    @Autowired
    public UserController(IUserService userService) {
        this.userService = userService;
    }

    @RequestMapping("get_uid")
    public JsonResult<Integer> getUid(HttpSession session) {
        Integer data = getuidFromSession(session);
        return new JsonResult<>(OK, data);
    }

    @RequestMapping("get_user_type")
    public JsonResult<Integer> getUserType(HttpSession session) {
        Integer data = getUserTypeFromSession(session);
        return new JsonResult<>(OK, data);
    }

    @RequestMapping("logout")
    public JsonResult<Void> logout(HttpSession session) {
        session.removeAttribute("uid");
        session.removeAttribute("username");
        return new JsonResult<>(OK);
    }

    @RequestMapping("reg")
    public JsonResult<Void> reg(User user) {
        userService.reg(user);
        return new JsonResult<>(OK);
    }

    @RequestMapping("admin/add_user")
    public JsonResult<Void> addUser(User user, HttpSession session) {
        userService.addUser(user, getUsernameFromSession(session));
        return new JsonResult<>(OK);
    }

    @RequestMapping("cancel_account")
    public JsonResult<Void> cancelAccount(String password, HttpSession session) {
        Integer userType = getUserTypeFromSession(session);
        if (userType != 3) {
            userService.cancelAccount(getuidFromSession(session), password);
            session.removeAttribute("uid");
            session.removeAttribute("username");
            session.removeAttribute("userType");
        }
        return new JsonResult<>(OK);
    }

    @RequestMapping("admin/delete_user")
    public JsonResult<Void> deleteUser(Integer uid) {
        userService.deleteUser(uid);
        return new JsonResult<>(OK);
    }

    @RequestMapping("change_password")
    public JsonResult<Void> changePassword(String oldPassword, String newPassword, HttpSession session) {
        Integer uid = getuidFromSession(session);
        String username = getUsernameFromSession(session);
        Integer userType = getUserTypeFromSession(session);
        if (userType != 3) {
            userService.changePassword(uid, username, oldPassword, newPassword);
        }
        return new JsonResult<>(OK);
    }

    @RequestMapping("change_info")
    public JsonResult<Void> changeInfo(User user, HttpSession session) {
        Integer uid = getuidFromSession(session);
        String username = getUsernameFromSession(session);
        userService.changeInfo(uid, username, user);
        return new JsonResult<>(OK);
    }

    @RequestMapping("change_avatar")
    public JsonResult<String> changeAvatar(HttpSession session, @RequestParam("file") MultipartFile file) throws FileNotFoundException {
        if (file.isEmpty()) {
            throw new FileEmptyException("文件为空");
        }
        if (file.getSize() > AVATAR_MAX_SIZE) {
            throw new FileSizeException("文件超出限制");
        }
        String contentType = file.getContentType();
        if (!AVATAR_TYPE.contains(contentType)) {
            throw new FileTypeException("文件类型不支持");
        }
        File path = new File(ResourceUtils.getURL("classpath:").getPath());
        if(!path.exists()) {
            path = new File("");
        }
        File upload = new File(path.getAbsolutePath(),"static/images/upload/");
        if(!upload.exists()) {
            boolean mkdir =  upload.mkdirs();
            if (!mkdir) {
                throw new FileUploadIOException("文件读写异常");
            }
        }
        String parent= upload.getPath();
        File dir = new File(parent);
        String originalFilename = file.getOriginalFilename();
        assert originalFilename != null;
        int index = originalFilename.lastIndexOf(".");
        String suffix = originalFilename.substring(index);
        String filename = UUID.randomUUID().toString().toUpperCase(Locale.ROOT) + suffix;
        File dest = new File(dir, filename);
        try {
            file.transferTo(dest);
        } catch (FileStateException e) {
            throw new FileStateException("文件状态异常");
        } catch (IOException e) {
            throw new FileUploadIOException("文件读写异常");
        }
        Integer uid = getuidFromSession(session);
        String username = getUsernameFromSession(session);
        String avatar = "/upload/" + filename;
        userService.changeAvatar(uid, avatar, username);
        return new JsonResult<>(OK, avatar);
    }

    @RequestMapping("admin/change_user_type")
    public JsonResult<Void> changeUserType(Integer uid, Integer userType, HttpSession session) {
        userService.changeUserType(uid, userType, getUsernameFromSession(session));
        return new JsonResult<>(OK);
    }

    @RequestMapping("login")
    public JsonResult<User> login(String username, String password, HttpSession session) {
        User data = userService.login(username, password);
        session.setAttribute("uid", data.getUid());
        session.setAttribute("username", data.getUsername());
        session.setAttribute("userType", data.getUserType());
        return new JsonResult<>(OK, data);
    }

    @RequestMapping("get_by_uid")
    public JsonResult<User> getByUid(HttpSession session) {
        User data = userService.getByUid(getuidFromSession(session));
        return new JsonResult<>(OK, data);
    }

    @RequestMapping("admin/users_list")
    public JsonResult<PageInfo<User>> usersList(@RequestParam(defaultValue = "1", value = "pageNum") Integer pageNum, @RequestParam(defaultValue = "10", value = "pageSize") Integer pageSize, @RequestParam("type") Integer type) {
        List<User> list = userService.usersList();
        if (type != 3) {
            list = userService.getByUserType(type);
        }
        PageHelper.startPage(pageNum, pageSize);
        PageInfo<User> data = new PageInfo<>(list);
        data.setPageNum(pageNum);
        data.setPageSize(pageSize);
        data.setPages((int) ((data.getTotal() % pageSize) == 0 ? data.getTotal() / pageSize : (data.getTotal() / pageSize) + 1));
        return new JsonResult<>(OK, data);
    }

    @RequestMapping("admin/search_user")
    public JsonResult<PageInfo<User>> searchUser(@RequestParam(defaultValue = "1", value = "pageNum") Integer pageNum, @RequestParam(defaultValue = "10", value = "pageSize") Integer pageSize, @RequestParam("keyword") String keyword) {
        List<User> list = userService.getByKeyword(keyword);
        PageHelper.startPage(pageNum, pageSize);
        PageInfo<User> data = new PageInfo<>(list);
        data.setPageNum(pageNum);
        data.setPageSize(pageSize);
        data.setPages((int) ((data.getTotal() % pageSize) == 0 ? data.getTotal() / pageSize : (data.getTotal() / pageSize) + 1));
        return new JsonResult<>(OK, data);
    }
}