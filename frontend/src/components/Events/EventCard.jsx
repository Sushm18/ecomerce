import React from 'react'
import CountDown from './CountDown'
import styles from '../../styles/styles'
import { backend_url } from '../../../server';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addtoCartreducer } from '../../redux/reducers/cart';

// import 
const EventCard = ({ active, data }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  console.log(data);


  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: 1 };
        dispatch(addtoCartreducer(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  // console.log("Data at event page:::", data)

  return (
    <div className={`w-full block bg-white rounded-lg ${active ? "unset" : "mb-12"
      } lg:flex p-2`}>

      <div className="w-[60%] lg:-w[50%] m-5">


        <img

          src={`${backend_url}${data?.images[0]}`}
          alt=""
          className='' />

      </div>

      <div className="w-full lg:[w-50%] flex flex-col justify-center">
        <h2 className={`${styles.productTitle}`}>{data?.name}</h2>
        <p>
          {data?.description}

        </p>
        <div className="flex py-2 justify-between">
        <div className="flex">
  {data?.originalPrice && (
    <h5 className="font-[500] text-[18px] text-[#d55b45] pr-3 line-through">
      ₹{data?.originalPrice}
    </h5>
  )}
  
  <h5 className="font-bold text-[20px] text-[#333] font-Roboto">
    ₹{data?.discountPrice}
  </h5>
  
  <span className=" pl-2 pr-3 font-[400] text-[17px] text-[#44a55e]">
    {data?.sold_out} sold
  </span>
</div>


          {/* <CountDown data={data} className='text-1px' /> */}
          <br />
          <div className=" mt-2 flex items-center">
            <Link to={`/product/${data?._id}?isEvent=true`}>
              <div className={`${styles.button} text-[#fff]`}>See Details</div>
            </Link>
            <div className={`${styles.button} text-[#fff] ml-5`}
              onClick={() => addToCartHandler(data)} >
              Add to cart</div>
          </div>
          

        </div>
        <CountDown data={data} className="text-1px text-gray-500" />
      </div>
    </div>
  )
}

export default EventCard