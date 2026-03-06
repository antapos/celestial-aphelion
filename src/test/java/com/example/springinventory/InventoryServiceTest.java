package com.example.springinventory;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

// We use MockitoExtension to enable the @Mock annotations
@ExtendWith(MockitoExtension.class)
public class InventoryServiceTest {

    // We mock the database layer. We不要 want to actually hit a real DB during unit
    // tests!
    @Mock
    private ItemRepository itemRepository;

    // InjectMocks tells Mockito to create our Service and inject the Mock
    // repository into it
    @InjectMocks
    private InventoryService inventoryService;

    private ItemBean testItem;

    @BeforeEach
    public void setUp() {
        // Runs before every single @Test to ensure a clean state
        testItem = new ItemBean("ITM-T1", "Test Item", 10, 100.00);
    }

    @Test
    public void purchaseItem_WithSufficientStock_ReturnsSuccess() {
        // Arrange
        when(itemRepository.findById("ITM-T1")).thenReturn(Optional.of(testItem));

        // Act
        PurchaseResult result = inventoryService.purchaseItem("ITM-T1", 3);

        // Assert
        assertEquals(PurchaseResult.Success.class, result.getClass());
        assertEquals(7, testItem.getQuantity(), "Quantity should be reduced by 3");
        verify(itemRepository, times(1)).save(testItem);
    }

    @Test
    public void purchaseItem_WithInsufficientStock_ReturnsOutOfStock() {
        // Arrange
        when(itemRepository.findById("ITM-T1")).thenReturn(Optional.of(testItem));

        // Act
        PurchaseResult result = inventoryService.purchaseItem("ITM-T1", 15);

        // Assert
        assertEquals(PurchaseResult.OutOfStock.class, result.getClass());
        verify(itemRepository, never()).save(testItem);
        assertEquals(10, testItem.getQuantity(), "Quantity should remain unchanged");
    }

    @Test
    public void purchaseItem_ItemNotFound_ReturnsNotFound() {
        // Arrange
        when(itemRepository.findById("INVALID")).thenReturn(Optional.empty());

        // Act
        PurchaseResult result = inventoryService.purchaseItem("INVALID", 1);

        // Assert
        assertEquals(PurchaseResult.NotFound.class, result.getClass());
    }
}
