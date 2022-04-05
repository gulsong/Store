package com.design.store.entity;

public class Message extends BaseEntity {
    private Integer id;
    private Integer oid;
    private Integer messageType;
    private Integer status;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getOid() {
        return oid;
    }

    public void setOid(Integer oid) {
        this.oid = oid;
    }

    public Integer getMessageType() {
        return messageType;
    }

    public void setMessageType(Integer messageType) {
        this.messageType = messageType;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Message)) return false;
        if (!super.equals(o)) return false;

        Message message = (Message) o;

        if (getId() != null ? !getId().equals(message.getId()) : message.getId() != null) return false;
        if (getOid() != null ? !getOid().equals(message.getOid()) : message.getOid() != null) return false;
        if (getMessageType() != null ? !getMessageType().equals(message.getMessageType()) : message.getMessageType() != null)
            return false;
        return getStatus() != null ? getStatus().equals(message.getStatus()) : message.getStatus() == null;
    }

    @Override
    public int hashCode() {
        int result = super.hashCode();
        result = 31 * result + (getId() != null ? getId().hashCode() : 0);
        result = 31 * result + (getOid() != null ? getOid().hashCode() : 0);
        result = 31 * result + (getMessageType() != null ? getMessageType().hashCode() : 0);
        result = 31 * result + (getStatus() != null ? getStatus().hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "Message{" +
                "id=" + id +
                ", oid=" + oid +
                ", messageType=" + messageType +
                ", status=" + status +
                '}';
    }
}