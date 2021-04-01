import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { OrderInput } from "../generated/graphql";

// Define a type for the slice state

// Define the initial state using that type
const initialState = {
    orders: [],
};

export const orderSlice = createSlice({
    name: "order",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        placeOrder: (state, { payload }) => {
            state.orders.push(payload);
            localStorage.setItem("cartItems", JSON.stringify(state.orders));
        },
        emptyOrders: (state) => {
            state.orders = [];
            localStorage.removeItem("cartItems");
        },
        getInitialCartItems: (state) => {
            const cartItems =
                JSON.parse(localStorage.getItem("cartItems")) || [];
            state.orders = cartItems;
        },
    },
});

export const {
    placeOrder,
    emptyOrders,
    getInitialCartItems,
} = orderSlice.actions;

export default orderSlice.reducer;
