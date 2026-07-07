function MedicalCross({ size = 24, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      fill="none"
    >
      <rect x="9" y="2" width="6" height="20" rx="1.5" fill="currentColor" />
      <rect x="2" y="9" width="20" height="6" rx="1.5" fill="currentColor" />
    </svg>
  )
}

export default MedicalCross