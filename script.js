document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', (e) => {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.classList.add('ripple');

        button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

let cartCount = 0;

// Add event listener to all "Add to Cart" buttons
document.querySelectorAll('.add-cart').forEach(button => {
    button.addEventListener('click', function() {
        cartCount++; // Increment the cart count
        updateCartCount(); // Update the displayed count
    });
});

function updateCartCount() {
    document.querySelector('.item-count').textContent = cartCount; // Update the item count display
}
let cart = [];
let totalPrice = 0;

document.querySelectorAll('.add-cart').forEach(button => {
    button.addEventListener('click', function() {
        const card = button.closest('.card');
        const name = card.querySelector('h3').innerText;
        const price = parseFloat(card.querySelector('.price').innerText.replace('$', ''));
        const image = card.querySelector('.product-image').src;

        addToCart(name, price, image);
    });
});

function addToCart(name, price, image) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name, price, image, quantity: 1 });
    }
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    totalPrice = 0;

    cart.forEach(item => {
        const total = item.price * item.quantity;
        totalPrice += total;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${item.image}" alt="${item.name}"></td>
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>
                <button onclick="changeQuantity('${item.name}', -1)">-</button>
                ${item.quantity}
                <button onclick="changeQuantity('${item.name}', 1)">+</button>
            </td>
            <td>$${total.toFixed(2)}</td>
            <td><button onclick="removeFromCart('${item.name}')">Remove</button></td>
        `;
        cartItems.appendChild(row);
    });

    document.getElementById('total-price').innerText = totalPrice.toFixed(2);
}

function changeQuantity(name, change) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(name);
        } else {
            updateCart();
        }
    }
}

function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    updateCart();
}
