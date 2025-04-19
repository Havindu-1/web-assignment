// cart.js

// Initialize the cart from localStorage or as an empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart counter in navbar
function updateCartCounter() {
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    const counters = document.querySelectorAll('.item-count');
    counters.forEach(counter => {
        counter.textContent = itemCount;
    });
}

// Add item to cart
function addToCart(name, price, discountedPrice, imageSrc) {
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item => item.name === name);
    
    if (existingItemIndex !== -1) {
        // Increment quantity if item already exists
        cart[existingItemIndex].quantity += 1;
        cart[existingItemIndex].total = cart[existingItemIndex].quantity * cart[existingItemIndex].discountedPrice;
    } else {
        // Add new item to cart
        cart.push({
            name: name,
            price: price,
            discountedPrice: discountedPrice,
            imageSrc: imageSrc,
            quantity: 1,
            total: discountedPrice
        });
    }
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart counter
    updateCartCounter();
    
    // Show confirmation message
    showNotification(`${name} added to cart!`);
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 2500);
}

// Remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
    renderCart();
    updateOrderSummary();
}

// Update item quantity
function updateQuantity(index, newQuantity) {
    if (newQuantity < 1) newQuantity = 1;
    
    cart[index].quantity = newQuantity;
    cart[index].total = cart[index].quantity * cart[index].discountedPrice;
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
    renderCart();
    updateOrderSummary();
}

// Render cart on payment page
function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const cartContainer = document.querySelector('.cart-container');
    
    if (!cartItems) return; // Not on payment page
    
    if (cart.length === 0) {
        emptyCart.style.display = 'flex';
        cartContainer.style.display = 'none';
        return;
    }
    
    emptyCart.style.display = 'none';
    cartContainer.style.display = 'flex';
    
    cartItems.innerHTML = '';
    
    cart.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td><img src="${item.imageSrc}" alt="${item.name}" class="cart-item-image"></td>
            <td>$${item.discountedPrice.toFixed(2)}</td>
            <td>
                <div class="quantity-control">
                    <button class="quantity-btn minus" data-index="${index}">-</button>
                    <input type="number" value="${item.quantity}" min="1" data-index="${index}" class="quantity-input">
                    <button class="quantity-btn plus" data-index="${index}">+</button>
                </div>
            </td>
            <td>$${item.total.toFixed(2)}</td>
            <td><button class="remove-btn" data-index="${index}"><i class="fa fa-trash"></i></button></td>
        `;
        
        cartItems.appendChild(row);
    });
    
    // Add event listeners to quantity buttons and remove buttons
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.getAttribute('data-index'));
            updateQuantity(index, cart[index].quantity - 1);
        });
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.getAttribute('data-index'));
            updateQuantity(index, cart[index].quantity + 1);
        });
    });
    
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', () => {
            const index = parseInt(input.getAttribute('data-index'));
            updateQuantity(index, parseInt(input.value));
        });
    });
    
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.getAttribute('data-index'));
            removeFromCart(index);
        });
    });
}

// Update order summary
function updateOrderSummary() {
    const subtotalElement = document.getElementById('subtotal');
    const discountElement = document.getElementById('discount');
    const shippingElement = document.getElementById('shipping');
    const totalElement = document.getElementById('total');
    
    if (!subtotalElement) return; // Not on payment page
    
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const discountedSubtotal = cart.reduce((total, item) => total + (item.discountedPrice * item.quantity), 0);
    const discount = subtotal - discountedSubtotal;
    const shipping = cart.length > 0 ? 9.99 : 0;
    const total = discountedSubtotal + shipping;
    
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    discountElement.textContent = `-$${discount.toFixed(2)}`;
    shippingElement.textContent = `$${shipping.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;
}

// Save cart as favorite
function saveAsFavorite() {
    localStorage.setItem('favoriteCart', JSON.stringify(cart));
    showNotification('Cart saved as favorite!');
}

// Apply favorite cart
function applyFavorite() {
    const favoriteCart = JSON.parse(localStorage.getItem('favoriteCart'));
    if (favoriteCart && favoriteCart.length > 0) {
        cart = favoriteCart;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCounter();
        renderCart();
        updateOrderSummary();
        showNotification('Favorite cart applied!');
    } else {
        showNotification('No favorite cart saved!');
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Update cart counter
    updateCartCounter();
    
    // Add event listeners to "Add to Cart" buttons on store page
    const addCartButtons = document.querySelectorAll('.add-cart');
    addCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.card');
            const name = card.querySelector('h3').textContent;
            const priceElement = card.querySelector('.price');
            const discountedPriceElement = card.querySelector('.discounted-price');
            const imageSrc = card.querySelector('.product-image').src;
            
            const price = parseFloat(priceElement.textContent.replace('$', ''));
            const discountedPrice = parseFloat(discountedPriceElement.textContent.replace('$', ''));
            
            addToCart(name, price, discountedPrice, imageSrc);
        });
    });
    
    // Render cart on payment page
    if (document.getElementById('cartItems')) {
        renderCart();
        updateOrderSummary();
        
        // Add event listeners to cart action buttons
        document.getElementById('saveAsFavorite')?.addEventListener('click', saveAsFavorite);
        document.getElementById('applyFavorite')?.addEventListener('click', applyFavorite);
        document.getElementById('proceedToCheckout')?.addEventListener('click', () => {
            alert('Checkout functionality would go here!');
        });
    }
});