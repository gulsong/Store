package com.design.store.service;

import com.design.store.entity.Address;

import java.util.List;

public interface IAddressService {
    void addNewAddress(Integer uid, String username, Address address);

    void delete(Integer aid, Integer uid, String username);

    void changeAddress(Integer aid, Integer uid, String username, Address address);

    void setDefault(Integer aid, Integer uid, String username);

    Address getByAid(Integer aid, Integer uid);

    List<Address> getByUid(Integer uid);
}