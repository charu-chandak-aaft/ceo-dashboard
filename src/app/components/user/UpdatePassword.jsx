import usePost from "@/hooks/usePost";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import Spinner from "../icons/Spinner";
import useProfile from "@/hooks/useProfile";
import { showErrClass } from "./constants/helper";

export default function UpdatePassword() {
  const [newPassword, setNewPassword] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });
  const password = watch('password');
  const { user, loading: proFileLoader, error: ProfileError } = useProfile();
  const showError = (fieldName) =>
    errors[fieldName] ? (
      <span className={`${showErrClass} font-normal text-sm block mt-2`}>
        {errors[fieldName].message}
      </span>
    ) : null;

  const { postData, loading, error, response } = usePost("auth/update-password");
  const router = useRouter();

  const handleFrmSubmit = useCallback(async (payload) => {
    console.log("payload ", payload);
    const {password} = payload
    const apiPayload = {
      newPassword:password,
      email:user?.email,
    }
    console.log("apiPayload ", apiPayload);

    // return;
    const result = await postData(apiPayload);
    console.log("result ", error, loading, result);
    if (result?.success) {
      console.log("✅ Successfull:", result);
      if (result?.userData?.role === "sales"|| result?.userData?.role === "admin") {
        router.push("/admin/Dashboard");
      }
    }
  });
  
  // return (
  //   <div className="flex flex-col items-center justify-center min-h-screen">
  //     <input type="password" placeholder="New Password" className="p-2 border" onChange={(e) => setNewPassword(e.target.value)} />
  //     <button onClick={handleUpdate} className="bg-green-500 text-white p-2 mt-2">Update Password</button>
  //   </div>
  // );
  if (proFileLoader) {
    return (
      <div className="text-center flex justify-center items-center p-3">
        <Spinner color="text-customBlue" />
      </div>
    );
  }
  return (
    <div className="bg-[#f9f9f9] flex items-center justify-center">
      <div className="h-screen w-full pb-8 bg-[#F8F2F2]">
        <div className="bg-gradient-to-b from-red-500 to-red-900 text-white py-20 px-10 rounded-b-3xl text-center">
          <h1 className="text-2xl font-black mx-w-sm">
            Welcome to the AAFT Chatbot Dashboard
          </h1>
          <p className="mt-6 text-[10px]">One tool for your whole team needs</p>
        </div>

        <div className="bg-white shadow-lg p-6 rounded-xl max-w-md lg:max-w-sm mx-auto -mt-10">
          <h3 className="text-center text-gray-400 uppercase text-xs mb-4">
            Just Update Password
          </h3>
          <h2 className="text-center text-xl font-bold mb-6 text-black">
            {user?.email}
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit(handleFrmSubmit)}>
            

            <div className="text-sm pb-3">
              {/* <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label> */}
              <input
                type="password"
                placeholder="Password"
                id="password"
                className="block w-full border-b
                             border-gray-300 focus:outline-none text-[#44444F]"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
                    message: 'Password must contain at least one letter and one number',
                  },
                })}
              />
              {showError("password")}
            </div>

            <div className="text-sm pb-3">
              {/* <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email ID</label> */}
              {/* Confirm Password Field */}
              <input
                type="password"
                placeholder="Confirm Password"
                id="confirmPassword"
                className="block w-full border-b border-gray-300 focus:outline-none text-[#44444F]"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value == password || "Passwords do not match",
                })}
              />
              {showError("confirmPassword")}
            </div>

            <button
              type="submit"
              className={`w-full ${!isValid ? 'bg-[#acacac] cursor-not-allowed' : 'bg-gray-500 cursor-pointer' } text-white py-2 
              rounded-full text-sm mt-2 relative text-center`}
              disabled={!isValid}
            >
              {loading ? <Spinner color="text-blue" /> : "Update"}
              {/* <Spinner color="text-blue" /> */}
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {response && <p style={{ color: "green" }}>Redirecting!</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
