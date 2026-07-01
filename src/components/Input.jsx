import { useState } from "react"
import { FaEye } from 'react-icons/fa'
import { HiEyeOff } from 'react-icons/hi'

export default function Input({ icon, label, id, placeholder, type, value, onChange, isPasswordType = false }) {

    const [isPasswordVisible, setIsPasswordVisible] = useState(false)

    function show() {
        setIsPasswordVisible(true)
    }

    function hide() {
        setIsPasswordVisible(false)
    }

    return (
        <div className="space-y-1">
            <label htmlFor={id}
                className="font-medium text-sm uppercase text-[#45474C]"
            >{label}</label>
            <div className="flex border border-[#C5C6CD] h-12 rounded-lg items-center py-3.5 px-4 gap-3.5">
                {icon}
                <input
                    id={id}
                    type={isPasswordType ?
                        isPasswordVisible ? "text" : "password"
                        : type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="border-0 focus:outline-none focus:ring-0 focus:border-transparent flex-1"
                    required
                />
                {
                    isPasswordType && (
                        <>
                            {isPasswordVisible ?
                                <button type="button" onClick={hide} className="cursor-pointer">
                                    <FaEye size={24} color="#75777D" />
                                </button> :
                                <button type="button" onClick={show}
                                    className="cursor-pointer"
                                >
                                    <HiEyeOff size={24} color="#75777D" /></button>}
                        </>
                    )
                }
            </div>
        </div>
    )
}