import { useState } from "react";
import Input from "../components/Input";
import { MdOutlineMail, MdOutlinePersonOutline } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import Button from "../components/Button";
import { FaArrowRight } from "react-icons/fa";

function Signup({ onSignup, onBack }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("Owner");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!firstName || !email || !password) return;
    onSignup({
      id: Date.now(),
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      role,
      businessName,
      dateCreated: new Date().toLocaleString(),
      dateUpdated: new Date().toLocaleString(),
    });
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

          <form className="space-y-6">
            <Input
              label={"First Name"}
              id={"firstName"}
              placeholder={"Enter first name"}
              type={"text"}
              icon={<MdOutlinePersonOutline size={24} color="#75777D" />}
            />

            <Input
              label={"Last Name"}
              id={"lastName"}
              placeholder={"Enter last name"}
              type={"text"}
              icon={<MdOutlinePersonOutline size={24} color="#75777D" />}
            />

            <Input
              label={"Email"}
              id={"email"}
              placeholder={"Enter email address"}
              type={"email"}
              icon={<MdOutlineMail size={24} color="#75777D" />}
            />

            <Input
              label={"Password"}
              id={"password"}
              placeholder={"Enter password"}
              icon={<RiLockPasswordLine size={24} color="#75777D" />}
              isPasswordType={true}
            />

            {/* Sign In Button */}
            <Button>
              Get Started
              <FaArrowRight />
            </Button>
          </form>

          <div className="text-center text-sm text-gray-600 pt-6 border-t border-[#C5C6CD]">
           Already have an account? <span className="font-semibold">Login here</span>
     
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
