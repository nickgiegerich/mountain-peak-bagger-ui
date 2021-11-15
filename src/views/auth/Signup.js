import React, { useState, useEffect } from "react";
import useAuth from "../../customHooks/AuthHook";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [errors, setErrors] = useState(false);
  const [loading, setLoading] = useState(true);
  const auth = useAuth();

  useEffect(() => {
    if (localStorage.getItem("token") !== null) {
      window.location.replace("http://localhost:3000/dashboard");
    } else {
      setLoading(false);
    }
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();

    const authorized = auth.signup({ email, password1, password2 });

    if (!authorized) {
      setEmail("");
      setPassword1("");
      setPassword2("");
      setErrors(true);
    }
  };

  return (
    <div>
      {loading === false && <h1>Signup</h1>}
      {errors === true && <h2>Cannot signup with provided credentials</h2>}
      <form onSubmit={onSubmit}>
        <label htmlFor="email">Email address:</label> <br />
        <input
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />{" "}
        <br />
        <label htmlFor="password1">Password:</label> <br />
        <input
          name="password1"
          type="password"
          value={password1}
          onChange={(e) => setPassword1(e.target.value)}
          required
        />{" "}
        <br />
        <label htmlFor="password2">Confirm password:</label> <br />
        <input
          name="password2"
          type="password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          required
        />{" "}
        <br />
        <input type="submit" value="Signup" />
      </form>
    </div>
  );
};

export default Signup;
