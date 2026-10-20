import React from "react"

export default function LoanIllustration({
  width = 240,
  height = 150,
  className = "",
}: {
  width?: number
  height?: number
  className?: string
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 240 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      style={{ display: "block" }}
    >
      {/* Background Soft Ambient Shadow / Ground Shape */}
      <ellipse cx="128" cy="132" rx="76" ry="12" fill="#EDF4FC" />
      
      {/* Soft Light Blue Backdrop / Cloud Shape behind characters */}
      <path
        d="M 68 126 C 46 122 42 98 56 82 C 68 68 90 70 108 64 C 132 54 164 50 190 62 C 214 72 222 96 212 116 C 204 128 186 130 162 128 Z"
        fill="#EDF4FC"
      />
      
      {/* Left Character - Lower body / Trousers */}
      <path
        d="M 66 102 L 78 130 C 74 132 60 132 56 128 L 52 106 Z"
        fill="#8EA4DF"
      />

      {/* Left Character - Suit Coat / Torso */}
      <path
        d="M 62 76 C 60 64 74 58 86 58 C 96 62 102 72 98 88 L 86 112 L 58 100 C 56 88 58 80 62 76 Z"
        fill="#5668B8"
      />

      {/* Left Character - Shirt Collar & Tie */}
      <polygon points="80,58 88,58 84,74" fill="#7D9DE5" />
      <polygon points="84,60 88,68 84,74 80,68" fill="#4B5CA6" />

      {/* Left Character - Head */}
      <ellipse cx="76" cy="46" rx="14" ry="15" fill="#A4B9ED" />

      {/* Left Character - Ear */}
      <ellipse cx="61" cy="48" rx="3.5" ry="4.5" fill="#A4B9ED" />

      {/* Left Character - Hair Tuft */}
      <path
        d="M 74 32 C 70 23 64 20 73 17 C 78 22 78 27 77 32 Z"
        fill="#A4B9ED"
      />

      {/* Left Character - Glasses Frame */}
      {/* Left eye circle */}
      <circle cx="76" cy="46" r="6.5" fill="none" stroke="#3A4FA2" strokeWidth="2.2" />
      {/* Right eye circle */}
      <circle cx="88" cy="46" r="5.5" fill="none" stroke="#3A4FA2" strokeWidth="2.2" />
      {/* Bridge */}
      <path d="M 82.5 45.5 Q 84 44 85 45.5" fill="none" stroke="#3A4FA2" strokeWidth="2.2" />
      {/* Temple to ear */}
      <line x1="69.5" y1="46" x2="61" y2="47" stroke="#3A4FA2" strokeWidth="2.2" strokeLinecap="round" />

      {/* Left Character - Subtle smile */}
      <path d="M 87 53 Q 89 54 91 52" fill="none" stroke="#3A4FA2" strokeWidth="1.4" strokeLinecap="round" />

      {/* Left Character - Arm extending toward money bag */}
      <path
        d="M 90 70 C 98 70 114 72 124 70 C 126 73 124 78 116 80 C 105 83 94 83 88 80 Z"
        fill="#5668B8"
      />

      {/* Left Character - Hand gripping bag neck */}
      <ellipse cx="123" cy="72" rx="4.5" ry="3.5" fill="#A4B9ED" />

      {/* Right Character - Lower body / Skirt / Trousers */}
      <path
        d="M 166 112 L 190 112 L 190 128 C 182 131 170 131 166 128 Z"
        fill="#98C3F4"
      />

      {/* Right Character - White Shirt / Torso */}
      <path
        d="M 174 80 C 168 80 158 86 152 92 L 146 98 C 143 100 146 104 151 102 L 164 96 L 166 114 C 166 118 186 118 190 114 L 190 88 C 190 83 183 80 174 80 Z"
        fill="#FFFFFF"
        stroke="#D2E3F8"
        strokeWidth="1.2"
      />

      {/* Right Character - Arms reaching under money bag */}
      <path
        d="M 168 86 C 158 88 144 94 135 96 C 132 98 135 102 140 100 C 149 96 160 92 168 90 Z"
        fill="#FFFFFF"
        stroke="#D2E3F8"
        strokeWidth="1"
      />

      {/* Right Character - Hands supporting the money bag */}
      <ellipse cx="134" cy="99" rx="4.5" ry="3" fill="#98C3F4" />

      {/* Right Character - Head */}
      <ellipse cx="182" cy="68" rx="13" ry="14" fill="#98C3F4" />

      {/* Right Character - Hair Ponytail pointing up & left */}
      <path
        d="M 178 56 C 171 48 171 43 179 45 C 182 49 183 52 181 56 Z"
        fill="#98C3F4"
      />

      {/* Right Character - Eye & Smile */}
      <circle cx="176" cy="66" r="1.5" fill="#3B579E" />
      <path d="M 173 72 Q 175 74 178 73" fill="none" stroke="#3B579E" strokeWidth="1.3" strokeLinecap="round" />

      {/* Center - Emerald Green Money Bag */}
      {/* Bag Pouch Body */}
      <path
        d="M 124 72 C 117 68 111 74 107 84 C 103 94 105 106 112 114 C 119 122 133 124 142 118 C 150 112 153 100 150 90 C 147 78 138 70 128 72 Z"
        fill="#2BB673"
      />
      {/* Bag soft inner highlight / gradient tone */}
      <path
        d="M 125 74 C 120 71 114 76 111 84 C 108 92 110 102 115 108 C 113 98 116 86 125 78 Z"
        fill="#34C759"
        opacity="0.5"
      />

      {/* Bag Neck Ruffle (Top Opening) */}
      <path
        d="M 121 72 C 118 64 122 60 125 63 C 127 58 131 59 132 63 C 134 60 137 62 136 72 Z"
        fill="#2BB673"
      />

      {/* Bag Neck Ribbon Tie */}
      <ellipse cx="127" cy="72" rx="7" ry="2.8" fill="#86EFAC" />

      {/* Crisp White Indian Rupee Symbol centered on the money bag */}
      <text
        x="129"
        y="99"
        fill="#FFFFFF"
        fontSize="21"
        fontWeight="700"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
      >
        ₹
      </text>
    </svg>
  )
}
