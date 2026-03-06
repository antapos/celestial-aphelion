import java.util.ArrayList;
import java.util.List;

// Simulates our Inventory Management System
public class InventorySimulator {
    private List<ItemBean> inventoryList;

    public InventorySimulator() {
        this.inventoryList = new ArrayList<>();
    }

    // Add an item to the inventory
    public void addItem(ItemBean item) {
        inventoryList.add(item);
        System.out.println("Added to inventory: " + item.getName());
    }

    // Display all items
    public void displayInventory() {
        System.out.println("\n--- Current Inventory ---");
        if (inventoryList.isEmpty()) {
            System.out.println("Inventory is empty.");
        } else {
            for (ItemBean item : inventoryList) {
                System.out.println(item.toString());
            }
        }
        System.out.println("-------------------------\n");
    }

    // Calculate total value of the inventory
    public double calculateTotalValue() {
        double total = 0;
        for (ItemBean item : inventoryList) {
            total += (item.getPrice() * item.getQuantity());
        }
        return total;
    }

    public static void main(String[] args) {
        System.out.println("Starting Inventory Simulator...");
        InventorySimulator simulator = new InventorySimulator();

        // Let's create some Java Beans!
        // Example 1: Using the convenience constructor
        ItemBean laptop = new ItemBean("ITM-001", "High-End Laptop", 10, 1500.00);

        // Example 2: Using the default constructor and setters (The very strict "Java
        // Bean" way)
        ItemBean mouse = new ItemBean();
        mouse.setId("ITM-002");
        mouse.setName("Wireless Mouse");
        mouse.setQuantity(50);
        mouse.setPrice(25.50);

        // Add them to our simulator
        simulator.addItem(laptop);
        simulator.addItem(mouse);

        // Display state
        simulator.displayInventory();

        // Show a calculation based on bean properties
        System.out.printf("Total Inventory Value: $%.2f%n", simulator.calculateTotalValue());
    }
}
