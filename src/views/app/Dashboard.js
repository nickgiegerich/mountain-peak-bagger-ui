import React, { useState, useEffect, Fragment } from "react";
import useAuth from "../../customHooks/AuthHook";
import { PeaksTable } from "./PeaksTable";

const Dashboard = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [peaks, setPeaks] = useState([]);
  const [authorized, setAuthorized] = useState(false);
  const auth = useAuth();

  const updatePeakState = (state) => {
    setPeaks(state);
  };

  useEffect(() => {
    // TODO: need to actaully verify that this token is legit
    auth.verify().then((value) => {
      if (value) {
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
    <div>
      {loading === false && (
        <Fragment>
          <div className="flex w-screen justify-center">
            <h1 className="text-3xl">Dashboard</h1>
          </div>
          <div className="flex w-screen justify-center">
            {peaks && <PeaksTable peaks={peaks} stateChanger={updatePeakState} />}
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default Dashboard;
