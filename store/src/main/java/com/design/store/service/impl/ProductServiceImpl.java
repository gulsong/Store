package com.design.store.service.impl;

import com.design.store.entity.Product;
import com.design.store.entity.ProductCategory;
import com.design.store.mapper.ProductMapper;
import com.design.store.service.IProductService;
import com.design.store.service.ex.InsertException;
import com.design.store.service.ex.ProductNotEnoughException;
import com.design.store.service.ex.ProductNotFoundException;
import com.design.store.service.ex.UpdateException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class ProductServiceImpl implements IProductService {
    private final ProductMapper productMapper;

    @Autowired
    public ProductServiceImpl(ProductMapper productMapper) {
        this.productMapper = productMapper;
    }

    @Override
    public void deleteById(Integer id, String username) {
        Product result = productMapper.findById(id);
        if (result == null || result.getStatus().equals(3)) {
            throw new ProductNotFoundException("尝试访问的商品数据不存在");
        }
        Integer rows = productMapper.updateStatusById(id, 3, username, new Date());
        if (rows != 1) {
            throw new UpdateException("更新数据时产生未知的异常");
        }
    }

    @Override
    public void changeProduct(Integer id, String username, Product product) {
        Product result = productMapper.findById(id);
        if (result == null || result.getStatus().equals(3)) {
            throw new ProductNotFoundException("尝试访问的商品数据不存在");
        }
        product.setId(id);
        product.setModifiedUser(username);
        product.setModifiedTime(new Date());
        Integer rows = productMapper.updateProductById(product);
        if (rows < 1) {
            throw new UpdateException("更新数据产生未知的异常");
        }
    }

    @Override
    public void reduceNum(Integer id, Integer num, String username) {
        Product result = productMapper.findById(id);
        if (result == null || result.getStatus().equals(3)) {
            throw new ProductNotFoundException("尝试访问的商品数据不存在");
        }
        if (result.getNum() < num) {
            throw new ProductNotEnoughException("商品库存不足");
        }
        Integer rows = productMapper.updateNumById(id, result.getNum() - num, username, new Date());
        if (rows != 1) {
            throw new UpdateException("更新数据时产生未知的异常");
        }
    }

    @Override
    public void addPriority(Integer id, Integer priority, String username) {
        Product result = productMapper.findById(id);
        if (result == null || result.getStatus().equals(3)) {
            throw new ProductNotFoundException("尝试访问的商品数据不存在");
        }
        Integer rows = productMapper.updatePriorityById(id, result.getPriority() + priority, username, new Date());
        if (rows != 1) {
            throw new UpdateException("更新数据时产生未知的异常");
        }
    }

    @Override
    public void setPrice(Integer id, Long price, String username) {
        Product result = productMapper.findById(id);
        if (result == null || result.getStatus().equals(3)) {
            throw new ProductNotFoundException("尝试访问的商品数据不存在");
        }
        Integer rows = productMapper.updatePrice(id, price, username, new Date());
        if (rows != 1) {
            throw new UpdateException("更新数据时产生未知的异常");
        }
    }

    @Override
    public void setStatusById(Integer id, Integer status, String username) {
        Product result = productMapper.findById(id);
        if (result == null || result.getStatus().equals(3)) {
            throw new ProductNotFoundException("尝试访问的商品数据不存在");
        }
        Integer rows = productMapper.updateStatusById(id, status, username, new Date());
        if (rows != 1) {
            throw new UpdateException("更新数据时产生未知的异常");
        }
    }

    @Override
    public Product createProduct(Product product, String username) {
        Date date = new Date();
        product.setStatus(2);
        product.setPriority(50);
        product.setCreatedUser(username);
        product.setCreatedTime(date);
        product.setModifiedUser(username);
        product.setModifiedTime(date);
        Integer rows = productMapper.insert(product);
        if (rows != 1) {
            throw new InsertException("插入数据异常");
        }
        return product;
    }

    @Override
    public Product findById(Integer id) {
        Product product = productMapper.findById(id);
        if (product == null || product.getStatus().equals(3)) {
            throw new ProductNotFoundException("尝试访问的商品数据不存在");
        }
        product.setPriority(null);
        product.setCreatedUser(null);
        product.setCreatedTime(null);
        product.setModifiedUser(null);
        product.setModifiedTime(null);
        return product;
    }

    @Override
    public Product findInfoById(Integer id) {
        Product product = productMapper.findById(id);
        if (product == null || product.getStatus().equals(3)) {
            throw new ProductNotFoundException("尝试访问的商品数据不存在");
        }
        return product;
    }

    @Override
    public ProductCategory findCategory(Integer id) {
        return productMapper.findCategory(id);
    }

    @Override
    public List<Product> findAll() {
        return productMapper.findAll();
    }

    @Override
    public List<Product> findByCategoryId(Integer categoryId) {
        List<Product> list = productMapper.findByCategoryId(categoryId);
        return setProductList(list);
    }

    @Override
    public List<Product> findByCategoryIdAllStatus(Integer categoryId) {
        return productMapper.findByCategoryIdAllStatus(categoryId);
    }

    @Override
    public List<Product> findByStatus(Integer status) {
        return productMapper.findByStatus(status);
    }

    @Override
    public List<Product> findByCategoryIdAndStatus(Integer categoryId, Integer status) {
        return productMapper.findByCategoryIdAndStatus(categoryId, status);
    }

    @Override
    public List<Product> findByKeyword(String keyword) {
        List<Product> list = productMapper.findByKeyword(keyword);
        return setProductList(list);
    }

    @Override
    public List<Product> findByKeywordAllStatus(String keyword) {
        return productMapper.findByKeywordAllStatus(keyword);
    }

    @Override
    public List<Product> findHotList() {
        List<Product> list = productMapper.findHotList();
        return setProductList(list);
    }

    @Override
    public List<Product> findNewList() {
        List<Product> list = productMapper.findNewList();
        return setProductList(list);
    }

    @Override
    public List<ProductCategory> getCategoryList() {
        return productMapper.getCategoryList();
    }

    private List<Product> setProductList(List<Product> list) {
        for (Product product : list) {
            product.setPriority(null);
            product.setCreatedUser(null);
            product.setCreatedTime(null);
            product.setModifiedUser(null);
            product.setModifiedTime(null);
        }
        return list;
    }
}