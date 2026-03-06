package com.example.springinventory;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

// @Entity tells Spring Data JPA that this class represents a database table.
// @Table(name = "items") explicitly names the table.
@Entity
@Table(name = "items")
public class ItemBean {

    // @Id marks this field as the Primary Key in the database
    @Id
    private String id;
    private String name;
    private int quantity;
    private double price;

    // JPA requires a no-argument constructor
    public ItemBean() {
    }

    public ItemBean(String id, String name, int quantity, double price) {
        this.id = id;
        this.name = name;
        this.quantity = quantity;
        this.price = price;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }
}
