package com.design.store.vo;

import java.io.Serializable;

public class FavoriteVO implements Serializable {
    private Integer fid;
    private Integer uid;
    private Integer pid;
    private Long price;
    private String title;
    private String image;

    public Integer getFid() {
        return fid;
    }

    public void setFid(Integer fid) {
        this.fid = fid;
    }

    public Integer getUid() {
        return uid;
    }

    public void setUid(Integer uid) {
        this.uid = uid;
    }

    public Integer getPid() {
        return pid;
    }

    public void setPid(Integer pid) {
        this.pid = pid;
    }

    public Long getPrice() {
        return price;
    }

    public void setPrice(Long price) {
        this.price = price;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof FavoriteVO)) return false;

        FavoriteVO that = (FavoriteVO) o;

        if (getFid() != null ? !getFid().equals(that.getFid()) : that.getFid() != null) return false;
        if (getUid() != null ? !getUid().equals(that.getUid()) : that.getUid() != null) return false;
        if (getPid() != null ? !getPid().equals(that.getPid()) : that.getPid() != null) return false;
        if (getPrice() != null ? !getPrice().equals(that.getPrice()) : that.getPrice() != null) return false;
        if (getTitle() != null ? !getTitle().equals(that.getTitle()) : that.getTitle() != null) return false;
        return getImage() != null ? getImage().equals(that.getImage()) : that.getImage() == null;
    }

    @Override
    public int hashCode() {
        int result = getFid() != null ? getFid().hashCode() : 0;
        result = 31 * result + (getUid() != null ? getUid().hashCode() : 0);
        result = 31 * result + (getPid() != null ? getPid().hashCode() : 0);
        result = 31 * result + (getPrice() != null ? getPrice().hashCode() : 0);
        result = 31 * result + (getTitle() != null ? getTitle().hashCode() : 0);
        result = 31 * result + (getImage() != null ? getImage().hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "FavoriteVO{" +
                "fid=" + fid +
                ", uid=" + uid +
                ", pid=" + pid +
                ", price=" + price +
                ", title='" + title + '\'' +
                ", image='" + image + '\'' +
                '}';
    }
}