import React from "react";

const Payment = (props) => {
  return (
    <div className="flex justify-between">
      <p className="text-lg mt-3 text-gray-700 font-semibold">{props.label}</p>
      <p className="text-lg mt-3 text-gray-700 font-semibold"> {props.info}</p>
    </div>
  );
};

export default Payment;
