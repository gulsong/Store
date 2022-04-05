package com.design.store.mapper;

import com.design.store.entity.Message;
import com.design.store.entity.Order;
import com.design.store.entity.OrderItem;

import java.util.Date;
import java.util.List;

public interface OrderMapper {
    Integer insertOrder(Order order);

    Integer insertOrderItem(OrderItem orderItem);

    Integer insertMessage(Message message);

    Integer deleteMessage(Integer id);

    Integer updateStatusByOid(Integer status, Integer oid, Date payTime, String modifiedUser, Date modifiedTime);

    Integer updateMessageStatusById(Integer status, Integer id, String modifiedUser, Date modifiedTime);

    Order findByOid(Integer oid);

    Message findMessageById(Integer id);

    List<Order> findByUid(Integer uid);

    List<Order> findAll();

    List<OrderItem> findOrderItemByOid(Integer oid);

    List<OrderItem> findOrderItemByPid(Integer pid);

    List<Message> findAllMessage();
}