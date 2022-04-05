package com.design.store.mapper;

import com.design.store.entity.District;

import java.util.List;

public interface DistrictMapper {
    String findNameByCode(String code);

    List<District> findByParent(String parent);
}