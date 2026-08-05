import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  product: [],
  plusQty: 1,
  minusQty: 1,
  quantity: {},
  isProduct: [],
  wishlist: [],
  allProducts: []
};

const AddToCartReducer = createSlice({
  name: "cart",
  initialState,
  reducers: {
    ADDTOCART: (state, action) => {
      state.product = action.payload;
    },
    PLUSQTY: (state, action) => {
      state.plusQty = action.payload;
    },
    MINUSQTY: (state, action) => {
      state.minusQty = action.payload;
    },
    ISPRODUCTINCART: (state, action) => {
      state.isProduct = action.payload;
    },
    ADDTOWISHLIST: (state, action) => {
      state.wishlist = action.payload;
    },
    ALLPRODUCT: (state, action) => {
      state.allProducts = action.payload;
    },
    QUANTITY: (state, action) => {
     state.quantity = { ...state.quantity, [action.payload.id]: { qty: action.payload.qty, price: action.payload.price } };
    },
  },
});

export const { ADDTOCART, PLUSQTY, MINUSQTY, ISPRODUCTINCART, ADDTOWISHLIST, ALLPRODUCT, QUANTITY } = AddToCartReducer.actions;

export default AddToCartReducer.reducer;
