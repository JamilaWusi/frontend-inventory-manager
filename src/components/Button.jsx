export default function Button({ children, type = "button" }) {
    return (
        <button
            type={type}
            className="h-12 bg-[#091426] rounded-lg text-white flex items-center justify-center gap-2 w-full"
        >
            {children}
        </button>
    )
}