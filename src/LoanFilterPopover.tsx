import React, { useState, useEffect, useRef, useMemo } from "react"

export type LoanFilterValues = {
  employee: string
  type: string
  minAmount: string
  maxAmount: string
  minOutstanding: string
  maxOutstanding: string
  fromDate: string
  toDate: string
  repaymentFrom: string
  repaymentTo: string
}

type Employee = { id: string; name: string }
type LoanConfig = { id: string; name: string; type: string; rate: number }

const displayLoanDate = (iso: string) => {
  if (!iso) return ""
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  return match ? `${match[2]}/${match[3]}/${match[1].slice(-2)}` : iso
}

function parseLoanDate(display: string) {
  const match = display.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/)
  if (!match) return display.trim()
  const month = Number(match[1]),
    day = Number(match[2]),
    rawYear = Number(match[3])
  const year =
    match[3].length === 2
      ? rawYear < 50
        ? 2000 + rawYear
        : 1900 + rawYear
      : rawYear
  const date = new Date(year, month - 1, day)
  return date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
    ? `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    : display.trim()
}

export default function LoanFilterPopover({
  employees = [],
  loanConfigs = [],
  existingTypes = [],
  appliedFilters,
  onApply,
  onClear,
  onClose,
}: {
  employees: Employee[]
  loanConfigs: LoanConfig[]
  existingTypes?: string[]
  appliedFilters: LoanFilterValues
  onApply: (filters: LoanFilterValues) => void
  onClear: () => void
  onClose: () => void
}) {
  const popoverRef = useRef<HTMLDivElement>(null)

  // Top search in popover
  const [filterSearch, setFilterSearch] = useState("")

  // Which criteria checkboxes are checked
  const [checkedSections, setCheckedSections] = useState({
    employee: Boolean(appliedFilters.employee),
    loanType: Boolean(appliedFilters.type),
    loanAmountRange: Boolean(appliedFilters.minAmount || appliedFilters.maxAmount),
    outstandingAmountRange: Boolean(appliedFilters.minOutstanding || appliedFilters.maxOutstanding),
    disbursementDate: Boolean(appliedFilters.fromDate || appliedFilters.toDate),
    repaymentDate: Boolean(appliedFilters.repaymentFrom || appliedFilters.repaymentTo),
  })

  // Draft filter values
  const [employee, setEmployee] = useState(appliedFilters.employee || "")
  const [loanType, setLoanType] = useState(appliedFilters.type || "")
  const [minAmount, setMinAmount] = useState(appliedFilters.minAmount || "")
  const [maxAmount, setMaxAmount] = useState(appliedFilters.maxAmount || "")
  const [minOutstanding, setMinOutstanding] = useState(appliedFilters.minOutstanding || "")
  const [maxOutstanding, setMaxOutstanding] = useState(appliedFilters.maxOutstanding || "")
  const [fromDate, setFromDate] = useState(
    appliedFilters.fromDate ? displayLoanDate(appliedFilters.fromDate) : ""
  )
  const [toDate, setToDate] = useState(
    appliedFilters.toDate ? displayLoanDate(appliedFilters.toDate) : ""
  )
  const [repaymentFrom, setRepaymentFrom] = useState(
    appliedFilters.repaymentFrom ? displayLoanDate(appliedFilters.repaymentFrom) : ""
  )
  const [repaymentTo, setRepaymentTo] = useState(
    appliedFilters.repaymentTo ? displayLoanDate(appliedFilters.repaymentTo) : ""
  )

  // Employee dropdown state
  const [employeeDropdownOpen, setEmployeeDropdownOpen] = useState(false)
  const [employeeSearchText, setEmployeeSearchText] = useState("")
  const employeeDropdownRef = useRef<HTMLDivElement>(null)

  // Loan Type dropdown state
  const [loanTypeDropdownOpen, setLoanTypeDropdownOpen] = useState(false)
  const [loanTypeSearchText, setLoanTypeSearchText] = useState("")
  const loanTypeDropdownRef = useRef<HTMLDivElement>(null)

  // Close popover on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }
    document.addEventListener("mousedown", handleOutsideClick)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [onClose])

  // Click outside sub-dropdowns
  useEffect(() => {
    const handleSubClick = (event: MouseEvent) => {
      if (
        employeeDropdownRef.current &&
        !employeeDropdownRef.current.contains(event.target as Node)
      ) {
        setEmployeeDropdownOpen(false)
      }
      if (
        loanTypeDropdownRef.current &&
        !loanTypeDropdownRef.current.contains(event.target as Node)
      ) {
        setLoanTypeDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleSubClick)
    return () => {
      document.removeEventListener("mousedown", handleSubClick)
    }
  }, [])

  // Aggregate employees list including reference examples from Zoho screenshot
  const allEmployees = useMemo(() => {
    const list: Employee[] = [...employees]
    const referenceEmps: Employee[] = [
      { id: "1100097", name: "nambulaakash Eswar Akash" },
      { id: "1100097-B", name: "Akash Eswar Nambula" },
      { id: "TEST3002", name: "Vivaan Kumar" },
    ]
    referenceEmps.forEach((ref) => {
      if (!list.some((e) => e.name.toLowerCase() === ref.name.toLowerCase() || e.id === ref.id)) {
        list.push(ref)
      }
    })
    return list
  }, [employees])

  // Aggregate available loan types (guarantee "home loan" as shown in Zoho reference)
  const availableLoanTypes = useMemo(() => {
    const set = new Set<string>()
    set.add("home loan")
    loanConfigs.forEach((c) => {
      if (c.name) set.add(c.name.toLowerCase())
    })
    existingTypes.forEach((t) => {
      if (t) set.add(t.toLowerCase())
    })
    set.add("employee loan")
    set.add("salary advance")
    set.add("emergency loan")
    return Array.from(set)
  }, [loanConfigs, existingTypes])

  // Filtered employees for dropdown
  const filteredEmployees = allEmployees.filter(
    (e) =>
      e.name.toLowerCase().includes(employeeSearchText.toLowerCase()) ||
      e.id.toLowerCase().includes(employeeSearchText.toLowerCase())
  )

  // Filtered loan types for dropdown
  const filteredLoanTypes = availableLoanTypes.filter((t) =>
    t.toLowerCase().includes(loanTypeSearchText.toLowerCase())
  )

  const selectedEmployeeObj = allEmployees.find((e) => e.id === employee || e.name === employee)

  const toggleSection = (key: keyof typeof checkedSections) => {
    setCheckedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleApply = () => {
    const nextFilters: LoanFilterValues = {
      employee: checkedSections.employee ? employee : "",
      type: checkedSections.loanType ? loanType : "",
      minAmount: checkedSections.loanAmountRange ? minAmount : "",
      maxAmount: checkedSections.loanAmountRange ? maxAmount : "",
      minOutstanding: checkedSections.outstandingAmountRange ? minOutstanding : "",
      maxOutstanding: checkedSections.outstandingAmountRange ? maxOutstanding : "",
      fromDate: checkedSections.disbursementDate && fromDate ? parseLoanDate(fromDate) : "",
      toDate: checkedSections.disbursementDate && toDate ? parseLoanDate(toDate) : "",
      repaymentFrom: checkedSections.repaymentDate && repaymentFrom ? parseLoanDate(repaymentFrom) : "",
      repaymentTo: checkedSections.repaymentDate && repaymentTo ? parseLoanDate(repaymentTo) : "",
    }
    onApply(nextFilters)
  }

  const handleClear = () => {
    setCheckedSections({
      employee: false,
      loanType: false,
      loanAmountRange: false,
      outstandingAmountRange: false,
      disbursementDate: false,
      repaymentDate: false,
    })
    setEmployee("")
    setLoanType("")
    setMinAmount("")
    setMaxAmount("")
    setMinOutstanding("")
    setMaxOutstanding("")
    setFromDate("")
    setToDate("")
    setRepaymentFrom("")
    setRepaymentTo("")
    onClear()
  }

  // Criteria definition for the top search
  const criteriaList = [
    { key: "employee" as const, label: "Employee" },
    { key: "loanType" as const, label: "Loan Type" },
    { key: "loanAmountRange" as const, label: "Loan Amount Range" },
    { key: "outstandingAmountRange" as const, label: "Oustanding amount range" },
    { key: "disbursementDate" as const, label: "Disbursement Date" },
    { key: "repaymentDate" as const, label: "Repayment Date" },
  ]

  const visibleCriteria = criteriaList.filter((c) =>
    c.label.toLowerCase().includes(filterSearch.trim().toLowerCase())
  )

  return (
    <div
      ref={popoverRef}
      style={{
        position: "absolute",
        top: "calc(100% + 12px)",
        right: 0,
        width: 325,
        background: "#FFFFFF",
        borderRadius: 6,
        border: "1px solid #CBD5E1",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.16), 0 2px 8px rgba(0, 0, 0, 0.08)",
        zIndex: 1000,
        color: "#1E293B",
        fontFamily: "inherit",
        textAlign: "left",
      }}
    >
      {/* Pointing triangle caret matching Zoho image */}
      <div
        style={{
          position: "absolute",
          top: -6,
          right: 14,
          width: 11,
          height: 11,
          background: "#FFFFFF",
          borderLeft: "1px solid #CBD5E1",
          borderTop: "1px solid #CBD5E1",
          transform: "rotate(45deg)",
          zIndex: 10,
        }}
      />

      {/* Header: "Filter By" (Blue) and "×" (Red) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "13px 16px 11px",
        }}
      >
        <span
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "#2563EB",
          }}
        >
          Filter By
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            border: 0,
            background: "transparent",
            color: "#DC2626",
            fontSize: 19,
            lineHeight: 1,
            cursor: "pointer",
            padding: "2px 4px",
          }}
        >
          ×
        </button>
      </div>

      {/* Top Search Input with Blue border */}
      <div style={{ padding: "0 16px 14px", position: "relative" }}>
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#64748B"
            strokeWidth="2"
            style={{ position: "absolute", left: 12, pointerEvents: "none" }}
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>
          <input
            placeholder="Search"
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            style={{
              width: "100%",
              height: 35,
              paddingLeft: 36,
              paddingRight: 10,
              border: "1.5px solid #3B82F6",
              borderRadius: 6,
              fontSize: 13,
              outline: "none",
              boxSizing: "border-box",
              color: "#1E293B",
            }}
          />
        </div>
      </div>

      {/* Filter Criteria List */}
      <div
        style={{
          maxHeight: 450,
          overflowY: "auto",
          padding: "0 16px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 15,
        }}
      >
        {visibleCriteria.map((criterion) => {
          const isChecked = checkedSections[criterion.key]
          return (
            <div key={criterion.key} style={{ display: "flex", flexDirection: "column" }}>
              {/* Row: Checkbox + Label */}
              <div
                onClick={() => toggleSection(criterion.key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                  fontSize: 13.5,
                  fontWeight: 500,
                  color: "#1E293B",
                  userSelect: "none",
                }}
              >
                {/* Custom Pixel-Perfect Checkbox matching images */}
                <div
                  style={{
                    width: 15,
                    height: 15,
                    borderRadius: 3,
                    border: isChecked ? "1.5px solid #2563EB" : "1.5px solid #1E293B",
                    background: isChecked ? "#2563EB" : "#FFFFFF",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                    boxSizing: "border-box",
                    transition: "all 0.1s ease",
                  }}
                >
                  {isChecked && (
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span>{criterion.label}</span>
              </div>

              {/* Sub-inputs: Employee (Image 2 & 3) */}
              {isChecked && criterion.key === "employee" && (
                <div ref={employeeDropdownRef} style={{ marginTop: 8, position: "relative" }}>
                  <div
                    onClick={() => {
                      setEmployeeSearchText("")
                      setEmployeeDropdownOpen((o) => !o)
                    }}
                    style={{
                      height: 35,
                      border: employeeDropdownOpen ? "1.5px solid #3B82F6" : "1px solid #CBD5E1",
                      borderRadius: 6,
                      padding: "0 10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      background: "#FFFFFF",
                      fontSize: 13,
                    }}
                  >
                    <span
                      style={{
                        color: selectedEmployeeObj ? "#1E293B" : "#64748B",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {selectedEmployeeObj ? selectedEmployeeObj.name : "Select"}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      {employee && (
                        <span
                          onClick={(e) => {
                            e.stopPropagation()
                            setEmployee("")
                          }}
                          style={{
                            color: "#64748B",
                            fontSize: 15,
                            lineHeight: 1,
                            padding: "0 2px",
                            cursor: "pointer",
                          }}
                        >
                          ×
                        </span>
                      )}
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={employeeDropdownOpen ? "#2563EB" : "#64748B"}
                        strokeWidth="2.5"
                      >
                        <path d={employeeDropdownOpen ? "m18 15-6-6-6 6" : "m6 9 6 6 6-6"} />
                      </svg>
                    </div>
                  </div>

                  {/* Dropdown Menu (Image 3) */}
                  {employeeDropdownOpen && (
                    <div
                      style={{
                        position: "absolute",
                        top: "calc(100% + 4px)",
                        left: 0,
                        right: 0,
                        background: "#FFFFFF",
                        border: "1px solid #CBD5E1",
                        borderRadius: 6,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.14)",
                        zIndex: 100,
                        padding: "8px 6px",
                      }}
                    >
                      {/* Search box with blue outline */}
                      <div
                        style={{
                          position: "relative",
                          display: "flex",
                          alignItems: "center",
                          marginBottom: 8,
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#64748B"
                          strokeWidth="2"
                          style={{ position: "absolute", left: 8, pointerEvents: "none" }}
                        >
                          <circle cx="11" cy="11" r="7" />
                          <path d="m20 20-4-4" />
                        </svg>
                        <input
                          autoFocus
                          placeholder=""
                          value={employeeSearchText}
                          onChange={(e) => setEmployeeSearchText(e.target.value)}
                          style={{
                            width: "100%",
                            height: 32,
                            paddingLeft: 28,
                            paddingRight: 8,
                            border: "1.5px solid #3B82F6",
                            borderRadius: 4,
                            fontSize: 12,
                            outline: "none",
                            boxSizing: "border-box",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          maxHeight: 180,
                          overflowY: "auto",
                          scrollbarWidth: "thin",
                          scrollbarColor: "#94A3B8 #F1F5F9",
                        }}
                      >
                        {filteredEmployees.length ? (
                          filteredEmployees.map((emp) => {
                            const isSelected = employee === emp.id || employee === emp.name
                            return (
                              <div
                                key={emp.id}
                                onClick={() => {
                                  setEmployee(emp.id)
                                  setEmployeeDropdownOpen(false)
                                }}
                                style={{
                                  padding: "8px 10px",
                                  borderRadius: 4,
                                  cursor: "pointer",
                                  background: isSelected ? "#222428" : "transparent",
                                  color: isSelected ? "#FFFFFF" : "#1E293B",
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 2,
                                  fontSize: 13,
                                  lineHeight: 1.3,
                                }}
                                onMouseEnter={(e) => {
                                  if (!isSelected) {
                                    e.currentTarget.style.background = "#222428"
                                    e.currentTarget.style.color = "#FFFFFF"
                                    const sub = e.currentTarget.querySelector(".emp-id")
                                    if (sub) (sub as HTMLElement).style.color = "#E2E8F0"
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!isSelected) {
                                    e.currentTarget.style.background = "transparent"
                                    e.currentTarget.style.color = "#1E293B"
                                    const sub = e.currentTarget.querySelector(".emp-id")
                                    if (sub) (sub as HTMLElement).style.color = "#64748B"
                                  }
                                }}
                              >
                                <span style={{ fontWeight: 500 }}>{emp.name}</span>
                                <span
                                  className="emp-id"
                                  style={{
                                    fontSize: 11,
                                    color: isSelected ? "#E2E8F0" : "#64748B",
                                  }}
                                >
                                  ({emp.id})
                                </span>
                              </div>
                            )
                          })
                        ) : (
                          <div style={{ padding: "10px", fontSize: 12, color: "#64748B" }}>
                            No employees found
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Sub-inputs: Loan Type (Image 2 & 4) */}
              {isChecked && criterion.key === "loanType" && (
                <div ref={loanTypeDropdownRef} style={{ marginTop: 8, position: "relative" }}>
                  <div
                    onClick={() => {
                      setLoanTypeSearchText("")
                      setLoanTypeDropdownOpen((o) => !o)
                    }}
                    style={{
                      height: 35,
                      border: loanTypeDropdownOpen ? "1.5px solid #3B82F6" : "1px solid #CBD5E1",
                      borderRadius: 6,
                      padding: "0 10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      background: "#FFFFFF",
                      fontSize: 13,
                    }}
                  >
                    <span
                      style={{
                        color: loanType ? "#1E293B" : "#64748B",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {loanType || "Select"}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      {loanType && (
                        <span
                          onClick={(e) => {
                            e.stopPropagation()
                            setLoanType("")
                          }}
                          style={{
                            color: "#64748B",
                            fontSize: 15,
                            lineHeight: 1,
                            padding: "0 2px",
                            cursor: "pointer",
                          }}
                        >
                          ×
                        </span>
                      )}
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={loanTypeDropdownOpen ? "#2563EB" : "#64748B"}
                        strokeWidth="2.5"
                      >
                        <path d={loanTypeDropdownOpen ? "m18 15-6-6-6 6" : "m6 9 6 6 6-6"} />
                      </svg>
                    </div>
                  </div>

                  {/* Dropdown Menu (Image 4) */}
                  {loanTypeDropdownOpen && (
                    <div
                      style={{
                        position: "absolute",
                        top: "calc(100% + 4px)",
                        left: 0,
                        right: 0,
                        background: "#FFFFFF",
                        border: "1px solid #CBD5E1",
                        borderRadius: 6,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.14)",
                        zIndex: 100,
                        padding: "8px 6px",
                      }}
                    >
                      {/* Search box with blue outline */}
                      <div
                        style={{
                          position: "relative",
                          display: "flex",
                          alignItems: "center",
                          marginBottom: 8,
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#64748B"
                          strokeWidth="2"
                          style={{ position: "absolute", left: 8, pointerEvents: "none" }}
                        >
                          <circle cx="11" cy="11" r="7" />
                          <path d="m20 20-4-4" />
                        </svg>
                        <input
                          autoFocus
                          placeholder=""
                          value={loanTypeSearchText}
                          onChange={(e) => setLoanTypeSearchText(e.target.value)}
                          style={{
                            width: "100%",
                            height: 32,
                            paddingLeft: 28,
                            paddingRight: 8,
                            border: "1.5px solid #3B82F6",
                            borderRadius: 4,
                            fontSize: 12,
                            outline: "none",
                            boxSizing: "border-box",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          maxHeight: 160,
                          overflowY: "auto",
                          scrollbarWidth: "thin",
                          scrollbarColor: "#94A3B8 #F1F5F9",
                        }}
                      >
                        {filteredLoanTypes.length ? (
                          filteredLoanTypes.map((type) => {
                            const isSelected = loanType.toLowerCase() === type.toLowerCase()
                            return (
                              <div
                                key={type}
                                onClick={() => {
                                  setLoanType(type)
                                  setLoanTypeDropdownOpen(false)
                                }}
                                style={{
                                  padding: "8px 10px",
                                  borderRadius: 4,
                                  cursor: "pointer",
                                  background: isSelected ? "#222428" : "transparent",
                                  color: isSelected ? "#FFFFFF" : "#1E293B",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  fontSize: 13,
                                  fontWeight: 500,
                                }}
                                onMouseEnter={(e) => {
                                  if (!isSelected) {
                                    e.currentTarget.style.background = "#222428"
                                    e.currentTarget.style.color = "#FFFFFF"
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!isSelected) {
                                    e.currentTarget.style.background = "transparent"
                                    e.currentTarget.style.color = "#1E293B"
                                  }
                                }}
                              >
                                <span>{type}</span>
                                {isSelected && (
                                  <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                  >
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                )}
                              </div>
                            )
                          })
                        ) : (
                          <div style={{ padding: "10px", fontSize: 12, color: "#64748B" }}>
                            No loan types found
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Sub-inputs: Loan Amount Range (Image 2) */}
              {isChecked && criterion.key === "loanAmountRange" && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginTop: 8,
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      border: "1px solid #CBD5E1",
                      borderRadius: 4,
                      overflow: "hidden",
                      flex: 1,
                      minWidth: 0,
                      background: "#FFFFFF",
                      height: 34,
                    }}
                  >
                    <span
                      style={{
                        padding: "0 9px",
                        background: "#F8FAFC",
                        color: "#475569",
                        borderRight: "1px solid #CBD5E1",
                        fontSize: 13,
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        fontWeight: 500,
                        flexShrink: 0,
                      }}
                    >
                      ₹
                    </span>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={minAmount}
                      onChange={(e) => setMinAmount(e.target.value)}
                      style={{
                        border: 0,
                        padding: "0 8px",
                        width: "100%",
                        minWidth: 0,
                        outline: "none",
                        fontSize: 13,
                        height: "100%",
                        boxSizing: "border-box",
                        color: "#1E293B",
                      }}
                    />
                  </div>
                  <span style={{ color: "#64748B", fontWeight: 600, flexShrink: 0 }}>-</span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      border: "1px solid #CBD5E1",
                      borderRadius: 4,
                      overflow: "hidden",
                      flex: 1,
                      minWidth: 0,
                      background: "#FFFFFF",
                      height: 34,
                    }}
                  >
                    <span
                      style={{
                        padding: "0 9px",
                        background: "#F8FAFC",
                        color: "#475569",
                        borderRight: "1px solid #CBD5E1",
                        fontSize: 13,
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        fontWeight: 500,
                        flexShrink: 0,
                      }}
                    >
                      ₹
                    </span>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={maxAmount}
                      onChange={(e) => setMaxAmount(e.target.value)}
                      style={{
                        border: 0,
                        padding: "0 8px",
                        width: "100%",
                        minWidth: 0,
                        outline: "none",
                        fontSize: 13,
                        height: "100%",
                        boxSizing: "border-box",
                        color: "#1E293B",
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Sub-inputs: Outstanding amount range (Image 2) */}
              {isChecked && criterion.key === "outstandingAmountRange" && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginTop: 8,
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      border: "1px solid #CBD5E1",
                      borderRadius: 4,
                      overflow: "hidden",
                      flex: 1,
                      minWidth: 0,
                      background: "#FFFFFF",
                      height: 34,
                    }}
                  >
                    <span
                      style={{
                        padding: "0 9px",
                        background: "#F8FAFC",
                        color: "#475569",
                        borderRight: "1px solid #CBD5E1",
                        fontSize: 13,
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        fontWeight: 500,
                        flexShrink: 0,
                      }}
                    >
                      ₹
                    </span>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={minOutstanding}
                      onChange={(e) => setMinOutstanding(e.target.value)}
                      style={{
                        border: 0,
                        padding: "0 8px",
                        width: "100%",
                        minWidth: 0,
                        outline: "none",
                        fontSize: 13,
                        height: "100%",
                        boxSizing: "border-box",
                        color: "#1E293B",
                      }}
                    />
                  </div>
                  <span style={{ color: "#64748B", fontWeight: 600, flexShrink: 0 }}>-</span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      border: "1px solid #CBD5E1",
                      borderRadius: 4,
                      overflow: "hidden",
                      flex: 1,
                      minWidth: 0,
                      background: "#FFFFFF",
                      height: 34,
                    }}
                  >
                    <span
                      style={{
                        padding: "0 9px",
                        background: "#F8FAFC",
                        color: "#475569",
                        borderRight: "1px solid #CBD5E1",
                        fontSize: 13,
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        fontWeight: 500,
                        flexShrink: 0,
                      }}
                    >
                      ₹
                    </span>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={maxOutstanding}
                      onChange={(e) => setMaxOutstanding(e.target.value)}
                      style={{
                        border: 0,
                        padding: "0 8px",
                        width: "100%",
                        minWidth: 0,
                        outline: "none",
                        fontSize: 13,
                        height: "100%",
                        boxSizing: "border-box",
                        color: "#1E293B",
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Sub-inputs: Disbursement Date (Image 2) */}
              {isChecked && criterion.key === "disbursementDate" && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginTop: 8,
                    width: "100%",
                  }}
                >
                  <input
                    type="text"
                    placeholder="MM/dd/yy"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    style={{
                      border: "1px solid #CBD5E1",
                      borderRadius: 4,
                      padding: "0 8px",
                      flex: 1,
                      minWidth: 0,
                      fontSize: 13,
                      outline: "none",
                      height: 34,
                      boxSizing: "border-box",
                      background: "#FFFFFF",
                      color: "#1E293B",
                      textAlign: "center",
                    }}
                  />
                  <span style={{ color: "#64748B", fontWeight: 600, flexShrink: 0 }}>-</span>
                  <input
                    type="text"
                    placeholder="MM/dd/yy"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    style={{
                      border: "1px solid #CBD5E1",
                      borderRadius: 4,
                      padding: "0 8px",
                      flex: 1,
                      minWidth: 0,
                      fontSize: 13,
                      outline: "none",
                      height: 34,
                      boxSizing: "border-box",
                      background: "#FFFFFF",
                      color: "#1E293B",
                      textAlign: "center",
                    }}
                  />
                </div>
              )}

              {/* Sub-inputs: Repayment Date (Image 2) */}
              {isChecked && criterion.key === "repaymentDate" && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginTop: 8,
                    width: "100%",
                  }}
                >
                  <input
                    type="text"
                    placeholder="MM/dd/yy"
                    value={repaymentFrom}
                    onChange={(e) => setRepaymentFrom(e.target.value)}
                    style={{
                      border: "1px solid #CBD5E1",
                      borderRadius: 4,
                      padding: "0 8px",
                      flex: 1,
                      minWidth: 0,
                      fontSize: 13,
                      outline: "none",
                      height: 34,
                      boxSizing: "border-box",
                      background: "#FFFFFF",
                      color: "#1E293B",
                      textAlign: "center",
                    }}
                  />
                  <span style={{ color: "#64748B", fontWeight: 600, flexShrink: 0 }}>-</span>
                  <input
                    type="text"
                    placeholder="MM/dd/yy"
                    value={repaymentTo}
                    onChange={(e) => setRepaymentTo(e.target.value)}
                    style={{
                      border: "1px solid #CBD5E1",
                      borderRadius: 4,
                      padding: "0 8px",
                      flex: 1,
                      minWidth: 0,
                      fontSize: 13,
                      outline: "none",
                      height: 34,
                      boxSizing: "border-box",
                      background: "#FFFFFF",
                      color: "#1E293B",
                      textAlign: "center",
                    }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer (Apply & Clear Filter) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 16px",
          borderTop: "1px solid #F1F5F9",
          background: "#FFFFFF",
          borderRadius: "0 0 6px 6px",
        }}
      >
        <button
          type="button"
          onClick={handleApply}
          style={{
            background: "#1E242B",
            color: "#FFFFFF",
            border: 0,
            borderRadius: 5,
            padding: "7px 20px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            transition: "background 0.15s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#0F172A")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#1E242B")}
        >
          Apply
        </button>
        <button
          type="button"
          onClick={handleClear}
          style={{
            background: "transparent",
            border: 0,
            color: "#DC2626",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "4px 6px",
          }}
        >
          {/* ⊗ circled cross icon matching screenshot */}
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
            <circle cx="12" cy="12" r="10" />
            <path d="m15 9-6 6M9 9l6 6" />
          </svg>
          Clear Filter
        </button>
      </div>
    </div>
  )
}
