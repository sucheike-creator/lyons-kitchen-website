/* =========================================
   LYON'S KITCHEN
   Menu, mobile navigation, cart and ordering
========================================= */

// IMPORTANT:
// Replace this with the restaurant's real WhatsApp number.
// Use country code and digits only: no +, spaces or hyphens.
const WHATSAPP_NUMBER = "2348105722448";

// Demonstration menu data.
// Replace the dishes and prices with approved restaurant details.
const menuItems = [
  {
    id: 1,
    name: "Grilled Chicken Plate",
    category: "mains",
    price: 6500,
    description: "Seasoned grilled chicken served with rice and vegetables.",
    image: "images/GrilledChicken.jpg",
  },
  {
    id: 2,
    // cspell:ignore Jollof
    name: "Jollof Rice Special",
    category: "mains",
    price: 4500,
    description: "A rich, savoury rice dish with aromatic spices.",
    image: "images/JollofRice.jpg",
  },
  {
    id: 3,
    name: "Creamy Pasta",
    category: "mains",
    price: 5500,
    description: "Creamy pasta finished with herbs and a touch of spice.",
    image: "images/CreamyPasta.jpg",
  },
  {
    id: 4,
    name: "Beef Burger",
    category: "mains",
    price: 5000,
    description: "A juicy burger served with fresh toppings.",
    image: "images/BeefBurger.jpg",
  },
  {
    id: 5,
    name: "Crispy Plantain",
    category: "sides",
    price: 1500,
    description: "Golden plantain slices, crisp on the outside.",
    image: "images/CrispyPlantain.jpg",
  },
  {
    id: 6,
    name: "Garden Salad",
    category: "sides",
    price: 2000,
    description: "Fresh greens and vegetables with a light dressing.",
    image: "images/GardenSalad.jpg",
  },
  {
    id: 7,
    name: "Fresh Lemonade",
    category: "drinks",
    price: 1200,
    description: "A refreshing citrus drink served chilled.",
    image: "images/fresh-lemonade.jpg.jpg",
  },
  {
    id: 8,
    name: "Fruit Smoothie",
    category: "drinks",
    price: 2500,
    description: "A fruity blended drink for a refreshing break.",
    image: "images/FruitSmoothie.jpg",
  },
  {
    id: 9,
    name: "Bottled Water",
    category: "drinks",
    price: 500,
    description: "Chilled bottled water.",
    image: "images/BottledWater.jpg",
  },
];

// The cart stores each selected dish and its quantity.
let cart = [];
let activeCategory = "all";

// Find the HTML elements we need to control.
const menuGrid = document.getElementById("menu-grid");
const menuFilters = document.getElementById("menu-filters");
const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartOverlay = document.getElementById("cart-overlay");
const toast = document.getElementById("toast");
const navigation = document.getElementById("navigation");
const menuToggle = document.getElementById("menu-toggle");

let toastTimeout;

// Format numbers as Nigerian naira.
function formatPrice(amount) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

// Display a short notification.
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2400);
}

// Create and display the menu cards.
function renderMenu() {
  const visibleItems = menuItems.filter((item) => {
    return activeCategory === "all" || item.category === activeCategory;
  });

  menuGrid.innerHTML = visibleItems
    .map((item) => {
      const imageMarkup = item.image
        ? `<div class="dish-image-wrap">
       <img
         class="dish-image"
         src="${item.image}"
         alt="${item.name}"
         loading="lazy"
         onerror="this.parentElement.classList.add('image-failed'); this.remove();"
       >
       <div class="dish-image-fallback" aria-hidden="true"></div>
     </div>`
        : `<div class="dish-image-wrap image-failed">
       <div class="dish-image-fallback" aria-hidden="true"></div>
     </div>`;

      return `
      <article class="menu-card">
        ${imageMarkup}

        <div class="dish-content">
          <span class="dish-category">${item.category}</span>

          <div class="dish-title-row">
            <h3>${item.name}</h3>
            <span class="dish-price">${formatPrice(item.price)}</span>
          </div>

          <p class="dish-description">${item.description}</p>

          <button class="add-button" data-add="${item.id}">
            + Add to cart
          </button>
        </div>
      </article>
    `;
    })
    .join("");
}

// Filter menu dishes by category.
menuFilters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");

  if (!button) return;

  activeCategory = button.dataset.category;

  menuFilters.querySelectorAll(".filter-button").forEach((filter) => {
    filter.classList.toggle("active", filter === button);
  });

  renderMenu();
});

// Add a dish to the cart.
menuGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");

  if (!button) return;

  const itemId = Number(button.dataset.add);
  const existingItem = cart.find((item) => item.id === itemId);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ id: itemId, quantity: 1 });
  }

  renderCart();
  showToast("Added to your cart.");
});

// Calculate the total number of items.
function getCartCount() {
  return cart.reduce((total, item) => {
    return total + item.quantity;
  }, 0);
}

// Calculate the total price.
function getCartTotal() {
  return cart.reduce((total, cartItem) => {
    const menuItem = menuItems.find((item) => item.id === cartItem.id);

    return total + menuItem.price * cartItem.quantity;
  }, 0);
}

// Display the cart and its current total.
function renderCart() {
  cartCount.textContent = getCartCount();
  cartTotal.textContent = formatPrice(getCartTotal());

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <p class="empty-cart">
        Your cart is empty. Find a dish you love.
      </p>
    `;
    return;
  }

  cartItems.innerHTML = cart
    .map((cartItem) => {
      const item = menuItems.find((menuItem) => {
        return menuItem.id === cartItem.id;
      });

      return `
      <div class="cart-item">
        <div>
          <h3>${item.name}</h3>
          <p class="cart-item-price">
            ${formatPrice(item.price * cartItem.quantity)}
          </p>

          <div class="quantity-controls">
            <button data-decrease="${item.id}"
              aria-label="Decrease ${item.name} quantity">−</button>

            <span>${cartItem.quantity}</span>

            <button data-increase="${item.id}"
              aria-label="Increase ${item.name} quantity">+</button>
          </div>
        </div>

        <button class="remove-item" data-remove="${item.id}">
          Remove
        </button>
      </div>
    `;
    })
    .join("");
}

// Change quantities or remove items.
cartItems.addEventListener("click", (event) => {
  const decreaseButton = event.target.closest("[data-decrease]");
  const increaseButton = event.target.closest("[data-increase]");
  const removeButton = event.target.closest("[data-remove]");

  if (decreaseButton) {
    const id = Number(decreaseButton.dataset.decrease);
    const item = cart.find((cartItem) => cartItem.id === id);

    if (item) {
      item.quantity--;

      if (item.quantity <= 0) {
        cart = cart.filter((cartItem) => cartItem.id !== id);
      }
    }
  }

  if (increaseButton) {
    const id = Number(increaseButton.dataset.increase);
    const item = cart.find((cartItem) => cartItem.id === id);

    if (item) item.quantity++;
  }

  if (removeButton) {
    const id = Number(removeButton.dataset.remove);
    cart = cart.filter((cartItem) => cartItem.id !== id);
  }

  renderCart();
});

// Open the cart drawer.
function openCart() {
  cartOverlay.hidden = false;
  document.body.classList.add("cart-open");
  document.getElementById("close-cart").focus();
}

// Close the cart drawer.
function closeCart() {
  cartOverlay.hidden = true;
  document.body.classList.remove("cart-open");
  document.getElementById("open-cart").focus();
}

document.getElementById("open-cart").addEventListener("click", openCart);
document.getElementById("experience-cart").addEventListener("click", openCart);
document.getElementById("close-cart").addEventListener("click", closeCart);
document
  .getElementById("close-cart-backdrop")
  .addEventListener("click", closeCart);

// Close the cart when Escape is pressed.
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !cartOverlay.hidden) {
    closeCart();
  }
});

// Empty the entire cart.
document.getElementById("clear-cart").addEventListener("click", () => {
  cart = [];
  renderCart();
  showToast("Your cart has been cleared.");
});

// Create a WhatsApp order message from the cart.
function orderOnWhatsApp() {
  if (cart.length === 0) {
    showToast("Please add a dish to your cart first.");
    return;
  }

  if (!/^\d{10,15}$/.test(WHATSAPP_NUMBER)) {
    showToast("Set the restaurant's real WhatsApp number in script.js.");
    return;
  }

  const lines = cart.map((cartItem) => {
    const item = menuItems.find((menuItem) => {
      return menuItem.id === cartItem.id;
    });

    return `${item.name} x ${cartItem.quantity} — ${formatPrice(
      item.price * cartItem.quantity,
    )}`;
  });

  const message = [
    "Hello Lyon's Kitchen!",
    "",
    "I'd like to place this order:",
    ...lines,
    "",
    `Estimated total: ${formatPrice(getCartTotal())}`,
    "",
    "Please confirm availability and the final price.",
  ].join("\n");

  const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  const orderWindow = window.open(whatsappURL, "_blank");
  if (orderWindow) orderWindow.opener = null;
}

document
  .getElementById("checkout-button")
  .addEventListener("click", orderOnWhatsApp);

document
  .getElementById("contact-whatsapp")
  .addEventListener("click", (event) => {
    if (!/^\d{10,15}$/.test(WHATSAPP_NUMBER)) {
      event.preventDefault();
      showToast("Set the restaurant's real WhatsApp number in script.js.");
      return;
    }

    event.currentTarget.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      "Hello Lyon's Kitchen! I'd like to make an enquiry.",
    )}`;
  });

// Mobile navigation menu.
menuToggle.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation" : "Open navigation",
  );
  menuToggle.textContent = isOpen ? "×" : "☰";
});

// Close the mobile navigation after selecting a link.
navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    navigation.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    menuToggle.textContent = "☰";
  }
});

// Set the current year in the footer.
document.getElementById("current-year").textContent = new Date().getFullYear();

// Display the menu and empty cart on initial page load.
renderMenu();
renderCart();
