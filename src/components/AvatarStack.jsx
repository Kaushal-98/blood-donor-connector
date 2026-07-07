function AvatarStack({ count, label, colors }) {
  return (
    <div className="flex items-center gap-3 mt-4">
      <div className="flex -space-x-3">
        {colors.map((c, i) => (
          <div
            key={i}
            className={`w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold ${c}`}
          >
            {String.fromCharCode(65 + i)}
          </div>
        ))}
        <div className="w-9 h-9 rounded-full border-2 border-white bg-bgsoft flex items-center justify-center text-ink text-xs font-semibold">
          +{count}
        </div>
      </div>
      <span className="text-subtext text-sm">{label}</span>
    </div>
  )
}

export default AvatarStack