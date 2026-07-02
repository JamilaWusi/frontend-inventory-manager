import { useState } from "react";
import Input from "../components/Input";
import { MdOutlineMail, MdOutlinePersonOutline, MdOutlinePhone } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import Button from "../components/Button";
import { FaArrowRight } from "react-icons/fa";
import { register } from "../utils/fn";
import Loader from "../components/Loader";
import { Link } from "react-router";

function Signup() {

  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
  })
 const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setIsLoading(true)
      const res = await register(registerData)
      console.log(res)
      if (res) {
        // registration succeeded — redirect to login page
        window.location.href = "/login";
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-md space-y-6">
        <div>
          <h1 className="font-bold text-2xl text-center">Inventory Management</h1>
        </div>
        <div className="space-y-6 py-10 px-8 rounded-xl border border-[#C5C6CD] bg-white">
          <div>
            <h1 className="text-2xl font-semibold text-[#191C1E]">
              Create an account
            </h1>
            <p>Start optimizing your supply chain today.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label={"First Name"}
              id={"firstName"}
              placeholder={"Enter first name"}
              type={"text"}
              icon={<MdOutlinePersonOutline size={24} color="#75777D" />}
              onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
              value={registerData.firstName}
            />

            <Input
              label={"Last Name"}
              id={"lastName"}
              placeholder={"Enter last name"}
              type={"text"}
              icon={<MdOutlinePersonOutline size={24} color="#75777D" />}
              onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
              value={registerData.lastName}
            />

            <Input
              label={"Email"}
              id={"email"}
              placeholder={"Enter email address"}
              type={"email"}
              icon={<MdOutlineMail size={24} color="#75777D" />}
              onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
              value={registerData.email}
            />

            <Input
              label={"Phone Number"}
              id={"phoneNumber"}
              placeholder={"Enter phone number"}
              type={"tel"}
              icon={<MdOutlinePhone size={24} color="#75777D" />}
              onChange={(e) => setRegisterData({ ...registerData, phoneNumber: e.target.value })}
              value={registerData.phoneNumber}
            />

            <Input
              label={"Password"}
              id={"password"}
              placeholder={"Enter password"}
              icon={<RiLockPasswordLine size={24} color="#75777D" />}
              isPasswordType={true}
              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
              value={registerData.password}
            />

            {/* Sign In Button */}
            <Button
              disabled={isLoading}
              type="submit">
              {
                isLoading ? <Loader /> : (
                  <>
                    Get Started
                    <FaArrowRight />
                  </>
                )
              }
            </Button>
          </form>

          <div className="text-center text-sm text-gray-600 pt-6 border-t border-[#C5C6CD]">
            Already have an account? <Link to="/login" className="font-semibold">Login here</Link>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
