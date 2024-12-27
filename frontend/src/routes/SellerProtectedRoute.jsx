import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from "../components/Layout/Loader";

const SellerProtectedRoute = ({ children }) => {
  const { isLoading, isSeller } = useSelector((state) => state.seller);
  if (isLoading === true) {
    return <Loader />;
    // return children;
  } else {
    if (!isSeller) {
      return <Navigate to={`/shop-login`} replace />;
    }
    return children;
  }
};

export default SellerProtectedRoute;


// import { useNavigate,Navigate } from "react-router-dom";

// const SellerProtectedRoute = ({ isSeller,  children }) => {


//   if(!isSeller){
//     return <Navigate to={`/`} replace/>
//   }
//   return children
// }

// export default SellerProtectedRoute;
