import React, { useState, useEffect, Fragment } from "react";
import { PencilIcon, XIcon, PlusCircleIcon } from "@heroicons/react/outline";

export const PeaksTable = ({ peaks}) => {
  
  // const handleCreate = () => {
  //   const peak = {
  //     name: "Test Post from webite",
  //     location_descr: "Location description",
  //   };
  //   console.log("create peak");
  //   fetch(`http://127.0.0.1:8000/peaks/user/1/`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Token ${localStorage.getItem("token")}`,
  //     },
  //     body: JSON.stringify(peak),
  //   })
  // };

  return (
    <div className="">
      {peaks.map((peak, idx) => (
        <div key={`peak-${idx}`}>
          <div className="w-full bg-gray-900 rounded-lg shadow-lg text-gray-300 my-5 py-2">
            <div className=" text-center font-light text-2xl pt-2">
              {peak.name}
            </div>
            <div className="flex w-full justify-center font-sans text-lg py-5">
              {peak.location_descr}
            </div>
            <div className="flex w-full justify-center font-sans text-md">
              <div className="px-3">Latitude: {peak.latitude}</div>
              <div className="px-3">Longitude: {peak.longitude}</div>
              <div className="px-3">Summit Date: {peak.summit_date}</div>
            </div>
          </div>
          <div className="flex justify-evenly">
            <button>
              <PencilIcon
                className="block h-6 w-6 text-purple-700"
                aria-hidden="true"
              />
            </button>
            <button>
              <XIcon
                className="block h-6 w-6 text-red-700"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      ))}
      <div className="flex justify-center py-11">
        {/* <button onClick={handleCreate}>
          <PlusCircleIcon
            className="block h-10 w-10 text-green-700"
            aria-hidden="true"
          />
        </button> */}
      </div>
    </div>
  );
};
