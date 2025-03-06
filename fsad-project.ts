import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { configureStore, createSlice } from "@reduxjs/toolkit";

// Sample plant data
const plants = [
    { id: 1, name: "Aloe Vera", price: 10, image: "aloe.jpg" },
    { id: 2, name: "Snake Plant", price: 15, image: "snake.jpg" },
    { id: 3, name: "Peace Lily", price: 20, image: "peace_lily.jpg" },
];

// Redux Slice
const cartSlice = createSlice({
    name: "cart",
    initialState: { items: [], totalItems: 0, totalPrice: 0 },
    reducers: {
        addToCart: (state, action) => {
            const plant = action.payload;
            const existingPlant = state.items.find(item => item.id === plant.id);
            if (existingPlant) {
                existingPlant.quantity += 1;
            } else {
                state.items.push({ ...plant, quantity: 1 });
            }
            state.totalItems += 1;
            state.totalPrice += plant.price;
        },
    },
});
const { addToCart } = cartSlice.actions;
const store = configureStore({ reducer: { cart: cartSlice.reducer } });

// Landing Page
const LandingPage = () => (
    <div>
        <h1>Welcome to Green Haven</h1>
        <p>Your one-stop shop for the best houseplants.</p>
        <Link to="/products"><button>Get Started</button></Link>
    </div>
);

// Product Listing Page
const ProductListing = () => {
    const dispatch = useDispatch();
    return (
        <div>
            <h2>Our Plants</h2>
            <div>
                {plants.map(plant => (
                    <div key={plant.id}>
                        <img src={plant.image} alt={plant.name} width="50" />
                        <h3>{plant.name}</h3>
                        <p>${plant.price}</p>
                        <button onClick={() => dispatch(addToCart(plant))}>Add to Cart</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Shopping Cart Page
const ShoppingCart = () => {
    const { items, totalItems, totalPrice } = useSelector(state => state.cart);
    return (
        <div>
            <h2>Shopping Cart</h2>
            {items.length === 0 ? <p>Your cart is empty.</p> : (
                <>
                    <p>Total Items: {totalItems}</p>
                    <p>Total Price: ${totalPrice}</p>
                    <ul>
                        {items.map(plant => (
                            <li key={plant.id}>
                                <img src={plant.image} alt={plant.name} width="50" />
                                <h4>{plant.name}</h4>
                                <p>${plant.price} x {plant.quantity}</p>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

// App Component
const App = () => (
    <Provider store={store}>
        <Router>
            <nav>
                <Link to="/">Home</Link> | <Link to="/products">Products</Link> | <Link to="/cart">Cart</Link>
            </nav>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/products" element={<ProductListing />} />
                <Route path="/cart" element={<ShoppingCart />} />
            </Routes>
        </Router>
    </Provider>
);

export default App;
