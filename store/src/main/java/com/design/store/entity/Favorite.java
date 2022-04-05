package com.design.store.entity;

public class Favorite extends BaseEntity {
    private Integer fid;
    private Integer uid;
    private Integer pid;

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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Favorite)) return false;
        if (!super.equals(o)) return false;

        Favorite favorite = (Favorite) o;

        if (getFid() != null ? !getFid().equals(favorite.getFid()) : favorite.getFid() != null) return false;
        if (getUid() != null ? !getUid().equals(favorite.getUid()) : favorite.getUid() != null) return false;
        return getPid() != null ? getPid().equals(favorite.getPid()) : favorite.getPid() == null;
    }

    @Override
    public int hashCode() {
        int result = super.hashCode();
        result = 31 * result + (getFid() != null ? getFid().hashCode() : 0);
        result = 31 * result + (getUid() != null ? getUid().hashCode() : 0);
        result = 31 * result + (getPid() != null ? getPid().hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "Favorite{" +
                "fid=" + fid +
                ", uid=" + uid +
                ", pid=" + pid +
                '}';
    }
}