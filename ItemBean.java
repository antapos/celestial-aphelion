// Represents a single Item in our inventory.
// This follows the standard Java Bean convention:
// 1. Private properties
// 2. Public No-Argument Constructor
// 3. Public Getters/Setters

public class ItemBean {
    private String id;
    private String name;
    private int quantity;
    private double price;

    // Default No-Argument Constructor
    public ItemBean() {
    }

    // Convenience Constructor
    public ItemBean(String id, String name, int quantity, double price) {
        this.id = id;
        this.name = name;
        this.quantity = quantity;
        this.price = price;
    }

    // Getters and Setters
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

    @Override
    public String toString() {
        return String.format("Item[id='%s', name='%s', quantity=%d, price=$%.2f]",
                id, name, quantity, price);
    }
}
