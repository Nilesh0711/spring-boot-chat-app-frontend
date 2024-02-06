import React, { useState, useEffect } from "react";
import { Alert, Button, Snackbar } from "@mui/material";
import { green } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { currentUser, register } from "../../redux/auth/Action";

import lottieData from "../../lottie/signup.json";
import Lottie from "react-lottie";
import { MdEmail } from "react-icons/md";
import { FaLock, FaUser } from "react-icons/fa";
import { CiLogin } from "react-icons/ci";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = localStorage.getItem("token");
  const { auth } = useSelector((store) => store);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackBarSeverity, setSnackBarSeverity] = useState({
    serverity: "",
    message: "",
  });
  const [inputData, setInputData] = useState({
    full_name: "",
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

  const isValidInput = () => {
    if (inputData.full_name.length < 2) {
      setSnackBarSeverity(() => ({
        serverity: "error",
        message: "User name must be more than 2 character",
      }));
      setOpenSnackbar(true);
      return false;
    }
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
    const res = await dispatch(register(inputData));
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

  useEffect(() => {
    if (token) dispatch(currentUser(token));
  }, [token]);

  useEffect(() => {
    if (auth.reqUser?.full_name) navigate("/");
  }, [auth.reqUser]);

  return (
    <div>
      <div className="flex w-full justify-center items-center h-screen">
        {/* Lottie Animation */}
        <div>
          <Lottie options={lottieDefaultConfig} height={400} width={400} />
        </div>

        <div className="flex flex-col justify-center h-screen w-[30%] mx-20">
          {/* sign up header */}
          <div className="p-5 text-xl shadow-md bg-white my-3 rounded-t-md flex items-center px-10 justify-between">
            <p className="text-black font-bold font-serif">Sign Up</p>
            <CiLogin className="w-7 h-8" />
          </div>
          {/* sign up body */}
          <div className="p-10 shadow-md bg-white rounded-b-md">
            {/* sign up form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* full_name input */}
              <div>
                <label
                  htmlFor="input-group-1"
                  className="block mb-2 font-medium text-gray-900"
                >
                  User Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center pl-3.5 pointer-events-none">
                    <FaUser />
                  </div>
                  <input
                    value={inputData.full_name}
                    name="full_name"
                    id="input-group-1"
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className=" border text-sm rounded-lg block w-full ps-10 p-2.5"
                    type="text"
                  />
                </div>
              </div>

              {/* email input */}
              <div>
                <label
                  htmlFor="input-group-2"
                  className="block mb-2 font-medium text-gray-900"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center pl-3.5 pointer-events-none">
                    <MdEmail />
                  </div>
                  <input
                    value={inputData.email}
                    name="email"
                    id="input-group-2"
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className=" border text-sm rounded-lg block w-full ps-10 p-2.5"
                    type="email"
                  />
                </div>
              </div>

              {/* password input */}
              <div>
                <label
                  htmlFor="input-group-3"
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
                    id="input-group-3"
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
                  SignUp
                </Button>
              </div>
            </form>

            {/* already have an Account */}
            <div className="flex space-x-3 items-center mt-5">
              <p className="m-0">Already have an account?</p>
              <Button variant="text" onClick={() => navigate("/signin")}>
                SignIn
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

export default Signup;
