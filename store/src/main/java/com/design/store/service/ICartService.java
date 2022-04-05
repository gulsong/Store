package com.design.store.service;

import com.design.store.vo.CartVO;

import java.util.List;

public interface ICartService {
    void addToCart(Integer uid, Integer pid, Integer amount, String username);

    void delete(Integer cid, Integer uid);

    Integer addNum(Integer cid, Integer uid, String username);

    Integer reduceNum(Integer cid, Integer uid, String username);

    List<CartVO> getVOByCid(Integer[] cids, Integer uid);

    List<CartVO> getVOByUid(Integer uid);
}