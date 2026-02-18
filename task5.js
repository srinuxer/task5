// Product data
const products = [
    {
        id: 1,
        name: "Galaxy Pro Max",
        price: 999.99,
        category: "smartphones",
        icon: "📱",
        rating: 4.8,
        reviews: 234
    },
    {
        id: 2,
        name: "UltraBook Pro",
        price: 1299.99,
        category: "laptops",
        icon: "💻",
        rating: 4.9,
        reviews: 156
    },
    {
        id: 3,
        name: "Noise-Cancel Headphones",
        price: 299.99,
        category: "audio",
        icon: "🎧",
        rating: 4.7,
        reviews: 445
    },
    {
        id: 4,
        name: "Gaming Console X",
        price: 499.99,
        category: "gaming",
        icon: "🎮",
        rating: 4.9,
        reviews: 789
    },
    {
        id: 5,
        name: "Smart Watch Elite",
        price: 399.99,
        category: "smartphones",
        icon: "⌚",
        rating: 4.6,
        reviews: 321
    },
    {
        id: 6,
        name: "4K Gaming Monitor",
        price: 599.99,
        category: "gaming",
        icon: "🖥️",
        rating: 4.8,
        reviews: 189
    },
    {
        id: 7,
        name: "Wireless Earbuds Pro",
        price: 199.99,
        category: "audio",
        icon: "🎵",
        rating: 4.5,
        reviews: 567
    },
    {
        id: 8,
        name: "MacBook Air M3",
        price: 1199.99,
        category: "laptops",
        icon: "💻",
        rating: 4.9,
        reviews: 432
    }
];

let cart = [];
let currentFilter = '';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const cartBtn = document.getElementById('cartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const ctaBtn = document.getElementById('ctaBtn');
const checkoutBtn = document.getElementById('checkoutBtn');
const productGrid = document.getElementById('productGrid');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const totalAmount = document.getElementById('totalAmount');
const cartSidebar = document.getElementById('cartSidebar');
const categoryCards = document.querySelectorAll('.category-card');

// Initialize the page
function init() {
    displayProducts(products);
    updateCartCount();

    // Event Listeners
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
    cartBtn.addEventListener('click', toggleCart);
    closeCartBtn.addEventListener('click', toggleCart);
    ctaBtn.addEventListener('click', scrollToProducts);
    checkoutBtn.addEventListener('click', checkout);

    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            filterProducts(card.dataset.category);
        });
    });
}

// Display products
function displayProducts(productsToShow) {
    productGrid.innerHTML = '';

    productsToShow.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">${product.icon}</div>
            <div class="product-info">
                <div class="product-title">${product.name}</div>
                <div class="product-price">$${product.price}</div>
                <div class="product-rating">
                    <span class="stars">${'★'.repeat(Math.floor(product.rating))}${product.rating % 1 ? '☆' : ''}</span>
                    <span>${product.rating} (${product.reviews} reviews)</span>
                </div>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });

    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            addToCart(parseInt(e.target.dataset.id));
        });
    });
}

// Filter products by category
function filterProducts(category) {
    currentFilter = category;
    const filteredProducts = products.filter(product => product.category === category);
    displayProducts(filteredProducts);
    scrollToProducts();
}

// Search functionality
function performSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
    displayProducts(filteredProducts);
    scrollToProducts();
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({...product, quantity: 1});
    }

    updateCartDisplay();
    updateCartCount();
    
    // Show success animation
    const btn = document.querySelector(`.add-to-cart[data-id="${productId}"]`);
    btn.style.background = '#4CAF50';
    btn.textContent = 'Added!';
    setTimeout(() => {
        btn.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
        btn.textContent = 'Add to Cart';
    }, 1000);
}

// Update cart count
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = count;
}

// Toggle cart sidebar
function toggleCart() {
    cartSidebar.classList.toggle('open');
    updateCartDisplay();
}

// Update cart display
function updateCartDisplay() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">Your cart is empty</p>';
        totalAmount.textContent = '0.00';
        return;
    }

    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="item-image">${item.icon}</div>
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-price">$${item.price}</div>
                <div class="quantity-controls">
                    <button class="qty-btn" data-id="${item.id}" data-change="-1">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" data-id="${item.id}" data-change="1">+</button>
                    <button class="qty-btn" data-id="${item.id}" data-change="remove" style="margin-left: 10px; background: #ff4757;">×</button>
                </div>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });

    totalAmount.textContent = total.toFixed(2);

    // Add event listeners to quantity buttons
    document.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            const change = e.target.dataset.change;

            if (change === 'remove') {
                removeFromCart(productId);
            } else {
                updateQuantity(productId, parseInt(change));
            }
        });
    });
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartDisplay();
            updateCartCount();
        }
    }
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    updateCartCount();
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Thank you for your purchase! Total: $${total.toFixed(2)}\n\nThis is a demo - no actual payment processed.`);
    cart = [];
    updateCartDisplay();
    updateCartCount();
    toggleCart();
}

// Scroll to products section
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', init);