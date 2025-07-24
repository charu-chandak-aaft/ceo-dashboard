"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { showErrClass } from "./constants/helper";
import usePost from "@/hooks/usePost";
import Spinner from "../icons/Spinner";
import { setCookie } from "@/utils/helper";
import { useProfileContext } from "@/app/context/ProfileContext";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const { setProfileDetails } = useProfileContext();
  const { postData, loading, error, response } = usePost("auth/login");
  const router = useRouter();

  const showError = (fieldName) =>
    errors[fieldName] ? (
      <span className={`${showErrClass} font-normal text-sm block mt-2`}>
        {errors[fieldName].message}
      </span>
    ) : null;

  const handleFrmSubmit = useCallback(async (payload) => {
    const result = await postData(payload);
    if (result?.success) {
      // console.log("login data", result);
      // setCookie('token', result?.token);
      setProfileDetails(result?.user);
      router.push('/user/Dashboard');
    }
  }, [postData, router, setProfileDetails]);


  return (
    <div className="bg-[#f9f9f9] flex items-center justify-center">
      <div className="w-full pb-8 bg-[#F8F2F2]">
        <div className="bg-gradient-to-b from-red-500 to-red-900 text-white py-20 px-10 rounded-b-3xl text-center">
          <h1 className="text-2xl font-black mx-w-sm">
            Welcome to the AAFT Common Dashboard
          </h1>
          <p className="mt-6 text-[14px] font-medium"> Monitoring your Dashboards Anytime. Easier & Effective than Before </p>
        </div>

        <div className="bg-white shadow-lg p-6 rounded-xl max-w-md lg:max-w-sm mx-auto -mt-10">
          <h3 className="text-center text-gray-400 uppercase text-xs mb-4">
            Just Login First
          </h3>

          <form className="space-y-4" onSubmit={handleSubmit(handleFrmSubmit)}>
            <div className="text-sm pb-3">
              <input
                type="text"
                placeholder="Email ID"
                id="email"
                className="block w-full border-b border-gray-300 focus:outline-none text-[#44444F]"
                {...register("email", {
                  required: "This field is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {showError("email")}
            </div>

            <div className="text-sm pb-3">
              <input
                type="password"
                placeholder="Password"
                id="password"
                className="block w-full border-b border-gray-300 focus:outline-none text-[#44444F]"
                {...register("password", {
                  required: "Password is required",
                })}
              />
              {showError("password")}
            </div>

            <button
              className={`w-full ${!isValid ? "bg-[#acacac] cursor-not-allowed" : "bg-gray-500 cursor-pointer"} text-white py-2 rounded-full text-sm mt-2 relative text-center`}
              disabled={!isValid}
            >
              {loading ? <Spinner color="text-blue" /> : "Login"}
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {response && <p style={{ color: "green" }}>✅ Login Success!</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
