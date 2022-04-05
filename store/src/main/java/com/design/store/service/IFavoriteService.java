package com.design.store.service;

import com.design.store.entity.Favorite;
import com.design.store.vo.FavoriteVO;

import java.util.List;

public interface IFavoriteService {
    void delete(Integer fid, Integer uid);

    Favorite addToFavorite(Integer uid, Integer pid, String username);

    Favorite getByUidAndPid(Integer uid, Integer pid);

    List<FavoriteVO> getVOByUid(Integer uid);
}