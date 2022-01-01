import { useState, useEffect } from "react";
import Map from "../../components/map/Map";
import PeakForm from "../../components/peaks/PeakForm";

import { IPeak } from "../../interfaces/PeakInterface";
import PeakList from "../../components/peaks/PeakList";
import { useAuth } from "../../context/Auth";

const Dashboard = () => {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false)
  const auth = useAuth();
  const [peaks, setPeaks] = useState<IPeak[]>([]);

  // useEffect(() => {
  //   auth!.verify().then((value) => {
  //     if (value[0]) {
  //       fetch("http://127.0.0.1:8000/users/auth/user/", {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Token ${localStorage.getItem("token")}`,
  //         },
  //       })
  //         .then((res) => res.json())
  //         .then((data) => {
  //           setUserId(data.pk);
  //           localStorage.setItem("email", data.email);
  //           setLoading(!value);
  //         });
  //     } else {
  //       window.location.replace("http://localhost:3000/login");
  //     }
  //   });
  // }, [auth]);

  // useEffect(() => {
  //   if (userId) {
  //     fetch(`http://127.0.0.1:8000/peaks/user/${userId}/`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Token ${localStorage.getItem("token")}`,
  //       },
  //     })
  //       .then((res) => res.json())
  //       .then((data) => {
  //         setPeaks(data);
  //       });
  //   }
  // }, [userId]);

  return (
    <div className="relative h-screen bg-gray-800 border-white border-0 p-0">
      {loading === false && (
        <div className="flex flex-wrap">
          <h1 className="w-full text-gray-500 text-4xl font-thin uppercase p-4">
              add a peak
          </h1>

          <div className="sticky top-0 w-full self-start">
            <Map />
          </div>

          <div className="absolute top-10 right-0 w-1/3 z-auto">
            <span className="flex h-3 w-3 -mb-2">
              <span className={`${auth.currentPeak ? "animate-ping bg-green-500" : "bg-transparent"} absolute inline-flex h-6 w-6 rounded-full opacity-75`}></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
            </span>
            <button className="text-white px-5 py-2 bg-gray-800 border-4 rounded-md" onClick={() => setShowForm(!showForm)}>
              {showForm ? "X" : "save?"}
            </button>

            <div className={`transform transition scale-y-${showForm ? 1 : 0} duration-75 ${showForm ? "block" : "hidden"}`}>
              <PeakForm peaks={peaks} setPeaks={setPeaks} />
            </div>

          </div>
          {/* <PeakList peaks={peaks} setPeaks={setPeaks} /> */}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
