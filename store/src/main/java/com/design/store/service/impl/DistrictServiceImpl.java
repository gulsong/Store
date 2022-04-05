package com.design.store.service.impl;

import com.design.store.entity.District;
import com.design.store.mapper.DistrictMapper;
import com.design.store.service.IDistrictService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DistrictServiceImpl implements IDistrictService {
    private final DistrictMapper districtMapper;

    @Autowired
    public DistrictServiceImpl(DistrictMapper districtMapper) {
        this.districtMapper = districtMapper;
    }

    @Override
    public String getNameByCode(String code) {
        return districtMapper.findNameByCode(code);
    }

    @Override
    public List<District> getByParent(String parent) {
        List<District> list = districtMapper.findByParent(parent);
        for (District d : list) {
            d.setId(null);
            d.setParent(null);
        }
        return list;
    }
}