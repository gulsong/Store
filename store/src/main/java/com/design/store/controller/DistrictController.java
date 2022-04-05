package com.design.store.controller;

import com.design.store.entity.District;
import com.design.store.service.IDistrictService;
import com.design.store.util.JsonResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping("districts")
@RestController
public class DistrictController extends BaseController {
    private final IDistrictService districtService;

    @Autowired
    public DistrictController(IDistrictService districtService) {
        this.districtService = districtService;
    }

    @RequestMapping({"/", ""})
    public JsonResult<List<District>> getByParent(String parent) {
        List<District> data = districtService.getByParent(parent);
        return new JsonResult<>(OK, data);
    }
}