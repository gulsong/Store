package com.design.store.mapper;

import com.design.store.entity.Product;
import com.design.store.entity.ProductCategory;

import java.util.Date;
import java.util.List;

public interface ProductMapper {
    Integer insert(Product product);

    Integer updateProductById(Product product);

    Integer updateNumById(Integer id, Integer num, String modifiedUser, Date modifiedTime);

    Integer updatePriorityById(Integer id, Integer priority, String modifiedUser, Date modifiedTime);

    Integer updateStatusById(Integer id, Integer status, String modifiedUser, Date modifiedTime);

    Integer updatePrice(Integer id, Long price, String modifiedUser, Date modifiedTime);

    Product findById(Integer id);

    ProductCategory findCategory(Integer id);

    List<Product> findAll();

    List<Product> findByCategoryId(Integer categoryId);

    List<Product> findByCategoryIdAllStatus(Integer categoryId);

    List<Product> findByStatus(Integer status);

    List<Product> findByCategoryIdAndStatus(Integer categoryId, Integer status);

    List<Product> findByKeyword(String keyword);

    List<Product> findByKeywordAllStatus(String keyword);

    List<Product> findHotList();

    List<Product> findNewList();

    List<ProductCategory> getCategoryList();
}