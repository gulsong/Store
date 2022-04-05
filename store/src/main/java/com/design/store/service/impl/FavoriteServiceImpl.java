package com.design.store.service.impl;

import com.design.store.entity.Favorite;
import com.design.store.mapper.FavoriteMapper;
import com.design.store.service.IFavoriteService;
import com.design.store.service.ex.*;
import com.design.store.vo.FavoriteVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class FavoriteServiceImpl implements IFavoriteService {
    private final FavoriteMapper favoriteMapper;

    @Autowired
    public FavoriteServiceImpl(FavoriteMapper favoriteMapper) {
        this.favoriteMapper = favoriteMapper;
    }

    @Override
    public void delete(Integer fid, Integer uid) {
        Favorite result = favoriteMapper.findByFid(fid);
        if (result == null) {
            throw new FavoriteNotFoundException("数据不存在");
        }
        if (!result.getUid().equals(uid)) {
            throw new AccessDeniedException("数据非法访问");
        }
        Integer rows = favoriteMapper.deleteByFid(fid);
        if (rows != 1) {
            throw new DeleteException("删除数据产生未知的异常");
        }
    }

    @Override
    public Favorite addToFavorite(Integer uid, Integer pid, String username) {
        Favorite result = favoriteMapper.findByUidAndPid(uid, pid);
        Date date = new Date();
        if (result == null) {
            Favorite favorite = new Favorite();
            favorite.setUid(uid);
            favorite.setPid(pid);
            favorite.setCreatedUser(username);
            favorite.setCreatedTime(date);
            favorite.setModifiedUser(username);
            favorite.setModifiedTime(date);
            Integer rows = favoriteMapper.insert(favorite);
            if (rows != 1) {
                throw new InsertException("插入数据时产生未知的异常");
            }
            return favorite;
        } else {
            throw new FavoriteDuplicatedException("收藏数据已存在");
        }
    }

    @Override
    public Favorite getByUidAndPid(Integer uid, Integer pid) {
        return favoriteMapper.findByUidAndPid(uid, pid);
    }

    @Override
    public List<FavoriteVO> getVOByUid(Integer uid) {
        return favoriteMapper.findVOByUid(uid);
    }
}