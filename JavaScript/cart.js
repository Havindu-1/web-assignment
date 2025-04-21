// Initialize cart from localStorage or as empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];
updateCartCount();

// Add to Cart button event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners to "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll('.add-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.card');
            const productName = card.querySelector('h3').textContent;
            const productImage = card.querySelector('.product-image').src;
            const productPrice = card.querySelector('.discounted-price').textContent.replace('$', '');
            
            // Check if item already exists in cart
            const existingItemIndex = cart.findIndex(item => item.name === productName);
            
            if (existingItemIndex > -1) {
                // Update quantity if item exists
                cart[existingItemIndex].quantity += 1;
            } else {
                // Add new item to cart
                cart.push({
                    name: productName,
                    image: productImage,
                    price: parseFloat(productPrice),
                    quantity: 1
                });
            }
            
            // Save cart to localStorage
            saveCart();
            updateCartCount();
            
            // Show confirmation
            alert(`Added ${productName} to your cart!`);
        });
    });

    // Handle "Buy Now" button clicks
    const buyNowButtons = document.querySelectorAll('.buy-now');
    buyNowButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // If the button doesn't contain an anchor tag or if we need to handle it
            if (!this.querySelector('a')) {
                e.preventDefault();
                const card = this.closest('.card');
                const productName = card.querySelector('h3').textContent;
                const productImage = card.querySelector('.product-image').src;
                const productPrice = card.querySelector('.discounted-price').textContent.replace('$', '');
                
                // Clear existing cart and add only this item
                cart = [{
                    name: productName,
                    image: productImage,
                    price: parseFloat(productPrice),
                    quantity: 1
                }];
                
                // Save cart to localStorage
                saveCart();
                updateCartCount();
                
                // Navigate to checkout page
                window.location.href = "checkout.html";
            }
        });
    });

    // Initialize checkout page if we're on it
    if (window.location.pathname.includes('checkout.html')) {
        displayCheckoutItems();
    }

    // Initialize payment page if we're on it
    if (window.location.pathname.includes('Payment.html')) {
        displayCartItems();
        setupPaymentPageListeners();
    }
});

// Update cart count in navbar
function updateCartCount() {
    const itemCountElements = document.querySelectorAll('.item-count');
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    
    itemCountElements.forEach(element => {
        element.textContent = itemCount;
    });
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Display checkout items on the checkout page
function displayCheckoutItems() {
    const checkoutItemsContainer = document.getElementById('checkoutItems');
    const subtotalElement = document.getElementById('checkout-subtotal');
    const discountElement = document.getElementById('checkout-discount');
    const shippingElement = document.getElementById('checkout-shipping');
    const totalElement = document.getElementById('checkout-total');
    
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
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    let discount = 0;
    if (subtotal >= 100) {
        discount = subtotal * 0.05;
    }
    const shipping = cart.length > 0 ? 9.99 : 0;
    const total = subtotal - discount + shipping;
    
    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (discountElement) discountElement.textContent = `$${discount.toFixed(2)}`;
    if (shippingElement) shippingElement.textContent = `$${shipping.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;

    // Set up checkout form submission
    setupCheckoutForm();
}

// Setup checkout form submission
function setupCheckoutForm() {
    const checkoutForm = document.getElementById('checkoutForm');
    const thankYouModal = document.getElementById('thankYouModal');
    
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real implementation, this would process the payment
            // Show thank you modal
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
                cart = [];
                saveCart();
                updateCartCount();
            }
        });
    }
    
    // Setup modal close button
    const closeModalBtn = document.querySelector('.modal .close');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            thankYouModal.style.display = 'none';
        });
    }
    
    // Setup continue shopping button
    const continueShoppingBtn = document.getElementById('continueShoppingBtn');
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', function() {
            thankYouModal.style.display = 'none';
            window.location.href = 'store.html';
        });
    }
    
    // Setup back to cart button
    const backToCartBtn = document.getElementById('backToCart');
    if (backToCartBtn) {
        backToCartBtn.addEventListener('click', function() {
            window.location.href = 'Payment.html';
        });
    }
}

// Display cart items on the payment page
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCartMessage = document.getElementById('emptyCart');
    const cartContainer = document.querySelector('.cart-container');
    
    if (!cartItemsContainer) return;
    
    // Clear existing cart items
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        // Show empty cart message
        emptyCartMessage.style.display = 'flex';
        cartContainer.style.display = 'none';
        return;
    }
    
    // Hide empty cart message and show cart container
    emptyCartMessage.style.display = 'none';
    cartContainer.style.display = 'flex';
    
    // Display cart items
    cart.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td><img src="${item.image}" alt="${item.name}" class="cart-item-image"></td>
            <td>$${item.price.toFixed(2)}</td>
            <td>
                <div class="quantity-controls">
                    <button class="quantity-btn decrease" data-index="${index}">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn increase" data-index="${index}">+</button>
                </div>
            </td>
            <td>$${(item.price * item.quantity).toFixed(2)}</td>
            <td><button class="remove-item" data-index="${index}">Remove</button></td>
        `;
        cartItemsContainer.appendChild(row);
    });
    
    // Add event listeners to quantity buttons and remove buttons
    const decreaseButtons = document.querySelectorAll('.decrease');
    const increaseButtons = document.querySelectorAll('.increase');
    const removeButtons = document.querySelectorAll('.remove-item');
    
    decreaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1;
                saveCart();
                displayCartItems();
                updateCartSummary();
            }
        });
    });
    
    increaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            cart[index].quantity += 1;
            saveCart();
            displayCartItems();
            updateCartSummary();
        });
    });
    
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            cart.splice(index, 1);
            saveCart();
            updateCartCount();
            displayCartItems();
            updateCartSummary();
        });
    });
    
    // Update order summary
    updateCartSummary();
}

// Update cart summary section on payment page
function updateCartSummary() {
    const subtotalElement = document.getElementById('subtotal');
    const discountElement = document.getElementById('discount');
    const totalElement = document.getElementById('total');
    const shippingElement = document.getElementById('shipping');
    
    if (!subtotalElement) return;
    
    // Calculate subtotal
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    
    // Calculate discount (for example, 5% off orders over $100)
    let discount = 0;
    if (subtotal >= 100) {
        discount = subtotal * 0.05;
    }
    discountElement.textContent = `-$${discount.toFixed(2)}`;
    
    // Shipping cost
    const shipping = cart.length > 0 ? 9.99 : 0;
    shippingElement.textContent = `$${shipping.toFixed(2)}`;
    
    // Calculate total
    const total = subtotal - discount + shipping;
    totalElement.textContent = `$${total.toFixed(2)}`;
}

// Setup event listeners for payment page buttons
function setupPaymentPageListeners() {
    const proceedToCheckoutBtn = document.getElementById('proceedToCheckout');
    const saveAsFavoriteBtn = document.getElementById('saveAsFavorite');
    const applyFavoriteBtn = document.getElementById('applyFavorite');
    
    if (proceedToCheckoutBtn) {
        proceedToCheckoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                alert('Your cart is empty. Please add items before checking out.');
                return;
            }
            
            // Navigate to the checkout page
            window.location.href = "checkout.html";
        });
    }
    
    if (saveAsFavoriteBtn) {
        saveAsFavoriteBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                alert('Your cart is empty. Add items to save as favorite.');
                return;
            }
            
            localStorage.setItem('favoriteCart', JSON.stringify(cart));
            alert('Cart saved as favorite!');
        });
    }
    
    if (applyFavoriteBtn) {
        applyFavoriteBtn.addEventListener('click', function() {
            const favoriteCart = JSON.parse(localStorage.getItem('favoriteCart'));
            
            if (!favoriteCart || favoriteCart.length === 0) {
                alert('No favorite cart found.');
                return;
            }
            
            // Replace current cart with favorite cart
            cart = favoriteCart;
            saveCart();
            updateCartCount();
            displayCartItems();
            alert('Favorite cart applied!');
        });
    }
}

// Function to handle mobile navbar
function myFunction() {
    var navbar = document.getElementById("navbar_id");
    if (navbar.className === "navbar") {
        navbar.className += " responsive";
    } else {
        navbar.className = "navbar";
    }
}
// Add this to your cart.js file or modify the existing "Buy Now" button handler

// Handle "Buy Now" button clicks
document.querySelectorAll('.buy-now').forEach(button => {
    button.addEventListener('click', function(e) {
        // Prevent default behavior for all buttons
        e.preventDefault();
        
        const card = this.closest('.card');
        const productName = card.querySelector('h3').textContent;
        const productImage = card.querySelector('.product-image').src;
        const productPrice = card.querySelector('.discounted-price').textContent.replace('$', '');
        
        // Clear existing cart and add only this item
        cart = [{
            name: productName,
            image: productImage,
            price: parseFloat(productPrice),
            quantity: 1
        }];
        
        // Save cart to localStorage
        saveCart();
        updateCartCount();
        
        // Navigate to checkout page
        window.location.href = "checkout.html";
    });
});