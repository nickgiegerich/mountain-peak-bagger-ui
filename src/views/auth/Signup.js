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
    auth.verify().then((value) => {
      if (value[0]) {
        window.location.replace("http://localhost:3000/dashboard");
      } else {
        setLoading(value[0]);
      }
    });
  }, [auth]);

  const onSubmit = async (e) => {
    e.preventDefault();

    const authorized = await auth.signup({ email, password1, password2 });

    if (!authorized) {
      setEmail("");
      setPassword1("");
      setPassword2("");
      setErrors(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-200 bg-auth-bg bg-no-repeat bg-cover">
      <form
        className="relative w-full mx-10 bg-gray-100 rounded-lg bg-opacity-50 filter backdrop-filter backdrop-blur-lg"
        onSubmit={onSubmit}
      >
        <div className="relative block mx-auto my-10 w-full text-center">
          {errors === true && (
            <h2 className="text-3xl font-light text-red-400">
              cannot signup with provided credentials
            </h2>
          )}
        </div>

        <div className="relative block mx-auto my-10 w-full text-center">
          {loading === false && <h1 className="text-3xl font-light">register</h1>}
        </div>
        <div className="relative block mx-auto w-full text-center">
          <input
            className="relative px-10 py-4 bottom-2 rounded-lg bg-gray-100 border border-gray-500 w-2/3 shadow-lg focus:outline-none"
            placeholder="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />{" "}
        </div>
        <br />
        <div className="relative block mx-auto w-full text-center">
          <input
            className="relative px-10 py-4 bottom-2 rounded-lg bg-gray-100 border border-gray-500 w-2/3 shadow-lg focus:outline-none"
            placeholder="password"
            name="password1"
            type="password"
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
            required
          />{" "}
        </div>
        <br />
        <div className="relative block mx-auto w-full text-center">
          <input
            className="relative px-10 py-4 bottom-2 rounded-lg bg-gray-100 border border-gray-500 w-2/3 shadow-lg focus:outline-none"
            placeholder="confirm password"
            name="password2"
            type="password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
          />{" "}
        </div>
        <br />
        <button
          type="submit"
          value={"Signup"}
          className="relative block my-10 w-1/2 mx-auto  cursor-pointer"
        >
          {/* BG Shadow */}
          <div className="absolute inset-x-0 inset-y-0 bottom-0 bg-gray-300 border border-gray-500 rounded-lg" />

          {/* Text */}
          <div className="relative bottom-2 text-xl font-thin leading-none tracking-wider py-4 px-10 bg-gray-100 border border-gray-500 rounded-lg transform hover:translate-y-1 transition duration-200 ease-in-out">
            register
          </div>
        </button>
      </form>
    </div>
  );
};

export default Signup;
