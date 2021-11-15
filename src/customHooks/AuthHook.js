import * as React from "react";

const authContext = React.createContext();

function useAuth() {
  const [authed, setAuthed] = React.useState(false);

  return {
    authed,
    async login({ email, password }) {
      const user = {
        email: email,
        password: password,
      };
      const res = await fetch("http://127.0.0.1:8000/users/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const data = await res.json();
      if (data.key) {
        setAuthed(true);
        localStorage.clear();
        localStorage.setItem("token", data.key);
        window.location.replace("http://localhost:3000/dashboard");
        return true;
      } else {
        setAuthed(false);
        localStorage.clear();
        return false;
      }
    },
    async logout() {
      const res = await fetch("http://127.0.0.1:8000/users/auth/logout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (data) {
        setAuthed(false);
        localStorage.clear();
        window.location.replace("http://localhost:3000/login");
      }
    },
    async signup({ email, password1, password2 }) {
      const user = {
        email: email,
        password1: password1,
        password2: password2,
      };
      const res = await fetch("http://127.0.0.1:8000/users/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const data = await res.json();
      if (data.key) {
        setAuthed(true);
        localStorage.clear();
        localStorage.setItem("token", data.key);
        window.location.replace("http://localhost:3000/dashboard");
        return true;
      } else {
        setAuthed(false);
        localStorage.clear();
        return false;
      }
    }, 
  };
}

export function AuthProvider({ children }) {
  const auth = useAuth();

  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export default function AuthConsumer() {
  return React.useContext(authContext);
}
