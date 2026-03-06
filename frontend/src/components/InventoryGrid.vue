<script setup>
import { ref, watch, onMounted } from 'vue'
import { showToast } from '../toast'

const props = defineProps(['credential', 'refreshTrigger'])
const emit = defineEmits(['itemsLoaded', 'logout'])

const items = ref([])
const initialLoad = ref(true)
const isFirstFetch = ref(true)

const fetchItems = async () => {
  if (isFirstFetch.value) {
    initialLoad.value = true
  }
  try {
    const response = await fetch('/api/inventory')
    if (!response.ok) throw new Error('Failed to fetch inventory')
    const data = await response.json()
    items.value = data
    emit('itemsLoaded', data)
  } catch (err) {
    showToast('Could not reach backend servers.', 'error')
    items.value = null
  } finally {
    if (isFirstFetch.value) {
      initialLoad.value = false
      isFirstFetch.value = false
    }
  }
}

const handlePurchase = async (id) => {
  if (!props.credential) {
    showToast('Access Denied. Please login to purchase items.', 'error')
    if (window.__focusUsername) window.__focusUsername()
    return
  }

  const qtyInput = document.getElementById(`qty-${id}`)
  const quantity = qtyInput ? parseInt(qtyInput.value) : 1

  if (isNaN(quantity) || quantity < 1) {
    showToast('Invalid quantity amount.', 'error')
    return
  }

  try {
    const response = await fetch(`/api/inventory/${id}/purchase?quantity=${quantity}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${props.credential}`
      }
    })

    if (response.ok) {
      showToast(`Successfully purchased ${quantity}x ${id}!`, 'success')
      await fetchItems()
      if (qtyInput) qtyInput.value = 1
    } else if (response.status === 401) {
      emit('logout')
      showToast('Authentication failed. Invalid username or password.', 'error')
    } else if (response.status === 400) {
      showToast('Transaction Failed: Insufficient stock.', 'error')
    } else {
      throw new Error(`HTTP Error: ${response.status}`)
    }
  } catch (err) {
    showToast('Failed to process transaction over network.', 'error')
  }
}

watch(() => props.refreshTrigger, () => {
  fetchItems()
})

onMounted(() => {
  fetchItems()
})
</script>

<template>
  <div v-if="initialLoad" class="loading-state">
    Connecting to secure database...
  </div>

  <div v-else-if="items === null" class="loading-state">
    Database offline. Did you start the Spring Boot server? <br /><br />
    <code>./mvnw spring-boot:run</code>
  </div>

  <div v-else-if="items.length === 0" class="loading-state">
    Database is empty.
  </div>

  <div v-else class="inventory-grid">
    <div v-for="item in items" :key="item.id" class="item-card glass">
      <div class="item-header">
        <span class="item-id">{{ item.id }}</span>
        <span class="item-price">${{ item.price.toFixed(2) }}</span>
      </div>
      <h4 class="item-name">{{ item.name }}</h4>
      <div class="item-stock">
        <div 
          class="stock-indicator" 
          :class="{ 'out': item.quantity === 0, 'low': item.quantity > 0 && item.quantity <= 10 }"
        ></div>
        <span>{{ item.quantity === 0 ? 'Out of stock' : `${item.quantity} in stock` }}</span>
      </div>
      <div class="card-actions">
        <input 
          type="number" 
          :id="`qty-${item.id}`" 
          class="qty-input" 
          min="1" 
          :max="item.quantity" 
          value="1" 
          :disabled="item.quantity === 0"
        />
        <button 
          class="purchase-btn" 
          :disabled="item.quantity === 0" 
          @click="handlePurchase(item.id)"
        >
          Purchase
        </button>
      </div>
    </div>
  </div>
</template>
