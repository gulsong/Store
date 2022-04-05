package com.design.store.controller;

import com.design.store.controller.ex.*;
import com.design.store.entity.Product;
import com.design.store.entity.ProductCategory;
import com.design.store.service.IProductService;
import com.design.store.util.JsonResult;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("products")
public class ProductController extends BaseController {

    public static final int IMAGE_MAX_SIZE = 10 * 1024 * 1024;
    public static final List<String> IMAGE_TYPE = new ArrayList<>();

    static {
        IMAGE_TYPE.add("image/jpeg");
        IMAGE_TYPE.add("image/png");
        IMAGE_TYPE.add("image/bmp");
        IMAGE_TYPE.add("image/gif");
    }

    private final IProductService productService;

    @Autowired
    public ProductController(IProductService productService) {
        this.productService = productService;
    }

    @GetMapping("{id}/details")
    public JsonResult<Product> getById(@PathVariable("id") Integer id) {
        Product data = productService.findById(id);
        return new JsonResult<>(OK, data);
    }

    @RequestMapping("category_list")
    public JsonResult<PageInfo<Product>> getCategoryList(@RequestParam(defaultValue = "1", value = "pageNum") Integer pageNum, @RequestParam(defaultValue = "8", value = "pageSize") Integer pageSize, Integer categoryId) {
        List<Product> list = productService.findByCategoryId(categoryId);
        PageHelper.startPage(pageNum, pageSize);
        PageInfo<Product> data = new PageInfo<>(list);
        data.setPageNum(pageNum);
        data.setPageSize(pageSize);
        data.setPages((int) ((data.getTotal() % pageSize) == 0 ? data.getTotal() / pageSize : (data.getTotal() / pageSize) + 1));
        return new JsonResult<>(OK, data);
    }

    @RequestMapping("search_list")
    public JsonResult<PageInfo<Product>> getSearchList(@RequestParam(defaultValue = "1", value = "pageNum") Integer pageNum, @RequestParam(defaultValue = "8", value = "pageSize") Integer pageSize, String keyword) {
        List<Product> list = productService.findByKeyword(keyword);
        PageHelper.startPage(pageNum, pageSize);
        PageInfo<Product> data = new PageInfo<>(list);
        data.setPageNum(pageNum);
        data.setPageSize(pageSize);
        data.setPages((int) ((data.getTotal() % pageSize) == 0 ? data.getTotal() / pageSize : (data.getTotal() / pageSize) + 1));
        return new JsonResult<>(OK, data);
    }

    @RequestMapping("hot_list")
    public JsonResult<List<Product>> getHotList() {
        List<Product> data = productService.findHotList();
        return new JsonResult<>(OK, data);
    }

    @RequestMapping("new_list")
    public JsonResult<List<Product>> getNewList() {
        List<Product> data = productService.findNewList();
        return new JsonResult<>(OK, data);
    }

    @RequestMapping("categories")
    public JsonResult<List<ProductCategory>> getCategoryList() {
        List<ProductCategory> data = productService.getCategoryList();
        return new JsonResult<>(OK, data);
    }

    @RequestMapping("sale/list")
    public JsonResult<PageInfo<Product>> getCategoryList(@RequestParam(defaultValue = "1", value = "pageNum") Integer pageNum, @RequestParam(defaultValue = "5", value = "pageSize") Integer pageSize, Integer categoryId, Integer status) {
        List<Product> list = productService.findAll();
        if (categoryId != 0) {
            if (status != 0) {
                list = productService.findByCategoryIdAndStatus(categoryId, status);
            } else {
                list = productService.findByCategoryIdAllStatus(categoryId);
            }
        } else {
            if (status != 0) {
                list = productService.findByStatus(status);
            }
        }
        PageHelper.startPage(pageNum, pageSize);
        PageInfo<Product> data = new PageInfo<>(list);
        data.setPageNum(pageNum);
        data.setPageSize(pageSize);
        data.setPages((int) ((data.getTotal() % pageSize) == 0 ? data.getTotal() / pageSize : (data.getTotal() / pageSize) + 1));
        return new JsonResult<>(OK, data);
    }

    @RequestMapping("sale/category")
    public JsonResult<ProductCategory> getCategory(Integer id) {
        ProductCategory data = productService.findCategory(id);
        return new JsonResult<>(OK, data);
    }

    @RequestMapping("sale/set_status")
    public JsonResult<Void> setStatus(Integer id, Integer status, HttpSession session) {
        productService.setStatusById(id, status, getUsernameFromSession(session));
        return new JsonResult<>(OK);
    }

    @RequestMapping("sale/delete")
    public JsonResult<Void> delete(Integer id, HttpSession session) {
        productService.deleteById(id, getUsernameFromSession(session));
        return new JsonResult<>(OK);
    }

    @RequestMapping("sale/set_price")
    public JsonResult<Void> setPrice(Integer id, Long price, HttpSession session) {
        productService.setPrice(id, price, getUsernameFromSession(session));
        return new JsonResult<>(OK);
    }

    @RequestMapping("sale/add_product")
    public JsonResult<Product> addProduct(@RequestParam("title") String title, @RequestParam("price") Long price, @RequestParam("num") Integer num, @RequestParam("categoryId") Integer categoryId, @RequestParam("file") MultipartFile file, HttpSession session) throws FileNotFoundException {
        if (file.isEmpty()) {
            throw new FileEmptyException("文件为空");
        }
        if (file.getSize() > IMAGE_MAX_SIZE) {
            throw new FileSizeException("文件超出限制");
        }
        String contentType = file.getContentType();
        if (!IMAGE_TYPE.contains(contentType)) {
            throw new FileTypeException("文件类型不支持");
        }
        File path = new File(ResourceUtils.getURL("classpath:").getPath());
        if(!path.exists()) {
            path = new File("");
        }
        File upload = new File(path.getAbsolutePath(),"static/images/products/");
        if(!upload.exists()) {
            boolean mkdir =  upload.mkdirs();
            if (!mkdir) {
                throw new FileUploadIOException("文件读写异常");
            }
        }
        String parent= upload.getPath();
        File dir = new File(parent);
        String originalFilename = file.getOriginalFilename();
        assert originalFilename != null;
        int index = originalFilename.lastIndexOf(".");
        String suffix = originalFilename.substring(index);
        String filename = UUID.randomUUID().toString().toUpperCase(Locale.ROOT) + suffix;
        File dest = new File(dir, filename);
        try {
            file.transferTo(dest);
        } catch (FileStateException e) {
            throw new FileStateException("文件状态异常");
        } catch (IOException e) {
            throw new FileUploadIOException("文件读写异常");
        }
        String username = getUsernameFromSession(session);
        String image = "/images/products/" + filename;
        Product product = new Product();
        product.setTitle(title);
        product.setPrice(price);
        product.setNum(num);
        product.setCategoryId(categoryId);
        product.setImage(image);
        Product data = productService.createProduct(product, username);
        return new JsonResult<>(OK, data);
    }

    @RequestMapping("sale/change_product")
    public JsonResult<Void> changeProduct(@RequestParam("id") Integer id, @RequestParam("title") String title, @RequestParam("price") Long price, @RequestParam("num") Integer num, @RequestParam("categoryId") Integer categoryId, @RequestParam("priority") Integer priority, @RequestParam("file") MultipartFile file, HttpSession session) throws FileNotFoundException {
        String image = null;
        if (!file.isEmpty()) {
            if (file.getSize() > IMAGE_MAX_SIZE) {
                throw new FileSizeException("文件超出限制");
            }
            String contentType = file.getContentType();
            if (!IMAGE_TYPE.contains(contentType)) {
                throw new FileTypeException("文件类型不支持");
            }
            File path = new File(ResourceUtils.getURL("classpath:").getPath());
            if(!path.exists()) {
                path = new File("");
            }
            File upload = new File(path.getAbsolutePath(),"static/images/products/");
            if(!upload.exists()) {
                boolean mkdir =  upload.mkdirs();
                if (!mkdir) {
                    throw new FileUploadIOException("文件读写异常");
                }
            }
            String parent= upload.getPath();
            File dir = new File(parent);
            String originalFilename = file.getOriginalFilename();
            assert originalFilename != null;
            int index = originalFilename.lastIndexOf(".");
            String suffix = originalFilename.substring(index);
            String filename = UUID.randomUUID().toString().toUpperCase(Locale.ROOT) + suffix;
            File dest = new File(dir, filename);
            try {
                file.transferTo(dest);
            } catch (FileStateException e) {
                throw new FileStateException("文件状态异常");
            } catch (IOException e) {
                throw new FileUploadIOException("文件读写异常");
            }
            image = "/images/products/" + filename;
        }
        String username = getUsernameFromSession(session);
        Product product = new Product();
        product.setTitle(title);
        product.setPrice(price);
        product.setNum(num);
        product.setCategoryId(categoryId);
        product.setPriority(priority);
        product.setImage(image);
        productService.changeProduct(id, username, product);
        return new JsonResult<>(OK);
    }

    @RequestMapping("sale/product_info")
    public JsonResult<Product> getProductInfo(Integer id) {
        Product data = productService.findInfoById(id);
        return new JsonResult<>(OK, data);
    }

    @RequestMapping("sale/search_list")
    public JsonResult<PageInfo<Product>> getSaleSearchList(@RequestParam(defaultValue = "1", value = "pageNum") Integer pageNum, @RequestParam(defaultValue = "5", value = "pageSize") Integer pageSize, String keyword) {
        List<Product> list = productService.findByKeywordAllStatus(keyword);
        PageHelper.startPage(pageNum, pageSize);
        PageInfo<Product> data = new PageInfo<>(list);
        data.setPageNum(pageNum);
        data.setPageSize(pageSize);
        data.setPages((int) ((data.getTotal() % pageSize) == 0 ? data.getTotal() / pageSize : (data.getTotal() / pageSize) + 1));
        return new JsonResult<>(OK, data);
    }

}