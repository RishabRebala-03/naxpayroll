import React, { useState, useId, useEffect } from "react"
import "./approvals.css"

export interface ApprovalsSubItem {
  id: "reimbursements" | "proof-of-investments" | "salary-revision"
  label: string
}

export const APPROVALS_NAV_ITEMS: ApprovalsSubItem[] = [
  { id: "reimbursements", label: "Reimbursements" },
  { id: "proof-of-investments", label: "Proof Of Investments" },
  { id: "salary-revision", label: "Salary Revision" },
]

export type ApprovalViewType = (typeof APPROVALS_NAV_ITEMS)[number]["id"]

export function isApprovalView(view: string): view is ApprovalViewType {
  return APPROVALS_NAV_ITEMS.some((item) => item.id === view)
}

export interface ApprovalsNavProps {
  currentView: string
  onNavigate: (viewId: string) => void
  sidebarOpen?: boolean
}

// Minimal Employee interface matching demo data
export interface ApprovalsEmployee {
  id: string
  name: string
  department?: string
  designation?: string
  email?: string
}

export interface ReimbursementBillItem {
  id: string
  type: string
  billDate: string
  billNumber: string
  attachmentName?: string
  claimAmount: string
  approvedAmount: string
}

export interface ReimbursementClaim {
  id: string
  employeeId: string
  employeeName: string
  employeeDept?: string
  bills: ReimbursementBillItem[]
  totalClaimAmount: number
  totalApprovedAmount: number
  submittedDate: string
  claimMonth: string // e.g. "Oct 2026"
  status: "Pending" | "Approved" | "Rejected"
}

// Approval checkmark icon: square box with rounded corners and a checkmark
function ApprovalIcon({ size = 17 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <polyline points="8 12 11.5 15.5 16.5 8.5" />
    </svg>
  )
}

// Chevron indicator icon
function ChevronIndicator({ expanded }: { expanded: boolean }) {
  return (
    <span
      className={`approvals-chevron-wrap ${expanded ? "is-expanded" : "is-collapsed"}`}
      aria-hidden="true"
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </span>
  )
}

/**
 * Mascot illustration: Character with glasses, blue tie & shrugging arms
 * emerging from an open box/folder with sparks, matching reference images 1, 2, 4, 5
 */
function ReimbursementMascot() {
  const maskId = useId()
  return (
    <svg
      viewBox="0 0 200 200"
      width="180"
      height="180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cloudGrad" x1="100" y1="20" x2="100" y2="180" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F0F7FF" />
          <stop offset="1" stopColor="#E2EEFC" />
        </linearGradient>
        <clipPath id={maskId}>
          <rect x="50" y="40" width="100" height="90" rx="8" />
        </clipPath>
      </defs>

      {/* Soft rounded background container / shield */}
      <rect x="25" y="42" width="150" height="136" rx="28" fill="url(#cloudGrad)" opacity="0.9" />

      {/* Golden sparks above head */}
      <path d="M100 16v9" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M84 21l5 8" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M116 21l-5 8" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />

      {/* Box / Folder back flap */}
      <path
        d="M48 116l14-22h76l14 22z"
        fill="#FEF08A"
        stroke="#FDE047"
        strokeWidth="1.5"
      />
      <rect x="68" y="92" width="64" height="26" rx="4" fill="#FFFFFF" stroke="#E2E8F0" />
      <line x1="76" y1="100" x2="106" y2="100" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
      <line x1="76" y1="106" x2="124" y2="106" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />

      {/* Cute hair tuft at the top of head */}
      <path
        d="M98 38c-3-8 9-10 4-1z"
        fill="#3730A3"
      />

      {/* Head */}
      <ellipse cx="100" cy="68" rx="24" ry="24" fill="#BFDBFE" />

      {/* Round glasses */}
      <circle cx="91" cy="68" r="8" fill="#DBEAFE" stroke="#334155" strokeWidth="1.8" />
      <circle cx="109" cy="68" r="8" fill="#DBEAFE" stroke="#334155" strokeWidth="1.8" />
      <line x1="99" y1="68" x2="101" y2="68" stroke="#334155" strokeWidth="1.8" />

      {/* Eyes behind glasses */}
      <circle cx="91" cy="68" r="2.2" fill="#1E293B" />
      <circle cx="109" cy="68" r="2.2" fill="#1E293B" />

      {/* Smile / Mouth */}
      <path
        d="M96 78q4 3 8 0"
        fill="none"
        stroke="#475569"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Body / Suit jacket */}
      <path
        d="M82 92c-6 2-10 10-10 18v22h56v-22c0-8-4-16-10-18z"
        fill="#4F46E5"
      />

      {/* White shirt collar */}
      <path d="M92 92l8 12 8-12z" fill="#FFFFFF" />

      {/* Tie */}
      <path
        d="M98 94l4 7-3 28-2 3-2-3-3-28 4-7z"
        fill="#312E81"
      />

      {/* Shrugging Arms spread out */}
      <path
        d="M74 96c-12-6-20-2-26 10l8 5c3-8 8-10 16-5z"
        fill="#4F46E5"
      />
      <circle cx="48" cy="106" r="5" fill="#BFDBFE" />

      <path
        d="M126 96c12-6 20-2 26 10l-8 5c-3-8-8-10-16-5z"
        fill="#4F46E5"
      />
      <circle cx="152" cy="106" r="5" fill="#BFDBFE" />

      {/* Front of Box / Carton with open flaps */}
      <path
        d="M44 116l24 44h64l24-44z"
        fill="#FDE68A"
        stroke="#F59E0B"
        strokeWidth="1.5"
      />
      {/* Front box fold detail */}
      <path d="M100 126v34" stroke="#F59E0B" strokeWidth="1.2" strokeDasharray="3 3" />
      <path
        d="M68 160l32-14 32 14"
        fill="none"
        stroke="#D97706"
        strokeWidth="1"
      />
    </svg>
  )
}

/**
 * Approvals Sidebar Navigation Component
 */
export function ApprovalsNav({
  currentView,
  onNavigate,
  sidebarOpen = true,
}: ApprovalsNavProps) {
  const isChildActive = isApprovalView(currentView)
  const [isExpanded, setIsExpanded] = useState<boolean>(isChildActive)

  useEffect(() => {
    if (isChildActive) {
      setIsExpanded(true)
    }
  }, [isChildActive])

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!sidebarOpen) {
      onNavigate("reimbursements")
      return
    }
    if (!isExpanded) {
      setIsExpanded(true)
      if (!isChildActive) {
        onNavigate("reimbursements")
      }
    } else {
      setIsExpanded(false)
    }
  }

  const handleSubItemClick = (
    e: React.MouseEvent,
    id: ApprovalViewType,
  ) => {
    e.preventDefault()
    onNavigate(id)
  }

  const F = {
    brand: "#0070F2",
    brandHover: "#005ecb",
    text1: "#1d2d3e",
    text2: "#526675",
    pageBg: "#f4f6f9",
    highlight: "#EBF3FC",
  }

  return (
    <div style={{ position: "relative" }} title={!sidebarOpen ? "Approvals" : undefined}>
      {/* Parent item: Approvals */}
      <button
        type="button"
        className={`sap-nav-item${isChildActive ? " is-active" : ""}`}
        onClick={handleToggle}
        aria-expanded={isExpanded}
        aria-controls="approvals-submenu"
        title="Approvals"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: sidebarOpen ? "10px 16px" : "11px 0",
          justifyContent: sidebarOpen ? "flex-start" : "center",
          background: isChildActive ? F.highlight : "transparent",
          border: "none",
          borderLeft: `3px solid ${isChildActive ? F.brand : "transparent"}`,
          cursor: "pointer",
          color: isChildActive ? F.brandHover : F.text2,
          textAlign: "left",
          fontSize: 13,
          fontWeight: isChildActive ? 600 : 400,
          width: "100%",
          fontFamily: "inherit",
          transition: "all 0.12s ease",
          whiteSpace: "nowrap",
          overflow: "hidden",
          outline: "none",
        }}
        onMouseEnter={(e) => {
          if (!isChildActive) e.currentTarget.style.background = F.pageBg
        }}
        onMouseLeave={(e) => {
          if (!isChildActive) e.currentTarget.style.background = "transparent"
        }}
      >
        <ApprovalIcon size={17} />
        {sidebarOpen && (
          <>
            <span
              style={{
                flex: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              Approvals
            </span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.18s ease",
                opacity: 0.65,
                flexShrink: 0,
                marginRight: 2,
              }}
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </>
        )}
      </button>

      {/* Submenu: 3 items in exact order */}
      {sidebarOpen && isExpanded && (
        <div id="approvals-submenu" role="menu" style={{ display: "flex", flexDirection: "column" }}>
          {APPROVALS_NAV_ITEMS.map((subItem) => {
            const active = currentView === subItem.id
            return (
              <button
                key={subItem.id}
                type="button"
                role="menuitem"
                onClick={(e) => handleSubItemClick(e, subItem.id)}
                title={subItem.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "9px 16px 9px 45px",
                  background: active ? F.highlight : "transparent",
                  border: "none",
                  borderLeft: `3px solid ${active ? F.brand : "transparent"}`,
                  cursor: "pointer",
                  color: active ? F.brandHover : F.text2,
                  textAlign: "left",
                  fontSize: 13,
                  fontWeight: active ? 600 : 400,
                  width: "100%",
                  fontFamily: "inherit",
                  transition: "all 0.12s ease",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  outline: "none",
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.background = F.pageBg
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.background = "transparent"
                }}
              >
                {subItem.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

const REIMBURSEMENT_TYPES = [
  "Fuel Allowance",
  "Telephone & Internet",
  "Travel & Conveyance",
  "Medical Reimbursement",
  "Food & Meals",
  "Books & Periodicals",
  "Professional Development",
  "Driver Salary",
  "Office Supplies",
  "Other",
]

const CLAIMS_FILTER_OPTIONS = [
  "All Claims",
  "Pending Claims",
  "Approved Claims",
  "Rejected Claims",
] as const

type ClaimsFilterType = (typeof CLAIMS_FILTER_OPTIONS)[number]

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

/**
 * REIMBURSEMENTS VIEW COMPONENT
 * Implements:
 * 1. Default view with Pending Claims title, Add, More (···), Filter buttons, Mascot & Empty State
 * 2. Month picker popup format when clicking Claim Month (Picture 1)
 * 3. Import Reimbursements full view when clicking Import (Picture 2)
 * 4. Export Reimbursements modal when clicking Export (Picture 3 - without password protection)
 * 5. New Claim modal (Picture 3 of previous request)
 * 6. Filter bar (Picture 5 of previous request)
 */
export function ReimbursementsView({
  emps = [],
}: {
  emps?: ApprovalsEmployee[]
}) {
  // 1. View filter dropdown state
  const [selectedFilter, setSelectedFilter] = useState<ClaimsFilterType>("Pending Claims")
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false)

  // 2. More options menu state
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false)

  // 3. Filter bar toggle & filter values
  const [isFilterBarOpen, setIsFilterBarOpen] = useState(false)
  const [claimMonthFilter, setClaimMonthFilter] = useState<string>("Oct 2026")
  const [employeeFilterId, setEmployeeFilterId] = useState<string>("")
  const [isEmployeePickerOpen, setIsEmployeePickerOpen] = useState(false)
  const [employeeSearch, setEmployeeSearch] = useState("")

  // Month Picker Dropdown state (Picture 1)
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false)
  const [pickerYear, setPickerYear] = useState<number>(2026)

  // 4. Import Page state (Picture 2)
  const [isImportPageOpen, setIsImportPageOpen] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importEncoding, setImportEncoding] = useState("UTF-8 (Unicode)")
  const [isDragOver, setIsDragOver] = useState(false)

  // 5. Export Modal state (Picture 3)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [exportPeriod, setExportPeriod] = useState("Oct 2026")
  const [exportFilterBy, setExportFilterBy] = useState("Pending Claims")
  const [exportFormat, setExportFormat] = useState(
    "XLS (Microsoft Excel 1997-2004 Compatible)",
  )
  const [isExportMonthPickerOpen, setIsExportMonthPickerOpen] = useState(false)
  const [exportPickerYear, setExportPickerYear] = useState<number>(2026)

  // 6. New Claim modal state
  const [isNewClaimOpen, setIsNewClaimOpen] = useState(false)
  const [newClaimEmployeeId, setNewClaimEmployeeId] = useState("")
  const [newClaimBills, setNewClaimBills] = useState<ReimbursementBillItem[]>([
    {
      id: "1",
      type: "Fuel Allowance",
      billDate: "2026-10-16",
      billNumber: "",
      attachmentName: "",
      claimAmount: "",
      approvedAmount: "",
    },
  ])

  // In-memory claims list
  const [claims, setClaims] = useState<ReimbursementClaim[]>([])

  // Close dropdowns on outside click
  const closeAllMenus = () => {
    setIsViewDropdownOpen(false)
    setIsMoreMenuOpen(false)
    setIsMonthPickerOpen(false)
    setIsExportMonthPickerOpen(false)
    setIsEmployeePickerOpen(false)
  }

  const selectedEmp = emps.find((e) => e.id === employeeFilterId)
  const filteredEmps = emps.filter(
    (e) =>
      e.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
      e.id.toLowerCase().includes(employeeSearch.toLowerCase()),
  )

  // Filtered claims logic
  const filteredClaims = claims.filter((claim) => {
    if (selectedFilter === "Pending Claims" && claim.status !== "Pending") return false
    if (selectedFilter === "Approved Claims" && claim.status !== "Approved") return false
    if (selectedFilter === "Rejected Claims" && claim.status !== "Rejected") return false

    if (claimMonthFilter && claim.claimMonth !== claimMonthFilter) return false
    if (employeeFilterId && claim.employeeId !== employeeFilterId) return false

    return true
  })

  // Add another bill row to form
  const handleAddBillRow = () => {
    setNewClaimBills((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        type: "Telephone & Internet",
        billDate: "2026-10-16",
        billNumber: "",
        attachmentName: "",
        claimAmount: "",
        approvedAmount: "",
      },
    ])
  }

  // Update a bill row
  const handleUpdateBillRow = (
    id: string,
    field: keyof ReimbursementBillItem,
    val: string,
  ) => {
    setNewClaimBills((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row
        const updated = { ...row, [field]: val }
        if (field === "claimAmount" && (!row.approvedAmount || row.approvedAmount === row.claimAmount)) {
          updated.approvedAmount = val
        }
        return updated
      }),
    )
  }

  // Remove a bill row
  const handleRemoveBillRow = (id: string) => {
    if (newClaimBills.length <= 1) return
    setNewClaimBills((prev) => prev.filter((r) => r.id !== id))
  }

  // Submit new claim
  const handleSaveClaim = (status: "Pending" | "Approved") => {
    if (!newClaimEmployeeId) {
      alert("Please select an employee.")
      return
    }

    const employeeObj = emps.find((e) => e.id === newClaimEmployeeId)
    const empName = employeeObj?.name || "Selected Employee"

    const totalClaim = newClaimBills.reduce(
      (sum, b) => sum + (Number(b.claimAmount) || 0),
      0,
    )
    const totalApproved = newClaimBills.reduce(
      (sum, b) => sum + (Number(b.approvedAmount) || 0),
      0,
    )

    const newClaim: ReimbursementClaim = {
      id: `CLM-${String(claims.length + 1).padStart(4, "0")}`,
      employeeId: newClaimEmployeeId,
      employeeName: empName,
      employeeDept: employeeObj?.department,
      bills: [...newClaimBills],
      totalClaimAmount: totalClaim,
      totalApprovedAmount: totalApproved,
      submittedDate: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      claimMonth: claimMonthFilter || "Oct 2026",
      status,
    }

    setClaims((prev) => [newClaim, ...prev])
    setIsNewClaimOpen(false)
    setNewClaimEmployeeId("")
    setNewClaimBills([
      {
        id: "1",
        type: "Fuel Allowance",
        billDate: "2026-10-16",
        billNumber: "",
        attachmentName: "",
        claimAmount: "",
        approvedAmount: "",
      },
    ])
  }

  // Download sample format file (.csv or .xls)
  const handleDownloadSample = (ext: "csv" | "xls") => {
    const csvContent =
      "Employee ID,Employee Name,Reimbursement Type,Bill Date,Bill Number,Claim Amount,Approved Amount\n" +
      "EMP-001,Meena Iyer,Fuel Allowance,2026-10-10,INV-8891,1500,1500\n" +
      "EMP-002,Priya Nair,Telephone & Internet,2026-10-12,BILL-4412,999,999\n"
    const mime = ext === "csv" ? "text/csv;charset=utf-8;" : "application/vnd.ms-excel"
    const blob = new Blob([csvContent], { type: mime })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `reimbursements_sample.${ext}`
    link.click()
    URL.revokeObjectURL(url)
  }

  // Process Import (Picture 2)
  const handleProcessImport = () => {
    const sampleImportedClaims: ReimbursementClaim[] = [
      {
        id: `CLM-${String(claims.length + 1).padStart(4, "0")}`,
        employeeId: emps[0]?.id || "EMP-001",
        employeeName: emps[0]?.name || "Meena Iyer",
        employeeDept: emps[0]?.department || "Human Resources",
        bills: [
          {
            id: "imp-1",
            type: "Fuel Allowance",
            billDate: "2026-10-10",
            billNumber: "INV-9901",
            attachmentName: "Fuel_Bill_Oct.pdf",
            claimAmount: "1850",
            approvedAmount: "1850",
          },
        ],
        totalClaimAmount: 1850,
        totalApprovedAmount: 1850,
        submittedDate: "10 Oct 2026",
        claimMonth: "Oct 2026",
        status: "Pending",
      },
      {
        id: `CLM-${String(claims.length + 2).padStart(4, "0")}`,
        employeeId: emps[1]?.id || "EMP-002",
        employeeName: emps[1]?.name || "Priya Nair",
        employeeDept: emps[1]?.department || "Engineering",
        bills: [
          {
            id: "imp-2",
            type: "Telephone & Internet",
            billDate: "2026-10-12",
            billNumber: "TEL-2026-88",
            attachmentName: "Broadband_Oct2026.pdf",
            claimAmount: "999",
            approvedAmount: "999",
          },
        ],
        totalClaimAmount: 999,
        totalApprovedAmount: 999,
        submittedDate: "12 Oct 2026",
        claimMonth: "Oct 2026",
        status: "Pending",
      },
    ]

    setClaims((prev) => [...sampleImportedClaims, ...prev])
    setIsImportPageOpen(false)
    setImportFile(null)
  }

  // Execute Export (Picture 3)
  const handleExecuteExport = () => {
    const claimsToExport = claims.filter((c) => {
      if (exportFilterBy === "Pending Claims" && c.status !== "Pending") return false
      if (exportFilterBy === "Approved Claims" && c.status !== "Approved") return false
      if (exportFilterBy === "Rejected Claims" && c.status !== "Rejected") return false
      if (exportPeriod && c.claimMonth !== exportPeriod) return false
      return true
    })

    const ext = exportFormat.includes("CSV") ? "csv" : exportFormat.includes("XLSX") ? "xlsx" : "xls"
    const csvHeader = "Claim ID,Employee Name,Department,Month,Status,Total Claim Amount,Total Approved Amount\n"
    const csvRows = claimsToExport.length > 0
      ? claimsToExport
          .map(
            (c) =>
              `${c.id},"${c.employeeName}","${c.employeeDept || ""}",${c.claimMonth},${c.status},${c.totalClaimAmount},${c.totalApprovedAmount}`,
          )
          .join("\n")
      : `CLM-1001,"Meena Iyer","HR",${exportPeriod || "Oct 2026"},Pending,1500,1500\n`

    const mime = ext === "csv" ? "text/csv;charset=utf-8;" : "application/vnd.ms-excel"
    const blob = new Blob([csvHeader + csvRows], { type: mime })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `reimbursements_${(exportPeriod || "All").replace(/\s+/g, "_")}_${exportFilterBy.replace(/\s+/g, "_")}.${ext}`
    link.click()
    URL.revokeObjectURL(url)
    setIsExportModalOpen(false)
  }

  // Clear all filters
  const handleClearFilter = () => {
    setClaimMonthFilter("")
    setEmployeeFilterId("")
    setIsMonthPickerOpen(false)
  }

  // ──────────────────────────────────────────────────────────
  // SCREEN: Import Reimbursements - Select File (Picture 2)
  // ──────────────────────────────────────────────────────────
  if (isImportPageOpen) {
    return (
      <div className="reimbursements-page-wrapper">
        <div className="reimbursements-import-page">
          <div className="import-page-header">
            <h2 className="import-page-title">
              Import Reimbursements - Select File
            </h2>
          </div>

          <p className="import-instructions">
            Download a sample{" "}
            <a
              className="import-link"
              onClick={() => handleDownloadSample("csv")}
            >
              .csv format
            </a>{" "}
            or{" "}
            <a
              className="import-link"
              onClick={() => handleDownloadSample("xls")}
            >
              .xls format
            </a>{" "}
            file and compare it with your import file to ensure that the file is ready to import.
          </p>

          <div
            className={`import-dropzone ${isDragOver ? "is-dragover" : ""}`}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragOver(true)
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault()
              setIsDragOver(false)
              const file = e.dataTransfer.files?.[0]
              if (file) setImportFile(file)
            }}
            onClick={() => {
              document.getElementById("reimbursement-import-input")?.click()
            }}
          >
            <input
              id="reimbursement-import-input"
              type="file"
              accept=".csv,.tsv,.xls,.xlsx"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) setImportFile(file)
              }}
            />
            <div className="import-dropzone-icon">
              <svg
                width="42"
                height="42"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                <path d="M12 12v9" />
                <path d="m16 16-4-4-4 4" />
              </svg>
            </div>
            {importFile ? (
              <div>
                <div style={{ fontWeight: 600, color: "#1a2b4b", fontSize: 14 }}>
                  {importFile.name}
                </div>
                <div style={{ fontSize: 12, color: "#059669", marginTop: 4 }}>
                  ✓ File ready for import ({(importFile.size / 1024).toFixed(1)} KB)
                </div>
              </div>
            ) : (
              <>
                <div className="import-dropzone-title">
                  Drop files here or click here to upload
                </div>
                <div className="import-dropzone-sub">
                  Maximum File Size: 5 MB | File Format: CSV or TSV or XLS
                </div>
              </>
            )}
          </div>

          <div className="import-field-group">
            <label className="import-field-label">
              Character Encoding<span style={{ color: "#ef4444" }}>*</span>
            </label>
            <select
              className="import-select"
              value={importEncoding}
              onChange={(e) => setImportEncoding(e.target.value)}
            >
              <option value="UTF-8 (Unicode)">UTF-8 (Unicode)</option>
              <option value="ISO-8859-1 (Latin-1)">ISO-8859-1 (Latin-1)</option>
              <option value="ASCII">ASCII</option>
              <option value="Windows-1252">Windows-1252</option>
            </select>
          </div>

          <div className="import-footer">
            <div className="import-btn-group">
              <button
                type="button"
                className="import-btn-next"
                onClick={handleProcessImport}
              >
                Next
              </button>
              <button
                type="button"
                className="import-btn-cancel"
                onClick={() => {
                  setIsImportPageOpen(false)
                  setImportFile(null)
                }}
              >
                Cancel
              </button>
            </div>
            <div className="import-mandatory-note">
              * indicates mandatory fields
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ──────────────────────────────────────────────────────────
  // SCREEN: Reimbursements Main List View
  // ──────────────────────────────────────────────────────────
  return (
    <div className="reimbursements-page-wrapper" onClick={closeAllMenus}>
      {/* ──────────────────────────────────────────────────────────
          1. TOP BAR
          ────────────────────────────────────────────────────────── */}
      <div className="reimbursements-topbar" onClick={(e) => e.stopPropagation()}>
        {/* Left: Title / View dropdown */}
        <div style={{ position: "relative" }}>
          <button
            type="button"
            className="reimbursements-view-trigger"
            onClick={() => {
              setIsMoreMenuOpen(false)
              setIsMonthPickerOpen(false)
              setIsViewDropdownOpen((prev) => !prev)
            }}
            aria-expanded={isViewDropdownOpen}
          >
            <span>{selectedFilter}</span>
            <svg
              className={`reimbursements-view-chevron ${isViewDropdownOpen ? "is-open" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {/* View Dropdown Menu */}
          {isViewDropdownOpen && (
            <div className="reimbursements-view-dropdown" role="menu">
              {CLAIMS_FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={`reimbursements-dropdown-item ${
                    selectedFilter === opt ? "is-selected" : ""
                  }`}
                  onClick={() => {
                    setSelectedFilter(opt)
                    setExportFilterBy(opt)
                    setIsViewDropdownOpen(false)
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Action Buttons */}
        <div className="reimbursements-actions">
          {/* + Add Button */}
          <button
            type="button"
            className="reimbursements-btn-add"
            onClick={() => setIsNewClaimOpen(true)}
            title="Create New Claim"
          >
            <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>
            <span>Add</span>
          </button>

          {/* ··· More Button (Picture 4) */}
          <div style={{ position: "relative" }}>
            <button
              type="button"
              className={`reimbursements-icon-btn ${isMoreMenuOpen ? "is-active" : ""}`}
              onClick={(e) => {
                e.stopPropagation()
                setIsViewDropdownOpen(false)
                setIsMonthPickerOpen(false)
                setIsMoreMenuOpen((prev) => !prev)
              }}
              title="More Actions"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="5" cy="12" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="19" cy="12" r="2" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isMoreMenuOpen && (
              <div
                className="reimbursements-more-menu"
                role="menu"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className="reimbursements-more-item"
                  onClick={() => {
                    setIsMoreMenuOpen(false)
                    setIsImportPageOpen(true)
                  }}
                >
                  <svg
                    className="reimbursements-more-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>Import Reimbursements</span>
                </button>
                <button
                  type="button"
                  className="reimbursements-more-item"
                  onClick={() => {
                    setIsMoreMenuOpen(false)
                    setExportPeriod(claimMonthFilter || "Oct 2026")
                    setExportFilterBy(selectedFilter)
                    setIsExportModalOpen(true)
                  }}
                >
                  <svg
                    className="reimbursements-more-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span>Export Reimbursements</span>
                </button>
              </div>
            )}
          </div>

          {/* Filter Symbol Button */}
          <button
            type="button"
            className={`reimbursements-icon-btn ${isFilterBarOpen ? "is-active" : ""}`}
            onClick={(e) => {
              e.stopPropagation()
              setIsFilterBarOpen((prev) => !prev)
            }}
            title="Toggle Filter Bar"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          </button>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          2. FILTER BAR (Picture 1 & Picture 5)
          ────────────────────────────────────────────────────────── */}
      {isFilterBarOpen && (
        <div className="reimbursements-filter-bar" onClick={(e) => e.stopPropagation()}>
          {/* Claim Month Filter Pill with Month Picker Popup (Picture 1) */}
          <div style={{ position: "relative" }}>
            <div
              className="reimbursements-filter-chip"
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation()
                setIsViewDropdownOpen(false)
                setIsMoreMenuOpen(false)
                setIsMonthPickerOpen((prev) => !prev)
              }}
              title="Click to select month"
            >
              <span className="reimbursements-filter-label">Claim Month:</span>
              <span className="reimbursements-filter-value">
                {claimMonthFilter || "Select Month"}
              </span>
              {claimMonthFilter && (
                <button
                  type="button"
                  className="reimbursements-filter-clear-icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    setClaimMonthFilter("")
                    setIsMonthPickerOpen(false)
                  }}
                  title="Remove month filter"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Month Picker Dropdown (Picture 1) */}
            {isMonthPickerOpen && (
              <div
                className="reimbursements-month-picker"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Year Navigation Header */}
                <div className="month-picker-header">
                  <button
                    type="button"
                    className="month-picker-nav-btn"
                    onClick={() => setPickerYear((y) => y - 1)}
                    title="Previous year"
                  >
                    «
                  </button>
                  <span className="month-picker-year">{pickerYear}</span>
                  <button
                    type="button"
                    className="month-picker-nav-btn"
                    onClick={() => setPickerYear((y) => y + 1)}
                    title="Next year"
                  >
                    »
                  </button>
                </div>

                {/* 4x3 Months Grid */}
                <div className="month-picker-grid">
                  {MONTH_NAMES.map((m) => {
                    const isSelected = claimMonthFilter === `${m} ${pickerYear}`
                    return (
                      <button
                        key={m}
                        type="button"
                        className={`month-picker-cell ${
                          isSelected ? "is-selected" : ""
                        }`}
                        onClick={() => {
                          setClaimMonthFilter(`${m} ${pickerYear}`)
                          setExportPeriod(`${m} ${pickerYear}`)
                          setIsMonthPickerOpen(false)
                        }}
                      >
                        {m}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Employees Filter Chip (Place 1: matching custom dropdown Image 5) */}
          <div style={{ position: "relative" }}>
            <div
              className="salary-rev-filter-chip"
              onClick={(e) => {
                e.stopPropagation()
                setIsViewDropdownOpen(false)
                setIsMoreMenuOpen(false)
                setIsMonthPickerOpen(false)
                setIsEmployeePickerOpen((prev) => !prev)
              }}
              title="Select Employee"
            >
              <span className="salary-rev-filter-label">Employees:</span>
              <span
                className="salary-rev-filter-value"
                style={{
                  color: selectedEmp ? "#1e293b" : "#64748b",
                  fontWeight: selectedEmp ? 600 : 400,
                }}
              >
                {selectedEmp ? selectedEmp.name : "Select an Employee"}
              </span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#64748b"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>

            {/* Employee Picker Dropdown */}
            {isEmployeePickerOpen && (
              <div
                className="salary-rev-emp-dropdown"
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ padding: "8px 10px", borderBottom: "1px solid #e2e8f0" }}>
                  <input
                    type="text"
                    placeholder="Search employee..."
                    className="salary-rev-emp-search-input"
                    value={employeeSearch}
                    onChange={(e) => setEmployeeSearch(e.target.value)}
                    autoFocus
                  />
                </div>
                <div style={{ maxHeight: 220, overflowY: "auto" }}>
                  <button
                    type="button"
                    className={`salary-rev-emp-item ${!employeeFilterId ? "is-selected" : ""}`}
                    onClick={() => {
                      setEmployeeFilterId("")
                      setIsEmployeePickerOpen(false)
                    }}
                  >
                    Select an Employee
                  </button>
                  {filteredEmps.map((emp) => (
                    <button
                      key={emp.id}
                      type="button"
                      className={`salary-rev-emp-item ${employeeFilterId === emp.id ? "is-selected" : ""}`}
                      onClick={() => {
                        setEmployeeFilterId(emp.id)
                        setIsEmployeePickerOpen(false)
                      }}
                    >
                      <div style={{ fontWeight: 500 }}>{emp.name}</div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>
                        {emp.id} {emp.department ? `· ${emp.department}` : ""}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Clear Filter button */}
          {(claimMonthFilter || employeeFilterId) && (
            <button
              type="button"
              className="reimbursements-clear-all-btn"
              onClick={handleClearFilter}
            >
              <span style={{ fontSize: 13 }}>✕</span>
              <span>Clear Filter</span>
            </button>
          )}
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          3. MAIN CONTENT: Empty State or Claims Table
          ────────────────────────────────────────────────────────── */}
      {filteredClaims.length === 0 ? (
        <div className="reimbursements-empty-state">
          <div className="reimbursements-mascot-wrap">
            <ReimbursementMascot />
          </div>
          <h2 className="reimbursements-empty-title">No results found</h2>
          <p className="reimbursements-empty-desc">
            Looks like you don't have any results for the filter applied
          </p>
        </div>
      ) : (
        <div className="reimbursements-table-container">
          <table className="reimbursements-table">
            <thead>
              <tr>
                <th>Claim ID</th>
                <th>Employee Name</th>
                <th>Reimbursement Type</th>
                <th>Bill Date</th>
                <th>Claim Amount</th>
                <th>Approved Amount</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClaims.map((claim) => (
                <tr key={claim.id}>
                  <td style={{ fontWeight: 600 }}>{claim.id}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{claim.employeeName}</div>
                    {claim.employeeDept && (
                      <div style={{ fontSize: 11, color: "#64748b" }}>
                        {claim.employeeDept}
                      </div>
                    )}
                  </td>
                  <td>
                    {claim.bills.map((b) => b.type).join(", ")}
                    {claim.bills.length > 1 && (
                      <span
                        style={{
                          marginLeft: 6,
                          fontSize: 11,
                          padding: "1px 6px",
                          borderRadius: 8,
                          background: "#e2e8f0",
                          color: "#475569",
                        }}
                      >
                        {claim.bills.length} bills
                      </span>
                    )}
                  </td>
                  <td>{claim.bills[0]?.billDate || claim.submittedDate}</td>
                  <td style={{ fontWeight: 600 }}>₹{claim.totalClaimAmount.toLocaleString()}</td>
                  <td style={{ fontWeight: 600, color: "var(--z-brand, #306fd1)" }}>
                    ₹{claim.totalApprovedAmount.toLocaleString()}
                  </td>
                  <td>
                    <span
                      className={`reimbursements-status-badge ${
                        claim.status === "Approved"
                          ? "is-approved"
                          : claim.status === "Rejected"
                            ? "is-rejected"
                            : "is-pending"
                      }`}
                    >
                      ● {claim.status}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {claim.status === "Pending" ? (
                      <div style={{ display: "inline-flex", gap: 6 }}>
                        <button
                          type="button"
                          style={{
                            padding: "4px 8px",
                            fontSize: 12,
                            background: "#ecfdf5",
                            color: "#059669",
                            border: "1px solid #a7f3d0",
                            borderRadius: 4,
                            cursor: "pointer",
                            fontWeight: 600,
                          }}
                          onClick={() => {
                            setClaims((prev) =>
                              prev.map((c) =>
                                c.id === claim.id ? { ...c, status: "Approved" } : c,
                              ),
                            )
                          }}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          style={{
                            padding: "4px 8px",
                            fontSize: 12,
                            background: "#fef2f2",
                            color: "#dc2626",
                            border: "1px solid #fecaca",
                            borderRadius: 4,
                            cursor: "pointer",
                            fontWeight: 600,
                          }}
                          onClick={() => {
                            setClaims((prev) =>
                              prev.map((c) =>
                                c.id === claim.id ? { ...c, status: "Rejected" } : c,
                              ),
                            )
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: 12, color: "#94a3b8" }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          4. NEW CLAIM MODAL / SCREEN
          ────────────────────────────────────────────────────────── */}
      {isNewClaimOpen && (
        <div className="new-claim-overlay">
          <div className="new-claim-card">
            {/* Header */}
            <div className="new-claim-header">
              <h2 className="new-claim-title">New Claim</h2>
              <button
                type="button"
                className="new-claim-close-btn"
                onClick={() => setIsNewClaimOpen(false)}
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="new-claim-body">
              {/* Employee Selection */}
              <div className="new-claim-field-group">
                <label className="new-claim-field-label">Employee Name</label>
                <select
                  className="new-claim-select-employee"
                  value={newClaimEmployeeId}
                  onChange={(e) => setNewClaimEmployeeId(e.target.value)}
                >
                  <option value="">Select an Employee</option>
                  {emps.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} {emp.designation ? `— ${emp.designation}` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bills Table */}
              <div className="new-claim-bills-container">
                <table className="new-claim-bills-table">
                  <thead>
                    <tr>
                      <th style={{ minWidth: 180 }}>
                        REIMBURSEMENT TYPE <span style={{ color: "#ef4444" }}>*</span>
                      </th>
                      <th style={{ minWidth: 130 }}>BILL DATE</th>
                      <th style={{ minWidth: 130 }}>BILL NUMBER</th>
                      <th style={{ minWidth: 160 }}>ATTACHMENTS</th>
                      <th style={{ minWidth: 120 }}>
                        CLAIM AMOUNT <span style={{ color: "#ef4444" }}>*</span>
                      </th>
                      <th style={{ minWidth: 120 }}>
                        APPROVED AMOUNT <span style={{ color: "#ef4444" }}>*</span>
                      </th>
                      <th style={{ width: 40 }} />
                    </tr>
                  </thead>
                  <tbody>
                    {newClaimBills.map((bill) => (
                      <tr key={bill.id}>
                        {/* Reimbursement Type */}
                        <td>
                          <select
                            className="new-claim-input"
                            value={bill.type}
                            onChange={(e) =>
                              handleUpdateBillRow(bill.id, "type", e.target.value)
                            }
                          >
                            {REIMBURSEMENT_TYPES.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Bill Date */}
                        <td>
                          <input
                            type="date"
                            className="new-claim-input"
                            value={bill.billDate}
                            onChange={(e) =>
                              handleUpdateBillRow(bill.id, "billDate", e.target.value)
                            }
                          />
                        </td>

                        {/* Bill Number */}
                        <td>
                          <input
                            type="text"
                            className="new-claim-input"
                            placeholder="e.g. INV-2026-01"
                            value={bill.billNumber}
                            onChange={(e) =>
                              handleUpdateBillRow(bill.id, "billNumber", e.target.value)
                            }
                          />
                        </td>

                        {/* Attachments */}
                        <td>
                          <label className="new-claim-file-btn">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                            </svg>
                            <span>{bill.attachmentName || "Attach Bill / Receipt"}</span>
                            <input
                              type="file"
                              style={{ display: "none" }}
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  handleUpdateBillRow(bill.id, "attachmentName", file.name)
                                }
                              }}
                            />
                          </label>
                        </td>

                        {/* Claim Amount */}
                        <td>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            className="new-claim-input"
                            placeholder="0.00"
                            value={bill.claimAmount}
                            onChange={(e) =>
                              handleUpdateBillRow(bill.id, "claimAmount", e.target.value)
                            }
                          />
                        </td>

                        {/* Approved Amount */}
                        <td>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            className="new-claim-input"
                            placeholder="0.00"
                            value={bill.approvedAmount}
                            onChange={(e) =>
                              handleUpdateBillRow(bill.id, "approvedAmount", e.target.value)
                            }
                          />
                        </td>

                        {/* Delete row */}
                        <td style={{ textAlign: "center" }}>
                          {newClaimBills.length > 1 && (
                            <button
                              type="button"
                              style={{
                                background: "none",
                                border: "none",
                                color: "#94a3b8",
                                cursor: "pointer",
                                padding: 4,
                              }}
                              onClick={() => handleRemoveBillRow(bill.id)}
                              title="Delete row"
                            >
                              ✕
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* + Add another bill */}
              <div>
                <button
                  type="button"
                  className="new-claim-add-row-btn"
                  onClick={handleAddBillRow}
                >
                  <span style={{ fontSize: 16 }}>+</span>
                  <span>Add another bill</span>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="new-claim-footer">
              <div className="new-claim-footer-actions">
                <button
                  type="button"
                  className="new-claim-btn-save"
                  onClick={() => handleSaveClaim("Approved")}
                >
                  Save & Approve
                </button>
                <button
                  type="button"
                  className="new-claim-btn-pending"
                  onClick={() => handleSaveClaim("Pending")}
                >
                  Save as Pending
                </button>
                <button
                  type="button"
                  className="new-claim-btn-cancel"
                  onClick={() => setIsNewClaimOpen(false)}
                >
                  Cancel
                </button>
              </div>
              <div className="new-claim-mandatory-note">
                * Indicates mandatory fields
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          5. EXPORT REIMBURSEMENTS MODAL (Picture 3 - No Password Checkbox)
          ────────────────────────────────────────────────────────── */}
      {isExportModalOpen && (
        <div
          className="export-modal-overlay"
          onClick={() => {
            setIsExportMonthPickerOpen(false)
            setIsExportModalOpen(false)
          }}
        >
          <div
            className="export-modal-card"
            onClick={() => setIsExportMonthPickerOpen(false)}
          >
            {/* Header */}
            <div className="export-modal-header">
              <h2 className="export-modal-title">Export Reimbursements</h2>
              <button
                type="button"
                className="export-modal-close-btn"
                onClick={() => setIsExportModalOpen(false)}
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="export-modal-body">
              <div className="export-field-group">
                <label className="export-field-label">Period</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    className="export-field-input"
                    value={exportPeriod}
                    readOnly
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsExportMonthPickerOpen((prev) => !prev)
                    }}
                    style={{
                      cursor: "pointer",
                      borderColor: isExportMonthPickerOpen ? "#1877f2" : undefined,
                      boxShadow: isExportMonthPickerOpen
                        ? "0 0 0 3px rgba(24, 119, 242, 0.2)"
                        : undefined,
                    }}
                    placeholder="e.g. Oct 2026"
                  />

                  {/* Month Picker Dropdown (matching screenshot) */}
                  {isExportMonthPickerOpen && (
                    <div
                      className="reimbursements-month-picker"
                      style={{
                        position: "absolute",
                        top: "calc(100% + 4px)",
                        left: 0,
                        zIndex: 100,
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="month-picker-header">
                        <button
                          type="button"
                          className="month-picker-nav-btn"
                          onClick={() => setExportPickerYear((y) => y - 1)}
                          title="Previous year"
                        >
                          «
                        </button>
                        <span className="month-picker-year">
                          {exportPickerYear}
                        </span>
                        <button
                          type="button"
                          className="month-picker-nav-btn"
                          onClick={() => setExportPickerYear((y) => y + 1)}
                          title="Next year"
                        >
                          »
                        </button>
                      </div>
                      <div className="month-picker-grid">
                        {MONTH_NAMES.map((m) => {
                          const isSelected =
                            exportPeriod === `${m} ${exportPickerYear}`
                          return (
                            <button
                              key={m}
                              type="button"
                              className={`month-picker-cell ${
                                isSelected ? "is-selected" : ""
                              }`}
                              onClick={() => {
                                setExportPeriod(`${m} ${exportPickerYear}`)
                                setIsExportMonthPickerOpen(false)
                              }}
                            >
                              {m}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="export-field-group">
                <label className="export-field-label">Filter By</label>
                <select
                  className="export-field-select"
                  value={exportFilterBy}
                  onChange={(e) => setExportFilterBy(e.target.value)}
                >
                  {CLAIMS_FILTER_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="export-field-group">
                <label className="export-field-label">Export as</label>
                <select
                  className="export-field-select"
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                >
                  <option value="XLS (Microsoft Excel 1997-2004 Compatible)">
                    XLS (Microsoft Excel 1997-2004 Compatible)
                  </option>
                  <option value="XLSX (Microsoft Excel)">
                    XLSX (Microsoft Excel)
                  </option>
                  <option value="CSV (Comma Separated Values)">
                    CSV (Comma Separated Values)
                  </option>
                </select>
              </div>
              {/* NOTE: No protect with password check box as requested */}
            </div>

            {/* Footer */}
            <div className="export-modal-footer">
              <button
                type="button"
                className="export-btn-submit"
                onClick={handleExecuteExport}
              >
                Export
              </button>
              <button
                type="button"
                className="export-btn-cancel"
                onClick={() => setIsExportModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ──────────────────────────────────────────────────────────
// PROOF OF INVESTMENTS MODULE (Matching Images 1, 2, 3, 4, 5)
// ──────────────────────────────────────────────────────────

const POI_VIEW_OPTIONS = [
  "All Investments",
  "Approval Pending Investments",
  "Yet To Confirm Investments",
  "Approved Investments",
] as const

type PoiViewFilterType = (typeof POI_VIEW_OPTIONS)[number]

interface YetToSubmitEmployee {
  id: string
  name: string
  email: string
  portalStatus: "Enabled" | "Disabled"
  poiReleaseStatus: "Locked" | "Released"
}

export function ProofOfInvestmentsView({
  emps = [],
  onNavigate,
  onOpenSettings,
}: {
  emps?: ApprovalsEmployee[]
  onNavigate?: (v: string) => void
  onOpenSettings?: (moduleId: string, tab?: string) => void
}) {
  // POI global release status
  const [isPoiReleased, setIsPoiReleased] = useState<boolean>(() => {
    try {
      return localStorage.getItem("naxpayroll_poi_released") === "true"
    } catch {
      return false
    }
  })

  // Main view state (Images 1, 2, 3)
  const [poiFilter, setPoiFilter] = useState<PoiViewFilterType>("Approval Pending Investments")
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false)
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false)
  const [isFilterBarOpen, setIsFilterBarOpen] = useState(true)

  // Filter bar values (Image 1)
  const [fiscalYear, setFiscalYear] = useState("2026 - 2027")
  const [taxRegime, setTaxRegime] = useState("")
  const [employeeFilterId, setEmployeeFilterId] = useState("")
  const [isFiscalYearDropdownOpen, setIsFiscalYearDropdownOpen] = useState(false)
  const [isTaxRegimeDropdownOpen, setIsTaxRegimeDropdownOpen] = useState(false)
  const [isEmployeePickerOpen, setIsEmployeePickerOpen] = useState(false)
  const [employeeSearch, setEmployeeSearch] = useState("")

  const selectedEmp = emps.find((e) => e.id === employeeFilterId)
  const filteredEmps = emps.filter(
    (e) =>
      e.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
      e.id.toLowerCase().includes(employeeSearch.toLowerCase()),
  )

  // Sub-view: "main" (Images 1-3) vs "yet-to-submit" (Images 4-5)
  const [subView, setSubView] = useState<"main" | "yet-to-submit">("main")

  // Modal warning for Send Reminder when POI is locked (Image 2)
  const [isReminderWarningModalOpen, setIsReminderWarningModalOpen] = useState(false)

  // Yet to submit employees state (Images 4 & 5)
  const [employeesYetToSubmit, setEmployeesYetToSubmit] = useState<YetToSubmitEmployee[]>([
    {
      id: "emp-01234",
      name: "POLAVARAPU GANAPATI VARA PRASAD - Emp01234",
      email: "prasadpolavarapu57@gmail.com",
      portalStatus: "Enabled",
      poiReleaseStatus: isPoiReleased ? "Released" : "Locked",
    },
    {
      id: "emp-012",
      name: "abc d e - emp012",
      email: "abc@gmail.com",
      portalStatus: "Enabled",
      poiReleaseStatus: isPoiReleased ? "Released" : "Locked",
    },
  ])

  // Sync POI release state across app
  useEffect(() => {
    const handleStatusChange = () => {
      try {
        const released = localStorage.getItem("naxpayroll_poi_released") === "true"
        setIsPoiReleased(released)
        setEmployeesYetToSubmit((prev) =>
          prev.map((e) => ({
            ...e,
            poiReleaseStatus: released ? "Released" : "Locked",
          })),
        )
      } catch {
        // ignore
      }
    }
    window.addEventListener("naxpayroll_poi_status_changed", handleStatusChange)
    return () =>
      window.removeEventListener("naxpayroll_poi_status_changed", handleStatusChange)
  }, [])

  // Selected row checkboxes in "yet-to-submit" view (Image 5)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isBatchDropdownOpen, setIsBatchDropdownOpen] = useState(false)

  // Toast / notification
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3500)
  }

  // Keyboard Escape listener to clear selection & close popups
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedIds([])
        setIsBatchDropdownOpen(false)
        setIsViewDropdownOpen(false)
        setIsMoreMenuOpen(false)
        setIsFiscalYearDropdownOpen(false)
        setIsTaxRegimeDropdownOpen(false)
        setIsEmployeePickerOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Close menus on outside click
  const closeMenus = () => {
    setIsViewDropdownOpen(false)
    setIsMoreMenuOpen(false)
    setIsBatchDropdownOpen(false)
    setIsFiscalYearDropdownOpen(false)
    setIsTaxRegimeDropdownOpen(false)
    setIsEmployeePickerOpen(false)
  }

  // Toggle all row checkboxes
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(employeesYetToSubmit.map((emp) => emp.id))
    } else {
      setSelectedIds([])
    }
  }

  // Toggle single row checkbox
  const handleToggleRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  // Batch action: Lock or Release (Image 5)
  const handleBatchStatusChange = (status: "Locked" | "Released") => {
    setEmployeesYetToSubmit((prev) =>
      prev.map((emp) =>
        selectedIds.includes(emp.id)
          ? { ...emp, poiReleaseStatus: status }
          : emp,
      ),
    )
    setIsBatchDropdownOpen(false)
    showToast(
      `POI ${status === "Locked" ? "locked" : "released"} for ${selectedIds.length} employee(s)`,
    )
  }

  // Export CSV of employees yet to submit POI (Image 4)
  const handleExportYetToSubmit = () => {
    const csvHeader = "EMPLOYEE NAME,EMAIL ID,PORTAL STATUS,POI RELEASE STATUS\n"
    const csvRows = employeesYetToSubmit
      .map(
        (e) =>
          `"${e.name}","${e.email}","${e.portalStatus}","${e.poiReleaseStatus}"`,
      )
      .join("\n")
    const blob = new Blob([csvHeader + csvRows], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "Employees_Yet_to_Submit_POI.csv"
    link.click()
    URL.revokeObjectURL(url)
    showToast("Downloaded Employees_Yet_to_Submit_POI.csv")
  }

  // ──────────────────────────────────────────────────────────
  // SCREEN: Employees Yet to Submit POI (Images 4 & 5)
  // ──────────────────────────────────────────────────────────
  if (subView === "yet-to-submit") {
    const isAllSelected =
      selectedIds.length === employeesYetToSubmit.length &&
      employeesYetToSubmit.length > 0
    const isIndeterminate =
      selectedIds.length > 0 && selectedIds.length < employeesYetToSubmit.length

    return (
      <div className="reimbursements-page-wrapper" onClick={closeMenus}>
        {/* Toast Notification */}
        {toastMessage && (
          <div className="poi-toast-notification">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header Bar */}
        {selectedIds.length > 0 ? (
          /* Image 5: Batch selection header */
          <div className="poi-batch-bar" onClick={(e) => e.stopPropagation()}>
            <div className="poi-batch-left">
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="poi-batch-select-btn"
                  onClick={() => setIsBatchDropdownOpen((prev) => !prev)}
                >
                  <span>Release POI</span>
                  <span className="poi-batch-divider" />
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      transform: isBatchDropdownOpen ? "rotate(180deg)" : "none",
                      transition: "transform 0.15s ease",
                    }}
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                {isBatchDropdownOpen && (
                  <div className="poi-batch-dropdown" role="menu">
                    <button
                      type="button"
                      className="poi-batch-item is-selected"
                      onClick={() => handleBatchStatusChange("Locked")}
                    >
                      Lock POI
                    </button>
                    <button
                      type="button"
                      className="poi-batch-item"
                      onClick={() => handleBatchStatusChange("Released")}
                    >
                      Release POI
                    </button>
                  </div>
                )}
              </div>

              <span className="poi-selected-pill">
                <strong>{selectedIds.length}</strong> Selected
              </span>
            </div>

            <div className="poi-batch-right">
              <button
                type="button"
                className="poi-esc-clear-btn"
                onClick={() => setSelectedIds([])}
                title="Clear selection (Esc)"
              >
                <span>Esc</span>
                <span className="poi-esc-cross">✕</span>
              </button>
            </div>
          </div>
        ) : (
          /* Image 4: Default Yet to submit header */
          <div
            className="poi-yet-to-submit-header"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="poi-yet-to-submit-left">
              <button
                type="button"
                className="poi-back-btn"
                onClick={() => {
                  setSubView("main")
                  setSelectedIds([])
                }}
                title="Back to Proof Of Investments"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <h2 className="poi-yet-to-submit-title">
                Employees Yet to Submit POI ({employeesYetToSubmit.length})
              </h2>
            </div>

            <div className="poi-yet-to-submit-right">
              <div className="poi-header-info-banner">
                {isPoiReleased ? (
                  <>
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#16A34A"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span style={{ color: "#16A34A", fontWeight: 600 }}>
                      POI is released.
                    </span>
                  </>
                ) : (
                  <>
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#64748b"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    <span>
                      POI is locked.{" "}
                      <button
                        type="button"
                        className="poi-release-link"
                        onClick={() => {
                          if (onOpenSettings) {
                            onOpenSettings("claims-declarations", "Proof Of Investments")
                          }
                        }}
                      >
                        Release
                      </button>
                    </span>
                  </>
                )}
              </div>

              <button
                type="button"
                className="poi-icon-btn"
                onClick={handleExportYetToSubmit}
                title="Export list to CSV"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </button>

              <button
                type="button"
                className="poi-btn-primary"
                onClick={() => {
                  if (!isPoiReleased) {
                    setIsReminderWarningModalOpen(true)
                  } else {
                    showToast(
                      `Reminder sent successfully to ${employeesYetToSubmit.length} employee(s)`,
                    )
                  }
                }}
              >
                Send Reminder
              </button>
            </div>
          </div>
        )}

        {/* Modal warning when clicking Send Reminder without release (Image 2) */}
        {isReminderWarningModalOpen && (
          <div
            className="poi-reminder-modal-overlay"
            onClick={() => setIsReminderWarningModalOpen(false)}
          >
            <div
              className="poi-reminder-modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="poi-reminder-modal-body">
                <div className="poi-reminder-icon-wrap">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#F97316" />
                    <line
                      x1="12"
                      y1="16"
                      x2="12"
                      y2="12"
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <circle cx="12" cy="8" r="1.3" fill="#FFFFFF" />
                  </svg>
                </div>
                <div className="poi-reminder-content">
                  <h3 className="poi-reminder-title">
                    Release Proof Of Investments
                  </h3>
                  <p className="poi-reminder-desc">
                    You'll have to release the POI Submission for these employees before sending the reminder.
                  </p>
                </div>
              </div>
              <div className="poi-reminder-modal-actions">
                <button
                  type="button"
                  className="poi-reminder-btn-primary"
                  onClick={() => setIsReminderWarningModalOpen(false)}
                >
                  Ok, got it!
                </button>
                <button
                  type="button"
                  className="poi-reminder-btn-link"
                  onClick={() => {
                    setIsReminderWarningModalOpen(false)
                    if (onOpenSettings) {
                      onOpenSettings("claims-declarations", "Proof Of Investments")
                    }
                  }}
                >
                  Release POI
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table matching Images 4 & 5 */}
        <div className="poi-table-container">
          <table className="poi-table">
            <thead>
              <tr>
                <th style={{ width: 44, paddingLeft: 20 }}>
                  <input
                    type="checkbox"
                    className="poi-checkbox"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isIndeterminate
                    }}
                    onChange={handleSelectAll}
                    aria-label="Select all employees"
                  />
                </th>
                <th>EMPLOYEE NAME</th>
                <th>EMAIL ID</th>
                <th>PORTAL STATUS</th>
                <th>POI RELEASE STATUS</th>
              </tr>
            </thead>
            <tbody>
              {employeesYetToSubmit.map((emp) => {
                const isSelected = selectedIds.includes(emp.id)
                return (
                  <tr
                    key={emp.id}
                    className={isSelected ? "is-row-selected" : ""}
                  >
                    <td style={{ width: 44, paddingLeft: 20 }}>
                      <input
                        type="checkbox"
                        className="poi-checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleRow(emp.id)}
                        aria-label={`Select ${emp.name}`}
                      />
                    </td>
                    <td className="poi-emp-name-cell">{emp.name}</td>
                    <td className="poi-emp-email-cell">{emp.email}</td>
                    <td>
                      <span className="poi-badge-enabled">{emp.portalStatus}</span>
                    </td>
                    <td>
                      <span
                        className={
                          emp.poiReleaseStatus === "Locked"
                            ? "poi-badge-locked"
                            : "poi-badge-released"
                        }
                      >
                        {emp.poiReleaseStatus}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  // ──────────────────────────────────────────────────────────
  // SCREEN: Main Proof of Investments View (Images 1, 2, 3)
  // ──────────────────────────────────────────────────────────
  return (
    <div className="reimbursements-page-wrapper" onClick={closeMenus}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="poi-toast-notification">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Topbar (Images 1, 2, 3) */}
      <div className="poi-topbar" onClick={(e) => e.stopPropagation()}>
        {/* Left: View Filter Dropdown (Image 1 & 2) */}
        <div style={{ position: "relative" }}>
          <button
            type="button"
            className="poi-view-trigger"
            onClick={() => {
              setIsMoreMenuOpen(false)
              setIsViewDropdownOpen((prev) => !prev)
            }}
            aria-expanded={isViewDropdownOpen}
          >
            <span>{poiFilter}</span>
            <svg
              className={`poi-view-chevron ${isViewDropdownOpen ? "is-open" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {/* Image 2: View Dropdown Menu */}
          {isViewDropdownOpen && (
            <div className="poi-view-dropdown" role="menu">
              {POI_VIEW_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={`poi-dropdown-item ${
                    poiFilter === opt ? "is-selected" : ""
                  }`}
                  onClick={() => {
                    setPoiFilter(opt)
                    setIsViewDropdownOpen(false)
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Warning banner with View button, 3 dots, and filter button */}
        <div className="poi-topbar-right">
          {/* Warning banner: 2 employee(s) yet to submit POI View */}
          <div className="poi-warning-banner">
            <span className="poi-alert-icon">!</span>
            <span className="poi-warning-text">
              2 employee(s) yet to submit POI
            </span>
            <button
              type="button"
              className="poi-view-link-btn"
              onClick={() => {
                setSubView("yet-to-submit")
                setSelectedIds([])
              }}
            >
              View
            </button>
          </div>

          {/* 3 dots (···) button (Image 1 & 3) */}
          <div style={{ position: "relative" }}>
            <button
              type="button"
              className={`poi-icon-btn ${isMoreMenuOpen ? "is-active" : ""}`}
              onClick={() => {
                setIsViewDropdownOpen(false)
                setIsMoreMenuOpen((prev) => !prev)
              }}
              title="More actions"
              aria-label="More actions"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="5" cy="12" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="19" cy="12" r="2" />
              </svg>
            </button>

            {/* Image 3: 3-dots Dropdown Menu */}
            {isMoreMenuOpen && (
              <div className="poi-more-menu" role="menu">
                <button
                  type="button"
                  className="poi-more-release-btn"
                  onClick={() => {
                    setIsMoreMenuOpen(false)
                    if (onOpenSettings) {
                      onOpenSettings("claims-declarations", "Proof Of Investments")
                    }
                  }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                  </svg>
                  <span>Release POI</span>
                </button>
              </div>
            )}
          </div>

          {/* Filter button */}
          <button
            type="button"
            className={`poi-icon-btn ${isFilterBarOpen ? "is-active" : ""}`}
            onClick={() => setIsFilterBarOpen((prev) => !prev)}
            title="Toggle Filters"
            aria-label="Toggle Filters"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Filter Bar (Places 2, 3, 4: matching custom dropdown Image 5) */}
      {isFilterBarOpen && (
        <div className="poi-filter-bar" onClick={(e) => e.stopPropagation()}>
          {/* Fiscal Year Filter Chip (Place 2) */}
          <div style={{ position: "relative" }}>
            <div
              className="salary-rev-filter-chip"
              onClick={(e) => {
                e.stopPropagation()
                setIsViewDropdownOpen(false)
                setIsMoreMenuOpen(false)
                setIsTaxRegimeDropdownOpen(false)
                setIsEmployeePickerOpen(false)
                setIsFiscalYearDropdownOpen((prev) => !prev)
              }}
              title="Select Fiscal Year"
            >
              <span className="salary-rev-filter-label">Fiscal Year:</span>
              <span className="salary-rev-filter-value">{fiscalYear}</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#64748b"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>

            {isFiscalYearDropdownOpen && (
              <div
                className="salary-rev-emp-dropdown"
                style={{ width: 170 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ padding: "4px 0" }}>
                  {["2026 - 2027", "2025 - 2026", "2024 - 2025"].map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      className={`salary-rev-emp-item ${fiscalYear === yr ? "is-selected" : ""}`}
                      onClick={() => {
                        setFiscalYear(yr)
                        setIsFiscalYearDropdownOpen(false)
                      }}
                    >
                      {yr}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tax Regime Filter Chip (Place 3) */}
          <div style={{ position: "relative" }}>
            <div
              className="salary-rev-filter-chip"
              onClick={(e) => {
                e.stopPropagation()
                setIsViewDropdownOpen(false)
                setIsMoreMenuOpen(false)
                setIsFiscalYearDropdownOpen(false)
                setIsEmployeePickerOpen(false)
                setIsTaxRegimeDropdownOpen((prev) => !prev)
              }}
              title="Select Tax Regime"
            >
              <span className="salary-rev-filter-label">Tax Regime:</span>
              <span
                className="salary-rev-filter-value"
                style={{
                  color: taxRegime ? "#1e293b" : "#64748b",
                  fontWeight: taxRegime ? 600 : 400,
                }}
              >
                {taxRegime || "Select Tax Regime"}
              </span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#64748b"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>

            {isTaxRegimeDropdownOpen && (
              <div
                className="salary-rev-emp-dropdown"
                style={{ width: 180 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ padding: "4px 0" }}>
                  {[
                    { label: "Select Tax Regime", value: "" },
                    { label: "New Tax Regime", value: "New Tax Regime" },
                    { label: "Old Tax Regime", value: "Old Tax Regime" },
                  ].map((reg) => (
                    <button
                      key={reg.label}
                      type="button"
                      className={`salary-rev-emp-item ${taxRegime === reg.value ? "is-selected" : ""}`}
                      onClick={() => {
                        setTaxRegime(reg.value)
                        setIsTaxRegimeDropdownOpen(false)
                      }}
                    >
                      {reg.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Employees Filter Chip (Place 4) */}
          <div style={{ position: "relative" }}>
            <div
              className="salary-rev-filter-chip"
              onClick={(e) => {
                e.stopPropagation()
                setIsViewDropdownOpen(false)
                setIsMoreMenuOpen(false)
                setIsFiscalYearDropdownOpen(false)
                setIsTaxRegimeDropdownOpen(false)
                setIsEmployeePickerOpen((prev) => !prev)
              }}
              title="Select Employee"
            >
              <span className="salary-rev-filter-label">Employees:</span>
              <span
                className="salary-rev-filter-value"
                style={{
                  color: selectedEmp ? "#1e293b" : "#64748b",
                  fontWeight: selectedEmp ? 600 : 400,
                }}
              >
                {selectedEmp ? selectedEmp.name : "Select an Employee"}
              </span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#64748b"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>

            {isEmployeePickerOpen && (
              <div
                className="salary-rev-emp-dropdown"
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ padding: "8px 10px", borderBottom: "1px solid #e2e8f0" }}>
                  <input
                    type="text"
                    placeholder="Search employee..."
                    className="salary-rev-emp-search-input"
                    value={employeeSearch}
                    onChange={(e) => setEmployeeSearch(e.target.value)}
                    autoFocus
                  />
                </div>
                <div style={{ maxHeight: 220, overflowY: "auto" }}>
                  <button
                    type="button"
                    className={`salary-rev-emp-item ${!employeeFilterId ? "is-selected" : ""}`}
                    onClick={() => {
                      setEmployeeFilterId("")
                      setIsEmployeePickerOpen(false)
                    }}
                  >
                    Select an Employee
                  </button>
                  {filteredEmps.map((emp) => (
                    <button
                      key={emp.id}
                      type="button"
                      className={`salary-rev-emp-item ${employeeFilterId === emp.id ? "is-selected" : ""}`}
                      onClick={() => {
                        setEmployeeFilterId(emp.id)
                        setIsEmployeePickerOpen(false)
                      }}
                    >
                      <div style={{ fontWeight: 500 }}>{emp.name}</div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>
                        {emp.id} {emp.department ? `· ${emp.department}` : ""}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty State (Images 1, 2, 3) */}
      <div className="poi-empty-state">
        <div className="poi-mascot-wrap">
          <ReimbursementMascot />
        </div>
        <h3 className="poi-empty-title">
          Excellent! Looks like you don't have any pending Proof Of
          <br />
          Investments to review.
        </h3>
        <p className="poi-empty-desc">
          All the pending investment proofs will be listed as soon as the
          employees submit them in the
          <br />
          employee portal.
        </p>
      </div>
    </div>
  )
}

/**
 * ──────────────────────────────────────────────────────────────────────────
 * SALARY REVISION VIEW
 * Reference screens 1-4:
 * 1. Main View: Title "All Revisions ⌵", "Send Revision Letters", "···", "▽".
 *    Filter bar: "Payout Month: Oct 2026 ✕", "Employees: Select an Employee ⌵", "✕ Clear Filter".
 *    Mascot with "No results found" and "Looks like you don't have any results for the filter applied".
 * 2. View Dropdown: "All Revisions" (active blue), "Pending Revisions", "Approved Revisions", "Rejected Revisions".
 * 3. More Action: "Export" button popover in blue with tray icon.
 * 4. Send Revision Letters Warning Modal: Orange exclamation mark circle, text:
 *    "You need to configure the Salary Revision Letter template in order to be able to send the Salary Revision Letter.",
 *    "Enable Now" button (redirects to Settings -> Customisations -> PDF Templates),
 *    "Maybe Later" button (closes modal).
 * ──────────────────────────────────────────────────────────────────────────
 */
export type SalaryRevisionFilterType =
  | "All Revisions"
  | "Pending Revisions"
  | "Approved Revisions"
  | "Rejected Revisions"

const SALARY_REVISION_FILTER_OPTIONS: SalaryRevisionFilterType[] = [
  "All Revisions",
  "Pending Revisions",
  "Approved Revisions",
  "Rejected Revisions",
]

export function SalaryRevisionView({
  emps = [],
  onNavigate,
  onOpenSettings,
}: {
  emps?: ApprovalsEmployee[]
  onNavigate?: (v: string) => void
  onOpenSettings?: (moduleId: string, tab?: string) => void
}) {
  // 1. Filter dropdown state (Image 1 & Image 2)
  const [selectedFilter, setSelectedFilter] =
    useState<SalaryRevisionFilterType>("All Revisions")
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false)

  // 2. More options popover state (Image 3)
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false)

  // 3. Filter bar toggle & filter values (Image 1)
  const [isFilterBarOpen, setIsFilterBarOpen] = useState(true)
  const [payoutMonthFilter, setPayoutMonthFilter] = useState<string>("Oct 2026")
  const [employeeFilterId, setEmployeeFilterId] = useState<string>("")

  // Month Picker Popover
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false)
  const [pickerYear, setPickerYear] = useState<number>(2026)

  // Employee Picker Popover
  const [isEmployeePickerOpen, setIsEmployeePickerOpen] = useState(false)
  const [employeeSearch, setEmployeeSearch] = useState("")

  // 4. Send Revision Letters Warning Modal (Image 4)
  const [isSendRevisionLettersModalOpen, setIsSendRevisionLettersModalOpen] =
    useState(false)

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3500)
  }

  // Close open popovers when clicking outside
  const closeAllPopovers = () => {
    setIsViewDropdownOpen(false)
    setIsMoreMenuOpen(false)
    setIsMonthPickerOpen(false)
    setIsEmployeePickerOpen(false)
  }

  // Export revisions to CSV
  const handleExport = () => {
    setIsMoreMenuOpen(false)
    const csvContent =
      "Employee ID,Employee Name,Effective Date,Payout Month,Previous CTC,Revised CTC,Increment Percentage,Status\n" +
      'EMP-001,Pavani Kanteti,01-Oct-2026,Oct 2026,"₹ 6,00,000","₹ 7,20,000",20%,Draft\n' +
      'EMP-002,Kiran Varma,01-Oct-2026,Oct 2026,"₹ 8,50,000","₹ 9,77,500",15%,Draft\n'
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute(
      "download",
      `Salary_Revisions_${(payoutMonthFilter || "All").replace(/\s+/g, "_")}.csv`,
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    showToast("Salary revisions exported successfully")
  }

  const selectedEmp = emps.find((e) => e.id === employeeFilterId)
  const filteredEmps = emps.filter(
    (e) =>
      e.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
      e.id.toLowerCase().includes(employeeSearch.toLowerCase()),
  )

  return (
    <div className="salary-rev-page-wrapper" onClick={closeAllPopovers}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="poi-toast-notification">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          1. HEADER BAR: Title Dropdown + Actions (Images 1, 2, 3)
          ────────────────────────────────────────────────────────── */}
      <div className="salary-rev-topbar">
        {/* Left: View Dropdown Trigger */}
        <div style={{ position: "relative" }}>
          <button
            type="button"
            className="salary-rev-view-trigger"
            onClick={(e) => {
              e.stopPropagation()
              setIsMoreMenuOpen(false)
              setIsMonthPickerOpen(false)
              setIsEmployeePickerOpen(false)
              setIsViewDropdownOpen((prev) => !prev)
            }}
          >
            <span className="salary-rev-view-title">{selectedFilter}</span>
            <svg
              className={`salary-rev-view-chevron ${isViewDropdownOpen ? "is-open" : ""}`}
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2563eb"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isViewDropdownOpen ? (
                <polyline points="18 15 12 9 6 15" />
              ) : (
                <polyline points="6 9 12 15 18 9" />
              )}
            </svg>
          </button>

          {/* View Dropdown Menu (Image 2) */}
          {isViewDropdownOpen && (
            <div
              className="salary-rev-view-dropdown"
              role="menu"
              onClick={(e) => e.stopPropagation()}
            >
              {SALARY_REVISION_FILTER_OPTIONS.map((opt) => {
                const isSelected = selectedFilter === opt
                return (
                  <button
                    key={opt}
                    type="button"
                    className={`salary-rev-dropdown-item ${isSelected ? "is-active" : ""}`}
                    onClick={() => {
                      setSelectedFilter(opt)
                      setIsViewDropdownOpen(false)
                    }}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="salary-rev-actions">
          {/* Send Revision Letters Button */}
          <button
            type="button"
            className="salary-rev-btn-send-letters"
            onClick={(e) => {
              e.stopPropagation()
              setIsViewDropdownOpen(false)
              setIsMoreMenuOpen(false)
              setIsSendRevisionLettersModalOpen(true)
            }}
            title="Send Revision Letters"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            <span>Send Revision Letters</span>
          </button>

          {/* ··· More Button (Image 3) */}
          <div style={{ position: "relative" }}>
            <button
              type="button"
              className={`salary-rev-icon-btn ${isMoreMenuOpen ? "is-active" : ""}`}
              onClick={(e) => {
                e.stopPropagation()
                setIsViewDropdownOpen(false)
                setIsMonthPickerOpen(false)
                setIsEmployeePickerOpen(false)
                setIsMoreMenuOpen((prev) => !prev)
              }}
              title="More Actions"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="5" cy="12" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="19" cy="12" r="2" />
              </svg>
            </button>

            {/* Export Popover (Image 3) */}
            {isMoreMenuOpen && (
              <div
                className="salary-rev-more-menu"
                role="menu"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className="salary-rev-export-btn"
                  onClick={handleExport}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span>Export</span>
                </button>
              </div>
            )}
          </div>

          {/* Filter Symbol Button */}
          <button
            type="button"
            className={`salary-rev-icon-btn ${isFilterBarOpen ? "is-active" : ""}`}
            onClick={(e) => {
              e.stopPropagation()
              setIsFilterBarOpen((prev) => !prev)
            }}
            title="Toggle Filter Bar"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2563eb"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          </button>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          2. FILTER BAR (Images 1, 2, 3)
          ────────────────────────────────────────────────────────── */}
      {isFilterBarOpen && (
        <div className="salary-rev-filter-bar" onClick={(e) => e.stopPropagation()}>
          {/* Payout Month Filter Chip */}
          <div style={{ position: "relative" }}>
            <div
              className="salary-rev-filter-chip"
              onClick={(e) => {
                e.stopPropagation()
                setIsViewDropdownOpen(false)
                setIsMoreMenuOpen(false)
                setIsEmployeePickerOpen(false)
                setIsMonthPickerOpen((prev) => !prev)
              }}
              title="Select Payout Month"
            >
              <span className="salary-rev-filter-label">Payout Month:</span>
              <span className="salary-rev-filter-value">
                {payoutMonthFilter || "Select Month"}
              </span>
              {payoutMonthFilter && (
                <button
                  type="button"
                  className="salary-rev-filter-chip-clear"
                  onClick={(e) => {
                    e.stopPropagation()
                    setPayoutMonthFilter("")
                    setIsMonthPickerOpen(false)
                  }}
                  title="Clear Payout Month"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Month Picker Popup (matching Reimbursements image 3) */}
            {isMonthPickerOpen && (
              <div
                className="reimbursements-month-picker"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="month-picker-header">
                  <button
                    type="button"
                    className="month-picker-nav-btn"
                    onClick={() => setPickerYear((y) => y - 1)}
                  >
                    «
                  </button>
                  <span className="month-picker-year">{pickerYear}</span>
                  <button
                    type="button"
                    className="month-picker-nav-btn"
                    onClick={() => setPickerYear((y) => y + 1)}
                  >
                    »
                  </button>
                </div>
                <div className="month-picker-grid">
                  {MONTH_NAMES.map((m) => {
                    const formatted = `${m} ${pickerYear}`
                    const isSelected = payoutMonthFilter === formatted
                    return (
                      <button
                        key={m}
                        type="button"
                        className={`month-picker-cell ${isSelected ? "is-selected" : ""}`}
                        onClick={() => {
                          setPayoutMonthFilter(formatted)
                          setIsMonthPickerOpen(false)
                        }}
                      >
                        {m}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Employees Filter Chip */}
          <div style={{ position: "relative" }}>
            <div
              className="salary-rev-filter-chip"
              onClick={(e) => {
                e.stopPropagation()
                setIsViewDropdownOpen(false)
                setIsMoreMenuOpen(false)
                setIsMonthPickerOpen(false)
                setIsEmployeePickerOpen((prev) => !prev)
              }}
              title="Select Employee"
            >
              <span className="salary-rev-filter-label">Employees:</span>
              <span
                className="salary-rev-filter-value"
                style={{
                  color: selectedEmp ? "#1e293b" : "#64748b",
                  fontWeight: selectedEmp ? 600 : 400,
                }}
              >
                {selectedEmp ? selectedEmp.name : "Select an Employee"}
              </span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#64748b"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>

            {/* Employee Picker Dropdown */}
            {isEmployeePickerOpen && (
              <div
                className="salary-rev-emp-dropdown"
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ padding: "8px 10px", borderBottom: "1px solid #e2e8f0" }}>
                  <input
                    type="text"
                    placeholder="Search employee..."
                    className="salary-rev-emp-search-input"
                    value={employeeSearch}
                    onChange={(e) => setEmployeeSearch(e.target.value)}
                    autoFocus
                  />
                </div>
                <div style={{ maxHeight: 220, overflowY: "auto" }}>
                  <button
                    type="button"
                    className={`salary-rev-emp-item ${!employeeFilterId ? "is-selected" : ""}`}
                    onClick={() => {
                      setEmployeeFilterId("")
                      setIsEmployeePickerOpen(false)
                    }}
                  >
                    Select an Employee
                  </button>
                  {filteredEmps.map((emp) => (
                    <button
                      key={emp.id}
                      type="button"
                      className={`salary-rev-emp-item ${employeeFilterId === emp.id ? "is-selected" : ""}`}
                      onClick={() => {
                        setEmployeeFilterId(emp.id)
                        setIsEmployeePickerOpen(false)
                      }}
                    >
                      <div style={{ fontWeight: 500 }}>{emp.name}</div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>
                        {emp.id} {emp.department ? `· ${emp.department}` : ""}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Clear Filter Action (Image 1) */}
          {(payoutMonthFilter || employeeFilterId) && (
            <button
              type="button"
              className="salary-rev-clear-filter-btn"
              onClick={() => {
                setPayoutMonthFilter("")
                setEmployeeFilterId("")
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 700 }}>✕</span>
              <span>Clear Filter</span>
            </button>
          )}
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          3. MAIN BODY: Mascot & Empty State (Image 1)
          ────────────────────────────────────────────────────────── */}
      <div className="reimbursements-empty-state">
        <div className="reimbursements-mascot-wrap">
          <ReimbursementMascot />
        </div>
        <h2 className="reimbursements-empty-title">No results found</h2>
        <p className="reimbursements-empty-desc">
          Looks like you don't have any results for the filter applied
        </p>
      </div>

      {/* ──────────────────────────────────────────────────────────
          4. SEND REVISION LETTERS WARNING MODAL (Image 4)
          ────────────────────────────────────────────────────────── */}
      {isSendRevisionLettersModalOpen && (
        <div
          className="salary-rev-modal-overlay"
          onClick={() => setIsSendRevisionLettersModalOpen(false)}
        >
          <div
            className="salary-rev-modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="salary-rev-modal-body">
              {/* Left: Orange Exclamation Icon */}
              <div className="salary-rev-modal-icon">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ display: "block" }}
                >
                  <circle cx="12" cy="12" r="11" fill="#F97316" />
                  <line
                    x1="12"
                    y1="7"
                    x2="12"
                    y2="13"
                    stroke="#FFFFFF"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                  <circle cx="12" cy="17" r="1.3" fill="#FFFFFF" />
                </svg>
              </div>

              {/* Right: Message text */}
              <div style={{ flex: 1 }}>
                <p className="salary-rev-modal-text">
                  You need to configure the Salary Revision Letter template in
                  order to be able to send the Salary Revision Letter.
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="salary-rev-modal-actions">
              <button
                type="button"
                className="salary-rev-modal-btn-primary"
                onClick={() => {
                  setIsSendRevisionLettersModalOpen(false)
                  if (onOpenSettings) {
                    onOpenSettings("pdf-templates", "Salary Revision Letter")
                  } else if (onNavigate) {
                    onNavigate("settings")
                  }
                }}
              >
                Enable Now
              </button>
              <button
                type="button"
                className="salary-rev-modal-btn-secondary"
                onClick={() => setIsSendRevisionLettersModalOpen(false)}
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Unified Approvals View:
 * Renders the full Reimbursements screen when type === "reimbursements",
 * the full Proof of Investments screen when type === "proof-of-investments",
 * or the full Salary Revision screen when type === "salary-revision".
 */
export function ApprovalsView({
  type,
  onNavigate,
  emps = [],
  onOpenSettings,
}: {
  type: ApprovalViewType
  onNavigate?: (v: string) => void
  emps?: ApprovalsEmployee[]
  onOpenSettings?: (moduleId: string, tab?: string) => void
}) {
  if (type === "reimbursements") {
    return <ReimbursementsView emps={emps} />
  }

  if (type === "proof-of-investments") {
    return (
      <ProofOfInvestmentsView
        emps={emps}
        onNavigate={onNavigate}
        onOpenSettings={onOpenSettings}
      />
    )
  }

  if (type === "salary-revision") {
    return (
      <SalaryRevisionView
        emps={emps}
        onNavigate={onNavigate}
        onOpenSettings={onOpenSettings}
      />
    )
  }
  const meta = {
    "proof-of-investments": {
      title: "Proof Of Investments",
      subtitle:
        "Verify and approve employee statutory investment declarations, Section 80C/80D proofs, and tax deductions.",
      emptyTitle: "No Investment Proofs Awaiting Verification",
      emptyDesc:
        "Year-end tax exemption proofs and supporting bills submitted by employees will appear here for statutory verification.",
      badge: "Tax Compliance",
      stat1: { label: "Pending Review", value: "0" },
      stat2: { label: "Verified Proofs", value: "0" },
      stat3: { label: "Rejected Submissions", value: "0" },
    },
    "salary-revision": {
      title: "Salary Revision",
      subtitle:
        "Manage, review, and authorize compensation increments, grade revisions, and structural CTC revisions.",
      emptyTitle: "No Pending Salary Revisions",
      emptyDesc:
        "Compensation updates, promotion adjustments, and appraisals awaiting administrative sign-off will be listed here.",
      badge: "Compensation Cycle",
      stat1: { label: "Pending Revisions", value: "0" },
      stat2: { label: "Effective This Month", value: "0" },
      stat3: { label: "Completed Revisions", value: "0" },
    },
  }[type as "proof-of-investments" | "salary-revision"]

  if (!meta) return null

  return (
    <div className="approvals-page-container">
      {/* Header bar */}
      <div
        className="sap-dynamic-page-title"
        style={{
          background: "var(--z-card, #ffffff)",
          border: "1px solid var(--z-border, #dde3ec)",
          borderRadius: 8,
          padding: "18px 22px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 18,
          boxShadow: "0 1px 4px rgba(15,23,42,0.06)",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 23,
              fontWeight: 900,
              color: "var(--z-text-primary, #1a2b4b)",
              lineHeight: 1.15,
            }}
          >
            {meta.title}
          </h1>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 13,
              color: "var(--z-text-secondary, #455a71)",
              lineHeight: 1.45,
            }}
          >
            {meta.subtitle}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span className="approvals-badge-pill">
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--z-brand, #306fd1)",
              }}
            />
            {meta.badge}
          </span>
        </div>
      </div>

      {/* Quick stats grid */}
      <div className="approvals-stat-grid">
        <div className="approvals-stat-card">
          <span className="approvals-stat-label">{meta.stat1.label}</span>
          <span className="approvals-stat-value">{meta.stat1.value}</span>
          <span className="approvals-stat-sub">Action required</span>
        </div>
        <div className="approvals-stat-card">
          <span className="approvals-stat-label">{meta.stat2.label}</span>
          <span className="approvals-stat-value">{meta.stat2.value}</span>
          <span className="approvals-stat-sub">Processed to date</span>
        </div>
        <div className="approvals-stat-card">
          <span className="approvals-stat-label">{meta.stat3.label}</span>
          <span className="approvals-stat-value">{meta.stat3.value}</span>
          <span className="approvals-stat-sub">Declined items</span>
        </div>
      </div>

      {/* Placeholder content card */}
      <div className="approvals-placeholder-card">
        <div className="approvals-placeholder-icon-circle">
          <ApprovalIcon size={26} />
        </div>
        <h3 className="approvals-placeholder-title">{meta.emptyTitle}</h3>
        <p className="approvals-placeholder-desc">{meta.emptyDesc}</p>
        <div
          style={{
            fontSize: 12,
            color: "var(--z-text-muted, #7a8da0)",
            padding: "8px 16px",
            background: "var(--z-app-bg, #f4f6f9)",
            borderRadius: 6,
            border: "1px dashed var(--z-border, #dde3ec)",
          }}
        >
          Navigation route active & ready for module workflow implementation
        </div>
      </div>
    </div>
  )
}

export default ApprovalsNav
