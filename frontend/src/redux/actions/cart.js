
import { addtoCartreducer,removefromCartreducer } from "../reducers/cart";

// Dispatch addtoCart action
export const addTocart = (data) => (dispatch, getState) => {
  dispatch(addtoCartreducer(data));  
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart));  // Keep cart in localStorage
  return data;
};

// Dispatch removeFromCart action
export const removeFromCart = (data) => (dispatch, getState) => {
  dispatch(removefromCartreducer(data._id)); 
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart));  // Update localStorage
  return data;
};
