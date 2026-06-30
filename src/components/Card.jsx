export default function Card({icon,title, desc, stat}) {
    return (
        <div className="h-40 rounded-xl border p-6 border-[#C5C6CD] border-l-4 w-full">
           {icon}
            <h1 className="text-4xl font-bold">{stat}</h1>
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-xs">{desc}</p>
        </div>
    )
}