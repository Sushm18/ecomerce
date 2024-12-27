// orderActions.js
import axios from "axios";
import { server } from "../../../server"; // Assuming `server` is an API endpoint for your server
import { 
  getAllOrdersUserRequest,
  getAllOrdersUserSuccess,
  getAllOrdersUserFailed,
  getAllOrdersShopRequest,
  getAllOrdersShopSuccess,
  getAllOrdersShopFailed,
  adminAllOrdersRequest,
  adminAllOrdersSuccess,
  adminAllOrdersFailed
} from "../reducers/order";

// Get all orders for user
export const getAllOrdersOfUser = (userId) => async (dispatch) => {
  try {
    dispatch(getAllOrdersUserRequest());

    const { data } = await axios.get(
      `http://localhost:5000/api/v2/order/get-all-orders/${userId}`
    );

    dispatch(getAllOrdersUserSuccess(data.orders));
  } catch (error) {
    dispatch(getAllOrdersUserFailed(error.response.data.message));
  }
};

// Get all orders for shop
export const getAllOrdersOfShop = (shopId) => async (dispatch) => {
  try {
    dispatch(getAllOrdersShopRequest());

    const { data } = await axios.get(
      `http://localhost:5000/api/v2/order/get-seller-all-orders/${shopId}`
    );
console.log("data")
    console.log("::Printing data :: " , data);

    dispatch(getAllOrdersShopSuccess(data.orders));
  } catch (error) {
    dispatch(getAllOrdersShopFailed(error.response.data.message));
  }
};

// Get all orders for Admin
export const getAllOrdersOfAdmin = () => async (dispatch) => {
  try {
    dispatch(adminAllOrdersRequest());
console.log("first")
    const { data } = await axios.get(
      `http://localhost:5000/api/v2/order/admin-all-orders`,
      { withCredentials: true }
    );
    console.log("data of admin order:::",data.orders)

    dispatch(adminAllOrdersSuccess(data.orders));
  } catch (error) {
    dispatch(adminAllOrdersFailed(error.response.data.message));
  }
};














