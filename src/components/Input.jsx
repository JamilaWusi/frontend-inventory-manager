// frontend-inventory-manager/src/components/Input.jsx
import { useState } from "react"
import { FaEye } from 'react-icons/fa'
import { HiEyeOff } from 'react-icons/hi'

export default function Input({
    icon,
    label,
    id,
    placeholder,
    type = "text",
    value,
    required = true,
    onChange,
    isPasswordType = false,
    className = "",
    inputClassName = "",
    readOnly = false,
    disabled = false,
}) {

    const [isPasswordVisible, setIsPasswordVisible] = useState(false)

    function show() {
        setIsPasswordVisible(true)
    }

    function hide() {
        setIsPasswordVisible(false)
    }

    return (
        <div className={`space-y-2 ${className}`}>
            <label htmlFor={id} className="block text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                {label}
            </label>
            <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm transition focus-within:border-slate-300 focus-within:ring-2 focus-within:ring-slate-200">
                {icon}
                <input
                    id={id}
                    type={isPasswordType ? (isPasswordVisible ? "text" : "password") : type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    readOnly={readOnly}
                    disabled={disabled}
                    required={required}
                    className={`flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 ${inputClassName}`}
                />

                {isPasswordType && (
                    <button onClick={isPasswordVisible ? hide : show} type="button" className="text-slate-500 transition hover:text-slate-800">
                        {isPasswordVisible ? <FaEye size={20} /> : <HiEyeOff size={20} />}
                    </button>
                )}
            </div>
        </div>
    )
}