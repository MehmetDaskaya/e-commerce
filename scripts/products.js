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
    const productToAdd = cart.find(product => product.id === productId);
    if (!productToAdd) {
        const selectedProduct = products.find(product => product.id === productId);
        if (selectedProduct) {
            cart.push(selectedProduct);
            totalAmount += selectedProduct.price;
            updateCart();
            showNotification(selectedProduct.title, selectedProduct.price);

            // Update localStorage
            updateLocalStorage();
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
    notificationContainer.classList.add("notification", "is-info");

    notificationContainer.innerHTML = `
        <button class="delete" onclick="removeNotification(this)"></button>
        <strong>${itemName}</strong> added to cart. Price: $${itemPrice.toFixed(2)}. Total: $${totalAmount.toFixed(2)}
        <button class="button is-primary" onclick="seeCart()">See Cart</button>
    `;

    document.body.appendChild(notificationContainer);

    // Auto-remove notification after a delay (e.g., 5 seconds)
    setTimeout(() => {
        removeNotification(notificationContainer.querySelector('.delete'));
    }, 5000);
}

// Function to navigate to the cart page
function seeCart() {
    // Add logic to navigate to the cart page (replace the alert with actual navigation code)
    alert("Navigate to Cart Page"); // Replace this with your actual navigation code
}




// Function to remove the notification when the close button is clicked
function removeNotification(deleteButton) {
    const notificationDiv = deleteButton.parentElement;
    notificationDiv.remove();
}


// Function to update the cart dynamically
function updateCart() {
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
    const indexToRemove = cart.findIndex(item => item.id === productId);
    if (indexToRemove !== -1) {
        const removedItem = cart.splice(indexToRemove, 1)[0];
        totalAmount -= removedItem.price;
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
    columnsContainer.classList.add("columns", "is-multiline");

    filteredProducts.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("column", "is-half");
        productDiv.innerHTML = `
        <div class="box product-box" style="min-height: 250px;">
            <div class="media">
                <div class="media-left is-align-self-center">
                    <figure class="image is-128x128">
                        <img src="${product.image}" alt="${product.title}">
                    </figure>
                </div>
                
                <div class="media-content">
                    <h3 class="title is-5">${product.title}</h3>
                    <p class="description" id="description_${product.id}">${truncateDescription(product.description)}<span class="has-text-link" onclick="seeMore(${product.id})"> See more</span></p>
                    <div class="price-and-button is-flex is-justify-content-space-between mt-3">
                        <p class="button is-static is-primary price">$${product.price.toFixed(2)}</p>
                        <button class="button is-primary" onclick="addToCart(${product.id})">Add to Cart</button>
                    </div>
                </div>
            </div>
        </div>
        `;
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
    window.location.href = 'cart.html';
}