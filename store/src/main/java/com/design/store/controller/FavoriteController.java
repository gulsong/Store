package com.design.store.controller;


import com.design.store.entity.Favorite;
import com.design.store.service.IFavoriteService;
import com.design.store.util.JsonResult;
import com.design.store.vo.FavoriteVO;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.List;

@RequestMapping("favorites")
@RestController
public class FavoriteController extends BaseController {
    private final IFavoriteService favoriteService;

    @Autowired
    public FavoriteController(IFavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @RequestMapping("{fid}/delete")
    public JsonResult<Void> delete(@PathVariable("fid") Integer fid, HttpSession session) {
        favoriteService.delete(fid, getuidFromSession(session));
        return new JsonResult<>(OK);
    }

    @RequestMapping("add_to_favorite")
    public JsonResult<Favorite> addToFavorite(Integer pid, HttpSession session) {
        Favorite data = favoriteService.addToFavorite(getuidFromSession(session), pid, getUsernameFromSession(session));
        return new JsonResult<>(OK, data);
    }

    @RequestMapping("get_favorite")
    public JsonResult<Favorite> getFavorite(Integer pid, HttpSession session) {
        Favorite data = favoriteService.getByUidAndPid(getuidFromSession(session), pid);
        return new JsonResult<>(OK, data);
    }

    @RequestMapping({"", "/"})
    public JsonResult<PageInfo<FavoriteVO>> getVOByUid(@RequestParam(defaultValue = "1", value = "pageNum") Integer pageNum, @RequestParam(defaultValue = "8", value = "pageSize") Integer pageSize, HttpSession session) {
        List<FavoriteVO> list = favoriteService.getVOByUid(getuidFromSession(session));
        PageHelper.startPage(pageNum, pageSize);
        PageInfo<FavoriteVO> data = new PageInfo<>(list);
        data.setPageNum(pageNum);
        data.setPageSize(pageSize);
        data.setPages((int) ((data.getTotal() % pageSize) == 0 ? data.getTotal() / pageSize : (data.getTotal() / pageSize) + 1));
        return new JsonResult<>(OK, data);
    }
}