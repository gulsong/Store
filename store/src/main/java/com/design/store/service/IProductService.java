package com.design.store.service;

import com.design.store.entity.Product;
import com.design.store.entity.ProductCategory;

import java.util.List;

public interface IProductService {
    void deleteById(Integer id, String username);

    void changeProduct(Integer id, String username, Product product);

    void reduceNum(Integer id, Integer num, String username);

    void addPriority(Integer id, Integer priority, String username);

    void setPrice(Integer id, Long price, String username);

    void setStatusById(Integer id, Integer status, String username);

    Product createProduct(Product product, String username);

    Product findById(Integer id);

    Product findInfoById(Integer id);

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