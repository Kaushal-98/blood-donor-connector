function DnaBackground() {
  return (
    <div
      className="hidden md:block fixed right-0 top-20 h-[calc(100vh-5rem)] w-[300px] z-0 pointer-events-none overflow-hidden"
    >
      <img
        src="/images/dna.png"
        alt=""
        className="absolute right-0 top-0 h-full w-full object-cover"
      />
    </div>
  )
}

export default DnaBackground