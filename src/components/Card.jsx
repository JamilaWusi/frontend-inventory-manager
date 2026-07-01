export default function Card({ icon, title, desc, stat }) {
  return (
    <div className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-6 text-white shadow-[0_16px_40px_-20px_rgba(15,23,42,0.7)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-20px_rgba(15,23,42,0.9)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),_transparent_45%)]" />
      <div className="relative z-10">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-sm">
          {icon}
        </div>
        <p className="text-3xl font-semibold tracking-tight">{stat}</p>
        <h3 className="mt-2 text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-200">{desc}</p>
      </div>
    </div>
  );
}