package com.example.springinventory;

public record ItemDTO(String id,String name,int quantity,double price){public static ItemDTO fromEntity(ItemBean bean){return new ItemDTO(bean.getId(),bean.getName(),bean.getQuantity(),bean.getPrice());}}
