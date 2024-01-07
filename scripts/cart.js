// Retrieve cart data from localStorage on page load
document.addEventListener("DOMContentLoaded", function () {
    const storedCart = localStorage.getItem('cart');
    const storedTotalAmount = localStorage.getItem('totalAmount');

    // Parse stored data or initialize an empty cart
    const cart = storedCart ? JSON.parse(storedCart) : [];
    const totalAmount = storedTotalAmount ? parseFloat(storedTotalAmount) : 0.0;

    // Update the cart display
    updateCartDisplay(cart, totalAmount);
});

// Function to update the cart display
function updateCartDisplay(cart, totalAmount) {
    const cartItemsContainer = document.getElementById("cart-items");
    const totalAmountElement = document.getElementById("totalAmount");
    cartItemsContainer.innerHTML = ''; // Clear existing cart items

    cart.forEach(item => {
        const cartItemDiv = document.createElement("div");
        cartItemDiv.classList.add("cart-item");
        cartItemDiv.innerHTML = `
            <p>${item.title} - $${item.price.toFixed(2)}</p>
            <button class="remove-from-cart-btn" onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartItemsContainer.appendChild(cartItemDiv);
    });

    totalAmountElement.textContent = totalAmount.toFixed(2);
}
