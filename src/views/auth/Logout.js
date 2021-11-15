import React, { useState, useEffect, Fragment } from "react";
import useAuth from "../../customHooks/AuthHook";

const Logout = () => {
  const [loading, setLoading] = useState(true);
  const auth = useAuth();

  useEffect(() => {
    if (localStorage.getItem("token") == null) {
      window.location.replace("http://localhost:3000/login");
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    auth.logout();
  };

  return (
    <div>
      {loading === false && (
        <Fragment>
          <h1>Are you sure you want to logout?</h1>
          <input type="button" value="Logout" onClick={handleLogout} />
        </Fragment>
      )}
    </div>
  );
};

export default Logout;
