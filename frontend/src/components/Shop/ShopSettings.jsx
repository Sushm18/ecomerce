import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { backend_url, server } from "../../../server";
import { AiOutlineCamera } from "react-icons/ai";
import styles from "../../styles/styles";
import axios from "axios";
import { loadSeller } from "../../redux/actions/user";
import { toast } from "react-toastify";
// import { useDispatch } from "react-redux";

const ShopSettings = () => {
  const { seller } = useSelector((state) => state.seller);
  const [avatar, setAvatar] = useState();
  const [name, setName] = useState(seller && seller.name);
  const [description, setDescription] = useState(
    seller && seller.description ? seller.description : ""
  );
  const dispatch = useDispatch();
  const [address, setAddress] = useState(seller && seller.address);
  const [phoneNumber, setPhoneNumber] = useState(seller && seller.phoneNumber);
  const [zipCode, setZipcode] = useState(seller && seller.zipCode);

  // Construct and log the formatted image URL
  const imageUrl = `${backend_url}${seller?.avatar?.replace(/^uploads[\\/]+/, "").replace(/\\/g, "/")}`;
  console.log("Formatted Image URL inside setting page:", imageUrl);

  // const handleImage = async (e) => {
  //   const file = e.target.files[0];
  //   console.log("file::",file)
  //   if (file) {
  //     setAvatar(URL.createObjectURL(file));

  //     const formData = new FormData();
  //     formData.append("avatar", avatar);
  //     console.log(formData)

  //     try {
  //       await axios.put(`http://localhost:5000/shop/update-shop-avatar`, formData, {
  //         withCredentials: true,
  //       });
  //       dispatch(loadSeller());
  //       toast.success("Avatar updated successfully!");
  //     } catch (error) {
  //       console.log("Avatar error::", error.response?.data?.message)
  //       toast.error(error.response?.data?.message || "Failed to update avatar");
  //     }
  //   }
  // };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    console.log(file,file)
    if (file) {

      setAvatar(URL.createObjectURL(file)); // For preview
      
      const formData = new FormData();
      formData.append("image", file);
  
      try {
        await axios.put(`${server}/shop/update-shop-avatar`, formData, {
          withCredentials: true,
        });
        dispatch(loadSeller());
        toast.success("Avatar updated successfully!");
      } catch (error) {
        console.error("Avatar error::", error);
        toast.error(error.response?.data?.message || "Failed to update avatar");
      }
    }
  };
  

  const updateHandler = async (e) => {
    e.preventDefault();

    await axios
      .put(
        `${server}/shop/update-seller-info`,
        {
          name,
          address,
          zipCode,
          phoneNumber,
          description,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Shop info updated succesfully!");
        dispatch(loadSeller());
      })
      .catch((error) => {
        toast.error(error.response?.data?.message);
      });
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center">
      <div className="flex w-[60%] 800px:w-[80%] flex-col justify-center my-5 bg-white p-6 rounded-lg shadow-md">
  <div className="w-full flex items-center justify-center">
    <div className="relative">
      <img
        src={imageUrl}
        alt="Shop Avatar"
        className="w-[200px] h-[200px] rounded-full cursor-pointer border-4 border-gray-300 shadow-lg object-cover"
      />
      <div className="w-[40px] h-[40px] bg-gray-100 rounded-full flex items-center justify-center cursor-pointer absolute bottom-[10px] right-[15px] shadow-md">
        <input
          type="file"
          id="image"
          className="hidden"
          onChange={handleImage}
        />
        <label htmlFor="image" className="cursor-pointer">
          <AiOutlineCamera className="text-gray-600 text-lg" />
        </label>
      </div>
    </div>
  </div>

  {/* Shop Info Form */}
  <form
  aria-required={true}
  className="flex flex-col items-center mt-6 space-y-6"
  onSubmit={updateHandler}
>
  {/* Shop Fields Container */}
  <div className="flex flex-wrap justify-between w-full 800px:w-[70%] gap-6">
    {/* Shop Name */}
    <div className="w-full 800px:w-[48%]">
      <label className="block pb-2 text-gray-700 font-semibold">Shop Name</label>
      <input
        type="text"
        placeholder={seller?.name || "Enter shop name"}
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>

    {/* Shop Description */}
    <div className="w-full 800px:w-[48%]">
      <label className="block pb-2 text-gray-700 font-semibold">Shop Description</label>
      <input
        type="text"
        placeholder={seller?.description || "Enter shop description"}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    {/* Shop Address */}
    <div className="w-full 800px:w-[48%]">
      <label className="block pb-2 text-gray-700 font-semibold">Shop Address</label>
      <input
        type="text"
        placeholder={seller?.address || "Enter shop address"}
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>

    {/* Phone Number */}
    <div className="w-full 800px:w-[48%]">
      <label className="block pb-2 text-gray-700 font-semibold">Phone Number</label>
      <input
        type="number"
        placeholder={seller?.phoneNumber || "Enter phone number"}
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>

    {/* Zip Code */}
    <div className="w-full 800px:w-[48%]">
      <label className="block pb-2 text-gray-700 font-semibold">Zip Code</label>
      <input
        type="number"
        placeholder={seller?.zipCode || "Enter zip code"}
        value={zipCode}
        onChange={(e) => setZipcode(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>
  </div>

  {/* Submit Button */}
  <div className="w-full 800px:w-[70%] mt-6">
    <input
      type="submit"
      value="Update Shop"
      className=" ml-8 w-[80%] bg-blue-500 text-white py-2 rounded-md cursor-pointer hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
</form>

</div>

    </div>
  );
};

export default ShopSettings;