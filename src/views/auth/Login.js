import React, { useState, useEffect } from "react";
import useAuth from "../../customHooks/AuthHook";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const auth = useAuth();

  useEffect(() => {
    auth.verify().then((value) => {
      if (value[0]) {
        window.location.replace("http://localhost:3000/");
      } else {
        setLoading(value[0]);
      }
    });
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();

    const authorized = auth.login({ email, password });

    if (!authorized) {
      setEmail("");
      setPassword("");
      setErrors(true);
    }
  };

  return (
    <div>
      {loading === false && <h1>Login</h1>}
      {errors === true && <h2>Cannot log in with provided credentials</h2>}
      {loading === false && (
        <form onSubmit={onSubmit}>
          <label htmlFor="email">Email address:</label> <br />
          <input
            name="email"
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />{" "}
          <br />
          <label htmlFor="password">Password:</label> <br />
          <input
            name="password"
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />{" "}
          <br />
          <input type="submit" value="Login" />
        </form>
      )}
    </div>
  );
};

export default Login;
