// productThunk.js
import axios from "axios";
import {
  productCreateRequest,
  productCreateSuccess,
  productCreateFail,
  getAllProductsShopRequest,
  getAllProductsShopSuccess,
  getAllProductsShopFailed,
  deleteProductRequest,
  deleteProductSuccess,
  deleteProductFailed,
  getAllProductsRequest,
  getAllProductsSuccess,
  getAllProductsFailed,
} from "../reducers/product";

// Create product
export const createProduct = (newForm) => async (dispatch) => {
  try {
      // Log FormData content
      for (let [key, value] of newForm.entries()) {
        console.log(`${key}: ${value}`);
    }
    dispatch(productCreateRequest());

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const { data } = await axios.post(
      "http://localhost:5000/api/v2/product/create-product",
      newForm,
      config
    );
    dispatch(productCreateSuccess(data.product));
  } catch (error) {
    dispatch(productCreateFail(error.response.data.message));
  }
};

// Get All Products of a shop
export const getAllProductsShop = (id) => async (dispatch) => {
  try {
    dispatch(getAllProductsShopRequest());

    const { data } = await axios.get(
      `http://localhost:5000/api/v2/product/get-all-products-shop/${id}`
    );
    console.log("------data.products--------",data.products)
    dispatch(getAllProductsShopSuccess(data.products));
  } catch (error) {
    dispatch(getAllProductsShopFailed(error.response.data.message));
  }
};

// Delete product of a shop
export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch(deleteProductRequest());

    const { data } = await axios.delete(
      `http://localhost:5000/api/v2/product/delete-shop-product/${id}`,
      {
        withCredentials: true,
      }
    );

    dispatch(deleteProductSuccess(data.message));
  } catch (error) {
    dispatch(deleteProductFailed(error.response.data.message));
  }
};

// Get all products
export const getAllProducts = () => async (dispatch) => {
  try {
    dispatch(getAllProductsRequest());

    const { data } = await axios.get(
      "http://localhost:5000/api/v2/product/get-all-products"
    );
    console.log(data.products)
    dispatch(getAllProductsSuccess(data.products));
  } catch (error) {
    dispatch(getAllProductsFailed(error.response.data.message));
  }
};






