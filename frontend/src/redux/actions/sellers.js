

import axios from "axios";

import {
  getAllSellersRequest,
  getAllSellersSuccess,
  getAllSellersFailed,
} from "../reducers/seller";

// Get all sellers --- Admin
export const getAllSellers = () => async (dispatch) => {
  try {
    dispatch(getAllSellersRequest());
// console.log("all seller")
    const { data } = await axios.get(`http://localhost:5000/api/v2/shop/admin-all-sellers`, {
      withCredentials: true,
    });

    // console.log("All seller::",data.sellers)
    dispatch(getAllSellersSuccess(data.sellers));

  } catch (error) {
    // console.log(error)
    dispatch(getAllSellersFailed(error.response ? error.response.data.message : "Server Error")
    );
  }
};
