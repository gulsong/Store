package com.design.store.service.impl;

import com.design.store.entity.Address;
import com.design.store.mapper.AddressMapper;
import com.design.store.service.IAddressService;
import com.design.store.service.IDistrictService;
import com.design.store.service.ex.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class AddressServiceImpl implements IAddressService {
    @Value("${user.address.max-count}")
    private Integer maxCount;
    @Autowired
    private AddressMapper addressMapper;
    @Autowired
    private IDistrictService districtService;

    @Override
    public void addNewAddress(Integer uid, String username, Address address) {
        Integer count = addressMapper.countByUid(uid);
        if (count >= maxCount) {
            throw new AddressCountLimitException("收货地址超出上限");
        }
        String provinceName = districtService.getNameByCode(address.getProvinceCode());
        String cityName = districtService.getNameByCode(address.getCityCode());
        String areaName = districtService.getNameByCode(address.getAreaCode());
        address.setProvinceName(provinceName);
        address.setCityName(cityName);
        address.setAreaName(areaName);
        address.setUid(uid);
        Integer isDefault = count == 0 ? 1 : 0;
        address.setIsDefault(isDefault);
        address.setZip(address.getZip().equals("") ? null : address.getZip());
        address.setTel(address.getTel().equals("") ? null : address.getTel());
        address.setTag(address.getTag().equals("") ? null : address.getTag());
        address.setCreatedUser(username);
        address.setModifiedUser(username);
        address.setCreatedTime(new Date());
        address.setModifiedTime(new Date());
        Integer rows = addressMapper.insert(address);
        if (rows != 1) {
            throw new InsertException("插入用户的收货地址产生未知异常");
        }
    }

    @Override
    public void delete(Integer aid, Integer uid, String username) {
        Address result = judgeUserExist(aid, uid);
        Integer rows = addressMapper.deleteByAid(aid);
        if (rows != 1) {
            throw new DeleteException("删除数据产生未知的异常");
        }
        Integer count = addressMapper.countByUid(uid);
        if (count == 0) {
            return;
        }
        if (result.getIsDefault() == 0) {
            return;
        }
        Address address = addressMapper.findLastModified(uid);
        rows = addressMapper.updateDefaultByAid(address.getAid(), username, new Date());
        if (rows != 1) {
            throw new UpdateException("更新数据产生未知的异常");
        }
    }

    @Override
    public void changeAddress(Integer aid, Integer uid, String username, Address address) {
        judgeUserExist(aid, uid);
        String provinceName = districtService.getNameByCode(address.getProvinceCode());
        String cityName = districtService.getNameByCode(address.getCityCode());
        String areaName = districtService.getNameByCode(address.getAreaCode());
        address.setProvinceName(provinceName);
        address.setCityName(cityName);
        address.setAreaName(areaName);
        address.setAid(aid);
        address.setUid(uid);
        address.setZip(address.getZip().equals("") ? null : address.getZip());
        address.setModifiedUser(username);
        address.setModifiedTime(new Date());
        Integer rows = addressMapper.updateAddressByAid(address);
        if (rows < 1) {
            throw new UpdateException("更新数据产生未知的异常");
        }
    }

    @Override
    public void setDefault(Integer aid, Integer uid, String username) {
        judgeUserExist(aid, uid);
        Integer rows = addressMapper.updateNonDefault(uid);
        if (rows < 1) {
            throw new UpdateException("更新数据产生未知的异常");
        }
        rows = addressMapper.updateDefaultByAid(aid, username, new Date());
        if (rows != 1) {
            throw new UpdateException("更新数据产生未知的异常");
        }
    }

    @Override
    public Address getByAid(Integer aid, Integer uid) {
        Address result = judgeUserExist(aid, uid);
        Address address = new Address();
        address.setName(result.getName());
        address.setProvinceCode(result.getProvinceCode());
        address.setProvinceName(result.getProvinceName());
        address.setCityCode(result.getCityCode());
        address.setCityName(result.getCityName());
        address.setAreaCode(result.getAreaCode());
        address.setAreaName(result.getAreaName());
        address.setZip(result.getZip());
        address.setAddress(result.getAddress());
        address.setPhone(result.getPhone());
        address.setTel(result.getTel());
        address.setTag(result.getTag());
        return address;
    }

    @Override
    public List<Address> getByUid(Integer uid) {
        List<Address> list = addressMapper.findByUid(uid);
        for (Address address : list) {
            address.setProvinceCode(null);
            address.setCityCode(null);
            address.setAreaCode(null);
            address.setTel(null);
            address.setIsDefault(null);
            address.setCreatedUser(null);
            address.setCreatedTime(null);
            address.setModifiedUser(null);
            address.setModifiedTime(null);
        }
        return list;
    }

    private Address judgeUserExist(Integer aid, Integer uid) {
        Address result = addressMapper.findByAid(aid);
        if (result == null) {
            throw new AddressNotFoundException("收货地址不存在");
        }
        if (!result.getUid().equals(uid)) {
            throw new AccessDeniedException("非法数据访问");
        }
        return result;
    }
}