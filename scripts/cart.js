// Retrieve cart data from localStorage on page load
document.addEventListener("DOMContentLoaded", function () {
    // Load the cart from localStorage
    const { cart, totalAmount } = loadCart();

    // Update the cart display
    updateCartDisplay(cart, totalAmount);
});

// Function to load the cart from localStorage
function loadCart() {
    const storedCart = localStorage.getItem('cart');
    const storedTotalAmount = localStorage.getItem('totalAmount');

    // Parse stored data or initialize an empty cart
    const cart = storedCart ? JSON.parse(storedCart) : [];
    const totalAmount = storedTotalAmount ? parseFloat(storedTotalAmount) : 0.0;

    return { cart, totalAmount };
}

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

// Function to remove a product from the cart
function removeFromCart(productId) {
    const { cart, totalAmount } = loadCart();
    const indexToRemove = cart.findIndex(item => item.id === productId);

    if (indexToRemove !== -1) {
        const removedItem = cart.splice(indexToRemove, 1)[0];
        const updatedTotalAmount = totalAmount - removedItem.price;

        // Update the cart display
        updateCartDisplay(cart, updatedTotalAmount);

        // Update localStorage
        updateLocalStorage(cart, updatedTotalAmount);
    }
}

// Function to update localStorage with the current cart state
function updateLocalStorage(cart, totalAmount) {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('totalAmount', totalAmount.toFixed(2));
}
