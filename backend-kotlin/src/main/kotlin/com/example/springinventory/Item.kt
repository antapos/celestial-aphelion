package com.example.springinventory

import jakarta.persistence.Entity
import jakarta.persistence.Id

@Entity
data class Item(
    @Id
    val id: String,
    val name: String,
    var quantity: Int,
    val price: Double
)
