package com.design.store.service.impl;

import com.design.store.entity.Cart;
import com.design.store.entity.Product;
import com.design.store.mapper.CartMapper;
import com.design.store.mapper.ProductMapper;
import com.design.store.service.ICartService;
import com.design.store.service.ex.*;
import com.design.store.vo.CartVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class CartServiceImpl implements ICartService {
    @Autowired
    private CartMapper cartMapper;
    @Autowired
    private ProductMapper productMapper;

    @Override
    public void addToCart(Integer uid, Integer pid, Integer amount, String username) {
        Cart result = cartMapper.findByUidAndPid(uid, pid);
        Date date = new Date();
        if (result == null) {
            Cart cart = new Cart();
            cart.setUid(uid);
            cart.setPid(pid);
            cart.setNum(amount);
            Product product = productMapper.findById(pid);
            cart.setPrice(product.getPrice());
            cart.setCreatedUser(username);
            cart.setCreatedTime(date);
            cart.setModifiedUser(username);
            cart.setModifiedTime(date);
            Integer rows = cartMapper.insert(cart);
            if (rows != 1) {
                throw new InsertException("插入数据时产生未知的异常");
            }
        } else {
            Integer num = result.getNum() + amount;
            Integer rows = cartMapper.updateNumByCid(result.getCid(), num, username, date);
            if (rows != 1) {
                throw new UpdateException("更新数据时产生未知的异常");
            }
        }
    }

    @Override
    public void delete(Integer cid, Integer uid) {
        judgeUserExist(cid, uid);
        Integer rows = cartMapper.deleteByCid(cid);
        if (rows != 1) {
            throw new DeleteException("删除数据产生未知的异常");
        }
    }

    @Override
    public Integer addNum(Integer cid, Integer uid, String username) {
        Cart result = judgeUserExist(cid, uid);
        Integer num = result.getNum() + 1;
        Integer rows = cartMapper.updateNumByCid(cid, num, username, new Date());
        if (rows != 1) {
            throw new UpdateException("数据更新失败");
        }
        return num;
    }

    @Override
    public Integer reduceNum(Integer cid, Integer uid, String username) {
        Cart result = judgeUserExist(cid, uid);
        Integer num = result.getNum() - 1;
        Integer rows = cartMapper.updateNumByCid(cid, num, username, new Date());
        if (rows != 1) {
            throw new UpdateException("数据更新失败");
        }
        return num;
    }

    @Override
    public List<CartVO> getVOByCid(Integer[] cids, Integer uid) {
        List<CartVO> list = cartMapper.findVOByCid(cids);
        list.removeIf(cartVO -> !cartVO.getUid().equals(uid));
        return list;
    }

    @Override
    public List<CartVO> getVOByUid(Integer uid) {
        return cartMapper.findVOByUid(uid);
    }

    private Cart judgeUserExist(Integer cid, Integer uid) {
        Cart result = cartMapper.findByCid(cid);
        if (result == null) {
            throw new CartNotFoundException("数据不存在");
        }
        if (!result.getUid().equals(uid)) {
            throw new AccessDeniedException("数据非法访问");
        }
        return result;
    }
}