// Sample cart array to store added items
let cart = [];
let totalAmount = 0;

// Sample products array (replace this with your actual product data)
let products = [];

// Function to fetch products from the FakeStore API
async function fetchProducts() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        products = await response.json();
        populateProducts(null);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}


// Function to add a product to the cart
function addToCart(productId) {
    const productToAdd = cart.find((product) => product.id === productId);

    if (productToAdd) {
        // Increment quantity if the product is already in the cart
        productToAdd.quantity += 1;

        // Update total amount and cart UI
        totalAmount += productToAdd.price;
        updateCart();

        // Update localStorage
        updateLocalStorage();

        // Show notification
        showNotification(productToAdd.title, productToAdd.price);
        console.log('Notification shown:', productToAdd.title, productToAdd.price);
    } else {
        const selectedProduct = products.find((product) => product.id === productId);
        if (selectedProduct) {
            // Add the product to the cart with quantity 1
            const newItem = { ...selectedProduct, quantity: 1 };
            cart.push(newItem);

            // Update total amount and cart UI
            totalAmount += newItem.price;
            updateCart();

            // Update localStorage
            updateLocalStorage();

            // Show notification
            showNotification(newItem.title, newItem.price);
        }
    }
}


// Function to show a notification
function showNotification(itemName, itemPrice) {
    const notificationContainer = document.createElement("div");
    notificationContainer.style.position = "fixed";
    notificationContainer.style.top = "10px";
    notificationContainer.style.right = "10px";
    notificationContainer.style.zIndex = "999";
    notificationContainer.classList.add("notification", "is-info", "is-light");


    if (itemName && itemPrice) {
        // Notification for existing product in the cart
        notificationContainer.innerHTML = `
            <button class="delete" onclick="removeNotification(this)"></button>
            <strong>${itemName}</strong> added to cart. Price: $${itemPrice.toFixed(2)}. Total: $${totalAmount.toFixed(2)}
            <button class="button is-primary" onclick="seeCart()">See Cart</button>
        `;
    } else {
        // Notification for new product added to the cart
        const lastAddedItem = cart[cart.length - 1];
        notificationContainer.innerHTML = `
            <button class="delete" onclick="removeNotification(this)"></button>
            <strong>${lastAddedItem.title}</strong> added to cart. Price: $${lastAddedItem.price.toFixed(2)}. Total: $${totalAmount.toFixed(2)}
            <button class="button is-primary" onclick="seeCart()">See Cart</button>
        `;
    }

    document.body.appendChild(notificationContainer);

    // Auto-remove notification after a delay (e.g., 5 seconds)
    setTimeout(() => {
        removeNotification(notificationContainer.querySelector('.delete'));
    }, 5000);
}



// Function to remove the notification when the close button is clicked
function removeNotification(deleteButton) {
    const notificationDiv = deleteButton.parentElement;
    notificationDiv.remove();
}


// Function to update the cart dynamically
function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalAmountElement = document.getElementById('totalAmount');

    if (cart.length === 0) {
        // If the cart is empty, display a message
        cartItemsContainer.innerHTML = '<p>Your cart is empty. Try adding products to the cart to continue shopping</p>';
    } else {
        // If the cart has items, display the items
        cartItemsContainer.innerHTML = '';

        cart.forEach((item) => {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('cart-item');
            cartItemDiv.innerHTML = `
                <p>${item.title} - $${item.price.toFixed(2)} x ${item.quantity}</p>
                <button class="remove-from-cart-btn" onclick="removeFromCart(${item.id})">Remove</button>
                <button class="increase-quantity-btn" onclick="increaseQuantity(${item.id})">+</button>
                <button class="decrease-quantity-btn" onclick="decreaseQuantity(${item.id})">-</button>
            `;
            cartItemsContainer.appendChild(cartItemDiv);
        });
    }

    // Update the total amount
    totalAmountElement.textContent = totalAmount.toFixed(2);
}



// Function to remove a product from the cart
function removeFromCart(productId) {
    const indexToRemove = cart.findIndex(item => item.id === productId);

    if (indexToRemove !== -1) {
        const removedItem = cart[indexToRemove];
        totalAmount -= removedItem.price * removedItem.quantity;
        removedItem.quantity -= 1;
        if (removedItem.quantity === 0) {
            cart.splice(indexToRemove, 1);
        }

        updateCart();
        updateLocalStorage();
    }
}

// Function to increase the quantity of a product in the cart
function increaseQuantity(productId) {
    const productToUpdate = cart.find((product) => product.id === productId);
    if (productToUpdate) {
        productToUpdate.quantity += 1;
        totalAmount += productToUpdate.price;
        updateCart();

        // Update localStorage
        updateLocalStorage();
    }
}

// Function to decrease the quantity of a product in the cart
function decreaseQuantity(productId) {
    const productToUpdate = cart.find((product) => product.id === productId);
    if (productToUpdate && productToUpdate.quantity > 1) {
        productToUpdate.quantity -= 1;
        totalAmount -= productToUpdate.price;
        updateCart();

        // Update localStorage
        updateLocalStorage();
    }
}


// Function to update localStorage with the current cart state
function updateLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('totalAmount', totalAmount.toFixed(2));
}

// Function to clear filters and show all products
function clearFilters() {
    populateProducts(null);
}

// Function to filter products by category
function filterProducts(category) {
    populateProducts(category);
}

function populateProducts(category) {
    const productsContainer = document.getElementById("products");
    productsContainer.innerHTML = ''; // Clear existing products

    const filteredProducts = category ? products.filter(product => product.category === category) : products;

    const columnsContainer = document.createElement("div");
    columnsContainer.classList.add("columns", "is-multiline", "ml-6-desktop", "mr-6-desktop");

    filteredProducts.forEach((product, index, array) => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("column", "is-half", "is-full-mobile");
        productDiv.innerHTML = `
        <div class="box product-box" style="min-height: 250px;">
            <div class="media">
                <div class="media-left is-align-self-center">
                <figure class="image is-square is-128x128">
                    <img src="${product.image}" alt="${product.title}">
                </figure>
                </div>
                
                <div class="media-content">
                    <h3 class="title is-5">${product.title}</h3>
                    <p class="description" id="description_${product.id}">${truncateDescription(product.description)}<span class="has-text-link" onclick="seeMore(${product.id})"> See more</span></p>
                    <div class="price-and-button is-flex is-justify-content-space-between mt-3" style="overflow-x: hidden;">
                        <p class="button is-static is-primary price">$${product.price.toFixed(2)}</p>
                        <button class="button is-primary" onclick="addToCart(${product.id})">Add to Cart</button>
                    </div>
                </div>
            </div>
        </div>
        `;

        // Add bottom margin to the last item
        if (index === array.length - 1) {
            productDiv.style.marginBottom = "200px";
        }

        columnsContainer.appendChild(productDiv);
    });

    productsContainer.appendChild(columnsContainer);
}


function truncateDescription(description) {
    const words = description.split(' ');
    if (words.length > 18) {
        return words.slice(0, 20).join(' ') + '...';
    }
    return description;
}

function capitalizeFirstLetter(word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}


function seeMore(productId) {
    const descriptionElement = document.getElementById(`description_${productId}`);
    const fullDescription = products.find(product => product.id === productId).description;
    descriptionElement.innerHTML = capitalizeFirstLetter(fullDescription);
}


// Initial population of products when the page loads
document.addEventListener("DOMContentLoaded", function () {
    fetchProducts();
});


// Function to navigate to the cart page
function seeCart() {
    // Save the cart data to localStorage
    updateLocalStorage();

    // Open the cart modal
    openCartModal();
}

// Initial population of products when the page loads
document.addEventListener("DOMContentLoaded", function () {
    // Load the cart from localStorage
    loadCart();
    // Update the cart UI
    updateCart();
    fetchProducts();
});

// Function to load the cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        totalAmount = parseFloat(localStorage.getItem('totalAmount')) || 0;
        updateCart();
    }
}

// Initial population of products when the page loads
document.addEventListener("DOMContentLoaded", function () {
    // Load the cart from localStorage
    loadCart();
    fetchProducts();
});

// Function to toggle the visibility of the floating cart icon
function toggleFloatingCartIcon() {
    const floatingCartIcon = document.getElementById('floatingCartIcon');
    if (window.scrollY > 1) {
        floatingCartIcon.style.display = 'block';
    } else {
        floatingCartIcon.style.display = 'none';
    }
}

// Add an event listener for scroll events
document.addEventListener('scroll', toggleFloatingCartIcon);

// Initial call to set the initial state based on scroll position
toggleFloatingCartIcon();

// Function to open the cart modal
function openCartModal() {
    const cartModal = document.getElementById('cartModal');
    cartModal.style.display = 'flex';

    // Populate cart content dynamically
    const cartModalContent = document.getElementById('cartModalContent');
    cartModalContent.innerHTML = '';

    cart.forEach(item => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cart-item-modal');
        cartItemDiv.innerHTML = `<p>${item.title} - $${item.price.toFixed(2)}</p>`;
        cartModalContent.appendChild(cartItemDiv);
    });

    // Calculate and update the total amount
    const cartTotal = document.getElementById('cartTotal');
    cartTotal.textContent = totalAmount.toFixed(2);
}

// Function to clear the cart and local storage
function clearCartAndLocalStorage() {
    cart = [];
    totalAmount = 0;
    updateCart();
    updateLocalStorage();
}

// Function to checkout
function checkout() {
    clearCartAndLocalStorage();
    window.location.href = 'cart.html';
}


// Function to close the cart modal
function closeCartModal() {
    const cartModal = document.getElementById('cartModal');
    cartModal.style.display = 'none';
}

