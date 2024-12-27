import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
  isSeller: false,
  seller: null,
  sellers: [],
  error: null,
};

const sellerSlice = createSlice({
  name: "seller",
  initialState,
  reducers: {
    loadSellerRequest: (state) => {
      state.isLoading = true;
    },
    loadSellerSuccess: (state, action) => {
      state.isSeller = true;
      state.isLoading = false;
      state.seller = action.payload;
      // console.log(action.payload)
    },
    loadSellerFailed: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isSeller = false;
    },
    getAllSellersRequest: (state) => {
      state.isLoading = true;
    },
    getAllSellersSuccess: (state, action) => {
      state.isLoading = false;
      state.sellers = action.payload;
      console.log( "get all seller success",action.payload)
    },
    getAllSellersFailed: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearErrors: (state) => {
      state.error = null;
    },
  },
});

// Export actions for use in components
export const {
  loadSellerRequest,
  loadSellerSuccess,
  loadSellerFailed,
  getAllSellersRequest,
  getAllSellersSuccess,
  getAllSellersFailed,
  clearErrors,
} = sellerSlice.actions;

// Export the reducer to configure the store
export default sellerSlice.reducer;
