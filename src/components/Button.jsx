export default function Button({ children, type = "button", onClick, disabled=false }) {
    return (
        <button
            type={type}
            disabled={disabled}
            className="h-12 bg-[#091426] rounded-lg text-white flex items-center justify-center gap-2 w-full cursor-pointer"
            onClick={onClick}
        >
            {children}
        </button>
    )
}