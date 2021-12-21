import React, { useState, useEffect } from "react";
import useAuth from "../../customHooks/AuthHook";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState(false);
  const [loading, setLoading] = useState(true);
  const auth = useAuth();

  useEffect(() => {
    auth.verify().then((value) => {
      if (value[0]) {
        window.location.replace("http://localhost:3000/");
      } else {
        setLoading(value[0]);
      }
    });
  }, [auth]);

  const onSubmit = async (e) => {
    e.preventDefault();

    const authorized = await auth.login({ email, password });

    console.log(authorized);

    if (!authorized) {
      setEmail("");
      setPassword("");
      setErrors(true);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-blue-200 bg-auth-bg bg-no-repeat bg-cover">
        {loading === false && (
          <form
            className="relative w-full mx-10 bg-gray-100 rounded-lg bg-opacity-50 filter backdrop-filter backdrop-blur-lg"
            onSubmit={onSubmit}
          >
            {/* FORM LABEL */}

            <div className="relative block mx-auto my-10 w-full text-center">
              {errors === true && (
                <h2 className="text-3xl font-light text-red-400">
                  cannot log in with provided credentials
                </h2>
              )}
            </div>

            <div className="relative block mx-auto my-10 w-full text-center">
              {loading === false && (
                <h1 className="text-3xl font-light">login</h1>
              )}
            </div>

            {/* EMAIL INPUT */}

            <div className="relative block mx-auto w-full text-center">
              {/* <div className="absolute inset-x-0 inset-y-4 bottom-0 bg-gray-300 border border-gray-500 rounded-lg w-2/3 mx-auto" /> */}
              <input
                className="relative px-10 py-4 bottom-2 rounded-lg bg-gray-100 border border-gray-500 w-2/3 shadow-lg focus:outline-none"
                placeholder="e-mail"
                name="email"
                type="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />{" "}
            </div>
            <br />

            {/* PASSWORD INPUT */}

            <div className="relative block mx-auto w-full text-center">
              {/* <div className="absolute inset-x-0 inset-y-4 bottom-0 bg-gray-300 border border-gray-500 rounded-lg w-2/3 mx-auto" /> */}
              <input
                className="relative px-10 py-4 bottom-2 rounded-lg bg-gray-100 border border-gray-500 w-2/3 shadow-lg focus:outline-none"
                placeholder="password"
                name="password"
                type="password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />{" "}
            </div>
            <br />
            {/* <input type="submit" value="Login" /> */}
            <button
              type="submit"
              value={"Login"}
              className="relative block my-10 w-1/2 mx-auto  cursor-pointer"
            >
              {/* BG Shadow */}
              <div className="absolute inset-x-0 inset-y-0 bottom-0 bg-gray-300 border border-gray-500 rounded-lg" />

              {/* Text */}
              <div className="relative bottom-2 text-xl font-thin leading-none tracking-wider py-4 px-10 bg-gray-100 border border-gray-500 rounded-lg transform hover:translate-y-1 transition duration-200 ease-in-out">
                login
              </div>
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default Login;
