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
