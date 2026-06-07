// Admin Panel Script

// Show Alert
function showAlert(message, type = 'success') {
    const alertsContainer = document.getElementById('alerts');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    alertsContainer.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 4000);
}

// Add Menu Item
document.getElementById('menuForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const itemName = document.getElementById('itemName').value.trim();
    const itemDescription = document.getElementById('itemDescription').value.trim();
    const itemPrice = parseFloat(document.getElementById('itemPrice').value);
    const itemEmoji = document.getElementById('itemEmoji').value.trim() || '🍽️';
    
    if (!itemName || !itemPrice) {
        showAlert('Please fill in all required fields', 'error');
        return;
    }
    
    if (itemPrice <= 0) {
        showAlert('Price must be greater than 0', 'error');
        return;
    }
    
    // Generate unique ID
    const itemId = 'item_' + Date.now();
    
    // Add to Firebase
    database.ref('menu/' + itemId).set({
        name: itemName,
        description: itemDescription,
        price: itemPrice,
        emoji: itemEmoji,
        createdAt: new Date().toISOString()
    }).then(() => {
        showAlert(`✓ "${itemName}" added to menu!`, 'success');
        document.getElementById('menuForm').reset();
        loadMenuItems();
    }).catch((error) => {
        console.error('Error adding item:', error);
        showAlert('Error adding item. Please check Firebase connection.', 'error');
    });
});

// Load Menu Items
function loadMenuItems() {
    const menuList = document.getElementById('menuList');
    
    database.ref('menu').once('value', (snapshot) => {
        menuList.innerHTML = '';
        const menu = snapshot.val();
        
        if (!menu || Object.keys(menu).length === 0) {
            menuList.innerHTML = '<div class="empty-state">📭 No menu items yet. Add one to get started!</div>';
            return;
        }
        
        Object.keys(menu).forEach(itemId => {
            const item = menu[itemId];
            const menuCard = document.createElement('div');
            menuCard.className = 'menu-item-card';
            menuCard.innerHTML = `
                <div class="menu-item-header">
                    <div class="menu-item-info">
                        <h3>${item.emoji || '🍽️'} ${item.name}</h3>
                        <p style="color: #666; margin-top: 0.5rem;">${item.description || 'No description'}</p>
                    </div>
                </div>
                <div class="menu-item-details">
                    <div class="menu-item-detail">
                        <strong>Price:</strong>
                        <span>₹${item.price}</span>
                    </div>
                    <div class="menu-item-detail">
                        <strong>ID:</strong>
                        <span style="font-family: monospace; font-size: 0.85rem;">${itemId}</span>
                    </div>
                </div>
                <div class="menu-item-actions">
                    <button class="edit-btn" onclick="editItem('${itemId}')">✏️ Edit</button>
                    <button class="delete-btn" onclick="deleteItem('${itemId}', '${item.name}')">🗑️ Delete</button>
                </div>
            `;
            menuList.appendChild(menuCard);
        });
    }).catch((error) => {
        console.error('Error loading menu:', error);
        menuList.innerHTML = '<div class="empty-state">❌ Error loading menu items</div>';
    });
}

// Edit Item
function editItem(itemId) {
    showAlert('Edit feature coming soon! For now, delete and re-add the item.', 'warning');
}

// Delete Item
function deleteItem(itemId, itemName) {
    if (confirm(`Are you sure you want to delete "${itemName}"?`)) {
        database.ref('menu/' + itemId).remove()
            .then(() => {
                showAlert(`✓ "${itemName}" deleted`, 'success');
                loadMenuItems();
            })
            .catch((error) => {
                console.error('Error deleting item:', error);
                showAlert('Error deleting item', 'error');
            });
    }
}

// Load items on page load
document.addEventListener('DOMContentLoaded', () => {
    loadMenuItems();
});