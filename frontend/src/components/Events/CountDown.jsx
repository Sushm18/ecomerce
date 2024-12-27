import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "../../styles/styles";


const CountDown = ({ data }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  console.log("data at event page",data)

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    if (
      typeof timeLeft.days === 'undefined' &&
      typeof timeLeft.hours === 'undefined' &&
      typeof timeLeft.minutes === 'undefined' &&
      typeof timeLeft.seconds === 'undefined'
    ) {
      axios.delete(`http://localhost:5000/api/v2/event/delete-shop-event/${data._id}`);
    }
    return () => clearTimeout(timer);
  },[timeLeft]);

  function calculateTimeLeft() {
    const difference = +new Date(data?.endDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  const timerComponents = Object.keys(timeLeft).map((interval) => {
    if (!timeLeft[interval]) {
      return null;
    }

    return (
      <span className="text-[25px] text-[#475ad2]">
        {timeLeft[interval]} {interval}{" "}
      </span>
    );
  });

  return (
    <div>
      {timerComponents.length ? (
        timerComponents
      ) : (
        <span className="text-[red] text-[25px]">Time's Up</span>
      )}
    </div>
  );
};

export default CountDown;
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import styles from "../../styles/styles";

// const CountDown = ({ data }) => {
//   const [timeLeft, setTimeLeft] = useState({});
//   const [isDeleted, setIsDeleted] = useState(false);

//   useEffect(() => {
//     if (!data?.Finish_Date) return;

//     const timer = setTimeout(() => {
//       const updatedTimeLeft = calculateTimeLeft();
//       setTimeLeft(updatedTimeLeft);

//       if (
//         !isDeleted &&
//         Object.keys(updatedTimeLeft).length === 0 // No time left
//       ) {
//         axios.delete(`http://localhost:5000/api/v2/event/delete-shop-event/${data._id}`)
//           .then(() => setIsDeleted(true))
//           .catch(err => console.error("Failed to delete event:", err));
//       }
//     }, 1000);

//     return () => clearTimeout(timer);
//   }, [timeLeft, isDeleted]);

//   function calculateTimeLeft() {
//     if (!data?.Finish_Date) return {};

//     const difference = +new Date(data?.Finish_Date) - +new Date();
//     if (difference > 0) {
//       return {
//         days: Math.floor(difference / (1000 * 60 * 60 * 24)),
//         hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
//         minutes: Math.floor((difference / 1000 / 60) % 60),
//         seconds: Math.floor((difference / 1000) % 60),
//       };
//     }
//     return {};
//   }

//   const timerComponents = Object.keys(timeLeft).map((interval) => {
//     if (!timeLeft[interval]) return null;

//     return (
//       <span key={interval} className="text-[25px] text-[#475ad2]">
//         {timeLeft[interval]} {interval}{" "}
//       </span>
//     );
//   });

//   return (
//     <div>
//       {timerComponents.length ? (
//         <div className="flex gap-2">
//           {timerComponents}
//         </div>
//       ) : (
//         <div className="text-center text-red-500 text-xl">Time's Up</div>
//       )}
//     </div>
//   );
// };

// export default CountDown;
