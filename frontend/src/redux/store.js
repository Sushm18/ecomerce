import { configureStore } from "@reduxjs/toolkit";
import  userSlice from "./reducers/user";
// import  sellerSlice from "./reducers/seller";
import  productSlice from "./reducers/product";
import  eventSlice from "./reducers/event";
import  cartSlice from "./reducers/cart";
import  wishlistSlice from "./reducers/wishlist";
import  orderSlice from "./reducers/order";
import sellerSlice from "./reducers/seller";

const Store = configureStore({
  reducer: {
    user: userSlice,
    seller: sellerSlice,
    products: productSlice,
    events: eventSlice,
    cart: cartSlice,
    wishlist: wishlistSlice,
    order: orderSlice,
  },
});

export default Store;
