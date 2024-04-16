import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: {},
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const itemName = action.payload.name;
      if (state.items[itemName]) {
        // Item already exists in the cart
        state.items[itemName].count += 1;
      } else {
        // Item is not in the cart, add it
        state.items[itemName] = { ...action.payload, count: 1 };
      }
    },
    removeFromCart: (state, action) => {
      const itemName = action.payload.name;
      if (state.items[itemName]) {
        if (state.items[itemName].count > 1) {
          // If more than one item left, decrease the count
          state.items[itemName].count -= 1;
        } else {
          // If only one item left, remove it from object
          delete state.items[itemName];
        }
      }
    },
    getItems: (state) => {
      return state.items;
    },
  },
});

export const { addToCart, removeFromCart,getItems } = cartSlice.actions;

export default cartSlice.reducer;