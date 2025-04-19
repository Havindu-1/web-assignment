// Global variables
let cartItems = [];

// Load cart items from localStorage
function loadCartItems() {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
        cartItems = JSON.parse(storedCart);
        renderCheckoutItems();
        updateOrderSummary();
    } else {
        // Redirect to cart if no items
        window.location.href = 'Payment.html';
    }
}

// Render checkout items
function renderCheckoutItems() {
    const checkoutItemsContainer = document.getElementById('checkoutItems');
    
    // Clear existing items
    checkoutItemsContainer.innerHTML = '';
    
    // Add items to the checkout summary
    cartItems.forEach(item => {
        const itemTotal = parseFloat(item.discountedPrice) * item.quantity;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'checkout-item';
        itemElement.innerHTML = `
            <div class="checkout-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="checkout-item-details">
                <h4>${item.name}</h4>
                <p>$${item.discountedPrice.toFixed(2)} × ${item.quantity}</p>
            </div>
            <div class="checkout-item-total">
                $${itemTotal.toFixed(2)}
            </div>
        `;
        
        checkoutItemsContainer.appendChild(itemElement);
    });
}

// Update order summary
function updateOrderSummary() {
    const subtotal = cartItems.reduce((total, item) => {
        return total + (parseFloat(item.discountedPrice) * item.quantity);
    }, 0);
    
    const shipping = subtotal > 0 ? 9.99 : 0;
    const discount = 0; // Calculate if you have discount logic
    const total = subtotal + shipping - discount;
    
    document.getElementById('checkout-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('checkout-shipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('checkout-discount').textContent = `$${discount.toFixed(2)}`;
    document.getElementById('checkout-total').textContent = `$${total.toFixed(2)}`;
}

// Calculate estimated delivery date (7-10 business days from now)
function calculateDeliveryDate() {
    const today = new Date();
    
    // Add 7-10 business days (randomly choose)
    const deliveryDays = Math.floor(Math.random() * 4) + 7; // 7-10 days
    let businessDays = 0;
    let currentDate = new Date(today);
    
    while (businessDays < deliveryDays) {
        currentDate.setDate(currentDate.getDate() + 1);
        // Skip weekends (0 = Sunday, 6 = Saturday)
        if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
            businessDays++;
        }
    }
    
    // Format date as Month Day, Year
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return currentDate.toLocaleDateString('en-US', options);
}

// Validate form fields
function validateForm() {
    const form = document.getElementById('checkoutForm');
    
    // Check all required fields
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('invalid');
            isValid = false;
        } else {
            field.classList.remove('invalid');
        }
    });
    
    // Validate email format
    const emailField = document.getElementById('email');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailPattern.test(emailField.value)) {
        emailField.classList.add('invalid');
        isValid = false;
    }
    
    // Validate card number format (simplified)
    const cardNumberField = document.getElementById('cardNumber');
    const cardNumberPattern = /^\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}$/;
    
    if (!cardNumberPattern.test(cardNumberField.value)) {
        cardNumberField.classList.add('invalid');
        isValid = false;
    }
    
    // Validate expiry date format (MM/YY)
    const expiryField = document.getElementById('expiryDate');
    const expiryPattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
    
    if (!expiryPattern.test(expiryField.value)) {
        expiryField.classList.add('invalid');
        isValid = false;
    }
    
    // Validate CVV (3-4 digits)
    const cvvField = document.getElementById('cvv');
    const cvvPattern = /^\d{3,4}$/;
    
    if (!cvvPattern.test(cvvField.value)) {
        cvvField.classList.add('invalid');
        isValid = false;
    }
    
    return isValid;
}

// Submit order and show thank you message
function submitOrder(event) {
    event.preventDefault();
    
    if (!validateForm()) {
        alert('Please fill all required fields correctly.');
        return;
    }
    
    // Set delivery date
    document.getElementById('deliveryDate').textContent = calculateDeliveryDate();
    
    // Show thank you modal
    const modal = document.getElementById('thankYouModal');
    modal.style.display = 'block';
    
    // Clear cart after successful order
    localStorage.removeItem('cartItems');
}

// Initialize checkout page when loaded
document.addEventListener('DOMContentLoaded', function() {
    loadCartItems();
    updateCartCount();
    
    // Add event listeners
    document.getElementById('backToCart').addEventListener('click', function() {
        window.location.href = 'Payment.html';
    });
    
    document.getElementById('checkoutForm').addEventListener('submit', submitOrder);
    
    // Thank you modal close button
    document.querySelector('.close').addEventListener('click', function() {
        document.getElementById('thankYouModal').style.display = 'none';
    });
    
    // Continue shopping button in modal
    document.getElementById('continueShoppingBtn').addEventListener('click', function() {
        window.location.href = 'store.html';
    });
    
    // Handle navbar toggling
    window.myFunction = function() {
        var navbar = document.getElementById("navbar_id");
        if (navbar.className === "navbar") {
            navbar.className += " responsive";
        } else {
            navbar.className = "navbar";
        }
    };
});

// Update the cart count in the UI
function updateCartCount() {
    const storedCart = localStorage.getItem('cartItems');
    let cartCount = 0;
    
    if (storedCart) {
        const items = JSON.parse(storedCart);
        cartCount = items.reduce((total, item) => total + item.quantity, 0);
    }
    
    const itemCountElements = document.querySelectorAll('.item-count');
    itemCountElements.forEach(element => {
        element.textContent = cartCount;
    });
}