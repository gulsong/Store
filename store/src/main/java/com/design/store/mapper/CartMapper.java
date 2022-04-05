package com.design.store.mapper;

import com.design.store.entity.Cart;
import com.design.store.vo.CartVO;

import java.util.Date;
import java.util.List;

public interface CartMapper {
    Integer insert(Cart cart);

    Integer deleteByCid(Integer cid);

    Integer updateNumByCid(Integer cid, Integer num, String modifiedUser, Date modifiedTime);

    Cart findByCid(Integer cid);

    Cart findByUidAndPid(Integer uid, Integer pid);

    List<CartVO> findVOByCid(Integer[] cids);

    List<CartVO> findVOByUid(Integer uid);
}