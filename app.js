// Cart Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Load Menu from Firebase
function loadMenu() {
    const menuContainer = document.getElementById('menuContainer');
    
    database.ref('menu').once('value', (snapshot) => {
        menuContainer.innerHTML = '';
        const menu = snapshot.val();
        
        if (!menu) {
            menuContainer.innerHTML = '<p class="loading">Menu not available yet</p>';
            return;
        }
        
        Object.keys(menu).forEach(itemId => {
            const item = menu[itemId];
            const menuItemHTML = `
                <div class="menu-item">
                    <div class="menu-item-image">${item.emoji || '🍽️'}</div>
                    <div class="menu-item-content">
                        <div class="menu-item-name">${item.name}</div>
                        <div class="menu-item-description">${item.description}</div>
                        <div class="menu-item-price">${businessConfig.currency}${item.price}</div>
                        <div class="menu-item-quantity">
                            <button class="quantity-btn" onclick="decreaseQty('qty-${itemId}')">−</button>
                            <input type="number" id="qty-${itemId}" class="quantity-input" value="1" min="1">
                            <button class="quantity-btn" onclick="increaseQty('qty-${itemId}')">+</button>
                        </div>
                        <button class="add-to-cart-btn" onclick="addToCart('${itemId}', '${item.name}', ${item.price})">Add to Cart</button>
                    </div>
                </div>
            `;
            menuContainer.innerHTML += menuItemHTML;
        });
    }).catch(error => {
        console.error('Error loading menu:', error);
        menuContainer.innerHTML = `
            <div class="loading" style="grid-column: 1/-1;">
                <p>Unable to load menu. Please refresh the page.</p>
                <p style="font-size: 0.9rem; color: #999; margin-top: 1rem;">
                    Make sure your Firebase database is set up with menu items.
                </p>
            </div>
        `;
    });
}

// Quantity Controls
function increaseQty(inputId) {
    const input = document.getElementById(inputId);
    input.value = parseInt(input.value) + 1;
}

function decreaseQty(inputId) {
    const input = document.getElementById(inputId);
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

// Add to Cart
function addToCart(itemId, itemName, itemPrice) {
    const qty = parseInt(document.getElementById(`qty-${itemId}`).value);
    
    // Check if item already in cart
    const existingItem = cart.find(item => item.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += qty;
    } else {
        cart.push({
            id: itemId,
            name: itemName,
            price: itemPrice,
            quantity: qty
        });
    }
    
    saveCart();
    updateCartDisplay();
    showNotification(`Added ${qty} x ${itemName} to cart!`);
}

// Remove from Cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    updateCartDisplay();
}

// Clear Cart
function clearCart() {
    if (cart.length === 0) {
        alert('Cart is already empty');
        return;
    }
    
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        saveCart();
        updateCartDisplay();
        showNotification('Cart cleared');
    }
}

// Save Cart to Local Storage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update Cart Display
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">No items in cart</p>';
        document.getElementById('subtotal').textContent = businessConfig.currency + '0';
        document.getElementById('tax').textContent = businessConfig.currency + '0';
        document.getElementById('total').textContent = businessConfig.currency + '0';
        return;
    }
    
    let cartHTML = '';
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        cartHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-qty">Qty: ${item.quantity} x ${businessConfig.currency}${item.price}</div>
                </div>
                <div class="cart-item-price">${businessConfig.currency}${itemTotal}</div>
                <button class="remove-btn" onclick="removeFromCart('${item.id}')">Remove</button>
            </div>
        `;
    });
    
    cartItems.innerHTML = cartHTML;
    
    const tax = subtotal * businessConfig.taxRate;
    const total = subtotal + tax;
    
    document.getElementById('subtotal').textContent = businessConfig.currency + subtotal.toFixed(2);
    document.getElementById('tax').textContent = businessConfig.currency + tax.toFixed(2);
    document.getElementById('total').textContent = businessConfig.currency + total.toFixed(2);
}

// Checkout - Generate WhatsApp Message
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }
    
    // Build order message
    let message = `*Order from ${businessConfig.name}*\n\n`;
    message += `*Items:*\n`;
    
    let subtotal = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        message += `• ${item.name} x${item.quantity} = ${businessConfig.currency}${itemTotal}\n`;
    });
    
    const tax = subtotal * businessConfig.taxRate;
    const total = subtotal + tax;
    
    message += `\n*Subtotal:* ${businessConfig.currency}${subtotal.toFixed(2)}\n`;
    message += `*Tax (5%):* ${businessConfig.currency}${tax.toFixed(2)}\n`;
    message += `*Total:* ${businessConfig.currency}${total.toFixed(2)}\n\n`;
    message += `Please confirm this order or let me know if you'd like to make changes.`;
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // WhatsApp Web URL (works on desktop and mobile)
    const whatsappURL = `https://wa.me/${businessConfig.whatsappNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp
    window.open(whatsappURL, '_blank');
    
    // Clear cart after sending
    setTimeout(() => {
        if (confirm('Order sent to WhatsApp! Clear your cart?')) {
            clearCart();
        }
    }, 1000);
}

// Scroll to Menu
function scrollToMenu() {
    document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
}

// Notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease-in;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Load business info
function loadBusinessInfo() {
    document.getElementById('businessPhone').textContent = businessConfig.phone;
    document.getElementById('businessAddress').textContent = businessConfig.address;
    document.getElementById('businessHours').textContent = businessConfig.hours;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadMenu();
    loadBusinessInfo();
    updateCartDisplay();
});

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);