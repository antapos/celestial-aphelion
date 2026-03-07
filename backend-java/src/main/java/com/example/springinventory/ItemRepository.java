package com.example.springinventory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// Spring Data JPA makes it incredibly easy to create data access layers.
// By simply extending JpaRepository and specifying our Entity (ItemBean) 
// and the type of its Primary Key (String), Spring automatically generates
// all the standard CRUD (Create, Read, Update, Delete) operations for us!
@Repository
public interface ItemRepository extends JpaRepository<ItemBean, String> {
    // We don't even need to write any methods here for basic operations.
    // Spring provides findAll(), findById(), save(), delete(), etc., out of the
    // box.
}
