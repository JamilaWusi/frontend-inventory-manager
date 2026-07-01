export default function Card({ icon, title, desc, stat }) {
  return (
    <div className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg transition hover:-translate-y-0.5 hover:shadow-2xl">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-900 transition group-hover:bg-slate-900 group-hover:text-white">
        {icon}
      </div>
      <p className="text-3xl font-semibold text-slate-900">{stat}</p>
      <h3 className="mt-2 text-lg font-semibold text-slate-800">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{desc}</p>
    </div>
  );
}