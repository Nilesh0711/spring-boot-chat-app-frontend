import React, { useState, useEffect } from "react";
import { Alert, Button, Snackbar } from "@mui/material";
import { green } from "@mui/material/colors";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { currentUser, login } from "../../redux/auth/Action";
import lottieData from "../../lottie/signin.json";
import Lottie from "react-lottie";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { CiLogin } from "react-icons/ci";

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = localStorage.getItem("token");
  const { auth } = useSelector((store) => store);

  const [snackBarSeverity, setSnackBarSeverity] = useState({
    serverity: "",
    message: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [inputData, setInputData] = useState({
    email: "",
    password: "",
  });

  const lottieDefaultConfig = {
    loop: true,
    autoplay: true,
    animationData: lottieData,
    renderSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    if (token) dispatch(currentUser(token));
  }, [token]);

  useEffect(() => {
    if (auth.reqUser?.full_name) navigate("/");
  }, [auth.reqUser]);

  const isValidInput = () => {
    if (inputData.email.length < 2) {
      setSnackBarSeverity(() => ({
        serverity: "error",
        message: "Email must be vaild!",
      }));
      setOpenSnackbar(true);
      return false;
    }
    if (inputData.password.length < 7) {
      setSnackBarSeverity(() => ({
        serverity: "error",
        message: "Password must be more than 8 character!",
      }));
      setOpenSnackbar(true);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidInput()) return;

    const res = await dispatch(login(inputData));
    if (res?.error && res.error.length > 0) {
      setSnackBarSeverity(() => ({
        serverity: "error",
        message: res.error,
      }));
      setOpenSnackbar(true);
      return;
    }
    setSnackBarSeverity(() => ({
      serverity: "success",
      message: "Login Successfull!",
    }));
    setOpenSnackbar(true);
  };
  const handleChange = (e) => {
    const { value, name } = e.target;
    setInputData((val) => ({ ...val, [name]: value }));
  };
  const handleSnackBarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <div>
      {/* src="https://w0.peakpx.com/wallpaper/818/148/HD-wallpaper-whatsapp-background-cool-dark-green-new-theme-whatsapp.jpg" */}

      <div className="flex w-full justify-center items-center h-screen">
        {/* Lottie Animation */}
        <div>
          <Lottie options={lottieDefaultConfig} height={400} width={400} />
        </div>

        <div className="flex flex-col justify-center h-screen w-[30%] mx-20">
          {/* sign in header */}
          <div className="p-5 text-xl shadow-md bg-white my-3 rounded-t-md flex items-center px-10 justify-between">
            <p className="text-black font-bold font-serif">Sign In</p>
            <CiLogin className="w-7 h-8" />
          </div>

          {/* sign in body */}
          <div className="p-10 shadow-md bg-white rounded-b-md">
            {/* sign in form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* email input */}
              <div>
                <label
                  htmlFor="input-group-1"
                  className="block mb-2 font-medium text-gray-900"
                >
                  Your Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center pl-3.5 pointer-events-none">
                    <MdEmail />
                  </div>
                  <input
                    value={inputData.email}
                    name="email"
                    id="input-group-1"
                    onChange={handleChange}
                    placeholder="Enter your Email"
                    className=" border text-sm rounded-lg block w-full ps-10 p-2.5"
                    type="email"
                  />
                </div>
              </div>

              {/* password input */}
              <div>
                <label
                  htmlFor="input-group-2"
                  className="block mb-2 font-medium text-gray-900"
                >
                  Password
                </label>

                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center pl-3.5 pointer-events-none">
                    <FaLock />
                  </div>
                  <input
                    value={inputData.password}
                    name="password"
                    id="input-group-2"
                    onChange={handleChange}
                    placeholder="Enter your Password"
                    className=" border text-sm rounded-lg block w-full ps-10 p-2.5"
                    type="password"
                  />
                </div>
              </div>

              {/* sumbit button */}
              <div>
                <Button
                  variant="contained"
                  className="w-full bg-green-600"
                  type="submit"
                  sx={{ bgcolor: green[500], padding: ".5rem 0rem" }}
                >
                  SignIn
                </Button>
              </div>
            </form>

            {/* dont have an Account */}
            <div className="flex space-x-3 items-center mt-5">
              <p className="m-0">Create New Account</p>
              <Button variant="text" onClick={() => navigate("/signup")}>
                SignUp
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* sign in Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackBarClose}
      >
        <Alert
          onClose={handleSnackBarClose}
          severity={snackBarSeverity.serverity}
          scx={{ width: "100%" }}
        >
          {snackBarSeverity.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SignIn;
