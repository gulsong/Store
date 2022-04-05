package com.design.store.mapper;

import com.design.store.entity.Address;
import org.apache.ibatis.annotations.Param;

import java.util.Date;
import java.util.List;

public interface AddressMapper {
    Integer insert(Address address);

    Integer deleteByAid(Integer aid);

    Integer updateAddressByAid(Address address);

    Integer updateNonDefault(Integer uid);

    Integer updateDefaultByAid(@Param("aid") Integer aid, @Param("modifiedUser") String modifiedUser, @Param("modifiedTime") Date modifiedTime);

    Integer countByUid(Integer uid);

    Address findByAid(Integer aid);

    Address findLastModified(Integer uid);

    List<Address> findByUid(Integer uid);
}