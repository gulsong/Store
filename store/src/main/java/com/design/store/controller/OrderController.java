package com.design.store.controller;

import com.design.store.entity.Message;
import com.design.store.entity.Order;
import com.design.store.entity.OrderItem;
import com.design.store.service.IOrderService;
import com.design.store.util.JsonResult;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;
import java.util.List;

@RequestMapping("orders")
@RestController
public class OrderController extends BaseController {
    private final IOrderService orderService;

    @Autowired
    public OrderController(IOrderService orderService) {
        this.orderService = orderService;
    }

    @RequestMapping("create")
    public JsonResult<Order> create(Integer aid, Integer[] cids, HttpSession session) {
        Integer uid = getuidFromSession(session);
        String username = getUsernameFromSession(session);
        Order data = orderService.create(aid, uid, username, cids);
        return new JsonResult<>(OK, data);
    }

    @RequestMapping("create_by_pid")
    public JsonResult<Order> createByPid(Integer aid, Integer pid, Integer num, HttpSession session) {
        Integer uid = getuidFromSession(session);
        String username = getUsernameFromSession(session);
        Order data = orderService.createByPid(aid, uid, username, pid, num);
        return new JsonResult<>(OK, data);
    }

    @RequestMapping("get_by_oid")
    public JsonResult<Order> getByOid(Integer oid, HttpSession session) {
        Order data = orderService.getByOid(oid, getuidFromSession(session));
        return new JsonResult<>(OK, data);
    }

    @RequestMapping("set_pay")
    public JsonResult<Void> setPay(Integer oid, HttpSession session) {
        orderService.setPay(oid, getuidFromSession(session), getUsernameFromSession(session));
        return new JsonResult<>(OK);
    }

    @RequestMapping("reduce_product_num")
    public JsonResult<Void> reduceProductNum(Integer oid, HttpSession session) {
        orderService.reduceProductNum(oid, getUsernameFromSession(session));
        return new JsonResult<>(OK);
    }

    @RequestMapping("get_by_uid")
    public JsonResult<List<Order>> getByUid(HttpSession session) {
        List<Order> data = orderService.getByUid(getuidFromSession(session));
        return new JsonResult<>(OK, data);
    }

    @RequestMapping("{oid}/get_order_item")
    public JsonResult<List<OrderItem>> getOrderItem(@PathVariable("oid") Integer oid) {
        List<OrderItem> data = orderService.getOrderItemByOid(oid);
        return new JsonResult<>(OK, data);
    }

    @RequestMapping("set_finish")
    public JsonResult<Void> setFinish(Integer oid, HttpSession session) {
        orderService.setFinish(oid, getuidFromSession(session), getUsernameFromSession(session));
        return new JsonResult<>(OK);
    }

    @RequestMapping("set_delete")
    public JsonResult<Void> setDelete(Integer oid, HttpSession session) {
        orderService.setDelete(oid, getuidFromSession(session), getUsernameFromSession(session));
        return new JsonResult<>(OK);
    }

    @RequestMapping("set_cancel")
    public JsonResult<Void> setCancel(Integer oid, HttpSession session) {
        orderService.setCancel(oid, getuidFromSession(session), getUsernameFromSession(session));
        return new JsonResult<>(OK);
    }

    @RequestMapping("add_product_priority")
    public JsonResult<Void> addProductPriority(Integer oid, HttpSession session) {
        orderService.addProductPriority(oid, getUsernameFromSession(session));
        return new JsonResult<>(OK);
    }

    @RequestMapping("message/create")
    public JsonResult<Message> createMessage(Integer oid, Integer messageType, HttpSession session) {
        Message data = orderService.createMessage(oid, getuidFromSession(session), messageType, getUsernameFromSession(session));
        return new JsonResult<>(OK, data);
    }

    @RequestMapping("message/delete")
    public JsonResult<Void> deleteMessage(Integer id) {
        orderService.deleteMessage(id);
        return new JsonResult<>(OK);
    }

    @RequestMapping("message/finish")
    public JsonResult<Void> setMessageFinish(Integer id, HttpSession session) {
        orderService.setMessageFinish(id, getUsernameFromSession(session));
        return new JsonResult<>(OK);
    }

    @RequestMapping("message/list")
    public JsonResult<PageInfo<Message>> getMessageList(@RequestParam(defaultValue = "1", value = "pageNum") Integer pageNum, @RequestParam(defaultValue = "11", value = "pageSize") Integer pageSize) {
        List<Message> list = orderService.getMessage();
        PageHelper.startPage(pageNum, pageSize);
        PageInfo<Message> data = new PageInfo<>(list);
        data.setPageNum(pageNum);
        data.setPageSize(pageSize);
        data.setPages((int) ((data.getTotal() % pageSize) == 0 ? data.getTotal() / pageSize : (data.getTotal() / pageSize) + 1));
        return new JsonResult<>(OK, data);
    }

    @RequestMapping("sale/orders_list")
    public JsonResult<PageInfo<Order>> getOrderList(@RequestParam(defaultValue = "1", value = "pageNum") Integer pageNum, @RequestParam(defaultValue = "15", value = "pageSize") Integer pageSize) {
        List<Order> list = orderService.getOrderList();
        PageHelper.startPage(pageNum, pageSize);
        PageInfo<Order> data = new PageInfo<>(list);
        data.setPageNum(pageNum);
        data.setPageSize(pageSize);
        data.setPages((int) ((data.getTotal() % pageSize) == 0 ? data.getTotal() / pageSize : (data.getTotal() / pageSize) + 1));
        return new JsonResult<>(OK, data);
    }

    @RequestMapping("sale/get_by_oid")
    public JsonResult<Order> saleGetByOid(Integer oid) {
        Order data = orderService.getByOidNoUid(oid);
        return new JsonResult<>(OK, data);
    }

    @RequestMapping("sale/set_send")
    public JsonResult<Void> setSend(Integer oid, HttpSession session) {
        orderService.setSend(oid, getUsernameFromSession(session));
        return new JsonResult<>(OK);
    }

    @RequestMapping("sale/set_refund")
    public JsonResult<Void> setRefund(Integer oid, HttpSession session) {
        orderService.setRefund(oid, getUsernameFromSession(session));
        return new JsonResult<>(OK);
    }

    @RequestMapping("sale/set_delete")
    public JsonResult<Void> saleSetDelete(Integer oid, HttpSession session) {
        orderService.setDeleteNoUid(oid, getUsernameFromSession(session));
        return new JsonResult<>(OK);
    }

    @RequestMapping("sale/count_mun")
    public JsonResult<Integer> countNum(Integer pid) {
        Integer data = orderService.countNum(pid);
        return new JsonResult<>(OK, data);
    }

    @RequestMapping("sale/count_mun_month")
    public JsonResult<Integer> countNumMonth(Integer pid) {
        Integer data = orderService.countNumMonth(pid);
        return new JsonResult<>(OK, data);
    }

    @RequestMapping("sale/count_money")
    public JsonResult<Long> countMoney(Integer pid) {
        Long data = orderService.countMoney(pid);
        return new JsonResult<>(OK, data);
    }

    @RequestMapping("sale/count_money_month")
    public JsonResult<Long> countMoneyMonth(Integer pid) {
        Long data = orderService.countMoneyMonth(pid);
        return new JsonResult<>(OK, data);
    }
}