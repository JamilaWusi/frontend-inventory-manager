function OverViewCard() {
  const cards = [
    {
      title: "Database Status",
      value: "Connected",
      subtitle: "Latency: 14ms",
      color: "border-green-500",
      text: "text-green-600",
    },
    {
      title: "Live Deployment",
      value: "Active",
      subtitle: "Uptime: 142h",
      color: "border-blue-500",
      text: "text-blue-600",
    },
    {
      title: "Total Items",
      value: "12,842",
      subtitle: "+2.4% this month",
      color: "border-slate-500",
      text: "text-slate-900",
    },
    {
      title: "Low Stock Alerts",
      value: "18",
      subtitle: "Needs attention",
      color: "border-red-500",
      text: "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`bg-white rounded-xl shadow p-6 border-l-4 ${card.color}`}
        >
          <p className="text-sm text-gray-500">{card.title}</p>

          <h2 className={`text-2xl font-bold mt-2 ${card.text}`}>
            {card.value}
          </h2>

          <p className="text-sm text-gray-400 mt-2">{card.subtitle}</p>
        </div>
      ))}
    </div>
  );
}

export default OverViewCard;
