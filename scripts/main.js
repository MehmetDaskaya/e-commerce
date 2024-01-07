document.addEventListener('DOMContentLoaded', function () {
    // Fetch categories and products from the FakeStore API
    fetch('https://fakestoreapi.com/products/categories')
        .then(response => response.json())
        .then(categories => {
            // Dynamically populate categories section
            displayCategories(categories);
        })
        .catch(error => console.error('Error fetching categories:', error));

    // Function to display categories dynamically
    function displayCategories(categories) {
        const categoriesSection = document.getElementById('categories');

        categories.forEach(category => {
            const categoryDiv = document.createElement('div');
            categoryDiv.classList.add('category');
            categoryDiv.innerHTML = `
                <h2>${category}</h2>
                <!-- Add any other category information you want to display -->
                <button class="view-products-btn" data-category="${category}">View Products</button>
            `;
            categoriesSection.appendChild(categoryDiv);
        });

        // Add event listener for the "View Products" button
        document.querySelectorAll('.view-products-btn').forEach(button => {
            button.addEventListener('click', function () {
                const selectedCategory = this.getAttribute('data-category');
                fetchProductsByCategory(selectedCategory);
            });
        });
    }

    function fetchProductsByCategory(category) {
        // Fetch products for the selected category
        fetch(`https://fakestoreapi.com/products/category/${category}`)
            .then(response => response.json())
            .then(products => {
                // Dynamically populate products section
                displayProducts(products);
            })
            .catch(error => console.error(`Error fetching products for ${category}:`, error));
    }

    function displayProducts(products) {
        const productsSection = document.getElementById('products');
        productsSection.innerHTML = ''; // Clear existing products

        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product');
            productDiv.innerHTML = `
                <img src="${product.image}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p>${product.description}</p>
                <button class="buy-btn">Buy Now</button>
            `;
            productsSection.appendChild(productDiv);
        });
    }
});
