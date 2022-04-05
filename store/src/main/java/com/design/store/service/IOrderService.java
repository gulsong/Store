package com.design.store.service;

import com.design.store.entity.Message;
import com.design.store.entity.Order;
import com.design.store.entity.OrderItem;

import java.util.List;

public interface IOrderService {
    void deleteMessage(Integer id);

    void setPay(Integer oid, Integer uid, String username);

    void setFinish(Integer oid, Integer uid, String username);

    void setDelete(Integer oid, Integer uid, String username);

    void setCancel(Integer oid, Integer uid, String username);

    void setSend(Integer oid, String username);

    void setRefund(Integer oid, String username);

    void setDeleteNoUid(Integer oid, String username);

    void setMessageFinish(Integer id, String username);

    void reduceProductNum(Integer oid, String username);

    void addProductPriority(Integer oid, String username);

    Integer countNum(Integer pid);

    Integer countNumMonth(Integer pid);

    Long countMoney(Integer pid);

    Long countMoneyMonth(Integer pid);

    Order create(Integer aid, Integer uid, String username, Integer[] cids);

    Order createByPid(Integer aid, Integer uid, String username, Integer pid, Integer num);

    Order getByOid(Integer oid, Integer uid);

    Order getByOidNoUid(Integer oid);

    Message createMessage(Integer oid, Integer uid, Integer messageType, String username);

    List<Order> getByUid(Integer uid);

    List<Order> getOrderList();

    List<OrderItem> getOrderItemByOid(Integer oid);

    List<Message> getMessage();
}