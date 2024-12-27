
import { addToWishlist, removeFromWishlist } from "../reducers/wishlist";

// Add item to wishlist
export const addToWishlistAction = (data) => async (dispatch, getState) => {
  dispatch(addToWishlist(data)); // Dispatch the addToWishlist action from slice
  localStorage.setItem("wishlistItems", JSON.stringify(getState().wishlist.wishlist)); // Sync with localStorage
  return data;
};

// Remove item from wishlist
export const removeFromWishlistAction = (data) => async (dispatch, getState) => {
  dispatch(removeFromWishlist(data._id)); // Dispatch the removeFromWishlist action from slice
  localStorage.setItem("wishlistItems", JSON.stringify(getState().wishlist.wishlist)); // Sync with localStorage
  return data;
};





  