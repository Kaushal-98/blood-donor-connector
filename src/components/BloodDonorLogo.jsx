function BloodDonorLogo({ size = 22, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M24 42C24 42 6 30.5 6 17.5C6 10.6 11.6 5 18.5 5C21.4 5 24 6.4 24 6.4C24 6.4 26.6 5 29.5 5C36.4 5 42 10.6 42 17.5C42 24.9 36.5 31.2 30.5 35.8"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 20H15L18 14L22 26L25 18L27.5 22H33"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 44C24 44 20 39 20 35.5C20 33 21.8 31 24 31C26.2 31 28 33 28 35.5C28 39 24 44 24 44Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default BloodDonorLogo