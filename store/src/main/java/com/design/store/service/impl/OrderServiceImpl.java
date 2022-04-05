package com.design.store.service.impl;

import com.design.store.entity.*;
import com.design.store.mapper.OrderMapper;
import com.design.store.service.IAddressService;
import com.design.store.service.ICartService;
import com.design.store.service.IOrderService;
import com.design.store.service.IProductService;
import com.design.store.service.ex.*;
import com.design.store.vo.CartVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service
public class OrderServiceImpl implements IOrderService {
    @Autowired
    private OrderMapper orderMapper;
    @Autowired
    private IAddressService addressService;
    @Autowired
    private ICartService cartService;
    @Autowired
    private IProductService productService;

    @Override
    public void deleteMessage(Integer id) {
        Message result = orderMapper.findMessageById(id);
        if (result == null) {
            throw new MessageNotFoundException("消息不存在");
        }
        Integer rows = orderMapper.deleteMessage(id);
        if (rows != 1) {
            throw new DeleteException("数据删除产生未知异常");
        }
    }

    @Override
    public void setPay(Integer oid, Integer uid, String username) {
        Order result = judgeUserExist(oid, uid);
        if (!result.getStatus().equals(0)) {
            throw new OrderCannotPayException("订单无法支付");
        }
        Date date = new Date();
        Integer rows = orderMapper.updateStatusByOid(1, oid, date, username, date);
        if (rows != 1) {
            throw new UpdateException("数据更新产生未知异常");
        }
    }

    @Override
    public void setFinish(Integer oid, Integer uid, String username) {
        Order result = judgeUserExist(oid, uid);
        if (!result.getStatus().equals(2)) {
            throw new OrderCannotFinishException("订单无法确认收货");
        }
        Integer rows = orderMapper.updateStatusByOid(3, oid, null, username, new Date());
        if (rows != 1) {
            throw new UpdateException("数据更新产生未知异常");
        }
    }

    @Override
    public void setDelete(Integer oid, Integer uid, String username) {
        Order result = judgeUserExist(oid, uid);
        if (!(result.getStatus().equals(0) || result.getStatus().equals(3) || result.getStatus().equals(4))) {
            throw new OrderCannotDeleteException("订单无法删除");
        }
        Integer rows = orderMapper.updateStatusByOid(5, oid, null, username, new Date());
        if (rows != 1) {
            throw new UpdateException("数据更新产生未知异常");
        }
    }

    @Override
    public void setCancel(Integer oid, Integer uid, String username) {
        Order result = judgeUserExist(oid, uid);
        if (!result.getStatus().equals(0)) {
            throw new OrderCannotCancelException("订单无法取消");
        }
        Integer rows = orderMapper.updateStatusByOid(4, oid, null, username, new Date());
        if (rows != 1) {
            throw new UpdateException("数据更新产生未知异常");
        }
    }

    @Override
    public void setSend(Integer oid, String username) {
        Order result = orderMapper.findByOid(oid);
        if (result == null || result.getStatus().equals(5)) {
            throw new OrderNotFoundException("订单不存在");
        }
        if (!result.getStatus().equals(1)) {
            throw new OrderCannotSendException("订单无法发货");
        }
        Integer rows = orderMapper.updateStatusByOid(2, oid, null, username, new Date());
        if (rows != 1) {
            throw new UpdateException("数据更新产生未知异常");
        }
    }

    @Override
    public void setRefund(Integer oid, String username) {
        Order result = orderMapper.findByOid(oid);
        if (result == null || result.getStatus().equals(5)) {
            throw new OrderNotFoundException("订单不存在");
        }
        if (!(result.getStatus().equals(1) || result.getStatus().equals(2) || result.getStatus().equals(3))) {
            throw new OrderCannotRefundException("订单无法退款");
        }
        Integer rows = orderMapper.updateStatusByOid(4, oid, null, username, new Date());
        if (rows != 1) {
            throw new UpdateException("数据更新产生未知异常");
        }
    }

    @Override
    public void setDeleteNoUid(Integer oid, String username) {
        Order result = orderMapper.findByOid(oid);
        if (result == null || result.getStatus().equals(5)) {
            throw new OrderNotFoundException("订单不存在");
        }
        if (!(result.getStatus().equals(0) || result.getStatus().equals(3) || result.getStatus().equals(4))) {
            throw new OrderCannotDeleteException("订单无法删除");
        }
        Integer rows = orderMapper.updateStatusByOid(5, oid, null, username, new Date());
        if (rows != 1) {
            throw new UpdateException("数据更新产生未知异常");
        }
    }

    @Override
    public void setMessageFinish(Integer id, String username) {
        Message result = orderMapper.findMessageById(id);
        if (result == null) {
            throw new MessageNotFoundException("消息不存在");
        }
        Integer rows = orderMapper.updateMessageStatusById(2, id, username, new Date());
        if (rows != 1) {
            throw new UpdateException("数据更新产生未知异常");
        }
    }

    @Override
    public void reduceProductNum(Integer oid, String username) {
        List<OrderItem> list = orderMapper.findOrderItemByOid(oid);
        for (OrderItem orderItem : list) {
            productService.reduceNum(orderItem.getPid(), orderItem.getNum(), username);
        }
    }

    @Override
    public void addProductPriority(Integer oid, String username) {
        List<OrderItem> list = orderMapper.findOrderItemByOid(oid);
        for (OrderItem orderItem : list) {
            productService.addPriority(orderItem.getPid(), orderItem.getNum(), username);
        }
    }

    @Override
    public Integer countNum(Integer pid) {
        List<OrderItem> list = orderMapper.findOrderItemByPid(pid);
        Integer count = 0;
        for (OrderItem o : list) {
            Order order = orderMapper.findByOid(o.getOid());
            if (order.getPayTime() != null) {
                count += o.getNum();
            }
        }
        return count;
    }

    @Override
    public Integer countNumMonth(Integer pid) {
        Calendar calendar = Calendar.getInstance();
        int year = calendar.get(Calendar.YEAR);
        int month = calendar.get(Calendar.MONTH);
        List<OrderItem> list = orderMapper.findOrderItemByPid(pid);
        Integer count = 0;
        for (OrderItem o : list) {
            Order order = orderMapper.findByOid(o.getOid());
            if (order.getPayTime() != null) {
                Calendar cal = Calendar.getInstance();
                cal.setTime(o.getCreatedTime());
                int y = cal.get(Calendar.YEAR);
                int m = cal.get(Calendar.MONTH);
                if (y == year && m == month) {
                    count += o.getNum();
                }
            }
        }
        return count;
    }

    @Override
    public Long countMoney(Integer pid) {
        List<OrderItem> list = orderMapper.findOrderItemByPid(pid);
        long count = 0L;
        for (OrderItem o : list) {
            Order order = orderMapper.findByOid(o.getOid());
            if (order.getPayTime() != null) {
                count += (o.getNum() * o.getPrice());
            }
        }
        return count;
    }

    @Override
    public Long countMoneyMonth(Integer pid) {
        Calendar calendar = Calendar.getInstance();
        int year = calendar.get(Calendar.YEAR);
        int month = calendar.get(Calendar.MONTH);
        List<OrderItem> list = orderMapper.findOrderItemByPid(pid);
        long count = 0L;
        for (OrderItem o : list) {
            Order order = orderMapper.findByOid(o.getOid());
            if (order.getPayTime() != null) {
                Calendar cal = Calendar.getInstance();
                cal.setTime(o.getCreatedTime());
                int y = cal.get(Calendar.YEAR);
                int m = cal.get(Calendar.MONTH);
                if (y == year && m == month) {
                    count += (o.getNum() * o.getPrice());
                }
            }
        }
        return count;
    }

    @Override
    public Order create(Integer aid, Integer uid, String username, Integer[] cids) {
        long totalPrice = 0L;
        List<CartVO> list = cartService.getVOByCid(cids, uid);
        Address address = addressService.getByAid(aid, uid);
        Order order = new Order();
        Date date = new Date();
        for (CartVO c : list) {
            totalPrice += c.getRealPrice() * c.getNum();
        }
        order.setUid(uid);
        order.setRecvName(address.getName());
        order.setRecvPhone(address.getPhone());
        order.setRecvProvince(address.getProvinceName());
        order.setRecvCity(address.getCityName());
        order.setRecvArea(address.getAreaName());
        order.setRecvAddress(address.getAddress());
        order.setStatus(0);
        order.setTotalPrice(totalPrice);
        order.setOrderTime(date);
        order.setCreatedUser(username);
        order.setCreatedTime(date);
        order.setModifiedUser(username);
        order.setModifiedTime(date);
        Integer rows = orderMapper.insertOrder(order);
        if (rows != 1) {
            throw new InsertException("插入数据异常");
        }
        for (CartVO c : list) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOid(order.getOid());
            orderItem.setPid(c.getPid());
            orderItem.setTitle(c.getTitle());
            orderItem.setImage(c.getImage());
            orderItem.setPrice(c.getPrice());
            orderItem.setNum(c.getNum());
            orderItem.setCreatedUser(username);
            orderItem.setCreatedTime(date);
            orderItem.setModifiedUser(username);
            orderItem.setModifiedTime(date);
            rows = orderMapper.insertOrderItem(orderItem);
            if (rows != 1) {
                throw new InsertException("插入数据异常");
            }
        }
        return order;
    }

    @Override
    public Order createByPid(Integer aid, Integer uid, String username, Integer pid, Integer num) {
        Product product = productService.findById(pid);
        Long totalPrice = product.getPrice() * num;
        Address address = addressService.getByAid(aid, uid);
        Order order = new Order();
        Date date = new Date();
        order.setUid(uid);
        order.setRecvName(address.getName());
        order.setRecvPhone(address.getPhone());
        order.setRecvProvince(address.getProvinceName());
        order.setRecvCity(address.getCityName());
        order.setRecvArea(address.getAreaName());
        order.setRecvAddress(address.getAddress());
        order.setStatus(0);
        order.setTotalPrice(totalPrice);
        order.setOrderTime(date);
        order.setCreatedUser(username);
        order.setCreatedTime(date);
        order.setModifiedUser(username);
        order.setModifiedTime(date);
        Integer rows = orderMapper.insertOrder(order);
        if (rows != 1) {
            throw new InsertException("插入数据异常");
        }
        OrderItem orderItem = new OrderItem();
        orderItem.setOid(order.getOid());
        orderItem.setPid(product.getId());
        orderItem.setTitle(product.getTitle());
        orderItem.setImage(product.getImage());
        orderItem.setPrice(product.getPrice());
        orderItem.setNum(num);
        orderItem.setCreatedUser(username);
        orderItem.setCreatedTime(date);
        orderItem.setModifiedUser(username);
        orderItem.setModifiedTime(date);
        rows = orderMapper.insertOrderItem(orderItem);
        if (rows != 1) {
            throw new InsertException("插入数据异常");
        }
        return order;
    }

    @Override
    public Order getByOid(Integer oid, Integer uid) {
        Order result = judgeUserExist(oid, uid);
        Order order = new Order();
        order.setTotalPrice(result.getTotalPrice());
        order.setStatus(result.getStatus());
        return order;
    }

    @Override
    public Order getByOidNoUid(Integer oid) {
        Order result = orderMapper.findByOid(oid);
        if (result == null || result.getStatus().equals(5)) {
            throw new OrderNotFoundException("订单不存在");
        }
        return result;
    }

    @Override
    public Message createMessage(Integer oid, Integer uid, Integer messageType, String username) {
        Order result = judgeUserExist(oid, uid);
        if (messageType == 1) {
            if (!result.getStatus().equals(1)) {
                throw new InsertException("插入数据异常");
            }
        }
        if (messageType == 2) {
            if (!result.getStatus().equals(1) && !result.getStatus().equals(2) && !result.getStatus().equals(3)) {
                throw new InsertException("插入数据异常");
            }
        }
        Message message = new Message();
        Date date = new Date();
        message.setOid(oid);
        message.setMessageType(messageType);
        message.setStatus(1);
        message.setCreatedUser(username);
        message.setModifiedUser(username);
        message.setCreatedTime(date);
        message.setModifiedTime(date);
        Integer rows = orderMapper.insertMessage(message);
        if (rows != 1) {
            throw new InsertException("插入数据异常");
        }
        return message;
    }

    @Override
    public List<Order> getByUid(Integer uid) {
        return orderMapper.findByUid(uid);
    }

    @Override
    public List<Order> getOrderList() {
        return orderMapper.findAll();
    }

    @Override
    public List<OrderItem> getOrderItemByOid(Integer oid) {
        return orderMapper.findOrderItemByOid(oid);
    }

    @Override
    public List<Message> getMessage() {
        return orderMapper.findAllMessage();
    }

    private Order judgeUserExist(Integer oid, Integer uid) {
        Order result = orderMapper.findByOid(oid);
        if (result == null || result.getStatus().equals(5)) {
            throw new OrderNotFoundException("订单不存在");
        }
        if (!result.getUid().equals(uid)) {
            throw new AccessDeniedException("非法数据访问");
        }
        return result;
    }
}