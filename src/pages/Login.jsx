// LoginPage.jsx
import React, { useContext, useState } from "react";
import Input from "../components/Input";
import { MdOutlineMail, MdOutlinePerson } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri"
import { FaArrowRight } from "react-icons/fa";
import Button from "../components/Button";
import { TbRuler } from "react-icons/tb";
import { login } from "../utils/fn";
import Loader from "../components/Loader";
import { Link } from "react-router";
import { TokenDispatchContext } from "../context/TokenContext";


export default function Login() {

  const tokenDispatch = useContext(TokenDispatchContext)

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  })
  const [isLoading, setIsLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setIsLoading(true)
    const response = await login(loginData)
    try {
      setIsLoading(true)
      const response = await login(loginData)
      if (response) {
        console.log(response);
        tokenDispatch({
          type: "loggedIn",
          payload: response.token
        })
        sessionStorage.setItem("token", response.token)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

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

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <Input
              label={"Email"}
              id={"email"}
              placeholder={"Enter email address"}
              type={"email"}
              icon={<MdOutlineMail size={24} color="#75777D" />}
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
            />

            {/* Password */}

            <Input
              label={"Password"}
              id={"password"}
              placeholder={"Enter password"}
              icon={<RiLockPasswordLine size={24} color="#75777D" />}
              isPasswordType={true}
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            />

            {/* Sign In Button */}
            <Button
              disabled={isLoading}
              type="submit"
            >
              {
                isLoading ? <Loader /> : (
                  <>
                    Sign in to Portal
                    <FaArrowRight />
                  </>
                )
              }

            </Button>
          </form>

          <div className="text-center text-sm text-gray-600 pt-6 border-t border-[#C5C6CD]">
            Don’t have an account? {" "}
            <Link to="/signup" className="font-semibold">
              Register
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
