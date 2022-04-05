package com.design.store.mapper;

import com.design.store.entity.Favorite;
import com.design.store.vo.FavoriteVO;

import java.util.List;

public interface FavoriteMapper {
    Integer insert(Favorite favorite);

    Integer deleteByFid(Integer fid);

    Favorite findByFid(Integer fid);

    Favorite findByUidAndPid(Integer uid, Integer pid);

    List<FavoriteVO> findVOByUid(Integer uid);
}