// LoginPage.jsx
import React from "react";
import Input from "../components/Input";
import { MdOutlineMail, MdOutlinePerson } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri"
import { FaArrowRight } from "react-icons/fa";
import Button from "../components/Button";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-md space-y-6">
        <div>
          <h1 className="font-bold text-2xl text-center">Inventory Management</h1>
        </div>
        <div className="space-y-6 py-10 px-8 rounded-xl border border-[#C5C6CD] bg-white">
          <div>
            <h1 className="text-2xl font-semibold text-[#191C1E]">
              Secure Sign In
            </h1>
            <p>Enter your credentials to access the dashboard</p>
          </div>

          <form className="space-y-6">
            {/* Email */}
            <Input
              label={"Email"}
              id={"email"}
              placeholder={"Enter email address"}
              type={"email"}
              icon={<MdOutlineMail size={24} color="#75777D" />}
            />

            {/* Password */}

            <Input
              label={"Password"}
              id={"password"}
              placeholder={"Enter password"}
              icon={<RiLockPasswordLine size={24} color="#75777D" />}
              isPasswordType={true}
            />

            {/* Sign In Button */}
            <Button>
              Sign in to Portal
              <FaArrowRight />
            </Button>
          </form>

          <div className="text-center text-sm text-gray-600 pt-6 border-t border-[#C5C6CD]">
            Don’t have an account? {" "}
            <span className="font-semibold">
              Register
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
