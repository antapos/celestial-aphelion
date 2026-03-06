package com.example.springinventory;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// @WebMvcTest tells Spring to only load the web layer (Controllers), 
// not the whole application context or database. This makes tests fast!
@WebMvcTest(InventoryController.class)
public class InventoryControllerTest {

    // MockMvc lets us send fake HTTP requests directly to our Controller
    @Autowired
    private MockMvc mockMvc;

    // We mock the service layer because we are only testing the controller here.
    @MockBean
    private InventoryService inventoryService;

    @Test
    @WithMockUser(username = "admin", roles = { "ADMIN" })
    public void purchaseItem_Success_Returns200() throws Exception {
        // Arrange: We must tell the mock service to return a Success record now
        ItemDTO mockDTO = new ItemDTO("ITM-001", "Mock Laptop", 8, 1500.0);
        when(inventoryService.purchaseItem("ITM-001", 2)).thenReturn(new PurchaseResult.Success(mockDTO));

        // Act & Assert
        mockMvc.perform(post("/api/inventory/ITM-001/purchase")
                .param("quantity", "2")
                .with(csrf()))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "admin", roles = { "ADMIN" })
    public void purchaseItem_InsufficientStock_Returns400() throws Exception {
        // Arrange: Return the OutOfStock record instead of throwing an exception
        when(inventoryService.purchaseItem("ITM-001", 100))
                .thenReturn(new PurchaseResult.OutOfStock("ITM-001", 10));

        // Act & Assert
        mockMvc.perform(post("/api/inventory/ITM-001/purchase")
                .param("quantity", "100")
                .with(csrf()))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Only 10 items left in stock!"));
    }

    @Test
    public void purchaseItem_Unauthenticated_Returns401() throws Exception {
        mockMvc.perform(post("/api/inventory/ITM-001/purchase")
                .param("quantity", "2")
                .with(csrf()))
                .andExpect(status().isUnauthorized());
    }
}
