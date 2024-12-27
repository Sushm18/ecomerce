import axios from "axios";
import { 
  eventCreateRequest, 
  eventCreateSuccess, 
  eventCreateFail, 
  getAlleventsShopRequest, 
  getAlleventsShopSuccess, 
  getAlleventsShopFailed, 
  deleteeventRequest, 
  deleteeventSuccess, 
  deleteeventFailed, 
  getAlleventsRequest, 
  getAlleventsSuccess, 
  getAlleventsFailed 
} from "../reducers/event";

// create event
export const createevent = (newForm) => async (dispatch) => {
  try {
    dispatch(eventCreateRequest());

    const config = {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    };

    const { data } = await axios.post('http://localhost:5000/api/v2/event/create-event', newForm, config);
    dispatch(eventCreateSuccess(data.event));
  } catch (error) {
    dispatch(eventCreateFail(error.response.data.message));
  }
};

// get all events of a shop
export const getAllEventsShop  = (id) => async (dispatch) => {
  try {
    dispatch(getAlleventsShopRequest());

    const { data } = await axios.get(`http://localhost:5000/api/v2/event/get-all-events/${id}`);
    dispatch(getAlleventsShopSuccess(data.events));
  } catch (error) {
    dispatch(getAlleventsShopFailed(error.response.data.message));
  }
};

// delete event of a shop
export const deleteEvent = (id) => async (dispatch) => {
  try {
    dispatch(deleteeventRequest());

    const { data } = await axios.delete(`http://localhost:5000/api/v2/event/delete-shop-event/${id}`, {
      withCredentials: true,
    });

    dispatch(deleteeventSuccess(data.message));
  } catch (error) {
    dispatch(deleteeventFailed(error.response.data.message));
  }
};

// get all events
export const getAllEvents = () => async (dispatch) => {
  try {
    dispatch(getAlleventsRequest());

    const { data } = await axios.get(`http://localhost:5000/api/v2/event/get-all-events`);
    dispatch(getAlleventsSuccess(data.events));
  } catch (error) {
    dispatch(getAlleventsFailed(error.response.data.message));
  }
};
