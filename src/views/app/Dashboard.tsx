import React, { useState, useEffect, Fragment } from "react";
import Map from "../../components/map/Map";
import PeakForm from "../../components/peaks/PeakForm";
import useAuth from "../../customHooks/AuthHook";
import { PeaksTable } from "./PeaksTable";
import { IPeak } from "../../interfaces/PeakInterface";
import PeakList from "../../components/peaks/PeakList";

const Dashboard = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [peaks, setPeaks] = useState<IPeak[]>([]);
  const [authorized, setAuthorized] = useState(false);
  const auth = useAuth();

  const updatePeakState = (state: IPeak[]) => {
    setPeaks(state);
  };

  useEffect(() => {
    // TODO: need to actaully verify that this token is legit
    auth!.verify().then((value) => {
      if (value[0]) {
        fetch("http://127.0.0.1:8000/users/auth/user/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            setUserEmail(data.email);
            setUserId(data.pk);
            localStorage.setItem("email", data.email);
            setLoading(!value);
          });
      } else {
        window.location.replace("http://localhost:3000/login");
      }
    });
  }, []);

  useEffect(() => {
    if (userId) {
      fetch(`http://127.0.0.1:8000/peaks/user/${userId}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setPeaks(data);
        });
    }
  }, [userId]);

  return (
    <div className="relative">
      {loading === false && (
        <div className="flex flex-wrap">
          <h1 className="w-full text-black text-4xl font-thin uppercase">
            Dashboard
          </h1>

          <div className="sticky top-0 w-1/2 self-start">
            <Map />
          </div>

          <div className="w-1/2 px-2">
            <PeakForm peaks={peaks} setPeaks={setPeaks} />
            {/* {peaks && (
              <PeaksTable peaks={peaks} />
            )} */}
            <PeakList peaks={peaks} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
