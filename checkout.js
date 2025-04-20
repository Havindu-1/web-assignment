document.addEventListener('DOMContentLoaded', function() {
    // Load cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Display checkout items
    displayCheckoutItems(cart);
    
    // Set up form submission
    setupCheckoutForm();
});

// Display items in the checkout summary
function displayCheckoutItems(cart) {
    const checkoutItemsContainer = document.getElementById('checkoutItems');
    if (!checkoutItemsContainer) return;
    
    // Clear existing checkout items
    checkoutItemsContainer.innerHTML = '';
    
    // Display checkout items
    cart.forEach((item) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'checkout-item';
        itemElement.innerHTML = `
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-quantity">Quantity: ${item.quantity}</div>
            </div>
            <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
        `;
        checkoutItemsContainer.appendChild(itemElement);
    });
    
    // Calculate and update totals
    updateCheckoutSummary(cart);
}

// Update the checkout summary totals
function updateCheckoutSummary(cart) {
    const subtotalElement = document.getElementById('checkout-subtotal');
    const discountElement = document.getElementById('checkout-discount');
    const shippingElement = document.getElementById('checkout-shipping');
    const totalElement = document.getElementById('checkout-total');
    
    // Calculate subtotal
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Calculate discount (for example, 5% off orders over $100)
    let discount = 0;
    if (subtotal >= 100) {
        discount = subtotal * 0.05;
    }
    
    // Shipping cost
    const shipping = cart.length > 0 ? 9.99 : 0;
    
    // Calculate total
    const total = subtotal - discount + shipping;
    
    // Update elements if they exist
    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (discountElement) discountElement.textContent = `$${discount.toFixed(2)}`;
    if (shippingElement) shippingElement.textContent = `$${shipping.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
}

// Set up checkout form submission and related functionality
function setupCheckoutForm() {
    const checkoutForm = document.getElementById('checkoutForm');
    const thankYouModal = document.getElementById('thankYouModal');
    const backToCartBtn = document.getElementById('backToCart');
    
    // Back to cart button
    if (backToCartBtn) {
        backToCartBtn.addEventListener('click', function() {
            window.location.href = 'Payment.html';
        });
    }
    
    // Form submission
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real implementation, this would process the payment
            // For now, just show the thank you modal
            if (thankYouModal) {
                // Set delivery date (5 days from now)
                const deliveryDate = new Date();
                deliveryDate.setDate(deliveryDate.getDate() + 5);
                const deliveryDateStr = deliveryDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                });
                
                document.getElementById('deliveryDate').textContent = deliveryDateStr;
                
                thankYouModal.style.display = 'block';
                
                // Clear cart after successful checkout
                localStorage.setItem('cart', JSON.stringify([]));
            }
        });
    }
    
    // Modal close button
    const closeModalBtn = document.querySelector('.modal .close');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            thankYouModal.style.display = 'none';
        });
    }
    
    // Continue shopping button
    const continueShoppingBtn = document.getElementById('continueShoppingBtn');
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', function() {
            thankYouModal.style.display = 'none';
            window.location.href = 'store.html';
        });
    }
}