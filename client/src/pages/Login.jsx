import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const [state, setState] = useState("Sign Up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    console.log("✅ Form submitted");
    console.log("Current mode:", state);
    console.log("Backend URL:", backendUrl);

    try {
      let data;

      if (state === "Sign Up") {
        console.log("📤 Sending signup request to:", backendUrl + "/api/user/register");

        const response = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });

        console.log("📥 Raw signup response:", response);
        data = response.data;
        console.log("✅ Register response:", data);
      } else {
        console.log("📤 Sending login request to:", backendUrl + "/api/user/login");

        const response = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });

        console.log("📥 Raw login response:", response);
        data = response.data;
        console.log("✅ Login response:", data);
      }

      // ✅ Token handling
      if (data.token) {
        console.log("🔑 Token received:", data.token);
        localStorage.setItem("token", data.token);
        setToken(data.token);
        toast.success("Welcome!");
        navigate("/"); // Redirect
      } else {
        console.warn("⚠️ No token received. Response:", data);
        toast.error(data.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("❌ Error caught:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // If already logged in, redirect
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
        <p className="text-2xl font-semibold">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </p>
        <p>
          Please {state === "Sign Up" ? "sign up" : "log in"} to book appointment
        </p>

        {state === "Sign Up" && (
          <div className="w-full">
            <p>Full Name</p>
            <input
              className="border border-zinc-300 rounded w-full p-2 mt-1"
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>
        )}

        <div className="w-full">
          <p>Email</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>

        <div className="w-full">
          <p>Password</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-primary text-white w-full py-2 rounded-md text-base"
        >
          {state === "Sign Up" ? "Create Account" : "Login"}
        </button>

        {state === "Sign Up" ? (
          <p>
            Already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-primary underline cursor-pointer"
            >
              Login here
            </span>
          </p>
        ) : (
          <p>
            Create a new account?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="text-primary underline cursor-pointer"
            >
              click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
