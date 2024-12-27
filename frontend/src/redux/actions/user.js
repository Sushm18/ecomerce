



import axios from "axios";
import { server } from "../../../server";
import {
  LoadUserRequest,
  LoadUserSuccess,
  LoadUserFail,
  updateUserInfoRequest,
  updateUserInfoSuccess,
  updateUserInfoFailed,
  updateUserAddressRequest,
  updateUserAddressSuccess,
  updateUserAddressFailed,
  deleteUserAddressRequest,
  deleteUserAddressSuccess,
  deleteUserAddressFailed,
  getAllUsersRequest,
  getAllUsersSuccess,
  getAllUsersFailed,
} from "../reducers/user";
import { loadSellerRequest, loadSellerSuccess, loadSellerFailed } from '../reducers/seller';




export const loadUser = () => async (dispatch) => {
  try {

    dispatch(LoadUserRequest());
    
    const { data } = await axios.get('http://localhost:5000/api/v2/user/getuser', {
      withCredentials: true,
    });
    console.log("::data::",data)
    
    dispatch(LoadUserSuccess(data.user));
  } catch (error) {
    const errorMessage = error.response ? error.response.data.message : "Network Error";
    dispatch(LoadUserFail(errorMessage));
  }
};



export const loadSeller = () => async (dispatch) => {
  try {
    dispatch(loadSellerRequest());
    const { data } = await axios.get('http://localhost:5000/api/v2/shop/getSeller', {
      withCredentials: true,
    });
    console.log("seller data after loading::",data.seller)
    dispatch(loadSellerSuccess(data.seller));
  } catch (error) {
    const errorMessage = error.response ? error.response.data.message : "Network Error";
    dispatch(loadSellerFailed(errorMessage));
  }
}













// User update information
export const updateUserInformation = (name, email, phoneNumber, password) => async (dispatch) => {
  try {
    dispatch(updateUserInfoRequest());
    const { data } = await axios.put(
      `${server}/user/update-user-info`,
      { email, password, phoneNumber, name },
      { withCredentials: true }
    );
    dispatch(updateUserInfoSuccess(data.user));
  } catch (error) {
    const errorMessage = error.response ? error.response.data.message : "Network Error";
    dispatch(updateUserInfoFailed(errorMessage));
  }
};

// Update user address
export const updatUserAddress = (country, city, address1, address2, zipCode, addressType) => async (dispatch) => {
  try {
    dispatch(updateUserAddressRequest());
    const { data } = await axios.put(
      `http://localhost:5000/api/v2/user/update-user-addresses`,
      { country, city, address1, address2, addressType, zipCode },
      { withCredentials: true }
    );
    dispatch(updateUserAddressSuccess({ successMessage: "User address updated successfully!", user: data.user }));
  } catch (error) {
    const errorMessage = error.response ? error.response.data.message : "Network Error";
    dispatch(updateUserAddressFailed(errorMessage));
  }
};

// Delete user address
export const deleteUserAddress = (id) => async (dispatch) => {
  try {
    dispatch(deleteUserAddressRequest());
    const { data } = await axios.delete(`${server}/user/delete-user-address/${id}`, { withCredentials: true });
    dispatch(deleteUserAddressSuccess({ successMessage: "User address deleted successfully!", user: data.user }));
  } catch (error) {
    const errorMessage = error.response ? error.response.data.message : "Network Error";
    dispatch(deleteUserAddressFailed(errorMessage));
  }
};

// Get all users (Admin)
export const getAllUsers = () => async (dispatch) => {
  try {
    dispatch(getAllUsersRequest());
    const { data } = await axios.get(`http://localhost:5000/api/v2/user/admin-all-users`, {
      withCredentials: true,
    });
    console.log(data.users)
    dispatch(getAllUsersSuccess(data.users));
  } catch (error) {
    const errorMessage = error.response ? error.response.data.message : "Network Error";
    dispatch(getAllUsersFailed(errorMessage));
  }
};










