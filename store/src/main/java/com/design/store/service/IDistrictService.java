package com.design.store.service;

import com.design.store.entity.District;

import java.util.List;

public interface IDistrictService {
    String getNameByCode(String code);

    List<District> getByParent(String parent);
}