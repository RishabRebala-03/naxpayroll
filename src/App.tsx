import React, {
  useState,
  createContext,
  useContext,
  useCallback,
  useEffect,
  useRef,
  Fragment,
} from "react"

const F = {
  shell: "#FFFFFF",
  brand: "#0070F2",
  brandHover: "#0064D9",
  pageBg: "#F5F6F7",
  card: "#FFFFFF",
  text1: "#1D2D3E",
  text2: "#475E75",
  text3: "#5B738B",
  border: "#D5DADD",
  success: "#188918",
  successBg: "#F5FAE5",
  warning: "#E76500",
  warningBg: "#FFF8D6",
  error: "#AA0808",
  errorBg: "#FFEAF4",
  infoBg: "#E1F4FF",
  highlight: "#E1F4FF",
}

type ToastType = "success" | "error" | "info" | "warning"
interface ToastItem {
  id: number
  msg: string
  type: ToastType
}
const ToastCtx = createContext<(msg: string, type?: ToastType) => void>(
  () => {},
)
const useToast = () => useContext(ToastCtx)

function getTimeGreeting() {
  const hour = new Date().getHours()
  if (hour >= 4 && hour < 12) {
    return { text: "Good morning" }
  } else if (hour >= 12 && hour < 17) {
    return { text: "Good afternoon" }
  } else {
    return { text: "Good evening" }
  }
}

function LiveClock() {
  const [timeStr, setTimeStr] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      let hours = now.getHours()
      const minutes = String(now.getMinutes()).padStart(2, "0")
      const seconds = String(now.getSeconds()).padStart(2, "0")
      const ampm = hours >= 12 ? "pm" : "am"
      hours = hours % 12
      hours = hours ? hours : 12
      const formattedHours = String(hours).padStart(2, "0")
      setTimeStr(`${formattedHours}:${minutes}:${seconds} ${ampm}`)
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  if (!timeStr) return null

  return (
    <div
      className="sap-shell-clock"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: "#FFFFFF",
        color: "#0F172A",
        padding: "5px 14px",
        borderRadius: 20,
        fontSize: 13,
        fontWeight: 700,
        boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
        border: "1px solid rgba(255,255,255,0.4)",
        letterSpacing: "0.02em",
        marginRight: 4,
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#0070F2",
          boxShadow: "0 0 0 3px rgba(0, 112, 242, 0.2)",
          display: "inline-block",
        }}
      />
      <span>{timeStr}</span>
    </div>
  )
}

function StrictDateInput({
  value,
  onChange,
  style,
  ariaLabel,
}: {
  value: string
  onChange: (value: string) => void
  style?: React.CSSProperties
  ariaLabel?: string
}) {
  const toDisplayDate = (isoValue: string) => {
    const match = isoValue.match(/^(\d{4})-(\d{2})-(\d{2})$/)
    return match ? `${match[2]}/${match[3]}/${match[1]}` : ""
  }
  const [displayValue, setDisplayValue] = useState(() => toDisplayDate(value))
  const pickerRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setDisplayValue(toDisplayDate(value))
  }, [value])

  const updateText = (nextValue: string) => {
    const digits = nextValue.replace(/\D/g, "").slice(0, 8)
    const formatted = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)]
      .filter(Boolean)
      .join("/")
    setDisplayValue(formatted)
    if (!digits) onChange("")
    if (digits.length === 8) {
      const month = digits.slice(0, 2)
      const day = digits.slice(2, 4)
      const year = digits.slice(4, 8)
      onChange(`${year}-${month}-${day}`)
    }
  }

  return (
    <span style={{ position: "relative", display: "inline-block", width: style?.width ?? "100%" }}>
      <input
        aria-label={ariaLabel}
        type="text"
        inputMode="numeric"
        placeholder="mm/dd/yyyy"
        maxLength={10}
        value={displayValue}
        onChange={(event) => updateText(event.target.value)}
        style={{ ...style, width: "100%", paddingRight: 38, boxSizing: "border-box" }}
      />
      <button
        type="button"
        aria-label={`${ariaLabel ?? "Date"} calendar`}
        onClick={() => pickerRef.current?.showPicker?.()}
        style={{ position: "absolute", right: 7, top: "50%", transform: "translateY(-50%)", border: 0, background: "transparent", cursor: "pointer", fontSize: 17, padding: 4 }}
      >
        ▣
      </button>
      <input
        ref={pickerRef}
        tabIndex={-1}
        aria-hidden="true"
        type="date"
        max="9999-12-31"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
      />
    </span>
  )
}

function DateRangeFilter({
  from,
  to,
  onFromChange,
  onToChange,
  onApply,
}: {
  from: string
  to: string
  onFromChange: (value: string) => void
  onToChange: (value: string) => void
  onApply: () => void
}) {
  return (
    <div className="sap-date-filter" style={{ padding: "0", marginBottom: 0, display: "flex", alignItems: "end", gap: 8, flexWrap: "nowrap", whiteSpace: "nowrap" }}>
      <div className="sap-date-filter-title" style={{ fontSize: 12, fontWeight: 800, color: F.text2, padding: "0 4px 9px 0" }}>Record date</div>
      <label className="sap-date-field" style={{ fontSize: 11, color: F.text2, fontWeight: 700 }}>From<StrictDateInput ariaLabel="Filter from date" value={from} onChange={onFromChange} style={{ ...iSt, display: "block", marginTop: 4, width: 154 }} /></label>
      <label className="sap-date-field" style={{ fontSize: 11, color: F.text2, fontWeight: 700 }}>To<StrictDateInput ariaLabel="Filter to date" value={to} onChange={onToChange} style={{ ...iSt, display: "block", marginTop: 4, width: 154 }} /></label>
      <Btn small onClick={onApply} style={{ height: 34, padding: "0 14px" }}>Apply range</Btn>
    </div>
  )
}

function limitDateYear(value: string) {
  const parts = value.split("-")
  if (parts.length > 1 && parts[0].length > 4) {
    return [parts[0].slice(0, 4), ...parts.slice(1)].join("-")
  }
  const slashParts = value.split("/")
  if (slashParts.length === 3 && slashParts[2].length > 4) {
    return `${slashParts[0]}/${slashParts[1]}/${slashParts[2].slice(0, 4)}`
  }
  return value
}

const DateFilterCtx = createContext<{
  active: boolean
  from: string
  to: string
  onFromChange: (value: string) => void
  onToChange: (value: string) => void
  onApply: () => void
} | null>(null)

function ContextDateRangeFilter() {
  const dateFilter = useContext(DateFilterCtx)
  if (!dateFilter?.active) return null
  return <DateRangeFilter from={dateFilter.from} to={dateFilter.to} onFromChange={dateFilter.onFromChange} onToChange={dateFilter.onToChange} onApply={dateFilter.onApply} />
}

type ManagedTable = {
  id: string
  label: string
  columns: string[]
  element: HTMLTableElement
}

/**
 * A shared column manager for every data table in every workspace.  Tables in
 * this prototype are intentionally authored close to their views, so deriving
 * their headers here keeps the control available for existing and future views.
 */
function UniversalColumnCustomizer({ persona, inline = false }: { persona: string; inline?: boolean }) {
  const [tables, setTables] = useState<ManagedTable[]>([])
  const [open, setOpen] = useState(false)
  const [activeTableId, setActiveTableId] = useState("")
  const [hiddenColumns, setHiddenColumns] = useState<Record<string, number[]>>({})
  const [columnOrder, setColumnOrder] = useState<Record<string, number[]>>({})
  const [draggedColumn, setDraggedColumn] = useState<number | null>(null)

  const scanTables = useCallback(() => {
    const tableElements = Array.from(document.querySelectorAll("main table")) as HTMLTableElement[]
    const discovered = tableElements.map((element, index) => {
      const headerRow = element.querySelector("thead tr:last-child")
      const headerCells = headerRow ? Array.from(headerRow.children) as HTMLElement[] : []
      headerCells.forEach((cell, columnIndex) => {
        if (!cell.dataset.columnManagerOrigin) cell.dataset.columnManagerOrigin = String(columnIndex)
      })
      const columns = headerCells.length
        ? [...headerCells].sort((a, b) => Number(a.dataset.columnManagerOrigin) - Number(b.dataset.columnManagerOrigin)).map((cell, columnIndex) => cell.textContent?.trim().replace(/\s+/g, " ") || `Column ${columnIndex + 1}`)
        : []
      const signature = columns.join("|").toLowerCase().replace(/[^a-z0-9|]/g, "")
      const id = `${persona}-${signature || "table"}-${index}`
      element.dataset.columnManagerId = id
      const precedingTitle = element.parentElement?.previousElementSibling?.textContent?.trim()
      return {
        id,
        label: precedingTitle && precedingTitle.length < 60 ? precedingTitle : columns.slice(0, 2).join(" · ") || `Table ${index + 1}`,
        columns,
        element,
      }
    }).filter((table) => table.columns.length > 0)
    setTables(discovered)
    setActiveTableId((current) => discovered.some((table) => table.id === current) ? current : discovered[0]?.id ?? "")
  }, [persona])

  useEffect(() => {
    scanTables()
    const main = document.querySelector("main")
    if (!main) return
    let frame = 0
    const observer = new MutationObserver(() => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(scanTables)
    })
    observer.observe(main, { childList: true, subtree: true })
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [scanTables])

  useEffect(() => {
    tables.forEach((table) => {
      const hidden = new Set(hiddenColumns[table.id] ?? [])
      const order = columnOrder[table.id] ?? table.columns.map((_, index) => index)
      table.element.querySelectorAll("tr").forEach((row) => {
        const cells = Array.from(row.children) as HTMLElement[]
        cells.forEach((cell, index) => {
          if (!cell.dataset.columnManagerOrigin) cell.dataset.columnManagerOrigin = String(index)
          cell.style.display = hidden.has(Number(cell.dataset.columnManagerOrigin)) ? "none" : ""
        })
        const orderedCells = [...cells].sort((a, b) => order.indexOf(Number(a.dataset.columnManagerOrigin)) - order.indexOf(Number(b.dataset.columnManagerOrigin)))
        orderedCells.forEach((cell) => row.appendChild(cell))
      })
    })
  }, [tables, hiddenColumns, columnOrder])

  const activeTable = tables.find((table) => table.id === activeTableId)
  const activeHidden = new Set(hiddenColumns[activeTableId] ?? [])
  const activeOrder = columnOrder[activeTableId] ?? activeTable?.columns.map((_, index) => index) ?? []
  const toggleColumn = (index: number) => {
    if (!activeTable) return
    // Keep at least one field visible, so a user can always recover the table.
    if (!activeHidden.has(index) && activeHidden.size >= activeTable.columns.length - 1) return
    setHiddenColumns((current) => ({
      ...current,
      [activeTable.id]: activeHidden.has(index)
        ? (current[activeTable.id] ?? []).filter((item) => item !== index)
        : [...(current[activeTable.id] ?? []), index],
    }))
  }
  const reorderColumn = (sourceColumnIndex: number, targetColumnIndex: number) => {
    if (!activeTable || sourceColumnIndex === targetColumnIndex) return
    setColumnOrder((current) => {
      const next = [...(current[activeTable.id] ?? activeOrder)]
      const sourceIndex = next.indexOf(sourceColumnIndex)
      const targetIndex = next.indexOf(targetColumnIndex)
      if (sourceIndex < 0 || targetIndex < 0) return current
      const [moved] = next.splice(sourceIndex, 1)
      next.splice(targetIndex, 0, moved)
      return { ...current, [activeTable.id]: next }
    })
  }
  const resetActiveTable = () => {
    if (!activeTable) return
    setHiddenColumns((current) => ({ ...current, [activeTable.id]: [] }))
    setColumnOrder((current) => ({ ...current, [activeTable.id]: activeTable.columns.map((_, index) => index) }))
  }

  if (!tables.length) return null

  return <>
    <button className={`universal-column-trigger${inline ? " is-inline" : ""}`} type="button" onClick={() => setOpen(true)} aria-haspopup="dialog">
      <span aria-hidden="true">↔</span> Customize columns
    </button>
    {open && <div className="universal-column-backdrop" onMouseDown={() => setOpen(false)}>
      <section className="universal-column-dialog" role="dialog" aria-modal="true" aria-label="Customize table columns" onMouseDown={(event) => event.stopPropagation()}>
        <div className="universal-column-dialog-header">
          <div><strong>Customize columns</strong><div>Show, hide, or rearrange the fields in this table.</div></div>
          <button type="button" aria-label="Close column customizer" onClick={() => setOpen(false)}>×</button>
        </div>
        <div className="universal-column-list">
          {activeOrder.map((columnIndex) => <div key={`${activeTable?.columns[columnIndex]}-${columnIndex}`} className={`universal-column-option${draggedColumn === columnIndex ? " is-dragging" : ""}`} draggable onDragStart={(event) => { event.dataTransfer.effectAllowed = "move"; setDraggedColumn(columnIndex) }} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); if (draggedColumn !== null) reorderColumn(draggedColumn, columnIndex); setDraggedColumn(null) }} onDragEnd={() => setDraggedColumn(null)}>
            <span className="universal-column-drag-handle" aria-hidden="true">⠿</span>
            <label><input type="checkbox" checked={!activeHidden.has(columnIndex)} onChange={() => toggleColumn(columnIndex)} /><span>{activeTable?.columns[columnIndex]}</span></label>
          </div>)}
        </div>
        <div className="universal-column-dialog-footer">
          <button type="button" onClick={resetActiveTable}>Reset table</button>
          <button type="button" className="primary" onClick={() => setOpen(false)}>Done</button>
        </div>
      </section>
    </div>}
  </>
}

function AdminWorkspaceHero({
  workspace,
  initials,
  name,
  role,
  scope,
  location,
  id,
}: {
  workspace: string
  initials: string
  name: string
  role: string
  scope: string
  location: string
  id: string
}) {
  const { text: greeting } = getTimeGreeting()
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div
      style={{
        background: F.card,
        border: `1px solid ${F.border}`,
        borderRadius: 8,
        padding: "26px 30px",
        display: "flex",
        alignItems: "center",
        gap: 24,
        boxShadow: "0 1px 4px rgba(15,23,42,0.08)",
      }}
    >
      <div
        style={{
          width: 84,
          height: 84,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${F.brand}, #0854A0)`,
          color: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 26,
          fontWeight: 900,
          boxShadow: "0 8px 22px rgba(0,112,242,0.22)",
          flexShrink: 0,
        }}
      >
        {initials}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
          <span
            style={{
              fontSize: 13,
              fontWeight: 900,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: F.text2,
            }}
          >
            {workspace}
          </span>
          <span
            style={{
              fontSize: 13,
              fontWeight: 800,
              color: F.brand,
              background: F.infoBg,
              padding: "5px 16px",
              borderRadius: 18,
              border: `1px solid ${F.brand}12`,
            }}
          >
            {today}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <h1 style={{ margin: 0, fontSize: 32, fontWeight: 900, color: F.text1, lineHeight: 1.1 }}>
            {greeting}, {name}
          </h1>
          <Badge label="Active" color={F.success} bg={F.successBg} dot={F.success} />
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: 16,
            color: F.text2,
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          {[role, scope, location, `ID: ${id}`].map((item, index) => (
            <Fragment key={`${item}-${index}`}>
              {index > 0 && <span>&bull;</span>}
              <span style={index === 3 ? { color: F.text3 } : undefined}>{item}</span>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}


type Persona = "org_admin" | "product_admin" | "employee"
type EmpStatus = "Active" | "Inactive" | "On Leave" | "Incomplete"
type OrgStatus = "Active" | "Draft" | "Inactive" | "Suspended"
type PayrunStatus = "Draft" | "Calculated" | "Under Review" | "Approved" | "Completed" | "Locked"

interface Employee {
  id: string
  name: string
  email: string
  department: string
  designation: string
  doj: string
  empType: "Full-Time" | "Part-Time" | "Contract"
  manager: string
  location: string
  mobile?: string
  status: EmpStatus
  salaryStructure: string
  grossSalary: number
}
interface SalaryStructure {
  id: string
  name: string
  basic: number
  hra: number
  fixedAllowance: number
  specialAllowance: number
  gross: number
}
interface PayrunInputRow {
  empId: string
  empName: string
  department: string
  grossSalary: number
  bonus: number
  incentive: number
  lopDays: number
  lopDeduction: number
  otherDeduction: number
  pf: number
  esi: number
  tds: number
  profTax: number
  totalEarnings: number
  totalDeductions: number
  netSalary: number
}
interface Payrun {
  id: string
  period: string
  month: number
  year: number
  status: PayrunStatus
  scope?: "All Employees" | "Specific Employees" | "Department Batch"
  employeeIds?: string[]
  note?: string
  totalEmployees: number
  grossPayroll: number
  totalDeductions: number
  netPayroll: number
  generatedBy: string
  generatedOn: string
  rows: PayrunInputRow[]
}
interface AuditLog {
  id: string
  user: string
  org: string
  action: string
  module: string
  oldValue: string
  newValue: string
  timestamp: string
}
interface ErrorLog {
  id: string
  timestamp: string
  role: "org_admin" | "product_admin"
  user: string
  module: string
  severity: "Critical" | "High" | "Medium" | "Low"
  issue: string
  route: string
  status: "Open" | "Investigating" | "Resolved"
}
interface OrgDocument {
  id: string
  title: string
  category: "Policy" | "Payroll" | "Compliance" | "HR Letter" | "Tax"
  assignedTo: "All Employees" | string
  assignedCount: number
  owner: string
  createdOn: string
  status: "Draft" | "Published"
  description: string
  fileName?: string
}
interface SalaryComponent {
  id: string
  name: string
  kind: "earning" | "deduction"
  type: "Fixed" | "Variable" | "Statutory" | "Manual"
  calculation: string
  basis: string
  frequency: "Monthly" | "One-time" | "Quarterly" | "Annual"
  effectiveFrom: string
  rounding: "Nearest rupee" | "No rounding" | "Round up"
  taxable: "Yes" | "No" | "Partial"
  active: boolean
}
interface Organization {
  id: string
  name: string
  code: string
  legalName: string
  country: string
  currency: string
  financialYear: string
  status: OrgStatus
  employees: number
  admin: string
  adminEmail?: string
}

const INIT_SS: SalaryStructure[] = [
  {
    id: "SS-001",
    name: "Senior Engineer",
    basic: 60000,
    hra: 24000,
    fixedAllowance: 12000,
    specialAllowance: 14000,
    gross: 110000,
  },
  {
    id: "SS-002",
    name: "Junior Engineer",
    basic: 30000,
    hra: 12000,
    fixedAllowance: 6000,
    specialAllowance: 7000,
    gross: 55000,
  },
  {
    id: "SS-003",
    name: "Manager",
    basic: 80000,
    hra: 32000,
    fixedAllowance: 16000,
    specialAllowance: 22000,
    gross: 150000,
  },
  {
    id: "SS-004",
    name: "Associate",
    basic: 20000,
    hra: 8000,
    fixedAllowance: 4000,
    specialAllowance: 3000,
    gross: 35000,
  },
  {
    id: "SS-005",
    name: "Director",
    basic: 150000,
    hra: 60000,
    fixedAllowance: 30000,
    specialAllowance: 50000,
    gross: 290000,
  },
]

const INIT_EMPS: Employee[] = [
  {
    id: "EMP-001",
    name: "Priya Nair",
    email: "priya.nair@globaltech.in",
    department: "Engineering",
    designation: "Senior Software Engineer",
    doj: "2021-03-15",
    empType: "Full-Time",
    manager: "Rajesh Kumar",
    location: "Bangalore",
    mobile: "+91 98765 43210",
    status: "Active",
    salaryStructure: "Senior Engineer",
    grossSalary: 110000,
  },
  {
    id: "EMP-002",
    name: "Arjun Sharma",
    email: "arjun.sharma@globaltech.in",
    department: "Engineering",
    designation: "Junior Software Engineer",
    doj: "2023-06-01",
    empType: "Full-Time",
    manager: "Priya Nair",
    location: "Bangalore",
    status: "Active",
    salaryStructure: "Junior Engineer",
    grossSalary: 55000,
  },
  {
    id: "EMP-003",
    name: "Meena Iyer",
    email: "meena.iyer@globaltech.in",
    department: "HR",
    designation: "HR Manager",
    doj: "2020-01-10",
    empType: "Full-Time",
    manager: "Rajesh Kumar",
    location: "Mumbai",
    status: "Active",
    salaryStructure: "Manager",
    grossSalary: 150000,
  },
  {
    id: "EMP-004",
    name: "Suresh Pillai",
    email: "suresh.pillai@globaltech.in",
    department: "Finance",
    designation: "Finance Associate",
    doj: "2022-09-20",
    empType: "Full-Time",
    manager: "Meena Iyer",
    location: "Hyderabad",
    status: "Active",
    salaryStructure: "Associate",
    grossSalary: 35000,
  },
  {
    id: "EMP-005",
    name: "Anita Desai",
    email: "anita.desai@globaltech.in",
    department: "Sales",
    designation: "Sales Manager",
    doj: "2019-07-01",
    empType: "Full-Time",
    manager: "Rajesh Kumar",
    location: "Delhi",
    status: "Active",
    salaryStructure: "Manager",
    grossSalary: 150000,
  },
  {
    id: "EMP-006",
    name: "Vikram Reddy",
    email: "vikram.reddy@globaltech.in",
    department: "Engineering",
    designation: "Senior Software Engineer",
    doj: "2020-11-15",
    empType: "Full-Time",
    manager: "Priya Nair",
    location: "Bangalore",
    status: "On Leave",
    salaryStructure: "Senior Engineer",
    grossSalary: 110000,
  },
  {
    id: "EMP-007",
    name: "Kavitha Rao",
    email: "kavitha.rao@globaltech.in",
    department: "Design",
    designation: "Senior Designer",
    doj: "2022-02-28",
    empType: "Full-Time",
    manager: "Anita Desai",
    location: "Bangalore",
    status: "Active",
    salaryStructure: "Senior Engineer",
    grossSalary: 110000,
  },
  {
    id: "EMP-008",
    name: "Rahul Mehta",
    email: "rahul.mehta@globaltech.in",
    department: "Engineering",
    designation: "Junior Software Engineer",
    doj: "2024-01-08",
    empType: "Contract",
    manager: "Priya Nair",
    location: "Remote",
    status: "Active",
    salaryStructure: "Junior Engineer",
    grossSalary: 55000,
  },
  {
    id: "EMP-009",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@globaltech.in",
    department: "Management",
    designation: "Director - Technology",
    doj: "2018-04-01",
    empType: "Full-Time",
    manager: "-",
    location: "Mumbai",
    status: "Active",
    salaryStructure: "Director",
    grossSalary: 290000,
  },
  {
    id: "EMP-010",
    name: "abc - abc",
    email: "abc@naxrita.in",
    department: "AI/ML",
    designation: "Packaged App Development Associate",
    doj: "2026-09-01",
    empType: "Full-Time",
    manager: "Meena Iyer",
    location: "Bangalore",
    status: "Incomplete",
    salaryStructure: "Junior Engineer",
    grossSalary: 0,
  },
  {
    id: "EMP-011",
    name: "cde - 123",
    email: "cde@naxrita.in",
    department: "AI/ML",
    designation: "Packaged App Development Associate",
    doj: "2026-09-01",
    empType: "Full-Time",
    manager: "Meena Iyer",
    location: "Bangalore",
    status: "Incomplete",
    salaryStructure: "Junior Engineer",
    grossSalary: 0,
  },
]

function calcRows(
  emps: Employee[],
  ss: SalaryStructure[],
  bonus: Record<string, number> = {},
  lop: Record<string, number> = {},
): PayrunInputRow[] {
  return emps
    .filter((e) => e.status !== "Inactive" && e.status !== "Incomplete" && e.grossSalary > 0)
    .map((e) => {
      const s = ss.find((x) => x.name === e.salaryStructure)
      const basic = s?.basic ?? Math.round(e.grossSalary * 0.4)
      const lopDays = lop[e.id] ?? 0
      const lopDeduction = Math.round((e.grossSalary / 26) * lopDays)
      const bonusAmt = bonus[e.id] ?? 0
      const pf = Math.round(basic * 0.12)
      const esi = e.grossSalary <= 21000 ? Math.round(e.grossSalary * 0.0075) : 0
      const tds = Math.round(e.grossSalary * 0.1)
      const profTax = e.grossSalary > 15000 ? 200 : 150
      const totalEarnings = e.grossSalary + bonusAmt - lopDeduction
      const totalDeductions = pf + esi + tds + profTax
      return {
        empId: e.id,
        empName: e.name,
        department: e.department,
        grossSalary: e.grossSalary,
        bonus: bonusAmt,
        incentive: 0,
        lopDays,
        lopDeduction,
        otherDeduction: 0,
        pf,
        esi,
        tds,
        profTax,
        totalEarnings,
        totalDeductions,
        netSalary: totalEarnings - totalDeductions,
      }
    })
}

function createPayrun(
  input: Omit<Payrun, "totalEmployees" | "grossPayroll" | "totalDeductions" | "netPayroll">,
): Payrun {
  const grossPayroll = input.rows.reduce((sum, row) => sum + row.totalEarnings, 0)
  const totalDeductions = input.rows.reduce((sum, row) => sum + row.totalDeductions, 0)
  return {
    ...input,
    totalEmployees: input.rows.length,
    grossPayroll,
    totalDeductions,
    netPayroll: grossPayroll - totalDeductions,
  }
}

const INIT_PAYRUNS: Payrun[] = [
  createPayrun({
    id: "PR-2026-07",
    period: "July 2026",
    month: 7,
    year: 2026,
    status: "Completed",
    scope: "All Employees",
    generatedBy: "Meena Iyer",
    generatedOn: "2026-07-28",
    rows: calcRows(INIT_EMPS, INIT_SS, { "EMP-001": 10000, "EMP-005": 15000 }, {
      "EMP-006": 2,
    }),
  }),
  createPayrun({
    id: "PR-2026-08",
    period: "August 2026",
    month: 8,
    year: 2026,
    status: "Under Review",
    scope: "All Employees",
    generatedBy: "Meena Iyer",
    generatedOn: "2026-08-28",
    rows: calcRows(INIT_EMPS, INIT_SS, { "EMP-003": 5000 }, { "EMP-006": 1 }),
  }),
  createPayrun({
    id: "PR-2026-06",
    period: "June 2026",
    month: 6,
    year: 2026,
    status: "Completed",
    scope: "All Employees",
    generatedBy: "Meena Iyer",
    generatedOn: "2026-06-27",
    rows: calcRows(INIT_EMPS, INIT_SS),
  }),
]

const INIT_ORGS: Organization[] = [
  {
    id: "ORG-001",
    name: "Naxrita Solutions Pvt. Ltd.",
    code: "GTS",
    legalName: "Naxrita Solutions Private Limited",
    country: "India",
    currency: "INR",
    financialYear: "April-March",
    status: "Active",
    employees: 9,
    admin: "Meena Iyer",
  },
  {
    id: "ORG-002",
    name: "NovaSoft Technologies",
    code: "NST",
    legalName: "NovaSoft Technologies Pvt. Ltd.",
    country: "India",
    currency: "INR",
    financialYear: "April-March",
    status: "Active",
    employees: 24,
    admin: "Rohan Gupta",
  },
  {
    id: "ORG-003",
    name: "BrightEdge Consulting",
    code: "BEC",
    legalName: "BrightEdge Consulting LLP",
    country: "India",
    currency: "INR",
    financialYear: "Jan-Dec",
    status: "Draft",
    employees: 0,
    admin: "-",
  },
]

const INIT_AUDIT: AuditLog[] = [
  {
    id: "AL-001",
    user: "Meena Iyer",
    org: "Naxrita Solutions",
    action: "Payroll Approved",
    module: "Payroll",
    oldValue: "Under Review",
    newValue: "Approved",
    timestamp: "2026-08-29 10:42:15",
  },
  {
    id: "AL-002",
    user: "Meena Iyer",
    org: "Naxrita Solutions",
    action: "Employee Updated",
    module: "Employees",
    oldValue: "Status: Active",
    newValue: "Status: On Leave",
    timestamp: "2026-08-27 14:18:33",
  },
  {
    id: "AL-003",
    user: "Meena Iyer",
    org: "Naxrita Solutions",
    action: "Salary Structure Changed",
    module: "Salary",
    oldValue: "Gross: 95000",
    newValue: "Gross: 110000",
    timestamp: "2026-08-20 09:05:11",
  },
  {
    id: "AL-004",
    user: "Meena Iyer",
    org: "Naxrita Solutions",
    action: "Payroll Generated",
    module: "Payroll",
    oldValue: "Draft",
    newValue: "Calculated",
    timestamp: "2026-08-28 17:30:00",
  },
  {
    id: "AL-005",
    user: "Rajesh Kumar",
    org: "Naxrita Solutions",
    action: "Access Role Changed",
    module: "Access",
    oldValue: "Role: Associate",
    newValue: "Role: Manager",
    timestamp: "2026-08-15 11:22:44",
  },
  {
    id: "AL-006",
    user: "Meena Iyer",
    org: "Naxrita Solutions",
    action: "Employee Created",
    module: "Employees",
    oldValue: "-",
    newValue: "EMP-008: Rahul Mehta",
    timestamp: "2026-08-08 08:55:02",
  },
  {
    id: "AL-007",
    user: "Product Admin",
    org: "Naxrita Solutions",
    action: "Payroll Completed",
    module: "Payroll",
    oldValue: "Approved",
    newValue: "Completed",
    timestamp: "2026-07-31 18:00:00",
  },
  {
    id: "AL-008",
    user: "Meena Iyer",
    org: "Naxrita Solutions",
    action: "Payslip Generated",
    module: "Payslips",
    oldValue: "-",
    newValue: "9 payslips Jul 2026",
    timestamp: "2026-07-31 18:05:30",
  },
]

const INIT_ERROR_LOGS: ErrorLog[] = [
  {
    id: "ERR-001",
    timestamp: "2026-08-29 10:45:12",
    role: "org_admin",
    user: "Meena Iyer",
    module: "Payroll / Pay Runs",
    severity: "High",
    issue: "Payroll approval recalculation detected mismatched deduction totals for EMP-006.",
    route: "/payruns/PR-2026-08",
    status: "Investigating",
  },
  {
    id: "ERR-002",
    timestamp: "2026-08-28 17:38:20",
    role: "org_admin",
    user: "Meena Iyer",
    module: "Payslips",
    severity: "Medium",
    issue: "Payslip preview was requested before a completed pay run was available.",
    route: "/payslips",
    status: "Resolved",
  },
  {
    id: "ERR-003",
    timestamp: "2026-08-27 15:04:44",
    role: "org_admin",
    user: "Meena Iyer",
    module: "Salary Management",
    severity: "Medium",
    issue: "Salary structure assignment attempted for an incomplete employee profile.",
    route: "/salary/assignment",
    status: "Open",
  },
  {
    id: "ERR-004",
    timestamp: "2026-08-24 09:19:05",
    role: "product_admin",
    user: "Platform Admin",
    module: "Organizations",
    severity: "Critical",
    issue: "Organization provisioning returned duplicate legal entity code GTS.",
    route: "/organizations/ORG-001",
    status: "Investigating",
  },
  {
    id: "ERR-005",
    timestamp: "2026-08-21 11:33:50",
    role: "product_admin",
    user: "Platform Admin",
    module: "Access Management",
    severity: "High",
    issue: "Admin role update was blocked because MFA verification was pending.",
    route: "/access/users",
    status: "Resolved",
  },
]

const INIT_ORG_DOCUMENTS: OrgDocument[] = [
  {
    id: "DOC-001",
    title: "Employee Handbook 2026",
    category: "Policy",
    assignedTo: "All Employees",
    assignedCount: INIT_EMPS.length,
    owner: "Meena Iyer",
    createdOn: "2026-08-05",
    status: "Published",
    description: "Company policy, leave, conduct, and workplace guidelines.",
  },
  {
    id: "DOC-002",
    title: "PF Declaration Guide",
    category: "Compliance",
    assignedTo: "Finance",
    assignedCount: INIT_EMPS.filter((e) => e.department === "Finance").length,
    owner: "Meena Iyer",
    createdOn: "2026-08-12",
    status: "Published",
    description: "Instructions for provident fund declaration and verification.",
  },
  {
    id: "DOC-003",
    title: "Payroll Cutoff Calendar",
    category: "Payroll",
    assignedTo: "All Employees",
    assignedCount: INIT_EMPS.length,
    owner: "Meena Iyer",
    createdOn: "2026-08-20",
    status: "Draft",
    description: "Monthly payroll input and approval cutoff schedule.",
  },
]

const INIT_SALARY_COMPONENTS: SalaryComponent[] = [
  { id: "SC-001", name: "Basic", kind: "earning", type: "Fixed", calculation: "40% of monthly gross", basis: "Gross salary", frequency: "Monthly", effectiveFrom: "2026-04-01", rounding: "Nearest rupee", taxable: "Yes", active: true },
  { id: "SC-002", name: "HRA", kind: "earning", type: "Fixed", calculation: "40% of Basic", basis: "Basic salary", frequency: "Monthly", effectiveFrom: "2026-04-01", rounding: "Nearest rupee", taxable: "Partial", active: true },
  { id: "SC-003", name: "Fixed Allowance", kind: "earning", type: "Fixed", calculation: "Configured in salary structure", basis: "Structure amount", frequency: "Monthly", effectiveFrom: "2026-04-01", rounding: "Nearest rupee", taxable: "Yes", active: true },
  { id: "SC-004", name: "Bonus", kind: "earning", type: "Variable", calculation: "Payroll input amount", basis: "Manual input", frequency: "One-time", effectiveFrom: "2026-04-01", rounding: "Nearest rupee", taxable: "Yes", active: true },
  { id: "SC-005", name: "PF (Provident Fund)", kind: "deduction", type: "Statutory", calculation: "12% of Basic", basis: "Basic salary", frequency: "Monthly", effectiveFrom: "2026-04-01", rounding: "Nearest rupee", taxable: "No", active: true },
  { id: "SC-006", name: "ESI", kind: "deduction", type: "Statutory", calculation: "0.75% of Gross where eligible", basis: "Gross salary", frequency: "Monthly", effectiveFrom: "2026-04-01", rounding: "Nearest rupee", taxable: "No", active: true },
  { id: "SC-007", name: "TDS (Income Tax)", kind: "deduction", type: "Statutory", calculation: "As per slab", basis: "Taxable income", frequency: "Monthly", effectiveFrom: "2026-04-01", rounding: "Nearest rupee", taxable: "No", active: true },
  { id: "SC-008", name: "Other Deduction", kind: "deduction", type: "Manual", calculation: "Manual payroll adjustment", basis: "Manual input", frequency: "One-time", effectiveFrom: "2026-04-01", rounding: "No rounding", taxable: "No", active: true },
]

const inr = (n: number) => "₹" + n.toLocaleString("en-IN")
const MIN_SEARCH_CHARS = 3
const activeSearch = (v: string) => v.trim().length >= MIN_SEARCH_CHARS
const searchMatches = (query: string, values: string[]) => {
  const q = query.trim().toLowerCase().replace(/ *\(.*\)$/, "")
  if (!activeSearch(q)) return true
  return values.some((v) => v.toLowerCase().includes(q))
}
const fmtD = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
const PAYRUN_STEPS: PayrunStatus[] = [
  "Draft",
  "Calculated",
  "Under Review",
  "Approved",
  "Completed",
  "Locked",
]
const isFinalizedPayrun = (status: PayrunStatus) =>
  status === "Completed" || status === "Locked"

function Badge({
  label,
  color,
  bg,
  dot,
}: {
  label: string
  color: string
  bg: string
  dot?: string
}) {
  return (
    <span
      className="sap-object-status"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "2px 8px",
        borderRadius: 10,
        fontSize: 11,
        fontWeight: 600,
        color,
        background: bg,
        whiteSpace: "nowrap",
        maxWidth: 200,
        overflow: "hidden",
        textOverflow: "ellipsis",
        flexShrink: 0,
      }}
    >
      {dot && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: dot,
            flexShrink: 0,
          }}
        />
      )}
      {label}
    </span>
  )
}
function empBadge(s: EmpStatus) {
  const m: Record<EmpStatus, [string, string, string]> = {
    Active: [F.success, F.successBg, F.success],
    Inactive: [F.text3, F.pageBg, F.text3],
    "On Leave": [F.warning, F.warningBg, F.warning],
    Incomplete: [F.warning, F.warningBg, F.warning],
  }
  const [c, b, d] = m[s]
  return <Badge label={s} color={c} bg={b} dot={d} />
}
function prBadge(s: PayrunStatus) {
  const m: Record<PayrunStatus, [string, string, string]> = {
    Draft: [F.text3, F.pageBg, F.text3],
    Calculated: [F.brand, F.infoBg, F.brand],
    "Under Review": [F.warning, F.warningBg, F.warning],
    Approved: ["#0854A0", "#D6E8FB", "#0854A0"],
    Completed: [F.success, F.successBg, F.success],
    Locked: [F.text1, "#E8EEF5", F.text1],
  }
  const [c, b, d] = m[s]
  return <Badge label={s} color={c} bg={b} dot={d} />
}
function orgBadge(s: OrgStatus) {
  const m: Record<OrgStatus, [string, string]> = {
    Active: [F.success, F.successBg],
    Draft: [F.text3, F.pageBg],
    Inactive: [F.warning, F.warningBg],
    Suspended: [F.error, F.errorBg],
  }
  const [c, b] = m[s]
  return <Badge label={s} color={c} bg={b} />
}
function capBadge(v: string) {
  if (v === "Yes")
    return <Badge label="Yes" color={F.success} bg={F.successBg} />
  if (v === "No") return <Badge label="No" color={F.error} bg={F.errorBg} />
  if (v === "-") return <span style={{ color: F.text3, fontSize: 13 }}>-</span>
  return <Badge label={v} color={F.warning} bg={F.warningBg} />
}

function Tile({
  label,
  value,
  sub,
  accent,
}: {
  label: string
  value: string
  sub?: string
  accent?: string
}) {
  return (
    <div
      className="sap-kpi-tile"
      style={{
        background: F.card,
        border: `1px solid ${F.border}`,
        borderRadius: 8,
        padding: "18px 22px",
        borderLeft: accent ? `3px solid ${accent}` : undefined,
        flex: 1,
        minWidth: 0,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: F.text2,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 8,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 24,
          fontWeight: 800,
          color: F.text1,
          lineHeight: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </div>
      {sub && (
        <div style={{
          fontSize: 12,
          color: F.text2,
          marginTop: 6,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}>{sub}</div>
      )}
    </div>
  )
}

const iSt: React.CSSProperties = {
  width: "100%",
  padding: "7px 10px",
  border: `1px solid ${F.border}`,
  borderRadius: 4,
  fontSize: 13,
  color: F.text1,
  background: F.card,
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
}

function Fld({ label, children }: { label: string children: React.ReactNode }) {
  return (
    <div className="sap-field" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: F.text2,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  )
}
function Th({
  children,
  right,
}: {
  children: React.ReactNode
  right?: boolean
}) {
  return (
    <th
      style={{
        padding: "10px 14px",
        textAlign: right ? "right" : "left",
        fontSize: 11,
        fontWeight: 600,
        color: F.text2,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        borderBottom: `2px solid ${F.border}`,
        whiteSpace: "nowrap",
        background: F.pageBg,
        position: "sticky",
        top: 0,
        zIndex: 2,
      }}
    >
      {children}
    </th>
  )
}
function Td({
  children,
  right,
  mono,
  style,
  onClick,
  colSpan,
  rowSpan,
}: {
  children: React.ReactNode
  right?: boolean
  mono?: boolean
  style?: React.CSSProperties
  onClick?: () => void
  colSpan?: number
  rowSpan?: number
}) {
  return (
    <td
      colSpan={colSpan}
      rowSpan={rowSpan}
      style={{
        padding: "11px 14px",
        textAlign: right ? "right" : "left",
        fontSize: 13,
        color: F.text1,
        verticalAlign: "middle",
        fontFamily: mono ? "'JetBrains Mono',monospace" : undefined,
        maxWidth: 220,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        ...style,
      }}
      onClick={onClick}
    >
      {children}
    </td>
  )
}
function TrH({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick?: () => void
}) {
  const [h, setH] = useState(false)
  return (
    <tr
      style={{
        borderBottom: `1px solid ${F.border}`,
        background: h ? F.highlight : "transparent",
        cursor: onClick ? "pointer" : "default",
        transition: "background 0.1s",
      }}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      onClick={onClick}
    >
      {children}
    </tr>
  )
}
function PH({
  title,
  sub,
  action,
}: {
  title: string
  sub?: string
  action?: React.ReactNode
}) {
  return (
    <div
      className="sap-dynamic-page-title"
      style={{
        background: F.card,
        border: `1px solid ${F.border}`,
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
          style={{ margin: 0, fontSize: 23, fontWeight: 900, color: F.text1, lineHeight: 1.15 }}
        >
          {title}
        </h1>
        {sub && (
          <p style={{ margin: "6px 0 0", fontSize: 13, color: F.text2, lineHeight: 1.45 }}>
            {sub}
          </p>
        )}
      </div>
      {action && <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>{action}</div>}
    </div>
  )
}

type BtnVariant = "primary" | "secondary" | "danger" | "ghost" | "success"
function Pagination({ page, pageSize, total, onPageChange }: { page: number; pageSize: number; total: number; onPageChange: (page: number) => void }) {
  const pages = Math.max(1, Math.ceil(total / pageSize))
  return (
    <div className="sap-pagination" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderTop: `1px solid ${F.border}`, fontSize: 12, color: F.text2 }}>
      <span>Showing {Math.min((page - 1) * pageSize + 1, total)}–{Math.min(page * pageSize, total)} of {total}</span>
      <div style={{ display: "flex", gap: 6 }}>
        <Btn small variant="secondary" disabled={page === 1} onClick={() => onPageChange(page - 1)}>Previous</Btn>
        <span style={{ display: "flex", alignItems: "center", padding: "0 6px", fontWeight: 700 }}>Page {page} of {pages}</span>
        <Btn small variant="secondary" disabled={page === pages} onClick={() => onPageChange(page + 1)}>Next</Btn>
      </div>
    </div>
  )
}
function Btn({
  children,
  variant = "primary",
  onClick,
  small,
  disabled,
  title,
  style,
}: {
  children: React.ReactNode
  variant?: BtnVariant
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  small?: boolean
  disabled?: boolean
  title?: string
  style?: React.CSSProperties
}) {
  const [hov, setHov] = useState(false)
  const base: Record<BtnVariant, React.CSSProperties> = {
    primary: {
      background: hov ? F.brandHover : F.brand,
      color: "#fff",
      border: "none",
    },
    secondary: {
      background: hov ? F.highlight : F.card,
      color: F.text1,
      border: `1px solid ${F.border}`,
    },
    danger: {
      background: F.errorBg,
      color: F.error,
      border: "1px solid #e8b4b4",
    },
    ghost: { background: "transparent", color: F.brand, border: "none" },
    success: {
      background: hov ? "#0d6b34" : F.success,
      color: "#fff",
      border: "none",
    },
  }
  return (
    <button
      className={`sap-button sap-button-${variant}${small ? " sap-button-small" : ""}`}
      onClick={onClick}
      disabled={disabled}
      title={
        title ??
        (typeof children === "string" ? children : undefined)
      }
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...base[variant],
        padding: small ? "5px 12px" : "8px 16px",
        borderRadius: 4,
        fontSize: small ? 12 : 13,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontFamily: "inherit",
        opacity: disabled ? 0.5 : 1,
        transition: "background 0.12s",
        ...style,
      }}
    >
      {children}
    </button>
  )
}

function TabBar({
  tabs,
  active,
  onSelect,
}: {
  tabs: { id: string label: string }[]
  active: string
  onSelect: (id: string) => void
}) {
  return (
    <div
      className="sap-icon-tab-bar"
      style={{
        display: "flex",
        borderBottom: `2px solid ${F.border}`,
        marginBottom: 16,
      }}
    >
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onSelect(t.id)}
          style={{
            padding: "10px 18px",
            fontSize: 13,
            fontWeight: active === t.id ? 600 : 400,
            color: active === t.id ? F.brand : F.text2,
            background: "transparent",
            border: "none",
            borderBottom: `2px solid ${
              active === t.id ? F.brand : "transparent"
            }`,
            cursor: "pointer",
            marginBottom: -2,
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

function SH({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="sap-section-label"
      style={{
        fontSize: 11,
        fontWeight: 700,
        color: F.text3,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        marginTop: 14,
        marginBottom: 8,
      }}
    >
      {children}
    </div>
  )
}
function IR({ label, value }: { label: string value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "6px 0",
        borderBottom: `1px solid ${F.border}`,
      }}
    >
      <span style={{ fontSize: 12, color: F.text2 }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 600, color: F.text1 }}>
        {value}
      </span>
    </div>
  )
}

// ── SAP F4 Value Help ─────────────────────────────────────────────────────────
function ValueHelp({
  value,
  onChange,
  placeholder,
  values,
  label,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  values: string[]
  label?: string
}) {
  const [open, setOpen] = useState(false)
  const [inner, setInner] = useState("")
  // Track whether the mouse is anywhere inside the dropdown.
  // This prevents the main input's onBlur from closing the panel
  // when the user clicks the inner search or hovers over items.
  const dropRef = useState(false)
  const dropHover = dropRef[0]
  const setDropHover = dropRef[1]

  const close = () => {
    setOpen(false)
    setInner("")
  }

  const optionQuery = inner || value
  const filtered = values.filter((v) =>
    !optionQuery || !activeSearch(optionQuery)
      ? true
      : v.toLowerCase().includes(optionQuery.trim().toLowerCase()),
  )

  return (
    <div style={{ position: "relative", flex: 1 }}>
      {label && (
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: F.text2,
            marginBottom: 3,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          {label}
        </div>
      )}
      <div style={{ position: "relative" }}>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            setOpen(true)
            setInner("")
          }}
          onBlur={() => {
            if (!dropHover) close()
          }}
          placeholder={placeholder ?? "Search…"}
          style={{
            ...iSt,
            paddingLeft: 10,
            paddingRight: value ? 28 : 10,
            border: `1px solid ${open ? F.brand : F.border}`,
            boxShadow: open ? `0 0 0 2px ${F.brand}22` : undefined,
            transition: "border 0.12s, box-shadow 0.12s",
          }}
        />
        {value && (
          <button
            title="Clear search"
            onMouseDown={(e) => {
              e.preventDefault()
              onChange("")
              close()
            }}
            style={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: F.text3,
              fontSize: 16,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        )}
      </div>

      {open && (
        <div
          onMouseEnter={() => setDropHover(true)}
          onMouseLeave={() => setDropHover(false)}
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            minWidth: 260,
            background: F.card,
            border: `1px solid ${F.brand}`,
            borderRadius: 6,
            zIndex: 400,
            boxShadow: "0 8px 28px rgba(0,0,0,0.16)",
            overflow: "hidden",
          }}
        >
          {/* Inner search — no autoFocus; stays open because dropHover is true */}
          <div
            style={{
              padding: "8px 10px",
              borderBottom: `1px solid ${F.border}`,
              background: F.pageBg,
            }}
          >
            <div style={{ position: "relative" }}>
              <input
                value={inner}
                onChange={(e) => setInner(e.target.value)}
                onBlur={() => {
                  if (!dropHover) close()
                }}
                placeholder="Search available values…"
                style={{ ...iSt, paddingLeft: 10, fontSize: 12 }}
              />
            </div>
          </div>

          <div style={{ maxHeight: 240, overflowY: "auto" }}>
            {filtered.length === 0 && (
              <div
                style={{
                  padding: "16px 14px",
                  fontSize: 13,
                  color: F.text3,
                  textAlign: "center",
                }}
              >
                No results for "{optionQuery}"
              </div>
            )}
            {optionQuery && !activeSearch(optionQuery) && (
              <div
                style={{
                  padding: "8px 14px",
                  fontSize: 12,
                  color: F.text3,
                  background: F.infoBg,
                  borderBottom: `1px solid ${F.border}`,
                }}
              >
                Type at least 3 characters to search.
              </div>
            )}
            {filtered.map((v) => (
              <div
                key={v}
                // onMouseDown with preventDefault keeps focus on the currently-focused
                // input (main or inner) so the blur/close cycle never triggers.
                onMouseDown={(e) => {
                  e.preventDefault()
                  onChange(v)
                  close()
                }}
                style={{
                  padding: "9px 14px",
                  fontSize: 13,
                  color: v === value ? F.brand : F.text1,
                  background: v === value ? F.infoBg : "transparent",
                  cursor: "pointer",
                  fontWeight: v === value ? 600 : 400,
                  borderBottom: `1px solid ${F.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "background 0.08s",
                }}
              >
                <span>{v}</span>
                {v === value && (
                  <span style={{ fontSize: 11, fontWeight: 800, color: F.brand }}>
                    Selected
                  </span>
                )}
              </div>
            ))}
          </div>

          <div
            style={{
              padding: "5px 12px",
              borderTop: `1px solid ${F.border}`,
              fontSize: 11,
              color: F.text3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: F.pageBg,
            }}
          >
            <span>F4 Value Help</span>
            <span>
              {filtered.length} of {values.length}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

function SlidePanel({
  title,
  sub,
  children,
  onClose,
  footer,
}: {
  title: string
  sub?: string
  children: React.ReactNode
  onClose: () => void
  footer?: React.ReactNode
}) {
  return (
    <div
      className="sap-overlay sap-side-overlay"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(50,54,58,0.35)",
        zIndex: 200,
        display: "flex",
        justifyContent: "flex-end",
      }}
      onClick={onClose}
    >
      <div
        className="sap-side-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 440,
          height: "100%",
          background: F.card,
          borderLeft: `1px solid ${F.border}`,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "14px 20px",
            borderBottom: `1px solid ${F.border}`,
            background: F.pageBg,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: F.text1 }}>
              {title}
            </div>
            {sub && (
              <div style={{ fontSize: 11, color: F.text3, marginTop: 2 }}>
                {sub}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            title="Close panel"
            style={{
              background: "none",
              border: `1px solid ${F.border}`,
              borderRadius: 4,
              cursor: "pointer",
              padding: "4px 8px",
              color: F.text2,
              fontSize: 14,
            }}
          >
            X
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 20, wordBreak: "break-word" }}>
          {children}
        </div>
        {footer && (
          <div
            style={{ padding: "12px 20px", borderTop: `1px solid ${F.border}` }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

function Modal({
  title,
  onClose,
  children,
  wide,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
  wide?: boolean
}) {
  return (
    <div
      className="sap-overlay sap-modal-overlay"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(50,54,58,0.45)",
        zIndex: 300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        className="sap-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: F.card,
          borderRadius: 8,
          width: wide ? 820 : 580,
          maxWidth: "calc(100vw - 32px)",
          maxHeight: "92vh",
          overflow: "auto",
          boxShadow: "0 18px 46px rgba(15,23,42,0.28)",
          border: `1px solid ${F.border}`,
        }}
      >
        <div
          style={{
            padding: "18px 24px",
            borderBottom: `1px solid ${F.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: F.pageBg,
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
        >
          <span style={{ fontSize: 18, fontWeight: 900, color: F.text1 }}>
            {title}
          </span>
          <button
            onClick={onClose}
            title="Close modal"
            style={{
              background: "none",
              border: `1px solid ${F.border}`,
              borderRadius: 4,
              cursor: "pointer",
              padding: "4px 8px",
              color: F.text2,
            }}
          >
            X
          </button>
        </div>
        <div style={{ padding: 22, wordBreak: "break-word" }}>{children}</div>
      </div>
    </div>
  )
}

function Stepper({ current }: { current: PayrunStatus }) {
  const ci = PAYRUN_STEPS.indexOf(current)
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 20, width: "100%", overflowX: "auto" }}>
      {PAYRUN_STEPS.map((step, i) => {
        const done = i < ci
        const active = i === ci
        return (
          <div
            key={step}
            style={{
              display: "flex",
              alignItems: "center",
              flex: i < PAYRUN_STEPS.length - 1 ? 1 : undefined,
              minWidth: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 5,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: done
                    ? F.success
                    : active
                      ? F.brand
                      : F.pageBg,
                  border: `2px solid ${
                    done
                      ? F.success
                      : active
                        ? F.brand
                        : F.borderStrong
                  }`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: active ? `0 0 0 3px ${F.brand}25` : "none",
                  transition: "all 0.2s ease",
                }}
              >
                {done ? (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span
                    style={{
                      color: active ? "#FFFFFF" : F.text2,
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {i + 1}
                  </span>
                )}
              </div>
              <span
                style={{
                  fontSize: 10,
                  color: active ? F.brand : done ? F.success : F.text3,
                  fontWeight: active ? 700 : 500,
                  whiteSpace: "nowrap",
                  textAlign: "center",
                }}
              >
                {step}
              </span>
            </div>
            {i < PAYRUN_STEPS.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: 2,
                  background: done ? F.success : F.border,
                  margin: "0 4px",
                  marginBottom: 16,
                  minWidth: 12,
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

type PayslipPdfEntry = {
  row: Pick<PayrunInputRow, "grossSalary" | "totalEarnings" | "pf" | "tds" | "profTax" | "totalDeductions" | "netSalary">
  run: Pick<Payrun, "period" | "generatedOn">
  emp: Pick<Employee, "name" | "id" | "department" | "designation" | "salaryStructure">
}

function downloadPayslipsPdf(entries: PayslipPdfEntry[]) {
  if (entries.length === 0) return
  const printWindow = window.open("", "_blank", "width=900,height=1100")
  if (!printWindow) return
  const title = entries.length === 1
    ? `${entries[0].emp.name} Payslip ${entries[0].run.period}`
    : `${entries.length} Selected Payslips`
  const payslipSections = entries.map(({ row, run, emp }) => `
    <section class="payslip">
      <div class="header"><div><h1>Naxpayroll</h1><div>Naxrita Solutions Pvt. Ltd.</div></div><div><div>Payslip Period</div><h2>${run.period}</h2></div></div>
      <div class="grid">
        <div class="row"><span>Employee</span><strong>${emp.name} (${emp.id})</strong></div>
        <div class="row"><span>Department</span><strong>${emp.department}</strong></div>
        <div class="row"><span>Designation</span><strong>${emp.designation}</strong></div>
        <div class="row"><span>Pay Date</span><strong>${fmtD(run.generatedOn)}</strong></div>
        <div class="row"><span>Salary Structure</span><strong>${emp.salaryStructure}</strong></div>
        <div class="row"><span>Status</span><strong>Completed</strong></div>
      </div>
      <div class="cols">
        <div class="col"><h3>Earnings</h3><div class="row"><span>Gross Salary</span><strong>${inr(row.grossSalary)}</strong></div><div class="row"><span>Total Earnings</span><strong>${inr(row.totalEarnings)}</strong></div></div>
        <div class="col ded"><h3>Deductions</h3><div class="row"><span>PF</span><strong>${inr(row.pf)}</strong></div><div class="row"><span>TDS</span><strong>${inr(row.tds)}</strong></div><div class="row"><span>Professional Tax</span><strong>${inr(row.profTax)}</strong></div><div class="row"><span>Total Deductions</span><strong>${inr(row.totalDeductions)}</strong></div></div>
      </div>
      <div class="net"><span>Net Pay</span><span>${inr(row.netSalary)}</span></div>
    </section>
  `).join("")
  printWindow.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 28px; color: #32363A; }
          .payslip { break-after: page; page-break-after: always; }
          .payslip:last-child { break-after: auto; page-break-after: auto; }
          .header { background: #354A5E; color: white; padding: 22px; display: flex; justify-content: space-between; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 24px; margin: 22px 0; }
          .row { display: flex; justify-content: space-between; border-bottom: 1px solid #D9D9D9; padding: 8px 0; }
          .cols { display: grid; grid-template-columns: 1fr 1fr; border: 1px solid #D9D9D9; }
          .col { padding: 18px; }
          .net { margin-top: 0; padding: 18px; background: #F1FDF6; display: flex; justify-content: space-between; font-size: 24px; font-weight: 800; color: #107E3E; }
          h3 { margin: 0 0 12px; color: #107E3E; }
          .ded h3 { color: #BB0000; }
          @media print { button { display: none; } body { padding: 0; } }
        </style>
      </head>
      <body>
        <button onclick="window.print()" style="margin-bottom:16px;padding:10px 16px;background:#0070F2;color:white;border:0;border-radius:4px;font-weight:700;">Download / Save ${entries.length} PDF${entries.length === 1 ? "" : "s"}</button>
        ${payslipSections}
        <script>window.onload = () => window.print()</script>
      </body>
    </html>
  `)
  printWindow.document.close()
}

function downloadPayslipPdf(row: PayslipPdfEntry["row"], run: PayslipPdfEntry["run"], emp: PayslipPdfEntry["emp"]) {
  downloadPayslipsPdf([{ row, run, emp }])
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}

function payslipGeneratedDate(period: string) {
  const [monthName, year = "2026"] = period.split(" ")
  const month = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ].indexOf(monthName) + 1
  return `${year}-${String(Math.max(month, 1)).padStart(2, "0")}-28`
}

function PayslipSheet({
  row,
  run,
  emp,
  showDownload = true,
}: {
  row: PayrunInputRow
  run: Payrun
  emp: Employee
  showDownload?: boolean
}) {
  const earnings = [
    ["Gross Salary", row.grossSalary],
    ["Bonus", row.bonus],
    ["Incentive", row.incentive],
  ].filter(([, value]) => Number(value) > 0)
  const deductions = [
    ["PF", row.pf],
    ["ESI", row.esi],
    ["TDS", row.tds],
    ["Professional Tax", row.profTax],
    ["LOP Deduction", row.lopDeduction],
    ["Other Deduction", row.otherDeduction],
  ].filter(([, value]) => Number(value) > 0)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div
        style={{
          border: `1px solid ${F.border}`,
          borderRadius: 8,
          overflow: "hidden",
          background: F.card,
        }}
      >
        <div
          style={{
            background: "#1D2D3E",
            color: "#fff",
            padding: "16px 20px",
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>Naxpayroll</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.68)" }}>
              Naxrita Solutions Pvt. Ltd.
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.68)" }}>
              Payslip Period
            </div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>{run.period}</div>
          </div>
        </div>

        <div
          style={{
            padding: 20,
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 14,
            borderBottom: `1px solid ${F.border}`,
          }}
        >
          <IR label="Employee" value={`${emp.name} (${emp.id})`} />
          <IR label="Department" value={emp.department} />
          <IR label="Designation" value={emp.designation} />
          <IR label="Pay Date" value={fmtD(run.generatedOn)} />
          <IR label="Salary Structure" value={emp.salaryStructure} />
          <IR label="Status" value="Completed" />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 0,
          }}
        >
          <div style={{ padding: 20, borderRight: `1px solid ${F.border}` }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: F.success, marginBottom: 10 }}>
              Earnings
            </div>
            {earnings.map(([label, value]) => (
              <IR key={label as string} label={label as string} value={inr(Number(value))} />
            ))}
            <div style={{ marginTop: 10 }}>
              <IR label="Total Earnings" value={inr(row.totalEarnings)} />
            </div>
          </div>
          <div style={{ padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: F.error, marginBottom: 10 }}>
              Deductions
            </div>
            {deductions.map(([label, value]) => (
              <IR key={label as string} label={label as string} value={inr(Number(value))} />
            ))}
            <div style={{ marginTop: 10 }}>
              <IR label="Total Deductions" value={inr(row.totalDeductions)} />
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "16px 20px",
            background: F.successBg,
            borderTop: `1px solid ${F.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 700, color: F.text1 }}>
            Net Pay
          </span>
          <span style={{ fontSize: 24, fontWeight: 900, color: F.success }}>
            {inr(row.netSalary)}
          </span>
        </div>
      </div>
      {showDownload && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "12px 0 0",
          }}
        >
          <Btn title="Download payslip PDF" onClick={() => downloadPayslipPdf(row, run, emp)}>
            <DownloadIcon />
            Download PDF
          </Btn>
        </div>
      )}
    </div>
  )
}

function Confirm({
  msg,
  onOk,
  onCancel,
  okLabel = "Confirm",
  danger,
}: {
  msg: string
  onOk: () => void
  onCancel: () => void
  okLabel?: string
  danger?: boolean
}) {
  return (
    <div
      className="sap-overlay sap-confirm-overlay"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(50,54,58,0.5)",
        zIndex: 500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="sap-message-box"
        style={{
          background: F.card,
          borderRadius: 4,
          padding: 24,
          width: 360,
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        }}
      >
        <p
          style={{
            margin: "0 0 20px",
            fontSize: 14,
            color: F.text1,
            lineHeight: 1.6,
          }}
        >
          {msg}
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Btn variant="secondary" onClick={onCancel}>
            Cancel
          </Btn>
          <Btn variant={danger ? "danger" : "primary"} onClick={onOk}>
            {okLabel}
          </Btn>
        </div>
      </div>
    </div>
  )
}

function Toasts({ toasts }: { toasts: ToastItem[] }) {
  const colors: Record<ToastType, [string, string]> = {
    success: [F.success, F.successBg],
    error: [F.error, F.errorBg],
    info: [F.brand, F.infoBg],
    warning: [F.warning, F.warningBg],
  }
  return (
    <div
      className="sap-message-toasts"
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 999,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      {toasts.map((t) => {
        const [color, bg] = colors[t.type]
        return (
          <div
            className={`sap-message-strip sap-message-strip-${t.type}`}
            key={t.id}
            style={{
              background: bg,
              border: `1px solid ${color}40`,
              borderLeft: `3px solid ${color}`,
              borderRadius: 4,
              padding: "10px 16px",
              fontSize: 13,
              color: F.text1,
              fontWeight: 500,
              boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
              minWidth: 240,
              maxWidth: 340,
            }}
          >
            {t.msg}
          </div>
        )
      })}
    </div>
  )
}

function MiniBarChart({
  data,
  color,
}: {
  data: { label: string value: number }[]
  color: string
}) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div
      style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 60 }}
    >
      {data.map((d) => (
        <div
          key={d.label}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
          }}
        >
          <div
            style={{
              width: "100%",
              borderRadius: "2px 2px 0 0",
              background: color,
              opacity: 0.85,
              height: `${(d.value / max) * 52}px`,
              minHeight: 3,
              transition: "height 0.3s",
            }}
          />
          <span style={{ fontSize: 9, color: F.text3, whiteSpace: "nowrap" }}>
            {d.label}
          </span>
        </div>
      ))}
    </div>
  )
}

function DonutChart({
  segments,
  size = 80,
}: {
  segments: { label: string value: number color: string }[]
  size?: number
}) {
  const total = segments.reduce((s, x) => s + x.value, 0)
  let cum = 0
  const paths = segments.map((seg) => {
    const pct = seg.value / total
    const start = cum
    cum += pct
    const s = start * Math.PI * 2 - Math.PI / 2
    const e = cum * Math.PI * 2 - Math.PI / 2
    const r = size / 2 - 6
    const cx = size / 2
    const cy = size / 2
    const x1 = cx + r * Math.cos(s)
    const y1 = cy + r * Math.sin(s)
    const x2 = cx + r * Math.cos(e)
    const y2 = cy + r * Math.sin(e)
    const large = pct > 0.5 ? 1 : 0
    return {
      d: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`,
      color: seg.color,
      label: seg.label,
      pct: Math.round(pct * 100),
    }
  })
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {paths.map((p, i) => (
        <path key={i} d={p.d} fill={p.color} opacity={0.88}>
          <title>
            {p.label}: {p.pct}%
          </title>
        </path>
      ))}
      <circle cx={size / 2} cy={size / 2} r={size / 2 - 16} fill={F.card} />
    </svg>
  )
}

function TrendArrow({ up }: { up: boolean }) {
  return (
    <span
      style={{
        color: up ? F.success : F.error,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 14,
        height: 14,
        borderRadius: "50%",
        background: up ? `${F.success}18` : `${F.error}18`,
        flexShrink: 0,
      }}
    >
      <svg
        width="9"
        height="9"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points={up ? "18 15 12 9 6 15" : "6 9 12 15 18 9"} />
      </svg>
    </span>
  )
}

// ── Enterprise Dashboard Charts ───────────────────────────────────────────────

// Proper ring donut with center label
function RingChart({
  segments,
  size = 130,
  centerLabel,
  centerSub,
}: {
  segments: { label: string; value: number; color: string }[]
  size?: number
  centerLabel?: string
  centerSub?: string
}) {
  const total = segments.reduce((s, x) => s + x.value, 0)
  if (total === 0)
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: F.pageBg,
          border: `1px dashed ${F.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          color: F.text3,
          flexShrink: 0,
        }}
      >
        No data
      </div>
    )
  const R = size / 2,
    r = R * 0.60,
    cx = R,
    cy = R
  const GAP = 0.015 // radians gap between segments
  let cum = 0
  const paths = segments.map((seg) => {
    const pct = seg.value / total
    const start = cum + GAP / 2
    cum += pct
    const end = cum * Math.PI * 2 - Math.PI / 2
    const s = start * Math.PI * 2 - Math.PI / 2
    const x1 = cx + (R - 2) * Math.cos(s)
    const y1 = cy + (R - 2) * Math.sin(s)
    const x2 = cx + (R - 2) * Math.cos(end)
    const y2 = cy + (R - 2) * Math.sin(end)
    const x3 = cx + r * Math.cos(end)
    const y3 = cy + r * Math.sin(end)
    const x4 = cx + r * Math.cos(s)
    const y4 = cy + r * Math.sin(s)
    const large = pct > 0.5 ? 1 : 0
    return {
      d: `M ${x1} ${y1} A ${R - 2} ${R - 2} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${r} ${r} 0 ${large} 0 ${x4} ${y4} Z`,
      color: seg.color,
      label: seg.label,
      pct: Math.round(pct * 100),
    }
  })
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ flexShrink: 0, display: "block" }}
    >
      {paths.map((p, i) => (
        <path key={i} d={p.d} fill={p.color} opacity={0.94}>
          <title>
            {p.label}: {p.pct}%
          </title>
        </path>
      ))}
      {centerLabel && (
        <>
          <text
            x={cx}
            y={cy - 2}
            textAnchor="middle"
            fontSize="14"
            fontWeight="800"
            fill={F.text1}
            fontFamily="Inter, sans-serif"
          >
            {centerLabel}
          </text>
          {centerSub && (
            <text
              x={cx}
              y={cy + 13}
              textAnchor="middle"
              fontSize="9"
              fontWeight="600"
              fill={F.text3}
              fontFamily="Inter, sans-serif"
            >
              {centerSub}
            </text>
          )}
        </>
      )}
    </svg>
  )
}

// Multi-series grouped bar chart (SVG)
function GroupedBarChart({ months, cur }: { months: Payrun[]; cur: Payrun }) {
  const W = 560,
    H = 180,
    PAD = { l: 56, r: 16, t: 20, b: 46 }
  const chartW = W - PAD.l - PAD.r,
    chartH = H - PAD.t - PAD.b
  const maxVal =
    Math.max(...months.flatMap((p) => [p.grossPayroll, p.netPayroll])) * 1.12 ||
    1

  // Y-axis grid ticks
  const ticks = 4
  const yTicks = Array.from({ length: ticks + 1 }, (_, i) => i / ticks)

  const barGroupW = chartW / months.length
  const barW = barGroupW * 0.28
  const gap = barGroupW * 0.05

  const yPos = (v: number) => PAD.t + chartH * (1 - v / maxVal)

  const fmtK = (v: number) =>
    v >= 100000
      ? `₹${(v / 100000).toFixed(1)}L`
      : v >= 1000
        ? `₹${Math.round(v / 1000)}K`
        : String(v)

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block", minHeight: 160 }}>
      {/* Grid lines */}
      {yTicks.map((t, i) => {
        const y = PAD.t + chartH * (1 - t)
        return (
          <g key={i}>
            <line
              x1={PAD.l}
              y1={y}
              x2={W - PAD.r}
              y2={y}
              stroke={F.border}
              strokeDasharray={t === 0 ? "none" : "4 3"}
              strokeWidth={t === 0 ? 1.5 : 0.8}
            />
            <text
              x={PAD.l - 8}
              y={y + 3.5}
              textAnchor="end"
              fontSize="9"
              fill={F.text3}
              fontFamily="Inter, sans-serif"
            >
              {fmtK(maxVal * t)}
            </text>
          </g>
        )
      })}

      {/* Bars */}
      {months.map((p, i) => {
        const gx = PAD.l + i * barGroupW + barGroupW * 0.12
        const isCur = p.id === cur.id
        const gh = Math.max(3, chartH * (p.grossPayroll / maxVal))
        const nh = Math.max(3, chartH * (p.netPayroll / maxVal))
        const dh = Math.max(3, chartH * (p.totalDeductions / maxVal))
        const gy = yPos(p.grossPayroll)
        const ny = yPos(p.netPayroll)
        const dy = yPos(p.totalDeductions)
        const cx = gx + barGroupW * 0.38
        return (
          <g key={p.id}>
            {isCur && (
              <rect
                x={gx - 4}
                y={PAD.t}
                width={barGroupW * 0.82}
                height={chartH}
                rx={4}
                fill={`${F.brand}0A`}
              />
            )}
            {/* Gross bar */}
            <rect
              x={gx}
              y={gy}
              width={barW}
              height={gh}
              rx={3}
              fill={isCur ? F.warning : `${F.warning}60`}
            >
              <title>
                {p.period} Gross: {inr(p.grossPayroll)}
              </title>
            </rect>
            {/* Net bar */}
            <rect
              x={gx + barW + gap}
              y={ny}
              width={barW}
              height={nh}
              rx={3}
              fill={isCur ? F.success : `${F.success}60`}
            >
              <title>
                {p.period} Net: {inr(p.netPayroll)}
              </title>
            </rect>
            {/* Deduction bar */}
            <rect
              x={gx + barW * 2 + gap * 2}
              y={dy}
              width={barW}
              height={dh}
              rx={3}
              fill={isCur ? F.error : `${F.error}50`}
            >
              <title>
                {p.period} Deductions: {inr(p.totalDeductions)}
              </title>
            </rect>
            {/* Month label */}
            <text
              x={cx}
              y={H - PAD.b + 14}
              textAnchor="middle"
              fontSize="10"
              fill={isCur ? F.brand : F.text2}
              fontWeight={isCur ? "700" : "500"}
              fontFamily="Inter, sans-serif"
            >
              {p.period.slice(0, 3)}
            </text>
            <text
              x={cx}
              y={H - PAD.b + 24}
              textAnchor="middle"
              fontSize="9"
              fill={F.text3}
              fontFamily="Inter, sans-serif"
            >
              {"'" + p.year.toString().slice(2)}
            </text>
          </g>
        )
      })}

      {/* Net payroll trend line */}
      {(() => {
        const pts = months.map((p, i) => {
          const gx = PAD.l + i * barGroupW + barGroupW * 0.12 + barW + gap + barW / 2
          return [gx, yPos(p.netPayroll)]
        })
        if (pts.length < 2) return null
        return (
          <>
            <polyline
              points={pts.map((p) => p.join(",")).join(" ")}
              fill="none"
              stroke={F.brand}
              strokeWidth="1.8"
              strokeDasharray="4 3"
              opacity="0.8"
            />
            {pts.map(([x, y], i) => (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="3.5"
                fill={months[i].id === cur.id ? F.brand : "#FFFFFF"}
                stroke={F.brand}
                strokeWidth="2"
              />
            ))}
          </>
        )
      })()}
    </svg>
  )
}

// Sparkline SVG
function Sparkline({
  data,
  color,
  up,
}: {
  data: number[]
  color: string
  up: boolean
}) {
  if (data.length < 2) return null
  const W = 64,
    H = 24
  const min = Math.min(...data),
    max = Math.max(...data),
    diff = max - min
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W
    const y = diff === 0 ? H / 2 : H - ((v - min) / diff) * (H - 8) - 4
    return [x, y]
  })
  const d = "M " + pts.map((p) => p.join(" ")).join(" L ")
  const area = `M ${pts[0][0]} ${H} L ${pts.map((p) => p.join(" ")).join(" L ")} L ${pts[pts.length - 1][0]} ${H} Z`
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ flexShrink: 0, display: "block" }}>
      <path d={area} fill={`${color}15`} />
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={pts[pts.length - 1][0]}
        cy={pts[pts.length - 1][1]}
        r="2.5"
        fill={color}
      />
    </svg>
  )
}

function DashboardView({
  emps,
  payruns,
  ss,
  onNav,
}: {
  emps: Employee[]
  ss: SalaryStructure[]
  payruns: Payrun[]
  onNav: (v: string) => void
}) {
  const toast = useToast()
  const months = payruns
    .slice()
    .sort((a, b) => (a.year !== b.year ? a.year - b.year : a.month - b.month))
  const cur = months[months.length - 1] ?? payruns[0]
  const prev = months[months.length - 2]
  const activeCount = emps.filter((e) => e.status === "Active").length
  const onLeave = emps.filter((e) => e.status === "On Leave").length
  const depts = [...new Set(emps.map((e) => e.department))]
  const DEPT_COLORS = [
    "#0070F2",
    "#107E3E",
    "#E9730C",
    "#8A5CF6",
    "#00ACC1",
    "#E91E63",
    "#FF9800",
  ]

  const netChange = prev
    ? ((cur.netPayroll - prev.netPayroll) / prev.netPayroll) * 100
    : 0
  const grossChange = prev
    ? ((cur.grossPayroll - prev.grossPayroll) / prev.grossPayroll) * 100
    : 0

  const totalDed = cur.rows.reduce((s, r) => s + r.totalDeductions, 0)
  const totalPF = cur.rows.reduce((s, r) => s + r.pf, 0)
  const totalTDS = cur.rows.reduce((s, r) => s + r.tds, 0)
  const totalPT = cur.rows.reduce((s, r) => s + r.profTax, 0)
  const totalESI = cur.rows.reduce((s, r) => s + r.esi, 0)
  const avgNetPerEmployee =
    cur.totalEmployees > 0 ? Math.round(cur.netPayroll / cur.totalEmployees) : 0
  const deductionRate =
    cur.grossPayroll > 0 ? Math.round((totalDed / cur.grossPayroll) * 1000) / 10 : 0
  const payrollReadiness = isFinalizedPayrun(cur.status)
    ? 100
    : cur.status === "Approved"
      ? 86
      : cur.status === "Under Review"
        ? 72
        : cur.status === "Calculated"
          ? 58
          : 35
  const verifiedCoverage =
    emps.length > 0 ? Math.round((activeCount / emps.length) * 100) : 0
  const incompleteCount = emps.filter((e) => e.status === "Incomplete").length
  const inactiveCount = emps.filter((e) => e.status === "Inactive").length
  const payrollVariance = prev
    ? cur.netPayroll - prev.netPayroll
    : 0
  const ytdGross = months.reduce((sum, run) => sum + run.grossPayroll, 0)
  const ytdNet = months.reduce((sum, run) => sum + run.netPayroll, 0)
  const ytdDeductions = months.reduce((sum, run) => sum + run.totalDeductions, 0)
  const finalizedRuns = months.filter((run) => isFinalizedPayrun(run.status)).length
  const avgDeductionRate =
    ytdGross > 0 ? Math.round((ytdDeductions / ytdGross) * 1000) / 10 : 0
  const complianceScore = Math.max(
    82,
    Math.min(100, payrollReadiness - incompleteCount * 3 + finalizedRuns * 2),
  )
  const exceptionCount =
    incompleteCount +
    cur.rows.filter((row) => row.lopDays > 0 || row.netSalary <= 0).length

  const empTypeSegs = [
    {
      label: "Full-Time",
      value: emps.filter((e) => e.empType === "Full-Time").length,
      color: F.brand,
    },
    {
      label: "Contract",
      value: emps.filter((e) => e.empType === "Contract").length,
      color: F.warning,
    },
    {
      label: "Part-Time",
      value: emps.filter((e) => e.empType === "Part-Time").length,
      color: "#8A5CF6",
    },
  ].filter((x) => x.value > 0)

  const statusSegs = [
    { label: "Active", value: activeCount, color: F.success },
    { label: "On Leave", value: onLeave, color: F.warning },
    {
      label: "Inactive",
      value: emps.filter((e) => e.status === "Inactive").length,
      color: F.text3,
    },
  ].filter((x) => x.value > 0)

  // Activity feed (recent audit-style events)
  const activityFeed = [
    {
      icon: "payroll",
      label: "Payroll Generated",
      detail: `${cur.period} · ${cur.totalEmployees} employees`,
      time: "Today, 09:14 AM",
      color: F.brand,
      status: "info",
    },
    {
      icon: "approve",
      label: "Payrun Submitted for Review",
      detail: `${cur.period} payroll · By ${cur.generatedBy}`,
      time: "Today, 09:10 AM",
      color: F.warning,
      status: "warning",
    },
    {
      icon: "employee",
      label: "New Employee Onboarded",
      detail: "Rahul Mehta · Engineering · Bangalore",
      time: "Yesterday",
      color: F.success,
      status: "success",
    },
    {
      icon: "tax",
      label: "TDS Challan Generated",
      detail: `Form 24Q · ${inr(cur.rows.reduce((s, r) => s + r.tds, 0))} · Aug 2026`,
      time: "28 Aug",
      color: "#8A5CF6",
      status: "info",
    },
    {
      icon: "pf",
      label: "PF Contribution Filed",
      detail: `EPFO · ${inr(cur.rows.reduce((s, r) => s + r.pf, 0))} · Due 15 Sep`,
      time: "28 Aug",
      color: F.success,
      status: "success",
    },
    {
      icon: "warning",
      label: "Salary Revision Pending",
      detail: "3 employees due for appraisal review",
      time: "25 Aug",
      color: F.warning,
      status: "warning",
    },
  ]

  // Salary bands
  const bands = [
    { l: "<₹50K", min: 0, max: 50000 },
    { l: "₹50K–₹1L", min: 50000, max: 100000 },
    { l: "₹1L–₹2L", min: 100000, max: 200000 },
    { l: ">₹2L", min: 200000, max: Infinity },
  ]
  const bandData = bands.map((b) => ({
    label: b.l,
    count: emps.filter((e) => e.grossSalary >= b.min && e.grossSalary < b.max)
      .length,
  }))

  // Financial year scope
  const now = new Date()
  const fyStartYear = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1

  // Time-based greeting calculation
  const { text: greeting, icon: greetingIcon } = getTimeGreeting()
  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const cardStyle: React.CSSProperties = {
    background: F.card,
    border: `1px solid ${F.border}`,
    borderRadius: 8,
    padding: "20px 22px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
  }

  // Trend dataset across payruns (matches DualBarTrendChart format)
  const trendData = months.map((run) => ({
    period: run.period,
    gross: run.grossPayroll,
    deductions: run.totalDeductions,
    net: run.netPayroll,
    status: run.status,
  }))

  // Donut chart segments for current pay run breakdown (matches AnalyticsDonutChart format)
  const donutSegments = [
    { label: "Take-Home Net", value: cur.netPayroll, color: F.success },
    { label: "Income Tax (TDS)", value: totalTDS, color: F.warning },
    { label: "Provident Fund", value: totalPF, color: F.brand },
    { label: "Professional Tax", value: totalPT, color: "#8B5CF6" },
    ...(totalESI > 0 ? [{ label: "ESI Contribution", value: totalESI, color: "#00ACC1" }] : []),
  ].filter((s) => s.value > 0)

  const takeHomeRatio = cur.grossPayroll > 0 ? Math.round((cur.netPayroll / cur.grossPayroll) * 100) : 83

  const deptRows = depts.map((d, i) => {
    const deptEmps = emps.filter((e) => e.department === d)
    const dRows = cur.rows.filter((r) => r.department === d)
    const net = dRows.reduce((s, r) => s + r.netSalary, 0)
    const pct = cur.netPayroll > 0 ? Math.round((net / cur.netPayroll) * 100) : 0
    return {
      d,
      count: deptEmps.length,
      net,
      pct,
      color: DEPT_COLORS[i % DEPT_COLORS.length],
    }
  })
  const readinessTrend = months.slice(-7).map((run) => ({
    label: run.period.slice(0, 3),
    value: isFinalizedPayrun(run.status)
      ? 100
      : run.status === "Approved"
        ? 86
        : run.status === "Under Review"
          ? 72
          : run.status === "Calculated"
            ? 58
            : 35,
  }))

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* ── Top Header Profile & Status Banner ── */}
      <div
        style={{
          background: F.card,
          border: `1px solid ${F.border}`,
          borderRadius: 8,
          padding: "20px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 20,
          flexWrap: "wrap",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${F.brand}, #0854A0)`,
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              fontWeight: 800,
              boxShadow: "0 2px 8px rgba(0,112,242,0.25)",
              flexShrink: 0,
            }}
          >
            MI
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: F.text2,
                }}
              >
                ORGANIZATION WORKSPACE
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: F.brand,
                  background: F.infoBg,
                  padding: "2px 10px",
                  borderRadius: 12,
                }}
              >
                {todayFormatted}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 18 }}>{greetingIcon}</span>
              <h1
                style={{
                  margin: 0,
                  fontSize: 24,
                  fontWeight: 800,
                  color: F.text1,
                  letterSpacing: "-0.01em",
                }}
              >
                {greeting}, <span style={{ fontWeight: 800 }}>Meena</span>
              </h1>
              <Badge
                label="Active"
                color={F.success}
                bg={F.successBg}
                dot={F.success}
              />
              <Badge
                label={`${complianceScore}% Compliance`}
                color={complianceScore >= 95 ? F.success : F.warning}
                bg={complianceScore >= 95 ? F.successBg : F.warningBg}
              />
            </div>
            <div
              style={{
                marginTop: 4,
                fontSize: 13,
                color: F.text2,
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              <span>Organization Administrator</span>
              <span>&bull;</span>
              <span>Naxrita Solutions Pvt. Ltd.</span>
              <span>&bull;</span>
              <span>Mumbai HQ</span>
              <span>&bull;</span>
              <span style={{ color: F.text3 }}>ID: ORG-ADM-01</span>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              textAlign: "right",
              paddingRight: 12,
              borderRight: `1px solid ${F.border}`,
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: F.text3 }}>
              FINANCIAL YEAR
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: F.text1,
                marginTop: 2,
              }}
            >
              FY {fyStartYear}&ndash;{(fyStartYear + 1).toString().slice(2)}
            </div>
          </div>
          <Btn
            onClick={() => onNav("payruns")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontWeight: 700,
            }}
          >
            <span>Run Payroll</span>
            <span style={{ fontSize: 14 }}>&rarr;</span>
          </Btn>
        </div>
      </div>

      {/* ── KPI Metric Summary Cards Grid (4 Columns) ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        <EmployeeMetricCard
          label="TOTAL EMPLOYEES"
          value={String(emps.length)}
          sub={`${activeCount} active · ${onLeave} on leave · ${inactiveCount} inactive`}
          accent={F.brand}
          badgeText="Workforce"
          badgeBg={F.infoBg}
          badgeColor={F.brand}
          progress={100}
          onClick={() => onNav("employees")}
        />
        <EmployeeMetricCard
          label="GROSS PAYROLL"
          value={inr(cur.grossPayroll)}
          sub={`${grossChange >= 0 ? "+" : ""}${grossChange.toFixed(1)}% vs ${prev?.period.slice(0, 3) ?? "prev"}`}
          accent={F.warning}
          badgeText={grossChange >= 0 ? "Growth" : "Variance"}
          badgeBg={F.warningBg}
          badgeColor={F.warning}
          progress={84}
          onClick={() => onNav("payruns")}
        />
        <EmployeeMetricCard
          label="NET DISBURSAL"
          value={inr(cur.netPayroll)}
          sub={`${takeHomeRatio}% net realization across org`}
          accent={F.success}
          badgeText="Take-Home"
          badgeBg={F.successBg}
          badgeColor={F.success}
          progress={takeHomeRatio}
          onClick={() => onNav("payruns")}
        />
        <EmployeeMetricCard
          label="TOTAL DEDUCTIONS"
          value={inr(totalDed)}
          sub={`PF ${inr(totalPF)} · TDS ${inr(totalTDS)}`}
          accent="#8A5CF6"
          badgeText={`${deductionRate}% Ratio`}
          badgeBg="#F3E8FF"
          badgeColor="#8A5CF6"
          progress={Math.min(100, Math.round(deductionRate * 4))}
          onClick={() => onNav("salary")}
        />
      </div>

      <div
        className="org-dashboard-chart-row"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.35fr) minmax(320px, 0.9fr)",
          gap: 20,
        }}
      >
        <section style={cardStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 12,
              marginBottom: 10,
            }}
          >
            <div>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: F.text1 }}>
                Payroll Readiness Trend
              </h2>
              <p style={{ margin: "4px 0 0", fontSize: 12, color: F.text2 }}>
                Line chart showing payroll approval readiness across recent cycles
              </p>
            </div>
            <Badge
              label={`${payrollReadiness}% ready`}
              color={payrollReadiness >= 85 ? F.success : F.warning}
              bg={payrollReadiness >= 85 ? F.successBg : F.warningBg}
            />
          </div>
          <ProductAdminLineChart data={readinessTrend} suffix="%" color={F.brand} />
        </section>

        <section style={cardStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 12,
              marginBottom: 14,
            }}
          >
            <div>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: F.text1 }}>
                Employee Status Mix
              </h2>
              <p style={{ margin: "4px 0 0", fontSize: 12, color: F.text2 }}>
                Donut chart by active, leave, and inactive workforce status
              </p>
            </div>
            <Badge label={`${emps.length} employees`} color={F.brand} bg={F.infoBg} />
          </div>
          <AnalyticsDonutChart
            segments={statusSegs}
            size={150}
            strokeWidth={24}
            centerLabel="Employees"
            valueFormatter={(value) => String(value)}
          />
        </section>
      </div>

      {/* ── Main Analytics Section: Dual Bar Trend + Donut Breakdown ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.45fr) minmax(320px, 0.95fr)",
          gap: 20,
        }}
      >
        {/* Left Card: Monthly Trend Bar Graph */}
        <section style={cardStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 16,
              gap: 12,
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 800,
                  color: F.text1,
                }}
              >
                Earnings & Net Pay Trend
              </h2>
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: 12,
                  color: F.text2,
                }}
              >
                Monthly Gross salary vs Net Take-Home disbursement over recent pay cycles
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  fontSize: 11,
                  color: F.text3,
                  fontWeight: 600,
                  background: F.pageBg,
                  padding: "3px 8px",
                  borderRadius: 4,
                }}
              >
                Last 12 Months
              </div>
              <Btn small variant="ghost" onClick={() => onNav("payruns")}>
                View Payruns &rarr;
              </Btn>
            </div>
          </div>
          <DualBarTrendChart data={trendData} />
        </section>

        {/* Right Card: Donut / Pie Chart Breakdown */}
        <section style={cardStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 14,
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 800,
                  color: F.text1,
                }}
              >
                Period Breakdown
              </h2>
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: 12,
                  color: F.text2,
                }}
              >
                {cur.period} organization salary composition
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: F.brand,
                  background: F.infoBg,
                  padding: "2px 8px",
                  borderRadius: 4,
                }}
              >
                {cur.period}
              </span>
              <Btn small variant="ghost" onClick={() => onNav("reports")}>
                View Reports &rarr;
              </Btn>
            </div>
          </div>
          <AnalyticsDonutChart segments={donutSegments} />
        </section>
      </div>

      {/* ── Lower Section: Current Pay Run Status + Department Payroll Ledger ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.4fr) minmax(320px, 1fr)",
          gap: 20,
        }}
      >
        {/* Left: Current Pay Run Lifecycle Card */}
        <section style={cardStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 800,
                  color: F.text1,
                }}
              >
                Current Pay Run Lifecycle
              </h2>
              <p
                style={{
                  margin: "3px 0 0",
                  fontSize: 12,
                  color: F.text2,
                }}
              >
                {cur.period} pay run process and disbursement status
              </p>
            </div>
            <Btn small variant="secondary" onClick={() => onNav("payruns")}>
              View All Payruns
            </Btn>
          </div>

          <Stepper current={cur.status} />

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }}>
            {[
              ["Gross Payroll", cur.grossPayroll, F.warning, "Total organization salary expense"],
              ["Total Deductions", cur.totalDeductions, F.error, "Statutory EPF, TDS & Tax liabilities"],
              ["Net Payout", cur.netPayroll, F.success, "Direct employee bank transfers"],
            ].map(([l, v, c, desc]) => (
              <div
                key={l as string}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 14px",
                  background: F.pageBg,
                  borderRadius: 6,
                  border: `1px solid ${F.border}`,
                  borderLeft: `3px solid ${c as string}`,
                }}
              >
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: F.text1 }}>
                    {l as string}
                  </div>
                  <div style={{ fontSize: 11, color: F.text3, marginTop: 1 }}>{desc as string}</div>
                </div>
                <span style={{ fontSize: 14, fontWeight: 800, color: F.text1 }}>
                  {inr(v as number)}
                </span>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 14,
              paddingTop: 12,
              borderTop: `1px solid ${F.border}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <div style={{ fontSize: 12, color: F.text3 }}>
              Prepared by <strong style={{ color: F.text1 }}>{cur.generatedBy}</strong> · Due 31 Aug 2026
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn small onClick={() => onNav("payruns")}>
                Review Pay Run &rarr;
              </Btn>
              <Btn
                small
                variant="secondary"
                onClick={() => toast("Pay run summary exported", "success")}
              >
                Export
              </Btn>
            </div>
          </div>
        </section>

        {/* Right: Payroll by Department */}
        <section style={cardStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 800,
                  color: F.text1,
                }}
              >
                Payroll by Department
              </h2>
              <p
                style={{
                  margin: "3px 0 0",
                  fontSize: 12,
                  color: F.text2,
                }}
              >
                Departmental net pay allocation for {cur.period}
              </p>
            </div>
            <Btn small variant="secondary" onClick={() => onNav("employees")}>
              Manage Staff
            </Btn>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {deptRows.map((x) => (
              <div key={x.d}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 4,
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 2,
                        background: x.color,
                        display: "inline-block",
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontSize: 12, fontWeight: 600, color: F.text1 }}>
                      {x.d}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: F.text3 }}>{x.count} emp</span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: F.text1,
                        background: F.pageBg,
                        padding: "1px 6px",
                        borderRadius: 4,
                      }}
                    >
                      {x.pct}%
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: x.color,
                        width: 76,
                        textAlign: "right",
                      }}
                    >
                      {inr(x.net)}
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    height: 5,
                    borderRadius: 3,
                    background: F.border,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${x.pct}%`,
                      height: "100%",
                      borderRadius: 3,
                      background: `linear-gradient(90deg, ${x.color}88, ${x.color})`,
                      transition: "width 0.4s ease",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

function EmployeeDetailPage({
  emp,
  ss,
  emps,
  setEmps,
  onBack,
}: {
  emp: Employee
  ss: SalaryStructure[]
  emps: Employee[]
  setEmps: React.Dispatch<React.SetStateAction<Employee[]>>
  onBack: () => void
}) {
  const toast = useToast()
  const [editing, setEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [employeeDocs, setEmployeeDocs] = useState([
    { name: "Employment agreement", category: "Employment", updated: "12 Jan 2025", status: "Verified" },
    { name: "PAN card", category: "Identity", updated: "12 Jan 2025", status: "Verified" },
    { name: "Bank account proof", category: "Payroll", updated: "18 Jan 2025", status: "Pending review" },
  ])
  const [payroll, setPayroll] = useState(() => {
    const structure = ss.find((item) => item.name === emp.salaryStructure)
    return {
      salaryStructure: emp.salaryStructure,
      basic: structure?.basic ?? Math.round(emp.grossSalary * 0.5),
      hra: structure?.hra ?? Math.round(emp.grossSalary * 0.2),
      fixedAllowance: structure?.fixedAllowance ?? Math.round(emp.grossSalary * 0.15),
      specialAllowance: structure?.specialAllowance ?? Math.round(emp.grossSalary * 0.15),
      pfRate: 12,
      tdsRate: 10,
      professionalTax: emp.grossSalary > 15000 ? 200 : 150,
      paymentMethod: "Bank transfer",
      bankAccount: "4821",
      ifsc: "HDFC0001234",
    }
  })
  const [editingPayroll, setEditingPayroll] = useState(false)
  const [annualCtc, setAnnualCtc] = useState(emp.grossSalary * 12)
  const [extraEarnings, setExtraEarnings] = useState<{ id: number; name: string; calculation: string; amount: number }[]>([])
  const [calculationType, setCalculationType] = useState({ basic: "% of CTC", hra: "% of Basic", fixedAllowance: "Fixed amount", specialAllowance: "Fixed amount" })
  const [editingPayslips, setEditingPayslips] = useState(false)
  const [payslipRows, setPayslipRows] = useState(() => ["August 2026", "July 2026", "June 2026", "May 2026"].map((period, index) => ({ period, gross: emp.grossSalary, deductions: Math.round(emp.grossSalary * 0.22) + (emp.grossSalary > 15000 ? 200 : 150), status: index === 0 ? "Available" : "Paid" })))
  const [editingDocuments, setEditingDocuments] = useState(false)
  const [editingLeave, setEditingLeave] = useState(false)
  const [leaveBalances, setLeaveBalances] = useState({ annualEntitlement: 20, annualUsed: 6, sickEntitlement: 12, sickUsed: 2, attendance: 96 })
  const [investments, setInvestments] = useState([
    { type: "Section 80C", description: "Provident Fund contribution", declared: 18000, approved: 18000, status: "Verified" },
    { type: "House Rent Allowance", description: "Rent declaration", declared: 120000, approved: 0, status: "Pending" },
  ])
  const [editingInvestments, setEditingInvestments] = useState(false)
  const [loanRows, setLoanRows] = useState([{ type: "Salary advance", principal: 0, outstanding: 0, installment: 0, status: "No active loan" }])
  const [editingLoans, setEditingLoans] = useState(false)
  const [editingStatutory, setEditingStatutory] = useState(false)
  const [editingPersonal, setEditingPersonal] = useState(false)
  const [personalInfo, setPersonalInfo] = useState({ dateOfBirth: "03/11/2002", fatherName: "Rajinikanth", pan: "AAAAA0000A", personalEmail: emp.email, address: "Panvel, Maharashtra - 410206", differentlyAbled: "None" })
  const [draft, setDraft] = useState<Employee>({ ...emp })
  const [confirm, setConfirm] = useState<{
    msg: string
    onOk: () => void
  } | null>(null)
  const s = ss.find((x) => x.name === payroll.salaryStructure)
  const extraEarningsTotal = extraEarnings.reduce((sum, item) => sum + item.amount, 0)
  const gross = payroll.basic + payroll.hra + payroll.fixedAllowance + payroll.specialAllowance + extraEarningsTotal
  const pf = Math.round(payroll.basic * (payroll.pfRate / 100))
  const tds = Math.round(gross * (payroll.tdsRate / 100))
  const pt = payroll.professionalTax
  const net = gross - pf - tds - pt

  const savePayroll = () => {
    setEmps(emps.map((item) => item.id === emp.id ? { ...item, salaryStructure: payroll.salaryStructure, grossSalary: gross } : item))
    setEditingPayroll(false)
    toast("Compensation and payroll settings saved", "success")
  }

  const save = () => {
    const updated = {
      ...draft,
      grossSalary:
        ss.find((x) => x.name === draft.salaryStructure)?.gross ??
        draft.grossSalary,
    }
    setEmps(emps.map((e) => (e.id === emp.id ? updated : e)))
    setEditing(false)
    toast("Employee details saved", "success")
  }

  const toggleStatus = () => {
    const next: EmpStatus = emp.status === "Active" ? "Inactive" : "Active"
    setConfirm({
      msg: `Set ${emp.name} to ${next}?`,
      onOk: () => {
        setEmps(emps.map((e) => (e.id === emp.id ? { ...e, status: next } : e)))
        toast(`Status updated to ${next}`, "success")
        setConfirm(null)
      },
    })
  }

  const initials = emp.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)

  return (
    <div>
      {/* Breadcrumb */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 20,
          fontSize: 13,
          color: F.text2,
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: F.brand,
            fontWeight: 600,
            fontSize: 13,
            fontFamily: "inherit",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Employees
        </button>
        <span style={{ color: F.border }}>/</span>
        <span style={{ color: F.text1, fontWeight: 600 }}>{emp.name}</span>
      </div>

      {/* Hero card */}
      <div
        style={{
          background: F.pageBg,
          border: "none",
          borderRadius: 0,
          marginBottom: 0,
          overflow: "visible",
        }}
      >
        <div
          style={{
            background: F.pageBg,
            padding: "8px 2px 22px",
            display: "flex",
            alignItems: "flex-start",
            gap: 20,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "#FCE5D5",
              color: "#A13D13",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 800,
              flexShrink: 0,
              border: "3px solid #FFFFFF",
            }}
          >
            {initials}
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: F.text1,
                marginBottom: 4,
              }}
            >
              {emp.id} - {emp.name}
            </div>
            <div
              style={{
                fontSize: 13,
                color: "#667085",
                marginBottom: 10,
              }}
            >
              {emp.designation}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {empBadge(emp.status)}
              <Badge
                label={emp.empType}
                color={F.brand}
                bg={F.infoBg}
              />
              <Badge
                label={emp.location}
                color={F.text2}
                bg="#FFFFFF"
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            {!editing ? (
              <>
                <Btn
                  onClick={() => {
                    if (activeTab === "salary") setEditingPayroll(true)
                    else {
                      setDraft({ ...emp })
                      setEditing(true)
                    }
                  }}
                >
                  {activeTab === "salary" ? "Edit Salary" : "Edit Details"}
                </Btn>
                <Btn
                  variant={emp.status === "Active" ? "danger" : "success"}
                  onClick={toggleStatus}
                >
                  {emp.status === "Active" ? "Deactivate" : "Activate"}
                </Btn>
              </>
            ) : (
              <>
                <Btn variant="secondary" onClick={() => setEditing(false)}>
                  Cancel
                </Btn>
                <Btn variant="success" onClick={save}>
                  Save Changes
                </Btn>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Employee workspace navigation — every operational record stays in this employee context. */}
      <div
        style={{
          display: "flex",
          gap: 4,
          overflowX: "auto",
          borderBottom: `1px solid ${F.border}`,
          marginBottom: 18,
          background: "transparent",
          padding: "0",
          borderRadius: 0,
        }}
      >
        {[
          ["overview", "Overview"],
          ["salary", "Salary Details"],
          ["investments", "Investments"],
          ["payslips", "Payslips & Forms"],
          ["loans", "Loans"],
        ].map(([id, label]) => {
          const active = activeTab === id
          return (
            <button
              key={id}
              onClick={() => {
                setActiveTab(id)
                setEditing(false)
                if (id === "salary") setEditingPayroll(true)
              }}
              style={{
                border: "none",
                borderBottom: active ? `3px solid ${F.brand}` : "3px solid transparent",
                background: "transparent",
                padding: "14px 14px 11px",
                whiteSpace: "nowrap",
                color: active ? F.brand : F.text2,
                fontWeight: active ? 800 : 600,
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {label}
            </button>
          )
        })}
      </div>

      <div style={{ background: "#FFF6DF", borderTop: "1px solid #F8E5B6", borderBottom: "1px solid #F8E5B6", padding: "14px 16px", margin: "0 -26px 22px", color: "#553311" }}>
        <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 6 }}>● &nbsp; Need Your Attention</div>
        <div style={{ fontSize: 13 }}>• &nbsp; An invite has been sent to this employee to access the Employee Self Service Portal. However, the employee is yet to accept it. <button onClick={() => toast("Invitation resent", "success")} style={{ border: "none", background: "transparent", color: F.brand, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Reinvite</button><span style={{ color: F.border, margin: "0 10px" }}>|</span><button onClick={() => toast("Portal access disabled", "success")} style={{ border: "none", background: "transparent", color: F.brand, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Disable Portal</button></div>
      </div>

      {/* Two-column detail grid */}
      {activeTab === "overview" && <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
        {/* Personal & Employment */}
        <div
          style={{
            background: F.card,
            border: `1px solid ${F.border}`,
            borderRadius: 10,
          }}
        >
          <div
            style={{
              padding: "14px 20px",
              borderBottom: `1px solid ${F.border}`,
              fontSize: 13,
              fontWeight: 700,
              color: F.text1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>Basic Information</span>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {editing && <Btn small variant="success" onClick={save}>Save</Btn>}
              <button aria-label="Edit basic information" onClick={() => { setDraft({ ...emp }); setEditing(true) }} style={{ border: "none", background: "transparent", color: F.brand, cursor: "pointer", fontSize: 17 }}>✎</button>
            </span>
          </div>
          <div
            className="employee-information-grid"
            style={{
              padding: "16px 20px",
              display: editing ? "flex" : "grid",
              gridTemplateColumns: editing ? undefined : "minmax(0, 1fr) minmax(0, 1fr)",
              flexDirection: "column",
              columnGap: editing ? undefined : 72,
              rowGap: 0,
            }}
          >
            {editing ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                }}
              >
                <Fld label="Full Name">
                  <input
                    style={iSt}
                    value={draft.name}
                    onChange={(e) =>
                      setDraft({ ...draft, name: e.target.value })
                    }
                  />
                </Fld>
                <Fld label="Email">
                  <input
                    style={iSt}
                    value={draft.email}
                    onChange={(e) =>
                      setDraft({ ...draft, email: e.target.value })
                    }
                  />
                </Fld>
                <Fld label="Department">
                  <select
                    style={iSt}
                    value={draft.department}
                    onChange={(e) =>
                      setDraft({ ...draft, department: e.target.value })
                    }
                  >
                    {[
                      "Engineering",
                      "HR",
                      "Finance",
                      "Sales",
                      "Design",
                      "Management",
                      "Operations",
                    ].map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </Fld>
                <Fld label="Designation">
                  <input
                    style={iSt}
                    value={draft.designation}
                    onChange={(e) =>
                      setDraft({ ...draft, designation: e.target.value })
                    }
                  />
                </Fld>
                <Fld label="Work Location">
                  <input
                    style={iSt}
                    value={draft.location}
                    onChange={(e) =>
                      setDraft({ ...draft, location: e.target.value })
                    }
                  />
                </Fld>
                <Fld label="Employment Type">
                  <select
                    style={iSt}
                    value={draft.empType}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        empType: e.target.value as Employee["empType"],
                      })
                    }
                  >
                    <option>Full-Time</option>
                    <option>Part-Time</option>
                    <option>Contract</option>
                  </select>
                </Fld>
                <Fld label="Reporting Manager">
                  <select
                    style={iSt}
                    value={draft.manager}
                    onChange={(e) =>
                      setDraft({ ...draft, manager: e.target.value })
                    }
                  >
                    <option value="">— none —</option>
                    {emps
                      .filter((x) => x.id !== emp.id)
                      .map((x) => (
                        <option key={x.id}>{x.name}</option>
                      ))}
                  </select>
                </Fld>
                <Fld label="Status">
                  <select
                    style={iSt}
                    value={draft.status}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        status: e.target.value as EmpStatus,
                      })
                    }
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>On Leave</option>
                  </select>
                </Fld>
              </div>
            ) : (
              [
                ["Name", emp.name],
                ["Email Address", emp.email],
                ["Mobile Number", emp.mobile || "08668229742"],
                ["Date of Joining", fmtD(emp.doj)],
                ["Department", emp.department],
                ["Designation", emp.designation],
                ["Reporting Manager", emp.manager || "—"],
                ["Work Location", emp.location],
                ["Employment Type", emp.empType],
                ["Portal Access", "Invite Sent · Reinvite · Disable"],
              ].map(([l, v]) => (
                <div
                  key={l}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 0",
                    borderBottom: `1px solid ${F.border}`,
                    width: "100%",
                    minWidth: 0,
                  }}
                >
                  <span style={{ fontSize: 12, color: F.text2 }}>{l}</span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: F.text1,
                      textAlign: "right",
                      maxWidth: "65%",
                      minWidth: 0,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {v}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Salary Details */}
        <div style={{ display: "none", flexDirection: "column", gap: 14 }}>
          <div
            style={{
              background: F.card,
              border: `1px solid ${F.border}`,
              borderRadius: 10,
            }}
          >
            <div
              style={{
                padding: "14px 20px",
                borderBottom: `1px solid ${F.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 700, color: F.text1 }}>
                Salary Structure
              </span>
              {editing && (
                <select
                  style={{ ...iSt, width: 200 }}
                  value={draft.salaryStructure}
                  onChange={(e) =>
                    setDraft({ ...draft, salaryStructure: e.target.value })
                  }
                >
                  {ss.map((x) => (
                    <option key={x.id}>{x.name}</option>
                  ))}
                </select>
              )}
              {!editing && (
                <span style={{ fontSize: 12, fontWeight: 600, color: F.brand }}>
                  {emp.salaryStructure}
                </span>
              )}
            </div>
            {s && (
              <div style={{ padding: "12px 20px" }}>
                {([
                  ["Basic", s.basic, F.brand],
                  ["HRA", s.hra, F.success],
                  ["Fixed Allowance", s.fixedAllowance, F.warning],
                  ["Special Allowance", s.specialAllowance, "#8A5CF6"],
                ] as [string, number, string][]).map(([l, v, c]) => (
                  <div
                    key={l}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "9px 0",
                      borderBottom: `1px solid ${F.border}`,
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 12,
                        color: F.text2,
                      }}
                    >
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 2,
                          background: c,
                          display: "inline-block",
                          flexShrink: 0,
                        }}
                      />
                      {l}
                    </span>
                    <span
                      style={{ fontWeight: 700, color: F.text1, fontSize: 13 }}
                    >
                      {inr(v)}
                    </span>
                  </div>
                ))}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 0",
                    fontSize: 14,
                    fontWeight: 800,
                    color: F.success,
                  }}
                >
                  <span>Monthly Gross</span>
                  <span>{inr(s.gross)}</span>
                </div>
              </div>
            )}
          </div>

          <div
            style={{
              background: F.card,
              border: `1px solid ${F.border}`,
              borderRadius: 10,
            }}
          >
            <div
              style={{
                padding: "14px 20px",
                borderBottom: `1px solid ${F.border}`,
                fontSize: 13,
                fontWeight: 700,
                color: F.text1,
              }}
            >
              Deductions (Monthly)
            </div>
            <div style={{ padding: "12px 20px" }}>
              {([
                ["Provident Fund (12% Basic)", pf, "#8A5CF6"],
                ["TDS / Income Tax (10%)", tds, F.error],
                ["Professional Tax", pt, F.warning],
              ] as [string, number, string][]).map(([l, v, c]) => (
                <div
                  key={l}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "9px 0",
                    borderBottom: `1px solid ${F.border}`,
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 12,
                      color: F.text2,
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 2,
                        background: c,
                        display: "inline-block",
                        flexShrink: 0,
                      }}
                    />
                    {l}
                  </span>
                  <span style={{ fontWeight: 700, color: c, fontSize: 13 }}>
                    {inr(v)}
                  </span>
                </div>
              ))}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 0",
                  fontSize: 13,
                  fontWeight: 800,
                  color: F.success,
                }}
              >
                <span>Net Take-Home</span>
                <span>{inr(net)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>}

      {activeTab === "overview" && <>
        <div style={{ background: F.card, border: `1px solid ${F.border}`, borderRadius: 10, padding: "20px 22px", marginTop: 14 }}>
          <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 18, display: "flex", justifyContent: "space-between" }}><span>Statutory Information</span><span>{editingStatutory && <Btn small variant="success" onClick={() => { setEditingStatutory(false); toast("Statutory information saved", "success") }}>Save</Btn>} <button aria-label="Edit statutory information" onClick={() => setEditingStatutory(!editingStatutory)} style={{ border: "none", background: "transparent", color: F.brand, cursor: "pointer", fontSize: 17 }}>✎</button></span></div>
          <div className="employee-information-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", columnGap: 72, rowGap: 16 }}>
            {[ ["EPF rate (%)", "pfRate"], ["TDS rate (%)", "tdsRate"], ["Professional Tax", "professionalTax"], ["Payment Method", "paymentMethod"], ["Account Ending", "bankAccount"], ["IFSC Code", "ifsc"] ].map(([label, field]) => <div key={label} style={{ display: "grid", gridTemplateColumns: "235px 1fr", fontSize: 13, alignItems: "center" }}><span style={{ color: F.text2 }}>{label}</span>{editingStatutory ? (field === "paymentMethod" ? <select style={iSt} value={payroll.paymentMethod} onChange={(e) => setPayroll({ ...payroll, paymentMethod: e.target.value })}><option>Bank transfer</option><option>Cheque</option><option>Cash</option></select> : <input type={field === "ifsc" || field === "bankAccount" ? "text" : "number"} style={iSt} value={payroll[field as "pfRate" | "tdsRate" | "professionalTax" | "bankAccount" | "ifsc"]} onChange={(e) => setPayroll({ ...payroll, [field]: field === "ifsc" || field === "bankAccount" ? e.target.value : Number(e.target.value) })} />) : <strong>{String(payroll[field as "pfRate" | "tdsRate" | "professionalTax" | "paymentMethod" | "bankAccount" | "ifsc"])}</strong>}</div>)}
          </div>
        </div>
        <div style={{ background: F.card, border: `1px solid ${F.border}`, borderRadius: 10, padding: "20px 22px", marginTop: 14 }}>
          <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 18, display: "flex", justifyContent: "space-between" }}><span>Personal Information</span><span>{editingPersonal && <Btn small variant="success" onClick={() => { setEditingPersonal(false); toast("Personal information saved", "success") }}>Save</Btn>} <button aria-label="Edit personal information" onClick={() => setEditingPersonal(!editingPersonal)} style={{ border: "none", background: "transparent", color: F.brand, cursor: "pointer", fontSize: 17 }}>✎</button></span></div>
          <div className="employee-information-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", columnGap: 72, rowGap: 16 }}>
            {[ ["Date of Birth", "dateOfBirth"], ["Personal Email", "personalEmail"], ["Father's Name", "fatherName"], ["Residential Address", "address"], ["PAN", "pan"], ["Differently Abled Type", "differentlyAbled"] ].map(([label, field]) => <div key={label} style={{ display: "grid", gridTemplateColumns: "235px 1fr", fontSize: 13, alignItems: "center" }}><span style={{ color: F.text2 }}>{label}</span>{editingPersonal ? <input style={iSt} maxLength={field === "dateOfBirth" ? 10 : undefined} value={personalInfo[field as keyof typeof personalInfo]} onChange={(e) => setPersonalInfo({ ...personalInfo, [field]: field === "dateOfBirth" ? limitDateYear(e.target.value) : e.target.value })} /> : <strong>{personalInfo[field as keyof typeof personalInfo]}</strong>}</div>)}
          </div>
        </div>
      </>}

      {activeTab === "salary" && (
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.35fr) minmax(280px, 0.65fr)", gap: 14 }}>
          <div style={{ gridColumn: "1 / -1", background: F.card, border: `1px solid ${F.border}`, borderRadius: 8, overflow: "hidden" }}>
              <div style={{ padding: "18px 20px", fontSize: 22, fontWeight: 500, borderBottom: `1px solid ${F.border}`, display: "flex", justifyContent: "space-between" }}><span>{emp.name.split(" ")[0]}'s salary details</span><button aria-label="Edit salary details" onClick={() => setEditingPayroll(true)} style={{ border: "none", background: "transparent", color: F.brand, cursor: "pointer", fontSize: 18 }}>✎</button></div>
            <div style={{ padding: "18px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 22 }}><strong>Annual CTC <span style={{ color: F.error }}>*</span></strong>{editingPayroll ? <input type="number" aria-label="Annual CTC" style={{ ...iSt, width: 310, fontSize: 16 }} value={annualCtc} onChange={(e) => setAnnualCtc(Number(e.target.value))} /> : <strong style={{ fontSize: 17 }}>{inr(annualCtc)} <span style={{ fontSize: 12, color: F.text3, fontWeight: 500 }}>per year</span></strong>}</div>
              <table style={{ width: "100%", borderCollapse: "collapse", border: `1px solid ${F.border}` }}><thead><tr><Th>Salary components</Th><Th>Calculation type</Th><Th right>Monthly amount</Th><Th right>Annual amount</Th></tr></thead><tbody><TrH><Td colSpan={4} style={{ fontWeight: 800, padding: "16px" }}>Earnings</Td></TrH>{([["Basic", "basic"], ["House Rent Allowance", "hra"], ["Fixed Allowance", "fixedAllowance"], ["Special Allowance", "specialAllowance"]] as [string, "basic" | "hra" | "fixedAllowance" | "specialAllowance"][]).map(([label, field]) => { const monthlyCtcBase = annualCtc / 12; const percentage = field === "basic" ? Math.round((payroll.basic / monthlyCtcBase) * 100) : field === "hra" ? Math.round((payroll.hra / payroll.basic) * 100) : 0; return <TrH key={field}><Td>{label}</Td><Td>{editingPayroll ? <div style={{ display: "flex", maxWidth: 260 }}><select aria-label={`${label} calculation type`} style={{ ...iSt, borderRadius: "6px 0 0 6px", minWidth: 130 }} value={calculationType[field]} onChange={(e) => setCalculationType({ ...calculationType, [field]: e.target.value })}><option>Fixed amount</option><option>% of CTC</option><option>% of Basic</option></select>{calculationType[field] !== "Fixed amount" && <input aria-label={`${label} percentage`} type="number" min="0" max="100" style={{ ...iSt, width: 75, borderRadius: "0 6px 6px 0", marginLeft: -1 }} value={percentage} onChange={(e) => { const pct = Number(e.target.value); if (field === "basic") setPayroll({ ...payroll, basic: Math.round(monthlyCtcBase * pct / 100) }); if (field === "hra") setPayroll({ ...payroll, hra: Math.round(payroll.basic * pct / 100) }) }} />}</div> : calculationType[field] === "Fixed amount" ? "Fixed amount" : `${percentage}% ${calculationType[field] === "% of CTC" ? "of CTC" : "of Basic"}`}</Td><Td right>{editingPayroll ? <input type="number" style={{ ...iSt, width: 150 }} value={payroll[field]} onChange={(e) => setPayroll({ ...payroll, [field]: Number(e.target.value) })} /> : inr(payroll[field])}</Td><Td right>{inr(payroll[field] * 12)}</Td></TrH>})}<TrH><Td colSpan={2} style={{ fontWeight: 800, background: "#EAF3FF", padding: "16px" }}>Cost to Company</Td><Td right style={{ fontWeight: 800, background: "#EAF3FF" }}>{inr(gross)}</Td><Td right style={{ fontWeight: 800, background: "#EAF3FF" }}>{inr(gross * 12)}</Td></TrH></tbody></table>
              <button onClick={() => { setExtraEarnings([...extraEarnings, { id: Date.now(), name: "New Earning", calculation: "Fixed amount", amount: 0 }]); toast("New earning added", "success") }} style={{ marginTop: 14, border: "none", background: "transparent", color: F.brand, cursor: "pointer", fontWeight: 700, fontFamily: "inherit", fontSize: 14 }}>＋ Add Earning</button>
              {extraEarnings.map((earning) => <div key={earning.id} style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr 0.7fr auto", gap: 12, alignItems: "end", marginTop: 12, padding: 12, border: `1px solid ${F.brand}40`, borderRadius: 7, background: F.infoBg }}><Fld label="Earning name"><input style={iSt} value={earning.name} onChange={(e) => setExtraEarnings(extraEarnings.map((item) => item.id === earning.id ? { ...item, name: e.target.value } : item))} /></Fld><Fld label="Calculation type"><select style={iSt} value={earning.calculation} onChange={(e) => setExtraEarnings(extraEarnings.map((item) => item.id === earning.id ? { ...item, calculation: e.target.value } : item))}><option>Fixed amount</option><option>% of CTC</option><option>% of Basic</option></select></Fld><Fld label="Monthly amount"><input type="number" min="0" style={iSt} value={earning.amount} onChange={(e) => setExtraEarnings(extraEarnings.map((item) => item.id === earning.id ? { ...item, amount: Number(e.target.value) } : item))} /></Fld><Btn small variant="secondary" onClick={() => setExtraEarnings(extraEarnings.filter((item) => item.id !== earning.id))}>Remove</Btn></div>)}
              <div style={{ borderTop: `1px solid ${F.border}`, marginTop: 22, paddingTop: 20 }}>
                <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 22 }}>Benefits</div>
                <div style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr 0.7fr 0.7fr", gap: 14, alignItems: "start" }}>
                  <div><strong>EPF - Employer Contribution</strong><div style={{ marginTop: 12, paddingLeft: 14, borderLeft: `2px solid ${F.border}`, fontSize: 13 }}><strong>Employee Contribution</strong><div style={{ color: "#667085", marginTop: 5 }}>{payroll.pfRate}% of Actual PF Wage</div><label style={{ display: "block", marginTop: 10 }}><input type="checkbox" defaultChecked /> Contribute to Employee Pension Scheme</label><label style={{ display: "block", marginTop: 7 }}><input type="checkbox" defaultChecked /> Contribute EPS at actual PF Wages</label></div></div>
                  <div style={{ paddingTop: 34 }}>{editingPayroll ? <input type="number" style={{ ...iSt, width: 130 }} value={payroll.pfRate} onChange={(e) => setPayroll({ ...payroll, pfRate: Number(e.target.value) })} /> : `${payroll.pfRate.toFixed(2)}% of PF Wages`}</div><div style={{ paddingTop: 34, textAlign: "right" }}>{inr(pf)}</div><div style={{ paddingTop: 34, textAlign: "right" }}>{inr(pf * 12)}</div>
                </div>
              </div>
              <div style={{ color: F.text2, fontSize: 12, marginTop: 15 }}>Note: Any changes made to salary components take effect in the current pay run, provided it is not approved.</div>
              <div style={{ display: "flex", gap: 8, marginTop: 20 }}><Btn onClick={savePayroll}>Save</Btn><Btn variant="secondary" onClick={() => setEditingPayroll(false)}>Cancel</Btn></div>
            </div>
          </div>
          <div style={{ display: "none", background: F.card, border: `1px solid ${F.border}`, borderRadius: 10, overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${F.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><div style={{ fontWeight: 800 }}>Salary structure & benefits</div><div style={{ fontSize: 12, color: F.text2, marginTop: 3 }}>Manage compensation assigned to {emp.name}.</div></div>
              <div style={{ display: "flex", gap: 8 }}>{editingPayroll && <Btn small variant="secondary" onClick={() => setEditingPayroll(false)}>Cancel</Btn>}<Btn small variant={editingPayroll ? "success" : "secondary"} onClick={() => editingPayroll ? savePayroll() : setEditingPayroll(true)}>{editingPayroll ? "Save payroll" : "Edit payroll"}</Btn></div>
            </div>
            <div style={{ padding: 20 }}>
              {editingPayroll ? <Fld label="Salary Structure"><select style={iSt} value={payroll.salaryStructure} onChange={(e) => setPayroll({ ...payroll, salaryStructure: e.target.value })}>{ss.map((item) => <option key={item.id}>{item.name}</option>)}</select></Fld> : <IR label="Assigned Salary Structure" value={payroll.salaryStructure} />}
              <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {([
                  ["Basic pay", "basic", F.brand], ["House rent allowance", "hra", F.success],
                  ["Fixed allowance", "fixedAllowance", F.warning], ["Special allowance", "specialAllowance", "#8A5CF6"],
                ] as [string, "basic" | "hra" | "fixedAllowance" | "specialAllowance", string][]).map(([label, field, color]) => <div key={label} style={{ padding: 14, border: `1px solid ${F.border}`, borderRadius: 8, borderLeft: `4px solid ${color}` }}><div style={{ color: F.text2, fontSize: 12 }}>{label}</div>{editingPayroll ? <input type="number" min="0" style={{ ...iSt, marginTop: 7, fontWeight: 800 }} value={payroll[field]} onChange={(e) => setPayroll({ ...payroll, [field]: Number(e.target.value) })} /> : <div style={{ marginTop: 5, fontWeight: 800, fontSize: 17 }}>{inr(payroll[field])}</div>}<div style={{ color: F.text3, fontSize: 11, marginTop: 5 }}>Monthly</div></div>)}
              </div>
            </div>
          </div>
          <div style={{ display: "none", background: F.card, border: `1px solid ${F.border}`, borderRadius: 10, padding: 20 }}>
            <div style={{ fontWeight: 800, marginBottom: 14 }}>Statutory & payment details</div>
            {editingPayroll ? <div style={{ display: "flex", flexDirection: "column", gap: 10 }}><Fld label="EPF rate (%)"><input type="number" min="0" max="100" value={payroll.pfRate} onChange={(e) => setPayroll({ ...payroll, pfRate: Number(e.target.value) })} style={iSt} /></Fld><Fld label="TDS rate (%)"><input type="number" min="0" max="100" value={payroll.tdsRate} onChange={(e) => setPayroll({ ...payroll, tdsRate: Number(e.target.value) })} style={iSt} /></Fld><Fld label="Professional tax"><input type="number" min="0" value={payroll.professionalTax} onChange={(e) => setPayroll({ ...payroll, professionalTax: Number(e.target.value) })} style={iSt} /></Fld><Fld label="Payment method"><select value={payroll.paymentMethod} onChange={(e) => setPayroll({ ...payroll, paymentMethod: e.target.value })} style={iSt}><option>Bank transfer</option><option>Cheque</option><option>Cash</option></select></Fld><Fld label="Account ending"><input value={payroll.bankAccount} onChange={(e) => setPayroll({ ...payroll, bankAccount: e.target.value })} style={iSt} /></Fld><Fld label="IFSC code"><input value={payroll.ifsc} onChange={(e) => setPayroll({ ...payroll, ifsc: e.target.value.toUpperCase() })} style={iSt} /></Fld></div> : <><IR label="EPF contribution" value={`${inr(pf)} / month (${payroll.pfRate}%)`} /><IR label="Professional tax" value={`${inr(pt)} / month`} /><IR label="Income tax (estimated)" value={`${inr(tds)} / month (${payroll.tdsRate}%)`} /><IR label="Payment method" value={payroll.paymentMethod} /><IR label="Bank account" value={`•••• •••• ${payroll.bankAccount}`} /><IR label="IFSC" value={payroll.ifsc} /></>}
          </div>
        </div>
      )}

      {activeTab === "payslips" && (
        <div style={{ background: F.card, border: `1px solid ${F.border}`, borderRadius: 10, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${F.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><div style={{ fontWeight: 800 }}>Payslips & tax forms</div><div style={{ fontSize: 12, color: F.text2, marginTop: 3 }}>{editingPayslips ? "Update the payroll values for each issued period." : "Payroll documents issued specifically to this employee."}</div></div><div style={{ display: "flex", gap: 8 }}>{editingPayslips && <Btn small variant="secondary" onClick={() => setEditingPayslips(false)}>Cancel</Btn>}<Btn small variant={editingPayslips ? "success" : "secondary"} onClick={() => { if (editingPayslips) toast("Payslip adjustments saved", "success"); setEditingPayslips(!editingPayslips) }}>{editingPayslips ? "Save changes" : "Edit figures"}</Btn></div></div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}><thead><tr><Th>Pay period</Th><Th>Gross earnings</Th><Th>Deductions</Th><Th>Net pay</Th><Th>Status</Th><Th>Action</Th></tr></thead><tbody>{payslipRows.map((row, i) => <TrH key={row.period}><Td><strong>{row.period}</strong><div style={{ fontSize: 11, color: F.text3 }}>Regular monthly payroll</div></Td><Td>{editingPayslips ? <input aria-label={`${row.period} gross`} type="number" min="0" style={{ ...iSt, width: 120 }} value={row.gross} onChange={(e) => setPayslipRows(payslipRows.map((item, index) => index === i ? { ...item, gross: Number(e.target.value) } : item))} /> : inr(row.gross)}</Td><Td>{editingPayslips ? <input aria-label={`${row.period} deductions`} type="number" min="0" style={{ ...iSt, width: 120 }} value={row.deductions} onChange={(e) => setPayslipRows(payslipRows.map((item, index) => index === i ? { ...item, deductions: Number(e.target.value) } : item))} /> : inr(row.deductions)}</Td><Td style={{ fontWeight: 800, color: F.success }}>{inr(row.gross - row.deductions)}</Td><Td>{editingPayslips ? <select aria-label={`${row.period} status`} style={{ ...iSt, width: 115 }} value={row.status} onChange={(e) => setPayslipRows(payslipRows.map((item, index) => index === i ? { ...item, status: e.target.value } : item))}><option>Available</option><option>Paid</option><option>On hold</option></select> : <Badge label={row.status} color={row.status === "On hold" ? F.warning : F.success} bg={row.status === "On hold" ? F.warningBg : F.successBg} />}</Td><Td><div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}><Btn small variant="secondary" onClick={() => toast(`${row.period} payslip opened`, "info")}>View</Btn><Btn small title={`Download PDF payslip for ${row.period}`} onClick={() => downloadPayslipPdf({ grossSalary: row.gross, totalEarnings: row.gross, pf: Math.round(row.gross * 0.12), tds: Math.max(0, row.deductions - Math.round(row.gross * 0.12) - (row.gross > 15000 ? 200 : 150)), profTax: row.gross > 15000 ? 200 : 150, totalDeductions: row.deductions, netSalary: row.gross - row.deductions }, { period: row.period, generatedOn: payslipGeneratedDate(row.period) }, emp)}><DownloadIcon />Download PDF</Btn></div></Td></TrH>)}</tbody></table>
        </div>
      )}

      {activeTab === "investments" && (
        <div style={{ background: F.card, border: `1px solid ${F.border}`, borderRadius: 10, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${F.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><div style={{ fontWeight: 800 }}>Investment declarations</div><div style={{ fontSize: 12, color: F.text2, marginTop: 3 }}>Tax-saving declarations and proof status for this employee.</div></div><div style={{ display: "flex", gap: 8 }}>{editingInvestments && <Btn small variant="secondary" onClick={() => setEditingInvestments(false)}>Cancel</Btn>}<Btn small variant={editingInvestments ? "success" : "secondary"} onClick={() => { if (editingInvestments) toast("Investment declarations saved", "success"); setEditingInvestments(!editingInvestments) }}>{editingInvestments ? "Save changes" : "Edit declarations"}</Btn></div></div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}><thead><tr><Th>Declaration</Th><Th>Description</Th><Th>Declared amount</Th><Th>Approved amount</Th><Th>Status</Th></tr></thead><tbody>{investments.map((item, i) => <TrH key={item.type}><Td style={{ fontWeight: 700 }}>{item.type}</Td><Td>{editingInvestments ? <input style={iSt} value={item.description} onChange={(e) => setInvestments(investments.map((row, index) => index === i ? { ...row, description: e.target.value } : row))} /> : item.description}</Td><Td>{editingInvestments ? <input type="number" min="0" style={iSt} value={item.declared} onChange={(e) => setInvestments(investments.map((row, index) => index === i ? { ...row, declared: Number(e.target.value) } : row))} /> : inr(item.declared)}</Td><Td>{editingInvestments ? <input type="number" min="0" style={iSt} value={item.approved} onChange={(e) => setInvestments(investments.map((row, index) => index === i ? { ...row, approved: Number(e.target.value) } : row))} /> : inr(item.approved)}</Td><Td>{editingInvestments ? <select style={iSt} value={item.status} onChange={(e) => setInvestments(investments.map((row, index) => index === i ? { ...row, status: e.target.value } : row))}><option>Verified</option><option>Pending</option><option>Rejected</option></select> : <Badge label={item.status} color={item.status === "Verified" ? F.success : F.warning} bg={item.status === "Verified" ? F.successBg : F.warningBg} />}</Td></TrH>)}</tbody></table>
        </div>
      )}

      {activeTab === "loans" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end", gap: 8 }}>{editingLeave && <Btn small variant="secondary" onClick={() => setEditingLeave(false)}>Cancel</Btn>}<Btn small variant={editingLeave ? "success" : "secondary"} onClick={() => { if (editingLeave) toast("Leave balances and attendance saved", "success"); setEditingLeave(!editingLeave) }}>{editingLeave ? "Save leave details" : "Edit leave details"}</Btn></div>
          {[ ["Annual leave", "annualEntitlement", "annualUsed"], ["Sick leave", "sickEntitlement", "sickUsed"] ].map(([title, entitled, used]) => <div key={title} style={{ background: F.card, border: `1px solid ${F.border}`, borderRadius: 10, padding: 20 }}><div style={{ fontSize: 12, color: F.text2 }}>{title}</div>{editingLeave ? <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 9 }}><Fld label="Entitled"><input type="number" min="0" style={iSt} value={leaveBalances[entitled as "annualEntitlement" | "sickEntitlement"]} onChange={(e) => setLeaveBalances({ ...leaveBalances, [entitled]: Number(e.target.value) })} /></Fld><Fld label="Used"><input type="number" min="0" style={iSt} value={leaveBalances[used as "annualUsed" | "sickUsed"]} onChange={(e) => setLeaveBalances({ ...leaveBalances, [used]: Number(e.target.value) })} /></Fld></div> : <><div style={{ fontWeight: 850, fontSize: 26, marginTop: 8, color: F.brand }}>{leaveBalances[entitled as "annualEntitlement" | "sickEntitlement"] - leaveBalances[used as "annualUsed" | "sickUsed"]} days</div><div style={{ fontSize: 12, color: F.text3, marginTop: 5 }}>{leaveBalances[used as "annualUsed" | "sickUsed"]} used of {leaveBalances[entitled as "annualEntitlement" | "sickEntitlement"]}</div></>}</div>)}
          <div style={{ background: F.card, border: `1px solid ${F.border}`, borderRadius: 10, padding: 20 }}><div style={{ fontSize: 12, color: F.text2 }}>Work attendance</div>{editingLeave ? <Fld label="Attendance percentage"><input type="number" min="0" max="100" style={{ ...iSt, marginTop: 8 }} value={leaveBalances.attendance} onChange={(e) => setLeaveBalances({ ...leaveBalances, attendance: Number(e.target.value) })} /></Fld> : <><div style={{ fontWeight: 850, fontSize: 26, marginTop: 8, color: F.brand }}>{leaveBalances.attendance}%</div><div style={{ fontSize: 12, color: F.text3, marginTop: 5 }}>This month</div></>}</div>
          <div style={{ gridColumn: "1 / -1", background: F.card, border: `1px solid ${F.border}`, borderRadius: 10, overflow: "hidden" }}><div style={{ padding: "16px 20px", fontWeight: 800, borderBottom: `1px solid ${F.border}` }}>Recent requests</div><table style={{ width: "100%", borderCollapse: "collapse" }}><thead><tr><Th>Type</Th><Th>Dates</Th><Th>Duration</Th><Th>Status</Th><Th>Action</Th></tr></thead><tbody><TrH><Td>Annual leave</Td><Td>18–19 Sep 2026</Td><Td>2 days</Td><Td><Badge label="Approved" color={F.success} bg={F.successBg} /></Td><Td><Btn small variant="secondary" onClick={() => toast("Leave request opened", "info")}>Review</Btn></Td></TrH></tbody></table></div>
        </div>
      )}

      {activeTab === "history" && (
        <div style={{ background: F.card, border: `1px solid ${F.border}`, borderRadius: 10, padding: 20 }}>
          <div style={{ fontWeight: 800, marginBottom: 18 }}>Employee payroll timeline</div>
          {[ ["August 2026 payroll completed", `Net pay ${inr(net)} was released to bank account ending 4821.`, F.success], ["Salary structure reviewed", `${emp.salaryStructure} remains active for this employee.`, F.brand], ["Employment record updated", `${emp.designation} · ${emp.department}`, F.warning] ].map(([title, note, color]) => <div key={title as string} style={{ display: "grid", gridTemplateColumns: "14px 1fr", gap: 12, paddingBottom: 20 }}><div style={{ width: 10, height: 10, marginTop: 4, borderRadius: "50%", background: color as string, boxShadow: `0 0 0 4px ${color}22` }} /><div><div style={{ fontWeight: 750, fontSize: 14 }}>{title as string}</div><div style={{ color: F.text2, fontSize: 12, marginTop: 4 }}>{note as string}</div><div style={{ color: F.text3, fontSize: 11, marginTop: 5 }}>Recorded in this employee file</div></div></div>)}
        </div>
      )}
      {confirm && (
        <Confirm
          msg={confirm.msg}
          onOk={confirm.onOk}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  )
}

// ── Add Employee Wizard Page (Zoho Payroll Style 4-Step Process) ────────────────
function AddEmployeeWizardPage({
  ss,
  emps,
  setEmps,
  onBack,
}: {
  ss: SalaryStructure[]
  emps: Employee[]
  setEmps: React.Dispatch<React.SetStateAction<Employee[]>>
  onBack: () => void
}) {
  const toast = useToast()
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)

  // Form State
  // Step 1: Basic Details
  const [basic, setBasic] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    empId: `EMP-${String(emps.length + 1).padStart(3, "0")}`,
    doj: new Date().toISOString().slice(0, 10),
    email: "",
    mobile: "",
    isDirector: false,
    gender: "Male",
    workLocation: "Head Office ( Swamy Ayyapa... )",
    designation: "Packaged App Development Associate",
    department: "AI/ML",
    enablePortalAccess: true,
  })

  // Step 2: Salary Details
  const [statutory, setStatutory] = useState({
    epf: false,
    esi: false,
    pt: true,
    lwf: false,
  })
  const [annualCTC, setAnnualCTC] = useState<number>(600000)
  const [basicPct, setBasicPct] = useState<number>(50)

  // Step 3: Personal Details
  const [personal, setPersonal] = useState({
    dob: "",
    age: "",
    fatherName: "",
    pan: "",
    differentlyAbled: "None",
    personalEmail: "",
    addr1: "",
    addr2: "",
    city: "",
    state: "Karnataka",
    pincode: "",
  })

  // Step 4: Payment Information
  const [paymentMethod, setPaymentMethod] =
    useState<"direct_deposit" | "bank_transfer" | "cheque" | "cash">(
      "bank_transfer",
    )

  // Calculations for Salary
  const monthlyCTC = Math.round(annualCTC / 12)
  const monthlyBasic = Math.round((monthlyCTC * basicPct) / 100)
  const annualBasic = monthlyBasic * 12
  const monthlyFixed = Math.max(0, monthlyCTC - monthlyBasic)
  const annualFixed = monthlyFixed * 12

  const handleNextStep1 = () => {
    if (!basic.firstName.trim() || !basic.email.trim()) {
      toast("First Name and Work Email are required.", "error")
      return
    }
    setStep(2)
  }

  const handleNextStep2 = () => {
    setStep(3)
  }

  const handleNextStep3 = () => {
    setStep(4)
  }

  const handleFinish = () => {
    const fullName = `${basic.firstName} ${
      basic.middleName ? basic.middleName + " " : ""
    }${basic.lastName}`.trim()
    const newEmp: Employee = {
      id: basic.empId,
      name: fullName || "New Employee",
      email: basic.email,
      department: basic.department,
      designation: basic.designation,
      doj: basic.doj,
      empType: "Full-Time",
      manager: "Meena Iyer",
      location: basic.workLocation.split(" ")[0] || "Bangalore",
      salaryStructure: "Standard Engineer",
      status: "Active",
      grossSalary: monthlyCTC,
    }

    setEmps([newEmp, ...emps])
    toast(`Employee ${fullName} created successfully!`, "success")
    onBack()
  }

  const handleSaveDraft = () => {
    const fullName = `${basic.firstName} ${
      basic.middleName ? basic.middleName + " " : ""
    }${basic.lastName}`.trim()
    const newEmp: Employee = {
      id: basic.empId,
      name: fullName || "New Employee",
      email: basic.email || "pending@naxrita.in",
      department: basic.department,
      designation: basic.designation,
      doj: basic.doj,
      empType: "Full-Time",
      manager: "Meena Iyer",
      location: basic.workLocation.split(" ")[0] || "Bangalore",
      salaryStructure: "Junior Engineer",
      status: "Incomplete",
      grossSalary: 0,
    }
    setEmps([newEmp, ...emps])
    toast(
      `Draft saved for ${fullName || "new employee"}. Profile marked as incomplete.`,
      "warning",
    )
    onBack()
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Top Navigation / Breadcrumb */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={onBack}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: F.text2,
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 13,
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Employees
          </button>
        </div>
      </div>

      {/* Stepper Wizard Header */}
      <div
        style={{
          background: F.card,
          border: `1px solid ${F.border}`,
          borderRadius: 10,
          padding: "20px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        <h2
          style={{ margin: 0, fontSize: 20, fontWeight: 700, color: F.text1 }}
        >
          Add Employee
        </h2>

        {/* Step Indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginTop: 4,
          }}
        >
          {[
            { num: 1, label: "Basic Details" },
            { num: 2, label: "Salary Details" },
            { num: 3, label: "Personal Details" },
            { num: 4, label: "Payment Information" },
          ].map((s, idx) => {
            const isDone = step > s.num
            const isCurr = step === s.num
            return (
              <div
                key={s.num}
                style={{ display: "flex", alignItems: "center", gap: 16 }}
              >
                {idx > 0 && (
                  <div
                    style={{
                      width: 40,
                      height: 2,
                      background: isDone ? F.success : F.border,
                    }}
                  />
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: isDone
                        ? F.success
                        : isCurr
                          ? F.brand
                          : "transparent",
                      border:
                        isDone || isCurr ? "none" : `1.5px solid ${F.border}`,
                      color: isDone || isCurr ? "#fff" : F.text3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {isDone ? "✓" : s.num}
                  </div>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: isCurr ? 700 : 500,
                      color: isCurr ? F.text1 : F.text2,
                    }}
                  >
                    {s.label}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Step Content */}
      <div
        style={{
          background: F.card,
          border: `1px solid ${F.border}`,
          borderRadius: 10,
          padding: 28,
          maxWidth: 900,
          margin: "0 auto",
          width: "100%",
        }}
      >
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Name Fields */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 14,
              }}
            >
              <Fld label="First Name *">
                <input
                  style={iSt}
                  value={basic.firstName}
                  onChange={(e) =>
                    setBasic({ ...basic, firstName: e.target.value })
                  }
                  placeholder="First Name"
                />
              </Fld>
              <Fld label="Middle Name">
                <input
                  style={iSt}
                  value={basic.middleName}
                  onChange={(e) =>
                    setBasic({ ...basic, middleName: e.target.value })
                  }
                  placeholder="Middle Name"
                />
              </Fld>
              <Fld label="Last Name">
                <input
                  style={iSt}
                  value={basic.lastName}
                  onChange={(e) =>
                    setBasic({ ...basic, lastName: e.target.value })
                  }
                  placeholder="Last Name"
                />
              </Fld>
            </div>

            {/* Emp ID & Date of Joining */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              <Fld label="Employee ID *">
                <input
                  style={iSt}
                  value={basic.empId}
                  onChange={(e) =>
                    setBasic({ ...basic, empId: e.target.value })
                  }
                />
              </Fld>
              <Fld label="Date of Joining *">
                <StrictDateInput
                  style={iSt}
                  value={basic.doj}
                  onChange={(value) => setBasic({ ...basic, doj: value })}
                />
              </Fld>
            </div>

            {/* Email & Mobile */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              <Fld label="Work Email *">
                <input
                  style={iSt}
                  value={basic.email}
                  onChange={(e) =>
                    setBasic({ ...basic, email: e.target.value })
                  }
                  placeholder="abc@xyz.com"
                />
              </Fld>
              <Fld label="Mobile Number">
                <input
                  style={iSt}
                  value={basic.mobile}
                  onChange={(e) =>
                    setBasic({ ...basic, mobile: e.target.value })
                  }
                  placeholder="+91 9876543210"
                />
              </Fld>
            </div>

            {/* Director Checkbox */}
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 13,
                color: F.text1,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={basic.isDirector}
                onChange={(e) =>
                  setBasic({ ...basic, isDirector: e.target.checked })
                }
              />
              <span>
                Employee is a Director/person with substantial interest in the
                company.
              </span>
            </label>

            {/* Gender & Work Location */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              <Fld label="Gender *">
                <select
                  style={iSt}
                  value={basic.gender}
                  onChange={(e) =>
                    setBasic({ ...basic, gender: e.target.value })
                  }
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </Fld>
              <Fld label="Work Location *">
                <select
                  style={iSt}
                  value={basic.workLocation}
                  onChange={(e) =>
                    setBasic({ ...basic, workLocation: e.target.value })
                  }
                >
                  <option>Head Office ( Swamy Ayyapa... )</option>
                  <option>Bangalore Branch</option>
                  <option>Mumbai Regional Office</option>
                  <option>Hyderabad Tech Park</option>
                </select>
              </Fld>
            </div>

            {/* Designation & Department */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              <Fld label="Designation *">
                <select
                  style={iSt}
                  value={basic.designation}
                  onChange={(e) =>
                    setBasic({ ...basic, designation: e.target.value })
                  }
                >
                  <option>Packaged App Development Associate</option>
                  <option>Software Engineer</option>
                  <option>Senior Developer</option>
                  <option>Product Manager</option>
                  <option>HR Specialist</option>
                </select>
              </Fld>
              <Fld label="Department *">
                <select
                  style={iSt}
                  value={basic.department}
                  onChange={(e) =>
                    setBasic({ ...basic, department: e.target.value })
                  }
                >
                  <option>AI/ML</option>
                  <option>Engineering</option>
                  <option>HR</option>
                  <option>Finance</option>
                  <option>Sales</option>
                </select>
              </Fld>
            </div>

            {/* Enable Portal Access Checkbox */}
            <div
              style={{
                background: F.infoBg,
                border: `1px solid ${F.brand}30`,
                borderRadius: 8,
                padding: 14,
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  color: F.text1,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={basic.enablePortalAccess}
                  onChange={(e) =>
                    setBasic({ ...basic, enablePortalAccess: e.target.checked })
                  }
                />
                <span>Enable Portal Access</span>
              </label>
              <span style={{ fontSize: 12, color: F.text2, marginLeft: 22 }}>
                The employee will be able to view payslips, submit their IT
                declaration and create reimbursement claims through the employee
                portal.
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 12,
                paddingTop: 16,
                borderTop: `1px solid ${F.border}`,
              }}
            >
              <div style={{ fontSize: 12, color: F.error }}>
                * indicates mandatory fields
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn variant="secondary" onClick={handleSaveDraft}>
                  Save as Draft
                </Btn>
                <Btn variant="secondary" onClick={onBack}>
                  Cancel
                </Btn>
                <Btn onClick={handleNextStep1}>Save and Continue</Btn>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Statutory Components Card */}
            <div
              style={{
                border: `1px solid ${F.border}`,
                borderRadius: 8,
                padding: 20,
                background: F.card,
              }}
            >
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: F.text1,
                  marginBottom: 4,
                }}
              >
                Statutory Components
              </div>
              <div style={{ fontSize: 12, color: F.text2, marginBottom: 16 }}>
                Enable the necessary benefits and tax applicable for this
                employee.
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 13,
                    color: F.text1,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={statutory.epf}
                    onChange={(e) =>
                      setStatutory({ ...statutory, epf: e.target.checked })
                    }
                  />
                  <span>Employees' Provident Fund</span>
                </label>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 13,
                    color: F.text1,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={statutory.esi}
                    onChange={(e) =>
                      setStatutory({ ...statutory, esi: e.target.checked })
                    }
                  />
                  <span>Employees' State Insurance</span>
                </label>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 13,
                    color: F.text1,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={statutory.pt}
                    onChange={(e) =>
                      setStatutory({ ...statutory, pt: e.target.checked })
                    }
                  />
                  <span>Professional Tax</span>
                </label>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 13,
                    color: F.text1,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={statutory.lwf}
                    onChange={(e) =>
                      setStatutory({ ...statutory, lwf: e.target.checked })
                    }
                  />
                  <span>Labour Welfare Fund</span>
                </label>
              </div>
            </div>

            {/* Salary Structure Card */}
            <div
              style={{
                border: `1px solid ${F.border}`,
                borderRadius: 8,
                padding: 20,
                background: F.card,
              }}
            >
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: F.text1,
                  marginBottom: 4,
                }}
              >
                Salary Structure
              </div>
              <div style={{ fontSize: 12, color: F.text2, marginBottom: 16 }}>
                Set how the employee's salary is divided for accurate pay
                calculation.
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 20,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 600, color: F.text1 }}>
                  Annual CTC *
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    border: `1px solid ${F.border}`,
                    borderRadius: 6,
                    overflow: "hidden",
                    width: 220,
                  }}
                >
                  <span
                    style={{
                      padding: "8px 12px",
                      background: F.pageBg,
                      color: F.text2,
                      fontSize: 13,
                      borderRight: `1px solid ${F.border}`,
                    }}
                  >
                    ₹
                  </span>
                  <input
                    type="number"
                    style={{
                      border: "none",
                      padding: "8px 10px",
                      width: "100%",
                      fontSize: 13,
                      outline: "none",
                    }}
                    value={annualCTC}
                    onChange={(e) => setAnnualCTC(Number(e.target.value) || 0)}
                  />
                </div>
                <span style={{ fontSize: 12, color: F.text3 }}>per year</span>
              </div>

              {/* Salary Components Table */}
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 13,
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: F.pageBg,
                      borderBottom: `1px solid ${F.border}`,
                    }}
                  >
                    <th
                      style={{
                        textAlign: "left",
                        padding: "8px 12px",
                        color: F.text2,
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      SALARY COMPONENTS
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "8px 12px",
                        color: F.text2,
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      CALCULATION TYPE
                    </th>
                    <th
                      style={{
                        textAlign: "right",
                        padding: "8px 12px",
                        color: F.text2,
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      MONTHLY AMOUNT
                    </th>
                    <th
                      style={{
                        textAlign: "right",
                        padding: "8px 12px",
                        color: F.text2,
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      ANNUAL AMOUNT
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: `1px solid ${F.border}` }}>
                    <td style={{ padding: 12, fontWeight: 600 }}>Basic</td>
                    <td style={{ padding: 12 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <input
                          type="number"
                          value={basicPct}
                          onChange={(e) =>
                            setBasicPct(Number(e.target.value) || 0)
                          }
                          style={{
                            width: 60,
                            padding: 4,
                            borderRadius: 4,
                            border: `1px solid ${F.border}`,
                          }}
                        />
                        <span style={{ color: F.text2, fontSize: 12 }}>
                          % of CTC
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: 12, textAlign: "right" }}>
                      ₹{monthlyBasic.toLocaleString("en-IN")}
                    </td>
                    <td style={{ padding: 12, textAlign: "right" }}>
                      ₹{annualBasic.toLocaleString("en-IN")}
                    </td>
                  </tr>
                  <tr style={{ borderBottom: `1px solid ${F.border}` }}>
                    <td style={{ padding: 12 }}>
                      <div style={{ fontWeight: 600 }}>Fixed Allowance</div>
                      <div style={{ fontSize: 11, color: F.text3 }}>
                        Monthly CTC - Sum of all other components
                      </div>
                    </td>
                    <td style={{ padding: 12, color: F.text2 }}>
                      Fixed amount
                    </td>
                    <td style={{ padding: 12, textAlign: "right" }}>
                      ₹{monthlyFixed.toLocaleString("en-IN")}
                    </td>
                    <td style={{ padding: 12, textAlign: "right" }}>
                      ₹{annualFixed.toLocaleString("en-IN")}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div
                style={{
                  background: F.infoBg,
                  borderRadius: 6,
                  padding: "12px 16px",
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 16,
                  fontWeight: 700,
                }}
              >
                <span>Cost to Company</span>
                <div style={{ display: "flex", gap: 32 }}>
                  <span>₹{monthlyCTC.toLocaleString("en-IN")}</span>
                  <span>₹{annualCTC.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: 16,
                borderTop: `1px solid ${F.border}`,
              }}
            >
              <Btn variant="secondary" onClick={() => setStep(1)}>
                Previous
              </Btn>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn variant="secondary" onClick={onBack}>
                  Cancel
                </Btn>
                <Btn onClick={handleNextStep2}>Save and Continue</Btn>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              <Fld label="Date of Birth *">
                <StrictDateInput
                  style={iSt}
                  value={personal.dob}
                  onChange={(value) =>
                    setPersonal({ ...personal, dob: value })
                  }
                />
              </Fld>
              <Fld label="Age">
                <input
                  style={iSt}
                  value={personal.age}
                  onChange={(e) =>
                    setPersonal({ ...personal, age: e.target.value })
                  }
                  placeholder="e.g. 26"
                />
              </Fld>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              <Fld label="Father's Name *">
                <input
                  style={iSt}
                  value={personal.fatherName}
                  onChange={(e) =>
                    setPersonal({ ...personal, fatherName: e.target.value })
                  }
                />
              </Fld>
              <Fld label="PAN">
                <input
                  style={iSt}
                  value={personal.pan}
                  onChange={(e) =>
                    setPersonal({
                      ...personal,
                      pan: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="AAAAA0000A"
                />
              </Fld>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              <Fld label="Differently Abled Type">
                <select
                  style={iSt}
                  value={personal.differentlyAbled}
                  onChange={(e) =>
                    setPersonal({
                      ...personal,
                      differentlyAbled: e.target.value,
                    })
                  }
                >
                  <option>None</option>
                  <option>Visual Impairment</option>
                  <option>Hearing Impairment</option>
                  <option>Locomotor</option>
                </select>
              </Fld>
              <Fld label="Personal Email Address">
                <input
                  style={iSt}
                  value={personal.personalEmail}
                  onChange={(e) =>
                    setPersonal({ ...personal, personalEmail: e.target.value })
                  }
                  placeholder="abc@xyz.com"
                />
              </Fld>
            </div>

            {/* Address */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginTop: 6,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: F.text1 }}>
                Residential Address
              </div>
              <input
                style={iSt}
                value={personal.addr1}
                onChange={(e) =>
                  setPersonal({ ...personal, addr1: e.target.value })
                }
                placeholder="Address Line 1"
              />
              <input
                style={iSt}
                value={personal.addr2}
                onChange={(e) =>
                  setPersonal({ ...personal, addr2: e.target.value })
                }
                placeholder="Address Line 2"
              />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 10,
                }}
              >
                <input
                  style={iSt}
                  value={personal.city}
                  onChange={(e) =>
                    setPersonal({ ...personal, city: e.target.value })
                  }
                  placeholder="Town/City"
                />
                <select
                  style={iSt}
                  value={personal.state}
                  onChange={(e) =>
                    setPersonal({ ...personal, state: e.target.value })
                  }
                >
                  <option>Karnataka</option>
                  <option>Maharashtra</option>
                  <option>Telangana</option>
                  <option>Tamil Nadu</option>
                  <option>Delhi</option>
                </select>
                <input
                  style={iSt}
                  value={personal.pincode}
                  onChange={(e) =>
                    setPersonal({ ...personal, pincode: e.target.value })
                  }
                  placeholder="PIN Code"
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 12,
                paddingTop: 16,
                borderTop: `1px solid ${F.border}`,
              }}
            >
              <Btn variant="secondary" onClick={() => setStep(2)}>
                Previous
              </Btn>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn variant="secondary" onClick={() => setStep(4)}>
                  Skip
                </Btn>
                <Btn onClick={handleNextStep3}>Save and Continue</Btn>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: F.text1,
                marginBottom: 4,
              }}
            >
              How would you like to pay this employee? *
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                {
                  id: "direct_deposit",
                  title: "Direct Deposit (Automated Process)",
                  desc: "Transfer the Employee's pay directly to their bank account.",
                },
                {
                  id: "bank_transfer",
                  title: "Bank Transfer (Manual Process)",
                  desc: "Download Bank Advice and process the payment through your bank's website",
                },
                {
                  id: "cheque",
                  title: "Cheque",
                  desc: "Record the Employee's pay as paid by cheque.",
                },
                {
                  id: "cash",
                  title: "Cash",
                  desc: "Record the Employee's pay as paid in cash.",
                },
              ].map((method) => {
                const selected = paymentMethod === method.id
                return (
                  <div
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id as any)}
                    style={{
                      border: `1px solid ${selected ? F.brand : F.border}`,
                      background: selected ? F.infoBg : F.card,
                      borderRadius: 8,
                      padding: "16px 20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 14,
                          color: F.text1,
                        }}
                      >
                        {method.title}
                      </div>
                      <div
                        style={{ fontSize: 12, color: F.text2, marginTop: 2 }}
                      >
                        {method.desc}
                      </div>
                    </div>
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        border: `2px solid ${selected ? F.brand : F.text3}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {selected && (
                        <div
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            background: F.brand,
                          }}
                        />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 16,
                paddingTop: 16,
                borderTop: `1px solid ${F.border}`,
              }}
            >
              <Btn variant="secondary" onClick={() => setStep(3)}>
                Previous
              </Btn>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn variant="secondary" onClick={onBack}>
                  Cancel
                </Btn>
                <Btn onClick={handleFinish}>Complete Setup & Save</Btn>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Bulk Upload Page ──────────────────────────────────────────────────────────
function BulkUploadPage({
  ss,
  emps,
  setEmps,
  onBack,
}: {
  ss: SalaryStructure[]
  emps: Employee[]
  setEmps: React.Dispatch<React.SetStateAction<Employee[]>>
  onBack: () => void
}) {
  const toast = useToast()
  type RowState = "valid" | "error" | "duplicate"
  interface ParsedRow {
    name: string
    email: string
    department: string
    designation: string
    doj: string
    empType: string
    location: string
    salaryStructure: string
    state: RowState
    error?: string
  }

  const [step, setStep] = useState<"upload" | "preview" | "done">("upload")
  const [rows, setRows] = useState<ParsedRow[]>([])
  const [importedList, setImportedList] = useState<Employee[]>([])
  const [dragging, setDragging] = useState(false)
  const [previewSearch, setPreviewSearch] = useState("")
  const [previewFilter, setPreviewFilter] = useState<"all" | "valid" | "error" | "duplicate">("all")

  const TEMPLATE_CSV = `Name,Email,Department,Designation,Date of Joining,Employment Type,Location,Salary Structure
Amit Patel,amit.patel@naxrita.in,Engineering,Software Engineer,2026-09-01,Full-Time,Bangalore,Junior Engineer
Sneha Kulkarni,sneha.kulkarni@naxrita.in,HR,HR Executive,2026-09-01,Full-Time,Mumbai,Associate
Deepak Joshi,deepak.joshi@naxrita.in,Finance,Finance Analyst,2026-09-01,Full-Time,Hyderabad,Associate`

  const downloadTemplate = () => {
    const blob = new Blob([TEMPLATE_CSV], { type: "text/csv" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = "naxpayroll_bulk_employee_template.csv"
    a.click()
    toast("Template downloaded successfully", "success")
  }

  const parseCSV = (text: string) => {
    const lines = text.trim().split("\n").filter(Boolean)
    if (lines.length < 2) {
      toast("CSV file contains no data rows", "error")
      return
    }
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())
    const parsed: ParsedRow[] = lines.slice(1).map((line) => {
      const cols = line.split(",").map((c) => c.trim())
      const get = (key: string) => cols[headers.indexOf(key)] ?? ""
      const name = get("name")
      const email = get("email")
      const dept = get("department") || "Operations"
      const desig = get("designation") || "Associate"
      const doj = get("date of joining") || new Date().toISOString().slice(0, 10)
      const type = get("employment type") || "Full-Time"
      const loc = get("location") || "Corporate HQ"
      const struc = get("salary structure") || ss[0]?.name || "Associate"
      const dup = emps.some(
        (e) => e.email.toLowerCase() === email.toLowerCase(),
      )
      const validSS = ss.some((s) => s.name === struc)
      let state: RowState = "valid"
      let error = ""
      if (!name || !email) {
        state = "error"
        error = "Name or Email missing"
      } else if (dup) {
        state = "duplicate"
        error = "Email already registered"
      } else if (!validSS) {
        state = "error"
        error = `Salary structure "${struc}" not found`
      }
      return {
        name,
        email,
        department: dept,
        designation: desig,
        doj,
        empType: type,
        location: loc,
        salaryStructure: struc,
        state,
        error,
      }
    })
    setRows(parsed)
    setStep("preview")
    toast(`Parsed ${parsed.length} rows from CSV`, "info")
  }

  const handleFile = (file: File) => {
    if (!file.name.endsWith(".csv")) {
      toast("Please select a valid .csv file", "error")
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => parseCSV(e.target?.result as string)
    reader.readAsText(file)
  }

  const loadDemoCSV = () => {
    parseCSV(TEMPLATE_CSV)
  }

  const importValid = () => {
    const validRows = rows.filter((r) => r.state === "valid")
    if (validRows.length === 0) {
      return toast("No valid rows available to import", "error")
    }

    const newEmps: Employee[] = validRows.map((r, i) => ({
      id: `EMP-${String(emps.length + i + 1).padStart(3, "0")}`,
      name: r.name,
      email: r.email,
      department: r.department,
      designation: r.designation,
      doj: r.doj || new Date().toISOString().slice(0, 10),
      empType: r.empType as Employee["empType"],
      manager: "Meena Iyer",
      location: r.location,
      status: "Active" as EmpStatus,
      salaryStructure: r.salaryStructure,
      grossSalary: ss.find((s) => s.name === r.salaryStructure)?.gross ?? 60000,
    }))

    setEmps((prev) => [...prev, ...newEmps])
    setImportedList(newEmps)
    setStep("done")
    toast(`Successfully imported ${newEmps.length} employees!`, "success")
  }

  const validCount = rows.filter((r) => r.state === "valid").length
  const errorCount = rows.filter((r) => r.state === "error").length
  const dupCount = rows.filter((r) => r.state === "duplicate").length

  const filteredPreviewRows = rows.filter((r) => {
    if (!searchMatches(previewSearch, [r.name, r.email])) {
      return false
    }
    if (previewFilter !== "all" && r.state !== previewFilter) {
      return false
    }
    return true
  })

  const stateColor: Record<RowState, string> = {
    valid: F.success,
    error: F.error,
    duplicate: F.warning,
  }
  const stateBg: Record<RowState, string> = {
    valid: F.successBg,
    error: F.errorBg,
    duplicate: F.warningBg,
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Top Breadcrumb Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 13,
          color: F.text2,
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: F.brand,
            fontWeight: 700,
            fontSize: 13,
            fontFamily: "inherit",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <span>&larr;</span>
          <span>Employees</span>
        </button>
        <span style={{ color: F.border }}>/</span>
        <span style={{ color: F.text1, fontWeight: 700 }}>
          Bulk Employee Onboarding
        </span>
      </div>

      {/* Enhanced 3-Step Stepper Progress Bar */}
      <div
        style={{
          background: F.card,
          border: `1px solid ${F.border}`,
          borderRadius: 8,
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        }}
      >
        {[
          { key: "upload", stepNum: 1, label: "1. Upload CSV" },
          { key: "preview", stepNum: 2, label: "2. Review & Validate" },
          { key: "done", stepNum: 3, label: "3. Done & Summary" },
        ].map((item, i) => {
          const isDone =
            step === "done"
              ? true
              : step === "preview"
              ? i === 0
              : false
          const isActive = step === item.key

          return (
            <Fragment key={item.key}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: isDone
                      ? F.success
                      : isActive
                      ? F.brand
                      : F.pageBg,
                    border: `2px solid ${
                      isDone
                        ? F.success
                        : isActive
                        ? F.brand
                        : F.border
                    }`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                  }}
                >
                  {isDone ? (
                    <span style={{ color: "#FFFFFF", fontWeight: 800, fontSize: 14 }}>
                      ✓
                    </span>
                  ) : (
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 800,
                        color: isActive ? "#FFFFFF" : F.text2,
                      }}
                    >
                      {item.stepNum}
                    </span>
                  )}
                </div>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: isActive || isDone ? 700 : 500,
                    color: isActive ? F.brand : isDone ? F.success : F.text2,
                  }}
                >
                  {item.label}
                </span>
              </div>
              {i < 2 && (
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    background: isDone ? F.success : F.border,
                    margin: "0 16px",
                    transition: "background 0.3s ease",
                  }}
                />
              )}
            </Fragment>
          )
        })}
      </div>

      {/* STEP 1: UPLOAD CSV */}
      {step === "upload" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
          {/* Dropzone Container */}
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragging(false)
              const f = e.dataTransfer.files[0]
              if (f) handleFile(f)
            }}
            style={{
              background: dragging ? F.infoBg : F.card,
              border: `2px dashed ${dragging ? F.brand : F.border}`,
              borderRadius: 12,
              padding: "60px 40px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
              transition: "all 0.2s ease",
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: F.infoBg,
                border: `1px solid ${F.brand}30`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                marginBottom: 16,
                color: F.brand,
              }}
            >
              ☁️
            </div>
            <div style={{ fontSize: 17, fontWeight: 800, color: F.text1, marginBottom: 6 }}>
              Drop your CSV file here
            </div>
            <div style={{ fontSize: 13, color: F.text2, marginBottom: 20 }}>
              Supports standard comma-separated .csv employee records
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
              <Btn
                onClick={() => {
                  const input = document.createElement("input")
                  input.type = "file"
                  input.accept = ".csv"
                  input.onchange = (e) => {
                    const f = (e.target as HTMLInputElement).files?.[0]
                    if (f) handleFile(f)
                  }
                  input.click()
                }}
              >
                Browse CSV File
              </Btn>
              <Btn variant="secondary" onClick={loadDemoCSV}>
                ⚡ Load Sample Demo CSV
              </Btn>
            </div>
          </div>

          {/* Guidelines Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                background: F.card,
                border: `1px solid ${F.border}`,
                borderRadius: 8,
                padding: "18px 20px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: F.text2,
                  marginBottom: 12,
                }}
              >
                Mandatory CSV Headers
              </div>
              {[
                "Name",
                "Email",
                "Department",
                "Designation",
                "Date of Joining",
                "Employment Type",
                "Location",
                "Salary Structure",
              ].map((col) => (
                <div
                  key={col}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 0",
                    borderBottom: `1px solid ${F.border}60`,
                    fontSize: 12,
                  }}
                >
                  <span style={{ color: F.success, fontWeight: 800 }}>✓</span>
                  <span style={{ color: F.text1, fontWeight: 600 }}>{col}</span>
                </div>
              ))}
            </div>

            <div
              style={{
                background: F.successBg,
                border: `1px solid ${F.success}30`,
                borderRadius: 8,
                padding: "16px 18px",
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: F.success, marginBottom: 4 }}>
                Download CSV Template
              </div>
              <div style={{ fontSize: 12, color: F.text2, marginBottom: 12, lineHeight: 1.4 }}>
                Pre-formatted template with verified column headers and 3 sample entries.
              </div>
              <Btn small onClick={downloadTemplate}>
                Download Template.csv
              </Btn>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: REVIEW & VALIDATE */}
      {step === "preview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Summary Chips Bar */}
          <div
            style={{
              background: F.card,
              border: `1px solid ${F.border}`,
              borderRadius: 8,
              padding: "14px 18px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span
                style={{
                  padding: "6px 12px",
                  background: F.successBg,
                  border: `1px solid ${F.success}40`,
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 700,
                  color: F.success,
                }}
              >
                ✓ {validCount} Valid Records
              </span>
              <span
                style={{
                  padding: "6px 12px",
                  background: errorCount > 0 ? F.errorBg : F.pageBg,
                  border: `1px solid ${errorCount > 0 ? F.error : F.border}40`,
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 700,
                  color: errorCount > 0 ? F.error : F.text3,
                }}
              >
                &times; {errorCount} Validation Errors
              </span>
              <span
                style={{
                  padding: "6px 12px",
                  background: dupCount > 0 ? F.warningBg : F.pageBg,
                  border: `1px solid ${dupCount > 0 ? F.warning : F.border}40`,
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 700,
                  color: dupCount > 0 ? F.warning : F.text3,
                }}
              >
                ! {dupCount} Duplicates Skipped
              </span>
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Btn
                variant="secondary"
                onClick={() => {
                  setRows([])
                  setStep("upload")
                }}
              >
                Re-upload File
              </Btn>
              <Btn disabled={validCount === 0} onClick={importValid}>
                Import {validCount} Employees &rarr;
              </Btn>
            </div>
          </div>

          {/* Validation Table */}
          <div
            style={{
              background: F.card,
              border: `1px solid ${F.border}`,
              borderRadius: 8,
              overflow: "hidden",
              boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
            }}
          >
            <div
            style={{
              padding: "12px 18px",
                borderBottom: `1px solid ${F.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 700, color: F.text1 }}>
                CSV Record Validation Sheet ({rows.length} Total Rows)
              </span>
              <span style={{ fontSize: 11, color: F.text3 }}>
                Only valid records will be written to the database.
              </span>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr
                    style={{
                      borderBottom: `1px solid ${F.border}`,
                      background: F.pageBg,
                      color: F.text2,
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                  >
                    <th style={{ padding: "10px 14px", textAlign: "center" }}>#</th>
                    <th style={{ padding: "10px 14px", textAlign: "left" }}>Employee Name</th>
                    <th style={{ padding: "10px 14px", textAlign: "left" }}>Email Address</th>
                    <th style={{ padding: "10px 14px", textAlign: "left" }}>Department</th>
                    <th style={{ padding: "10px 14px", textAlign: "left" }}>Designation</th>
                    <th style={{ padding: "10px 14px", textAlign: "left" }}>Salary Structure</th>
                    <th style={{ padding: "10px 14px", textAlign: "left" }}>Date of Joining</th>
                    <th style={{ padding: "10px 18px", textAlign: "center" }}>Validation Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPreviewRows.map((r, i) => (
                    <tr
                      key={i}
                      style={{
                        borderBottom: `1px solid ${F.border}60`,
                        background: r.state !== "valid" ? stateBg[r.state] : "transparent",
                      }}
                    >
                      <td style={{ padding: "12px 14px", textAlign: "center", color: F.text3, fontSize: 11 }}>
                        {i + 1}
                      </td>
                      <td style={{ padding: "12px 14px", fontWeight: 700, color: F.text1 }}>
                        {r.name || "—"}
                      </td>
                      <td style={{ padding: "12px 14px", color: F.text2 }}>
                        {r.email || "—"}
                      </td>
                      <td style={{ padding: "12px 14px", color: F.text2 }}>{r.department}</td>
                      <td style={{ padding: "12px 14px", color: F.text2 }}>{r.designation}</td>
                      <td style={{ padding: "12px 14px", color: F.brand, fontWeight: 600 }}>
                        {r.salaryStructure}
                      </td>
                      <td style={{ padding: "12px 14px", color: F.text3, fontSize: 12 }}>{r.doj}</td>
                      <td style={{ padding: "12px 18px", textAlign: "center" }}>
                        <Badge
                          label={r.error || "Valid"}
                          color={stateColor[r.state]}
                          bg={stateBg[r.state]}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: DONE & SUMMARY REPORT */}
      {step === "done" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Executive Success Card */}
          <div
            style={{
              background: F.card,
              border: `1px solid ${F.border}`,
              borderRadius: 12,
              padding: "40px 32px",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: F.successBg,
                border: `3px solid ${F.success}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                fontSize: 28,
              }}
            >
              ✓
            </div>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: F.text1,
                margin: "0 0 6px",
              }}
            >
              Bulk Onboarding Complete!
            </h2>
            <p style={{ fontSize: 14, color: F.text2, margin: "0 0 24px" }}>
              Successfully imported <strong>{importedList.length}</strong> new employee record{importedList.length !== 1 ? "s" : ""} to Naxrita Solutions.
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
              <Btn onClick={onBack}>View All Employees &rarr;</Btn>
              <Btn
                variant="secondary"
                onClick={() => {
                  setRows([])
                  setImportedList([])
                  setStep("upload")
                }}
              >
                Upload Another File
              </Btn>
            </div>
          </div>

          {/* Report Sheet of Newly Imported Employees */}
          {importedList.length > 0 && (
            <div
              style={{
                background: F.card,
                border: `1px solid ${F.border}`,
                borderRadius: 8,
                overflow: "hidden",
                boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
              }}
            >
              <div
                style={{
                  padding: "14px 18px",
                  borderBottom: `1px solid ${F.border}`,
                  background: F.successBg,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 700, color: F.success }}>
                  Newly Assigned Employee Records
                </span>
                <span style={{ fontSize: 12, color: F.text2 }}>
                  Status: Active &bull; Accounts Provisioned
                </span>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr
                      style={{
                        borderBottom: `1px solid ${F.border}`,
                        background: F.pageBg,
                        color: F.text2,
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: "uppercase",
                      }}
                    >
                      <th style={{ padding: "10px 18px", textAlign: "left" }}>Assigned ID</th>
                      <th style={{ padding: "10px 14px", textAlign: "left" }}>Employee Name</th>
                      <th style={{ padding: "10px 14px", textAlign: "left" }}>Email</th>
                      <th style={{ padding: "10px 14px", textAlign: "left" }}>Department</th>
                      <th style={{ padding: "10px 14px", textAlign: "left" }}>Designation</th>
                      <th style={{ padding: "10px 14px", textAlign: "left" }}>Salary Structure</th>
                      <th style={{ padding: "10px 18px", textAlign: "center" }}>Account Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importedList.map((emp) => (
                      <tr key={emp.id} style={{ borderBottom: `1px solid ${F.border}60` }}>
                        <td style={{ padding: "12px 18px", fontWeight: 800, color: F.brand }}>
                          {emp.id}
                        </td>
                        <td style={{ padding: "12px 14px", fontWeight: 700, color: F.text1 }}>
                          {emp.name}
                        </td>
                        <td style={{ padding: "12px 14px", color: F.text2 }}>{emp.email}</td>
                        <td style={{ padding: "12px 14px", color: F.text2 }}>{emp.department}</td>
                        <td style={{ padding: "12px 14px", color: F.text2 }}>{emp.designation}</td>
                        <td style={{ padding: "12px 14px", color: F.text1, fontWeight: 600 }}>
                          {emp.salaryStructure}
                        </td>
                        <td style={{ padding: "12px 18px", textAlign: "center" }}>
                          <Badge label="Active" color={F.success} bg={F.successBg} dot={F.success} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function EmployeesView({
  emps,
  setEmps,
  ss,
}: {
  emps: Employee[]
  setEmps: React.Dispatch<React.SetStateAction<Employee[]>>
  ss: SalaryStructure[]
}) {
  const toast = useToast()
  const [search, setSearch] = useState("")
  const [deptF, setDeptF] = useState("All")
  const [statusF, setStatusF] = useState("All")
  const [typeF, setTypeF] = useState("All")
  const [locF, setLocF] = useState("All")
  const [ssF, setSSF] = useState("All")
  const [salMin, setSalMin] = useState("")
  const [salMax, setSalMax] = useState("")
  const [dojYear, setDojYear] = useState("All")
  const [sortBy, setSortBy] = useState("name-asc")
  const [employeePage, setEmployeePage] = useState(1)
  const [hasRunEmployeeSearch, setHasRunEmployeeSearch] = useState(false)
  const employeePageSize = 10
  const [appliedEmpFilters, setAppliedEmpFilters] = useState({
    search: "",
    deptF: "All",
    statusF: "All",
    typeF: "All",
    locF: "All",
    ssF: "All",
    salMin: "",
    salMax: "",
    dojYear: "All",
    sortBy: "name-asc",
  })
  const [showAdv, setShowAdv] = useState(false)
  const [subPage, setSubPage] = useState<{ type: "detail" emp: Employee } | {
    type: "bulk"
  } | { type: "new" } | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [editEmp, setEditEmp] = useState<Employee | null>(null)
  const [confirm, setConfirm] = useState<{
    msg: string
    onOk: () => void
  } | null>(null)
  const [addForm, setAddForm] = useState({
    name: "",
    email: "",
    department: "Engineering",
    designation: "",
    doj: "",
    empType: "Full-Time" as Employee["empType"],
    manager: "",
    location: "",
    salaryStructure: "Senior Engineer",
  })
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([])
  const [bulkAction, setBulkAction] = useState("export_payslips")
  const [bulkReason, setBulkReason] = useState("")
  const [bulkStructure, setBulkStructure] = useState(ss[0]?.name ?? "")
  const [showColumnManager, setShowColumnManager] = useState(false)
  const [draggedColumnId, setDraggedColumnId] = useState<string | null>(null)
  const [employeeColumns, setEmployeeColumns] = useState([
    { id: "employee", label: "Employee", visible: true },
    { id: "department", label: "Department", visible: true },
    { id: "designation", label: "Designation", visible: true },
    { id: "type", label: "Employment Type", visible: true },
    { id: "location", label: "Location", visible: true },
    { id: "salary", label: "Gross Salary", visible: true },
    { id: "joined", label: "Joined", visible: true },
    { id: "status", label: "Status", visible: true },
    { id: "actions", label: "Actions", visible: true },
  ])

  const openEmployeeDetail = (employee: Employee) => {
    // Keep the selected record tied to the current directory data.
    const currentEmployee = emps.find((item) => item.id === employee.id) ?? employee
    setSubPage({ type: "detail", emp: currentEmployee })
  }

  // When employee list changes, refresh the selected employee if viewing detail
  const selEmp =
    subPage?.type === "detail"
      ? (emps.find((e) => e.id === subPage.emp.id) ?? subPage.emp)
      : null

  useEffect(() => {
    if (!selEmp) return
    // The directory can be scrolled well below its header. Resetting the
    // shared content pane makes the newly opened profile immediately visible.
    document.querySelector("main")?.scrollTo({ top: 0 })
  }, [selEmp])

  if (subPage?.type === "bulk")
    return (
      <BulkUploadPage
        ss={ss}
        emps={emps}
        setEmps={setEmps}
        onBack={() => setSubPage(null)}
      />
    )
  if (subPage?.type === "new")
    return (
      <AddEmployeeWizardPage
        ss={ss}
        emps={emps}
        setEmps={setEmps}
        onBack={() => setSubPage(null)}
      />
    )
  if (subPage?.type === "detail" && selEmp)
    return (
      <EmployeeDetailPage
        emp={selEmp}
        ss={ss}
        emps={emps}
        setEmps={setEmps}
        onBack={() => setSubPage(null)}
      />
    )

  const depts = ["All", ...Array.from(new Set(emps.map((e) => e.department)))]
  const locs = ["All", ...Array.from(new Set(emps.map((e) => e.location)))]
  const structs = [
    "All",
    ...Array.from(new Set(emps.map((e) => e.salaryStructure))),
  ]
  const dojYears = [
    "All",
    ...Array.from(new Set(emps.map((e) => e.doj.slice(0, 4)))).sort(),
  ]
  const empSearchVals = emps.map((e) => `${e.name} (${e.id})`)

  const activeFilters =
    [
      appliedEmpFilters.deptF,
      appliedEmpFilters.statusF,
      appliedEmpFilters.typeF,
      appliedEmpFilters.locF,
      appliedEmpFilters.ssF,
      appliedEmpFilters.dojYear,
    ].filter((v) => v !== "All").length +
    (appliedEmpFilters.salMin ? 1 : 0) +
    (appliedEmpFilters.salMax ? 1 : 0) +
    (activeSearch(appliedEmpFilters.search) ? 1 : 0) +
    (appliedEmpFilters.sortBy !== "name-asc" ? 1 : 0)

  const applyEmpFilters = () => {
    setHasRunEmployeeSearch(true)
    setEmployeePage(1)
    setAppliedEmpFilters({
      search,
      deptF,
      statusF,
      typeF,
      locF,
      ssF,
      salMin,
      salMax,
      dojYear,
      sortBy,
    })
  }
  const clearEmpFilters = () => {
    setHasRunEmployeeSearch(false)
    setEmployeePage(1)
    setSearch("")
    setDeptF("All")
    setStatusF("All")
    setTypeF("All")
    setLocF("All")
    setSSF("All")
    setSalMin("")
    setSalMax("")
    setDojYear("All")
    setSortBy("name-asc")
    setAppliedEmpFilters({
      search: "",
      deptF: "All",
      statusF: "All",
      typeF: "All",
      locF: "All",
      ssF: "All",
      salMin: "",
      salMax: "",
      dojYear: "All",
      sortBy: "name-asc",
    })
  }

  const filtered = hasRunEmployeeSearch ? emps.filter((e) => {
    const nameMatch = searchMatches(appliedEmpFilters.search, [
      e.name,
      e.id,
      e.email,
      e.designation,
    ])
    return (
      nameMatch &&
      (appliedEmpFilters.deptF === "All" || e.department === appliedEmpFilters.deptF) &&
      (appliedEmpFilters.statusF === "All" || e.status === appliedEmpFilters.statusF) &&
      (appliedEmpFilters.typeF === "All" || e.empType === appliedEmpFilters.typeF) &&
      (appliedEmpFilters.locF === "All" || e.location === appliedEmpFilters.locF) &&
      (appliedEmpFilters.ssF === "All" || e.salaryStructure === appliedEmpFilters.ssF) &&
      (appliedEmpFilters.dojYear === "All" || e.doj.startsWith(appliedEmpFilters.dojYear)) &&
      (!appliedEmpFilters.salMin || e.grossSalary >= parseInt(appliedEmpFilters.salMin) * 1000) &&
      (!appliedEmpFilters.salMax || e.grossSalary <= parseInt(appliedEmpFilters.salMax) * 1000)
    )
  }).sort((a, b) => {
    const dir = appliedEmpFilters.sortBy.endsWith("-desc") ? -1 : 1
    if (appliedEmpFilters.sortBy.startsWith("salary")) {
      return (a.grossSalary - b.grossSalary) * dir
    }
    if (appliedEmpFilters.sortBy.startsWith("joined")) {
      return (new Date(a.doj).getTime() - new Date(b.doj).getTime()) * dir
    }
    if (appliedEmpFilters.sortBy.startsWith("dept")) {
      return a.department.localeCompare(b.department) * dir
    }
    return a.name.localeCompare(b.name) * dir
  }) : []
  const paginatedEmployees = filtered.slice((employeePage - 1) * employeePageSize, employeePage * employeePageSize)
  const allVisibleSelected = paginatedEmployees.length > 0 && paginatedEmployees.every((employee) => selectedEmployeeIds.includes(employee.id))
  const toggleVisibleSelection = () => setSelectedEmployeeIds(allVisibleSelected ? selectedEmployeeIds.filter((id) => !paginatedEmployees.some((employee) => employee.id === id)) : Array.from(new Set([...selectedEmployeeIds, ...paginatedEmployees.map((employee) => employee.id)])))
  const runBulkAction = () => {
    if (!selectedEmployeeIds.length) return
    const selected = selectedEmployeeIds.length
    if (["request_documents", "deactivate"].includes(bulkAction) && !bulkReason.trim()) return toast("Add a reason for this bulk action", "error")
    if (bulkAction === "activate") setEmps(emps.map((employee) => selectedEmployeeIds.includes(employee.id) ? { ...employee, status: "Active" } : employee))
    if (bulkAction === "deactivate") setEmps(emps.map((employee) => selectedEmployeeIds.includes(employee.id) ? { ...employee, status: "Inactive" } : employee))
    if (bulkAction === "assign_structure") { const structure = ss.find((item) => item.name === bulkStructure); setEmps(emps.map((employee) => selectedEmployeeIds.includes(employee.id) ? { ...employee, salaryStructure: bulkStructure, grossSalary: structure?.gross ?? employee.grossSalary } : employee)) }
    const labels: Record<string, string> = { export_payslips: "Payslip package prepared", portal_invite: "Portal invitations sent", activate: "Employees activated", deactivate: "Employees deactivated", assign_structure: "Salary structure assigned", request_documents: "Document request sent" }
    toast(`${labels[bulkAction]} for ${selected} employee${selected === 1 ? "" : "s"}`, "success")
    setSelectedEmployeeIds([])
    setBulkReason("")
  }
  const visibleEmployeeColumns = employeeColumns.filter((column) => column.visible)
  const moveEmployeeColumn = (id: string, direction: -1 | 1) => setEmployeeColumns((columns) => {
    const index = columns.findIndex((column) => column.id === id)
    const nextIndex = index + direction
    if (index < 0 || nextIndex < 0 || nextIndex >= columns.length) return columns
    const next = [...columns]
    ;[next[index], next[nextIndex]] = [next[nextIndex], next[index]]
    return next
  })
  const dropEmployeeColumn = (targetId: string) => {
    if (!draggedColumnId || draggedColumnId === targetId) return setDraggedColumnId(null)
    setEmployeeColumns((columns) => {
      const from = columns.findIndex((column) => column.id === draggedColumnId)
      const to = columns.findIndex((column) => column.id === targetId)
      if (from < 0 || to < 0) return columns
      const next = [...columns]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next
    })
    setDraggedColumnId(null)
  }
  const employeeCell = (employee: Employee, columnId: string) => {
    if (columnId === "employee") return <div><strong style={{ color: F.brand }}>{employee.name}</strong><div style={{ fontSize: 11, color: F.text3 }}>{employee.id} · {employee.designation}</div></div>
    if (columnId === "department") return employee.department
    if (columnId === "designation") return employee.designation
    if (columnId === "type") return <Badge label={employee.empType} color={employee.empType === "Contract" ? F.warning : F.brand} bg={employee.empType === "Contract" ? F.warningBg : F.infoBg} />
    if (columnId === "location") return employee.location
    if (columnId === "salary") return <strong>{inr(employee.grossSalary)}</strong>
    if (columnId === "joined") return fmtD(employee.doj)
    if (columnId === "status") return empBadge(employee.status)
    return <span style={{ color: F.brand, fontWeight: 700 }}>View details</span>
  }

  const addEmployee = () => {
    if (!addForm.name || !addForm.email)
      return toast("Name and email are required", "error")
    const newId = `EMP-${String(emps.length + 1).padStart(3, "0")}`
    const newEmp: Employee = {
      id: newId,
      ...addForm,
      status: "Active",
      grossSalary:
        ss.find((s) => s.name === addForm.salaryStructure)?.gross ?? 0,
    }
    setEmps([...emps, newEmp])
    setShowAdd(false)
    setAddForm({
      name: "",
      email: "",
      department: "Engineering",
      designation: "",
      doj: "",
      empType: "Full-Time",
      manager: "",
      location: "",
      salaryStructure: "Senior Engineer",
    })
    toast(`${newEmp.name} added successfully`, "success")
  }

  const saveEdit = () => {
    if (!editEmp) return
    setEmps(emps.map((e) => (e.id === editEmp.id ? editEmp : e)))
    setEditEmp(null)
    toast("Employee updated", "success")
  }

  const toggleStatus = (emp: Employee) => {
    const next: EmpStatus = emp.status === "Active" ? "Inactive" : "Active"
    setConfirm({
      msg: `Set ${emp.name} to ${next}?`,
      onOk: () => {
        setEmps(emps.map((e) => (e.id === emp.id ? { ...e, status: next } : e)))
        toast(`Status updated to ${next}`, "success")
        setConfirm(null)
      },
    })
  }

  return (
    <div>
      <PH
        title="Employees"
        sub={`${emps.length} employees · Naxrita Solutions`}
        action={
          <div style={{ display: "flex", gap: 8 }}>
            <Btn
              variant="secondary"
              onClick={() => toast("Employee list exported as CSV", "success")}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Export CSV
            </Btn>
            <Btn variant="secondary" onClick={() => setShowColumnManager(!showColumnManager)}>
              ↔ Customize columns
            </Btn>
            <Btn
              variant="secondary"
              onClick={() => setSubPage({ type: "bulk" })}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="16 16 12 12 8 16" />
                <line x1="12" y1="12" x2="12" y2="21" />
                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
              </svg>
              Bulk Upload
            </Btn>
            <Btn onClick={() => setSubPage({ type: "new" })}>
              + Add Employee
            </Btn>
          </div>
        }
      />

      {/* Status chips */}
      <div
        style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}
      >
        {[
          { l: "All", v: emps.length, c: F.brand },
          {
            l: "Active",
            v: emps.filter((e) => e.status === "Active").length,
            c: F.success,
          },
          {
            l: "On Leave",
            v: emps.filter((e) => e.status === "On Leave").length,
            c: F.warning,
          },
          {
            l: "Incomplete",
            v: emps.filter((e) => e.status === "Incomplete").length,
            c: F.warning,
          },
          {
            l: "Inactive",
            v: emps.filter((e) => e.status === "Inactive").length,
            c: F.text3,
          },
        ].map((x) => (
          <div
            key={x.l}
            onClick={() => setStatusF(x.l === "All" ? "All" : x.l)}
            style={{
              padding: "5px 14px",
              background:
                statusF === (x.l === "All" ? "All" : x.l) ? `${x.c}15` : F.card,
              border: `1px solid ${
                statusF === (x.l === "All" ? "All" : x.l) ? x.c : F.border
              }`,
              borderRadius: 20,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              color: x.c,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 800 }}>{x.v}</span>
            {x.l}
          </div>
        ))}
        <div style={{ flex: 1 }} />
        <button
          onClick={() => setShowAdv((v) => !v)}
          style={{
            padding: "5px 14px",
            background: showAdv || activeFilters > 0 ? F.infoBg : F.card,
            border: `1px solid ${activeFilters > 0 ? F.brand : F.border}`,
            borderRadius: 20,
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 600,
            color: activeFilters > 0 ? F.brand : F.text2,
            fontFamily: "inherit",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
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
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="8" y1="12" x2="16" y2="12" />
            <line x1="11" y1="18" x2="13" y2="18" />
          </svg>
          Filters{" "}
          {activeFilters > 0 && (
            <span
              style={{
                background: F.brand,
                color: "#fff",
                borderRadius: 10,
                padding: "0 6px",
                fontSize: 11,
              }}
            >
              {activeFilters}
            </span>
          )}
        </button>
        {activeFilters > 0 && (
          <button
            onClick={clearEmpFilters}
            style={{
              padding: "5px 12px",
              background: F.errorBg,
              border: `1px solid #e8b4b4`,
              borderRadius: 20,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              color: F.error,
              fontFamily: "inherit",
            }}
          >
            Clear All
          </button>
        )}
      </div>

      {/* Incomplete profiles banner alert */}
          {emps.filter((e) => e.status === "Incomplete").length > 0 && (
        <div
          style={{
            background: "#FFF8E1",
            border: "1px solid #FFE082",
            borderRadius: 8,
            padding: "10px 16px",
            marginBottom: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#B78103",
            fontSize: 13,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 15 }}>⚠️</span>
            <span>
              You have{" "}
              <strong>
                {emps.filter((e) => e.status === "Incomplete").length}{" "}
                incomplete employee profiles
              </strong>
              . Complete setup to process their payroll.
            </span>
          </div>
          <button
            onClick={() => setStatusF("Incomplete")}
            style={{
              background: "none",
              border: "none",
              color: F.brand,
              fontWeight: 700,
              cursor: "pointer",
              textDecoration: "underline",
              fontSize: 13,
            }}
          >
            View Incomplete
          </button>
        </div>
      )}

      {/* Primary search + quick selects */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: showAdv ? 8 : 14,
          flexWrap: "wrap",
        }}
      >
        <ValueHelp
          value={search}
          onChange={setSearch}
          placeholder="Search name, ID, email, designation…"
          values={empSearchVals}
        />
        <select
          value={deptF}
          onChange={(e) => setDeptF(e.target.value)}
          style={{ ...iSt, width: 160 }}
        >
          {depts.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
        <select
          value={typeF}
          onChange={(e) => setTypeF(e.target.value)}
          style={{ ...iSt, width: 140 }}
        >
          {["All", "Full-Time", "Part-Time", "Contract"].map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ ...iSt, width: 180 }}
          title="Sort employees"
        >
          <option value="name-asc">Name A-Z</option>
          <option value="name-desc">Name Z-A</option>
          <option value="salary-desc">Salary High-Low</option>
          <option value="salary-asc">Salary Low-High</option>
          <option value="joined-desc">Newest Joined</option>
          <option value="joined-asc">Oldest Joined</option>
          <option value="dept-asc">Department A-Z</option>
        </select>
        <Btn onClick={applyEmpFilters}>Go</Btn>
        <Btn variant="secondary" onClick={clearEmpFilters}>
          Clear Filters
        </Btn>
      </div>

      {/* Advanced filter panel */}
      {showAdv && (
        <div
          style={{
            background: F.card,
            border: `1px solid ${F.border}`,
            borderRadius: 8,
            padding: "14px 18px",
            marginBottom: 14,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
            gap: 12,
          }}
        >
          <Fld label="Location">
            <select
              value={locF}
              onChange={(e) => setLocF(e.target.value)}
              style={iSt}
            >
              {locs.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </Fld>
          <Fld label="Salary Structure">
            <select
              value={ssF}
              onChange={(e) => setSSF(e.target.value)}
              style={iSt}
            >
              {structs.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Fld>
          <Fld label="Joining Year">
            <select
              value={dojYear}
              onChange={(e) => setDojYear(e.target.value)}
              style={iSt}
            >
              {dojYears.map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </Fld>
          <Fld label="Min Gross Salary (₹K)">
            <input
              type="number"
              value={salMin}
              onChange={(e) => setSalMin(e.target.value)}
              placeholder="e.g. 50"
              style={iSt}
            />
          </Fld>
          <Fld label="Max Gross Salary (₹K)">
            <input
              type="number"
              value={salMax}
              onChange={(e) => setSalMax(e.target.value)}
              placeholder="e.g. 200"
              style={iSt}
            />
          </Fld>
        </div>
      )}

      {/* Active filter pills */}
      {activeFilters > 0 && (
        <div
          style={{
            display: "flex",
            gap: 6,
            marginBottom: 10,
            flexWrap: "wrap",
          }}
        >
          {appliedEmpFilters.deptF !== "All" && (
            <span
              style={{
                padding: "3px 10px 3px 8px",
                background: F.infoBg,
                border: `1px solid ${F.brand}40`,
                borderRadius: 12,
                fontSize: 12,
                color: F.brand,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              Dept: {appliedEmpFilters.deptF}
            </span>
          )}
          {appliedEmpFilters.statusF !== "All" && (
            <span
              style={{
                padding: "3px 10px 3px 8px",
                background: F.infoBg,
                border: `1px solid ${F.brand}40`,
                borderRadius: 12,
                fontSize: 12,
                color: F.brand,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              Status: {appliedEmpFilters.statusF}
            </span>
          )}
          {appliedEmpFilters.typeF !== "All" && (
            <span
              style={{
                padding: "3px 10px 3px 8px",
                background: F.infoBg,
                border: `1px solid ${F.brand}40`,
                borderRadius: 12,
                fontSize: 12,
                color: F.brand,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              Type: {appliedEmpFilters.typeF}
            </span>
          )}
          {appliedEmpFilters.locF !== "All" && (
            <span
              style={{
                padding: "3px 10px 3px 8px",
                background: F.infoBg,
                border: `1px solid ${F.brand}40`,
                borderRadius: 12,
                fontSize: 12,
                color: F.brand,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              Location: {appliedEmpFilters.locF}
            </span>
          )}
          {appliedEmpFilters.ssF !== "All" && (
            <span
              style={{
                padding: "3px 10px 3px 8px",
                background: F.infoBg,
                border: `1px solid ${F.brand}40`,
                borderRadius: 12,
                fontSize: 12,
                color: F.brand,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              Structure: {appliedEmpFilters.ssF}
            </span>
          )}
          {appliedEmpFilters.dojYear !== "All" && (
            <span
              style={{
                padding: "3px 10px 3px 8px",
                background: F.infoBg,
                border: `1px solid ${F.brand}40`,
                borderRadius: 12,
                fontSize: 12,
                color: F.brand,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              Joined: {appliedEmpFilters.dojYear}
            </span>
          )}
          {appliedEmpFilters.salMin && (
            <span
              style={{
                padding: "3px 10px 3px 8px",
                background: F.infoBg,
                border: `1px solid ${F.brand}40`,
                borderRadius: 12,
                fontSize: 12,
                color: F.brand,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              Min: ₹{appliedEmpFilters.salMin}K
            </span>
          )}
          {appliedEmpFilters.salMax && (
            <span
              style={{
                padding: "3px 10px 3px 8px",
                background: F.infoBg,
                border: `1px solid ${F.brand}40`,
                borderRadius: 12,
                fontSize: 12,
                color: F.brand,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              Max: ₹{appliedEmpFilters.salMax}K
            </span>
          )}
          <span style={{ fontSize: 12, color: F.text3, alignSelf: "center" }}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {selectedEmployeeIds.length > 0 && (
        <div style={{ background: F.card, border: `1px solid ${F.border}`, borderRadius: 8, padding: "12px 14px", marginBottom: 12, display: "flex", alignItems: "end", gap: 10, flexWrap: "wrap", boxShadow: "0 2px 8px rgba(15,23,42,0.08)" }}>
          <Fld label="Bulk operation"><select style={{ ...iSt, width: 210 }} value={bulkAction} onChange={(e) => setBulkAction(e.target.value)}><option value="export_payslips">Export payslip package</option><option value="portal_invite">Send portal invitations</option><option value="assign_structure">Assign salary structure</option><option value="request_documents">Request employee documents</option><option value="activate">Activate employee access</option><option value="deactivate">Deactivate employee access</option></select></Fld>
          {bulkAction === "assign_structure" && <Fld label="Salary structure"><select style={{ ...iSt, width: 210 }} value={bulkStructure} onChange={(e) => setBulkStructure(e.target.value)}>{ss.map((structure) => <option key={structure.id}>{structure.name}</option>)}</select></Fld>}
          {["request_documents", "deactivate"].includes(bulkAction) && <Fld label="Reason *"><input style={{ ...iSt, width: 250 }} value={bulkReason} onChange={(e) => setBulkReason(e.target.value)} placeholder={bulkAction === "deactivate" ? "e.g. Separation processed" : "e.g. Updated proof required"} /></Fld>}
          <Btn onClick={runBulkAction}>Apply to {selectedEmployeeIds.length}</Btn>
          <button onClick={() => setSelectedEmployeeIds([])} style={{ border: "none", background: "transparent", color: F.text2, cursor: "pointer", fontFamily: "inherit", padding: "9px 6px" }}>Clear selection</button>
          <span style={{ marginLeft: "auto", alignSelf: "center", color: F.brand, background: F.infoBg, borderRadius: 16, padding: "6px 11px", fontWeight: 800, fontSize: 12 }}>{selectedEmployeeIds.length} selected</span>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10, position: "relative" }}>
        <Btn small variant="secondary" onClick={() => setShowColumnManager(!showColumnManager)}>☷ Columns</Btn>
        {showColumnManager && <div style={{ position: "absolute", top: 34, right: 0, zIndex: 5, width: 330, background: F.card, border: `1px solid ${F.border}`, borderRadius: 8, padding: 12, boxShadow: "0 8px 24px rgba(15,23,42,0.18)" }}><div style={{ fontSize: 13, fontWeight: 800, marginBottom: 8 }}>Table columns</div><div style={{ fontSize: 11, color: F.text2, marginBottom: 10 }}>Drag the ⠿ handle to rearrange. Check columns to show or hide them.</div>{employeeColumns.map((column) => <div key={column.id} draggable onDragStart={() => setDraggedColumnId(column.id)} onDragOver={(event) => event.preventDefault()} onDrop={() => dropEmployeeColumn(column.id)} onDragEnd={() => setDraggedColumnId(null)} style={{ display: "grid", gridTemplateColumns: "18px 22px 1fr", alignItems: "center", gap: 7, padding: "8px 4px", borderRadius: 5, cursor: "grab", background: draggedColumnId === column.id ? F.infoBg : "transparent", border: `1px solid ${draggedColumnId === column.id ? F.brand : "transparent"}` }}><span title="Drag to rearrange" style={{ color: F.text3, fontSize: 16, letterSpacing: -2 }}>⠿</span><input type="checkbox" checked={column.visible} onClick={(event) => event.stopPropagation()} onChange={() => setEmployeeColumns(employeeColumns.map((item) => item.id === column.id ? { ...item, visible: !item.visible } : item))} /><span style={{ fontSize: 12, fontWeight: 600 }}>{column.label}</span></div>)}</div>}
      </div>

      <div style={{ background: F.card, border: `1px solid ${F.border}`, borderRadius: 8, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", minWidth: 850 }}><thead><tr><Th><input aria-label="Select visible employees" type="checkbox" checked={allVisibleSelected} onChange={toggleVisibleSelection} /></Th>{visibleEmployeeColumns.map((column) => <Th key={column.id} right={column.id === "salary"}>{column.label}</Th>)}</tr></thead><tbody>{paginatedEmployees.map((employee) => <TrH key={employee.id}><Td><input aria-label={`Select ${employee.name}`} type="checkbox" checked={selectedEmployeeIds.includes(employee.id)} onClick={(event) => event.stopPropagation()} onChange={() => setSelectedEmployeeIds(selectedEmployeeIds.includes(employee.id) ? selectedEmployeeIds.filter((id) => id !== employee.id) : [...selectedEmployeeIds, employee.id])} /></Td>{visibleEmployeeColumns.map((column) => <Td key={column.id} right={column.id === "salary"} onClick={() => openEmployeeDetail(employee)} style={{ cursor: "pointer" }}>{employeeCell(employee, column.id)}</Td>)}</TrH>)}</tbody></table></div>
        <Pagination page={employeePage} pageSize={employeePageSize} total={filtered.length} onPageChange={setEmployeePage} />
      </div>

      <div
        style={{
          display: "none", background: F.card,
          border: `1px solid ${F.border}`,
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
          <thead>
            <tr>
              <Th><input aria-label="Select visible employees" type="checkbox" checked={allVisibleSelected} onChange={toggleVisibleSelection} /></Th>
              <Th>Employee</Th>
              <Th>Department</Th>
              <Th>Designation</Th>
              <Th>Type</Th>
              <Th>Location</Th>
              <Th right>Gross Salary</Th>
              <Th>Joined</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={10}
                  style={{
                    padding: 48,
                    textAlign: "center",
                    color: F.text3,
                    fontSize: 13,
                  }}
                >
                  No employees match filters.
                </td>
              </tr>
            )}
            {paginatedEmployees.map((e) => (
              <TrH
                key={e.id}
                onClick={() => setSubPage({ type: "detail", emp: e })}
              >
                <Td><input aria-label={`Select ${e.name}`} type="checkbox" checked={selectedEmployeeIds.includes(e.id)} onClick={(event) => event.stopPropagation()} onChange={() => setSelectedEmployeeIds(selectedEmployeeIds.includes(e.id) ? selectedEmployeeIds.filter((id) => id !== e.id) : [...selectedEmployeeIds, e.id])} /></Td>
                <Td>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        background:
                          e.status === "Incomplete" ? "#E9730C" : F.brand,
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {e.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: 13,
                          color:
                            e.status === "Incomplete" ? "#0070F2" : F.text1,
                        }}
                      >
                        {e.name}
                      </div>
                      <div style={{ fontSize: 11, color: F.text3 }}>
                        {e.id} · {e.designation}
                      </div>
                    </div>
                  </div>
                </Td>
                <Td>{e.status === "Incomplete" ? "-" : e.department}</Td>
                <Td>
                  <span style={{ fontSize: 12 }}>{e.designation}</span>
                </Td>
                <Td>
                  {e.status === "Incomplete" ? (
                    <span style={{ fontSize: 12, color: F.text3 }}>-</span>
                  ) : (
                    <Badge
                      label={e.empType}
                      color={e.empType === "Contract" ? F.warning : F.brand}
                      bg={e.empType === "Contract" ? F.warningBg : F.infoBg}
                    />
                  )}
                </Td>
                <Td>{e.status === "Incomplete" ? "-" : e.location}</Td>
                <Td right>
                  <span style={{ fontWeight: 700 }}>
                    {e.status === "Incomplete" ? "-" : inr(e.grossSalary)}
                  </span>
                </Td>
                <Td>{fmtD(e.doj)}</Td>
                <Td colSpan={e.status === "Incomplete" ? 1 : 1}>
                  {e.status === "Incomplete" ? (
                    <div
                      style={{
                        background: "#FFF8E1",
                        border: "1px solid #FFE082",
                        borderRadius: 6,
                        padding: "6px 12px",
                        display: "flex",
                        alignItems: "center",
                        justify: "space-between",
                        gap: 8,
                        width: "100%",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          color: "#B78103",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        ℹ️ This employee's profile is incomplete.
                      </span>
                      <button
                        onClick={(ev) => {
                          ev.stopPropagation()
                          setSubPage({ type: "new" })
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#0070F2",
                          fontWeight: 700,
                          fontSize: 12,
                          cursor: "pointer",
                          padding: 0,
                        }}
                      >
                        Complete now
                      </button>
                    </div>
                  ) : (
                    empBadge(e.status)
                  )}
                </Td>
                <Td>
                  <div
                    style={{ display: "flex", gap: 4 }}
                    onClick={(ev) => ev.stopPropagation()}
                  >
                    {e.status === "Incomplete" ? (
                      <Btn
                        small
                        variant="secondary"
                        onClick={() => setSubPage({ type: "new" })}
                      >
                        Complete Setup
                      </Btn>
                    ) : (
                      <>
                        <Btn
                          small
                          variant="secondary"
                          onClick={() => setSubPage({ type: "detail", emp: e })}
                        >
                          View
                        </Btn>
                        <Btn
                          small
                          variant={e.status === "Active" ? "danger" : "success"}
                          onClick={() => toggleStatus(e)}
                        >
                          {e.status === "Active" ? "Deactivate" : "Activate"}
                        </Btn>
                      </>
                    )}
                  </div>
                </Td>
              </TrH>
            ))}
          </tbody>
        </table>
        </div>
        <Pagination page={employeePage} pageSize={employeePageSize} total={filtered.length} onPageChange={setEmployeePage} />
      </div>

      {showAdd && (
        <Modal title="Add New Employee" onClose={() => setShowAdd(false)}>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <Fld label="Full Name *">
              <input
                style={iSt}
                value={addForm.name}
                onChange={(e) =>
                  setAddForm({ ...addForm, name: e.target.value })
                }
                placeholder="e.g. Priya Nair"
              />
            </Fld>
            <Fld label="Email *">
              <input
                style={iSt}
                value={addForm.email}
                onChange={(e) =>
                  setAddForm({ ...addForm, email: e.target.value })
                }
                placeholder="priya@company.in"
              />
            </Fld>
            <Fld label="Department">
              <select
                style={iSt}
                value={addForm.department}
                onChange={(e) =>
                  setAddForm({ ...addForm, department: e.target.value })
                }
              >
                {[
                  "Engineering",
                  "HR",
                  "Finance",
                  "Sales",
                  "Design",
                  "Management",
                  "Operations",
                ].map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </Fld>
            <Fld label="Designation">
              <input
                style={iSt}
                value={addForm.designation}
                onChange={(e) =>
                  setAddForm({ ...addForm, designation: e.target.value })
                }
              />
            </Fld>
            <Fld label="Date of Joining">
              <StrictDateInput
                style={iSt}
                value={addForm.doj}
                onChange={(value) =>
                  setAddForm({ ...addForm, doj: value })
                }
              />
            </Fld>
            <Fld label="Employment Type">
              <select
                style={iSt}
                value={addForm.empType}
                onChange={(e) =>
                  setAddForm({
                    ...addForm,
                    empType: e.target.value as Employee["empType"],
                  })
                }
              >
                <option>Full-Time</option>
                <option>Part-Time</option>
                <option>Contract</option>
              </select>
            </Fld>
            <Fld label="Work Location">
              <input
                style={iSt}
                value={addForm.location}
                onChange={(e) =>
                  setAddForm({ ...addForm, location: e.target.value })
                }
              />
            </Fld>
            <Fld label="Reporting Manager">
              <select
                style={iSt}
                value={addForm.manager}
                onChange={(e) =>
                  setAddForm({ ...addForm, manager: e.target.value })
                }
              >
                <option value="">— none —</option>
                {emps.map((e) => (
                  <option key={e.id}>{e.name}</option>
                ))}
              </select>
            </Fld>
            <Fld label="Salary Structure">
              <select
                style={iSt}
                value={addForm.salaryStructure}
                onChange={(e) =>
                  setAddForm({ ...addForm, salaryStructure: e.target.value })
                }
              >
                {ss.map((s) => (
                  <option key={s.id}>
                    {s.name} ({inr(s.gross)}/mo)
                  </option>
                ))}
              </select>
            </Fld>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              marginTop: 18,
            }}
          >
            <Btn variant="secondary" onClick={() => setShowAdd(false)}>
              Cancel
            </Btn>
            <Btn onClick={addEmployee}>Save Employee</Btn>
          </div>
        </Modal>
      )}

      {editEmp && (
        <Modal
          title={`Edit - ${editEmp.name}`}
          onClose={() => setEditEmp(null)}
        >
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <Fld label="Full Name">
              <input
                style={iSt}
                value={editEmp.name}
                onChange={(e) =>
                  setEditEmp({ ...editEmp, name: e.target.value })
                }
              />
            </Fld>
            <Fld label="Email">
              <input
                style={iSt}
                value={editEmp.email}
                onChange={(e) =>
                  setEditEmp({ ...editEmp, email: e.target.value })
                }
              />
            </Fld>
            <Fld label="Department">
              <select
                style={iSt}
                value={editEmp.department}
                onChange={(e) =>
                  setEditEmp({ ...editEmp, department: e.target.value })
                }
              >
                {[
                  "Engineering",
                  "HR",
                  "Finance",
                  "Sales",
                  "Design",
                  "Management",
                  "Operations",
                ].map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </Fld>
            <Fld label="Designation">
              <input
                style={iSt}
                value={editEmp.designation}
                onChange={(e) =>
                  setEditEmp({ ...editEmp, designation: e.target.value })
                }
              />
            </Fld>
            <Fld label="Work Location">
              <input
                style={iSt}
                value={editEmp.location}
                onChange={(e) =>
                  setEditEmp({ ...editEmp, location: e.target.value })
                }
              />
            </Fld>
            <Fld label="Employment Type">
              <select
                style={iSt}
                value={editEmp.empType}
                onChange={(e) =>
                  setEditEmp({
                    ...editEmp,
                    empType: e.target.value as Employee["empType"],
                  })
                }
              >
                <option>Full-Time</option>
                <option>Part-Time</option>
                <option>Contract</option>
              </select>
            </Fld>
            <Fld label="Salary Structure">
              <select
                style={iSt}
                value={editEmp.salaryStructure}
                onChange={(e) =>
                  setEditEmp({
                    ...editEmp,
                    salaryStructure: e.target.value,
                    grossSalary:
                      ss.find((s) => s.name === e.target.value)?.gross ??
                      editEmp.grossSalary,
                  })
                }
              >
                {ss.map((s) => (
                  <option key={s.id}>
                    {s.name} ({inr(s.gross)}/mo)
                  </option>
                ))}
              </select>
            </Fld>
            <Fld label="Status">
              <select
                style={iSt}
                value={editEmp.status}
                onChange={(e) =>
                  setEditEmp({
                    ...editEmp,
                    status: e.target.value as EmpStatus,
                  })
                }
              >
                <option>Active</option>
                <option>Inactive</option>
                <option>On Leave</option>
              </select>
            </Fld>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              marginTop: 18,
            }}
          >
            <Btn variant="secondary" onClick={() => setEditEmp(null)}>
              Cancel
            </Btn>
            <Btn onClick={saveEdit}>Save Changes</Btn>
          </div>
        </Modal>
      )}

      {confirm && (
        <Confirm
          msg={confirm.msg}
          onOk={confirm.onOk}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  )
}

function SalaryManagementView({
  emps,
  ss,
  setSS,
  setEmps,
}: {
  emps: Employee[]
  ss: SalaryStructure[]
  setSS: React.Dispatch<React.SetStateAction<SalaryStructure[]>>
  setEmps: React.Dispatch<React.SetStateAction<Employee[]>>
}) {
  const toast = useToast()
  const [tab, setTab] = useState<"structures" | "components" | "templates" | "assignment">(
    "structures",
  )
  const [structurePage, setStructurePage] = useState(1)
  const [componentPage, setComponentPage] = useState(1)
  const [templatePage, setTemplatePage] = useState(1)
  const [assignmentPage, setAssignmentPage] = useState(1)
  // Keep these registers compact enough that pagination is available and useful
  // for structures, components, templates, and employee assignments alike.
  const salaryTablePageSize = 3
  const salaryWorkflowSteps = [
    "Draft",
    "Calculated",
    "Review",
    "Approved",
    "Paid & Disbursed",
    "Locked",
  ]
  const [salaryRunStatus, setSalaryRunStatus] = useState("Calculated")
  const [showGuidedSalaryRun, setShowGuidedSalaryRun] = useState(false)
  const [salaryWizardStep, setSalaryWizardStep] = useState<1 | 2>(1)
  const [salaryCycle, setSalaryCycle] = useState("August 2026")
  const [salaryDate, setSalaryDate] = useState("2026-08-28")
  const [salaryScope, setSalaryScope] = useState<"All Employees" | "Specific Employees" | "Department Batch">("All Employees")
  const [salaryNote, setSalaryNote] = useState("August regular monthly salary cycle")
  const [wizardSearch, setWizardSearch] = useState("")
  const [appliedWizardSearch, setAppliedWizardSearch] = useState("")
  const [hasRunWizardSearch, setHasRunWizardSearch] = useState(false)
  const [wizardSelectedIds, setWizardSelectedIds] = useState<string[]>([])
  const [traceRow, setTraceRow] = useState<{
    emp: Employee
    structure?: SalaryStructure
    gross: number
    deductions: number
    net: number
    pf: number
    tds: number
    pt: number
  } | null>(null)
  const [showNewSS, setShowNewSS] = useState(false)
  const [editSS, setEditSS] = useState<SalaryStructure | null>(null)
  const [assignEmp, setAssignEmp] = useState<Employee | null>(null)
  const [assignStructure, setAssignStructure] = useState("")
  const [salaryComponents, setSalaryComponents] = useState<SalaryComponent[]>(
    INIT_SALARY_COMPONENTS,
  )
  const [editComponent, setEditComponent] = useState<SalaryComponent | null>(null)
  const [showNewComponent, setShowNewComponent] = useState(false)
  const [componentDraft, setComponentDraft] = useState<SalaryComponent>({
    id: "",
    name: "",
    kind: "earning",
    type: "Fixed",
    calculation: "",
    basis: "Gross salary",
    frequency: "Monthly",
    effectiveFrom: "2026-04-01",
    rounding: "Nearest rupee",
    taxable: "Yes",
    active: true,
  })
  const [componentFilterDraft, setComponentFilterDraft] = useState({
    search: "",
    kind: "All",
    type: "All",
    taxable: "All",
    active: "All",
  })
  const [componentFilters, setComponentFilters] = useState(componentFilterDraft)
  const [hasRunComponentSearch, setHasRunComponentSearch] = useState(false)
  const [assignDept, setAssignDept] = useState("All")
  const [assignType, setAssignType] = useState("All")
  const [assignDesignation, setAssignDesignation] = useState("All")
  const [assignSearch, setAssignSearch] = useState("")
  const [assignSort, setAssignSort] = useState("name-asc")
  const [appliedAssignFilters, setAppliedAssignFilters] = useState({
    assignDept: "All",
    assignType: "All",
    assignDesignation: "All",
    assignSearch: "",
    assignSort: "name-asc",
  })
  const [hasRunAssignmentSearch, setHasRunAssignmentSearch] = useState(false)
  const [selectedEmpIds, setSelectedEmpIds] = useState<string[]>([])
  const [bulkStructure, setBulkStructure] = useState(ss[0]?.name ?? "")
  const [newSS, setNewSS] = useState({
    name: "",
    basic: 0,
    hra: 0,
    fixedAllowance: 0,
    specialAllowance: 0,
  })
  const [templateDraft, setTemplateDraft] = useState({
    name: "",
    grade: "Mid Level",
    assignMode: "No Assignment",
    assignTarget: "",
    basic: 45000,
    hra: 18000,
    fixedAllowance: 9000,
    specialAllowance: 8000,
  })

  const saveNewSS = () => {
    if (!newSS.name) return toast("Structure name is required", "error")
    const gross =
      newSS.basic + newSS.hra + newSS.fixedAllowance + newSS.specialAllowance
    setSS([
      ...ss,
      { id: `SS-${String(ss.length + 1).padStart(3, "0")}`, ...newSS, gross },
    ])
    setShowNewSS(false)
    setNewSS({
      name: "",
      basic: 0,
      hra: 0,
      fixedAllowance: 0,
      specialAllowance: 0,
    })
    toast("Salary structure created", "success")
  }
  const saveEditSS = () => {
    if (!editSS) return
    const gross =
      editSS.basic +
      editSS.hra +
      editSS.fixedAllowance +
      editSS.specialAllowance
    setSS(ss.map((s) => (s.id === editSS.id ? { ...editSS, gross } : s)))
    setEditSS(null)
    toast("Salary structure updated", "success")
  }
  const openAssign = (emp: Employee) => {
    setAssignEmp(emp)
    setAssignStructure(emp.salaryStructure)
  }
  const saveAssignment = () => {
    if (!assignEmp) return
    const structure = ss.find((s) => s.name === assignStructure)
    if (!structure) return toast("Select a valid salary structure", "error")
    setEmps((prev) =>
      prev.map((e) =>
        e.id === assignEmp.id
          ? { ...e, salaryStructure: structure.name, grossSalary: structure.gross }
          : e,
      ),
    )
    setAssignEmp(null)
    toast(`${assignEmp.name} assigned to ${structure.name}`, "success")
  }
  const saveComponent = () => {
    const draft = editComponent ?? componentDraft
    if (!draft.name.trim()) return toast("Component name is required", "error")
    if (!draft.calculation.trim()) return toast("Calculation rule is required", "error")
    if (editComponent) {
      setSalaryComponents((prev) =>
        prev.map((c) => (c.id === editComponent.id ? { ...draft, name: draft.name.trim() } : c)),
      )
      setEditComponent(null)
      toast("Salary component updated", "success")
    } else {
      setSalaryComponents((prev) => [
        ...prev,
        {
          ...draft,
          id: `SC-${String(prev.length + 1).padStart(3, "0")}`,
          name: draft.name.trim(),
        },
      ])
      setShowNewComponent(false)
      setComponentDraft({
        id: "",
        name: "",
        kind: "earning",
        type: "Fixed",
        calculation: "",
        basis: "Gross salary",
        frequency: "Monthly",
        effectiveFrom: "2026-04-01",
        rounding: "Nearest rupee",
        taxable: "Yes",
        active: true,
      })
      toast("Salary component added", "success")
    }
  }
  const filteredSalaryComponents = hasRunComponentSearch ? salaryComponents.filter(
    (c) =>
      searchMatches(componentFilters.search, [
        c.name,
        c.calculation,
        c.basis,
        c.type,
      ]) &&
      (componentFilters.kind === "All" || c.kind === componentFilters.kind) &&
      (componentFilters.type === "All" || c.type === componentFilters.type) &&
      (componentFilters.taxable === "All" || c.taxable === componentFilters.taxable) &&
      (componentFilters.active === "All" ||
        (componentFilters.active === "Active" ? c.active : !c.active)),
  ) : []
  const assignmentRows = hasRunAssignmentSearch ? emps.filter(
    (e) =>
      (appliedAssignFilters.assignDept === "All" || e.department === appliedAssignFilters.assignDept) &&
      (appliedAssignFilters.assignType === "All" || e.empType === appliedAssignFilters.assignType) &&
      (appliedAssignFilters.assignDesignation === "All" || e.designation === appliedAssignFilters.assignDesignation) &&
      searchMatches(appliedAssignFilters.assignSearch, [e.name, e.id, e.department, e.designation]),
  ).sort((a, b) => {
    const dir = appliedAssignFilters.assignSort.endsWith("-desc") ? -1 : 1
    if (appliedAssignFilters.assignSort.startsWith("salary")) {
      return (a.grossSalary - b.grossSalary) * dir
    }
    if (appliedAssignFilters.assignSort.startsWith("team")) {
      return a.department.localeCompare(b.department) * dir
    }
    if (appliedAssignFilters.assignSort.startsWith("structure")) {
      return a.salaryStructure.localeCompare(b.salaryStructure) * dir
    }
    return a.name.localeCompare(b.name) * dir
  }) : []
  const pagedStructures = ss.slice((structurePage - 1) * salaryTablePageSize, structurePage * salaryTablePageSize)
  const pagedComponents = filteredSalaryComponents.slice((componentPage - 1) * salaryTablePageSize, componentPage * salaryTablePageSize)
  const pagedTemplates = ss.slice((templatePage - 1) * salaryTablePageSize, templatePage * salaryTablePageSize)
  const pagedAssignments = assignmentRows.slice((assignmentPage - 1) * salaryTablePageSize, assignmentPage * salaryTablePageSize)

  const applyAssignFilters = () => {
    setHasRunAssignmentSearch(true)
    setAppliedAssignFilters({
      assignDept,
      assignType,
      assignDesignation,
      assignSearch,
      assignSort,
    })
  }
  const clearAssignFilters = () => {
    setHasRunAssignmentSearch(false)
    setAssignDept("All")
    setAssignType("All")
    setAssignDesignation("All")
    setAssignSearch("")
    setAssignSort("name-asc")
    setAppliedAssignFilters({
      assignDept: "All",
      assignType: "All",
      assignDesignation: "All",
      assignSearch: "",
      assignSort: "name-asc",
    })
  }
  const visibleIds = assignmentRows.map((e) => e.id)
  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedEmpIds.includes(id))
  const toggleVisibleSelection = () => {
    setSelectedEmpIds((prev) =>
      allVisibleSelected
        ? prev.filter((id) => !visibleIds.includes(id))
        : Array.from(new Set([...prev, ...visibleIds])),
    )
  }
  const applyBulkAssignment = () => {
    const structure = ss.find((s) => s.name === bulkStructure)
    if (!structure) return toast("Select a salary structure", "error")
    if (selectedEmpIds.length === 0)
      return toast("Select at least one employee for batch assignment", "error")
    setEmps((prev) =>
      prev.map((e) =>
        selectedEmpIds.includes(e.id)
          ? { ...e, salaryStructure: structure.name, grossSalary: structure.gross }
          : e,
      ),
    )
    toast(`${selectedEmpIds.length} employee salary assignments updated`, "success")
    setSelectedEmpIds([])
  }
  const templateGross =
    templateDraft.basic +
    templateDraft.hra +
    templateDraft.fixedAllowance +
    templateDraft.specialAllowance
  const templateAssignees = emps.filter((e) => {
    if (templateDraft.assignMode === "All Employees") return true
    if (templateDraft.assignMode === "Team" || templateDraft.assignMode === "Department") {
      return e.department === templateDraft.assignTarget
    }
    if (templateDraft.assignMode === "Designation") return e.designation === templateDraft.assignTarget
    return false
  })
  const templateDepartments = Array.from(
    new Set(emps.map((e) => e.department.trim()).filter(Boolean)),
  ).sort()
  const templateDesignations = Array.from(
    new Set(emps.map((e) => e.designation.trim()).filter(Boolean)),
  ).sort()
  const createTemplate = () => {
    if (!templateDraft.name.trim()) return toast("Template name is required", "error")
    const structure: SalaryStructure = {
      id: `SS-${String(ss.length + 1).padStart(3, "0")}`,
      name: templateDraft.name.trim(),
      basic: templateDraft.basic,
      hra: templateDraft.hra,
      fixedAllowance: templateDraft.fixedAllowance,
      specialAllowance: templateDraft.specialAllowance,
      gross: templateGross,
    }
    setSS((prev) => [...prev, structure])
    if (templateAssignees.length > 0) {
      const ids = new Set(templateAssignees.map((e) => e.id))
      setEmps((prev) =>
        prev.map((e) =>
          ids.has(e.id)
            ? { ...e, salaryStructure: structure.name, grossSalary: structure.gross }
            : e,
        ),
      )
    }
    toast(
      templateAssignees.length > 0
        ? `Template created and assigned to ${templateAssignees.length} employees`
        : "Salary template created",
      "success",
    )
    setTemplateDraft({
      name: "",
      grade: "Mid Level",
      assignMode: "No Assignment",
      assignTarget: "",
      basic: 45000,
      hra: 18000,
      fixedAllowance: 9000,
      specialAllowance: 8000,
    })
  }
  const salaryCalculationRows = emps
    .filter((e) => e.status === "Active")
    .map((emp) => {
      const structure = ss.find((s) => s.name === emp.salaryStructure)
      const gross = structure?.gross ?? emp.grossSalary
      const pf = Math.round((structure?.basic ?? gross * 0.4) * 0.12)
      const tds = Math.round(gross * 0.1)
      const pt = 200
      const deductions = pf + tds + pt
      return {
        emp,
        structure,
        gross,
        pf,
        tds,
        pt,
        deductions,
        net: gross - deductions,
      }
    })
  const totalGrossSalary = salaryCalculationRows.reduce((sum, row) => sum + row.gross, 0)
  const totalSalaryDeductions = salaryCalculationRows.reduce((sum, row) => sum + row.deductions, 0)
  const totalNetSalary = salaryCalculationRows.reduce((sum, row) => sum + row.net, 0)
  const activeStepIndex = salaryWorkflowSteps.indexOf(salaryRunStatus)
  const advanceSalaryStatus = () => {
    const next = salaryWorkflowSteps[Math.min(activeStepIndex + 1, salaryWorkflowSteps.length - 1)]
    setSalaryRunStatus(next)
    toast(`Salary workflow moved to ${next}`, "success")
  }
  const filteredWizardEmployees = hasRunWizardSearch ? emps.filter((e) =>
    searchMatches(appliedWizardSearch, [e.name, e.id, e.department, e.designation]),
  ) : []
  const wizardTargetEmployees = (() => {
    if (salaryScope === "Specific Employees") {
      return emps.filter((e) => wizardSelectedIds.includes(e.id))
    }
    if (salaryScope === "Department Batch") {
      const department = wizardSelectedIds[0]
      return emps.filter((e) => e.department === department)
    }
    return emps.filter((e) => e.status === "Active")
  })()
  const executeGuidedSalaryRun = () => {
    if (salaryScope === "Specific Employees" && wizardSelectedIds.length === 0) {
      return toast("Select at least one employee for the salary run", "error")
    }
    if (salaryScope === "Department Batch" && !wizardSelectedIds[0]) {
      return toast("Select a department for the salary run", "error")
    }
    setSalaryRunStatus("Calculated")
    setShowGuidedSalaryRun(false)
    setSalaryWizardStep(1)
    toast(`${salaryCycle} salary run calculated for ${wizardTargetEmployees.length} employees`, "success")
  }

  return (
    <div>
      <PH
        title="Salary Management"
        sub="Configure salary components, structures, and employee assignments"
      />
      <TabBar
        tabs={[
          { id: "structures", label: "Salary Structures" },
          { id: "components", label: "Salary Components" },
          { id: "templates", label: "Structure Templates" },
          { id: "assignment", label: "Employee Assignment" },
        ]}
        active={tab}
        onSelect={(t) => setTab(t as typeof tab)}
      />

      {tab === "review" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: F.text1 }}>
                {salaryCycle} Salary Review
              </h2>
              <div style={{ marginTop: 5, display: "flex", gap: 8, alignItems: "center" }}>
                <Badge
                  label={salaryRunStatus}
                  color={salaryRunStatus === "Approved" || salaryRunStatus === "Paid & Disbursed" ? F.success : F.warning}
                  bg={salaryRunStatus === "Approved" || salaryRunStatus === "Paid & Disbursed" ? F.successBg : F.warningBg}
                  dot={salaryRunStatus === "Approved" || salaryRunStatus === "Paid & Disbursed" ? F.success : F.warning}
                />
                <span style={{ fontSize: 12, color: F.text2 }}>
                  Salary structures, statutory deductions, and employee assignments verified from live records
                </span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn variant="secondary" onClick={() => setShowGuidedSalaryRun(true)}>
                Execute Guided Salary Run
              </Btn>
              <Btn
                onClick={advanceSalaryStatus}
                disabled={salaryRunStatus === "Locked"}
              >
                {salaryRunStatus === "Calculated"
                  ? "Authorize & Approve Salary"
                  : salaryRunStatus === "Approved"
                    ? "Disburse & Mark as Paid"
                    : salaryRunStatus === "Locked"
                      ? "Workflow Locked"
                      : "Advance Workflow"}
              </Btn>
            </div>
          </div>

          <div
            style={{
              background: F.card,
              border: `1px solid ${F.border}`,
              borderRadius: 8,
              padding: "28px 30px",
              boxShadow: "0 2px 8px rgba(15,23,42,0.05)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              {salaryWorkflowSteps.map((step, index) => {
                const complete = index < activeStepIndex
                const active = index === activeStepIndex
                return (
                  <Fragment key={step}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 88 }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: complete ? F.brand : active ? F.infoBg : F.card,
                          border: `2px solid ${complete || active ? F.brand : "#B8C7D9"}`,
                          color: complete ? "#fff" : active ? F.brand : "#8A9AAF",
                          fontWeight: 900,
                          fontSize: 13,
                        }}
                      >
                        {complete ? "Done" : index + 1}
                      </div>
                      <div
                        style={{
                          marginTop: 8,
                          fontSize: 12,
                          fontWeight: active || complete ? 900 : 700,
                          color: active || complete ? F.brand : "#8A9AAF",
                          textAlign: "center",
                        }}
                      >
                        {step}
                      </div>
                    </div>
                    {index < salaryWorkflowSteps.length - 1 && (
                      <div
                        style={{
                          flex: 1,
                          height: 4,
                          borderRadius: 4,
                          background: index < activeStepIndex ? F.brand : "#E1E8F0",
                          margin: "0 4px 24px",
                        }}
                      />
                    )}
                  </Fragment>
                )
              })}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(180px, 1fr))", gap: 14 }}>
            <Tile label="Total Workforce" value={`${salaryCalculationRows.length} Staff`} sub="100% calculated and verified" accent={F.brand} />
            <Tile label="Total Gross Salary" value={inr(totalGrossSalary)} sub="Earnings and fixed additions" accent="#0F6CBD" />
            <Tile label="Total Deductions" value={`-${inr(totalSalaryDeductions)}`} sub="EPF, PT, TDS and statutory items" accent={F.error} />
            <Tile label="Net Payout Disbursed" value={inr(totalNetSalary)} sub="To be credited via direct NEFT" accent={F.success} />
          </div>

          <div>
            <div style={{ marginBottom: 10 }}>
              <span style={{ fontSize: 15, fontWeight: 900, color: F.text1 }}>
                Employee Salary Calculations
              </span>
              <span style={{ marginLeft: 8, fontSize: 12, color: F.text2 }}>
                Click Edit to review and adjust salary calculation details for each employee
              </span>
            </div>
            <div
              style={{
                background: F.card,
                border: `1px solid ${F.border}`,
                borderRadius: 8,
                overflow: "hidden",
                boxShadow: "0 1px 5px rgba(15,23,42,0.04)",
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 980 }}>
                <thead>
                  <tr>
                    <Th>Employee</Th>
                    <Th>Department</Th>
                    <Th>Payable / LOP</Th>
                    <Th right>Gross Earnings</Th>
                    <Th right>Deductions</Th>
                    <Th right>Net Payout</Th>
                    <Th>Review Status</Th>
                    <Th>Audit & Payslip</Th>
                  </tr>
                </thead>
                <tbody>
                  {salaryCalculationRows.map((row) => (
                    <TrH key={row.emp.id}>
                      <Td>
                        <div style={{ fontWeight: 900, color: F.text1 }}>{row.emp.name}</div>
                        <div style={{ fontSize: 11, color: F.text2 }}>
                          {row.emp.id} - {row.emp.designation}
                        </div>
                      </Td>
                      <Td>{row.emp.department}</Td>
                      <Td>
                        <strong style={{ color: F.success }}>30d</strong>
                        <div style={{ fontSize: 11, color: F.text3 }}>LOP 0d</div>
                      </Td>
                      <Td right><strong>{inr(row.gross)}</strong></Td>
                      <Td right style={{ color: F.error, fontWeight: 800 }}>
                        -{inr(row.deductions)}
                      </Td>
                      <Td right>
                        <strong style={{ color: F.success, fontSize: 14 }}>{inr(row.net)}</strong>
                      </Td>
                      <Td>
                        <Badge label="Verified" color={F.success} bg={F.successBg} dot={F.success} />
                      </Td>
                      <Td>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <Btn small variant="secondary" onClick={() => setTraceRow(row)}>
                            Edit
                          </Btn>
                          <Btn
                            small
                            title={`Download PDF payslip for ${row.emp.name}`}
                            onClick={() => downloadPayslipPdf({ grossSalary: row.gross, totalEarnings: row.gross, pf: row.pf, tds: row.tds, profTax: row.pt, totalDeductions: row.deductions, netSalary: row.net }, { period: salaryCycle, generatedOn: salaryDate }, row.emp)}
                          >
                            <DownloadIcon />
                            Download PDF
                          </Btn>
                        </div>
                      </Td>
                    </TrH>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === "structures" && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <Btn
              variant="secondary"
              onClick={() => toast("Structures exported as CSV", "success")}
            >
              Export
            </Btn>
            <Btn onClick={() => setShowNewSS(true)}>+ New Structure</Btn>
          </div>
          <div
            style={{
              background: F.card,
              border: `1px solid ${F.border}`,
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <Th>Structure Name</Th>
                  <Th right>Basic</Th>
                  <Th right>HRA</Th>
                  <Th right>Fixed Allow.</Th>
                  <Th right>Special Allow.</Th>
                  <Th right>Monthly Gross</Th>
                  <Th right>Annual CTC</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {pagedStructures.map((s) => (
                  <TrH key={s.id}>
                    <Td>
                      <span style={{ fontWeight: 600, color: F.brand }}>
                        {s.name}
                      </span>
                      <div style={{ fontSize: 11, color: F.text3 }}>{s.id}</div>
                    </Td>
                    <Td right>{inr(s.basic)}</Td>
                    <Td right>{inr(s.hra)}</Td>
                    <Td right>{inr(s.fixedAllowance)}</Td>
                    <Td right>{inr(s.specialAllowance)}</Td>
                    <Td right>
                      <strong>{inr(s.gross)}</strong>
                    </Td>
                    <Td right>{inr(s.gross * 12)}</Td>
                    <Td>
                      <div style={{ display: "flex", gap: 4 }}>
                        <Btn
                          small
                          variant="secondary"
                          onClick={() => setEditSS({ ...s })}
                        >
                          Edit
                        </Btn>
                      </div>
                    </Td>
                  </TrH>
                ))}
              </tbody>
            </table>
            <Pagination page={structurePage} pageSize={salaryTablePageSize} total={ss.length} onPageChange={setStructurePage} />
          </div>
        </div>
      )}

      {tab === "components" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            <Tile label="Components" value={String(filteredSalaryComponents.length)} sub="Visible payroll rules" accent={F.brand} />
            <Tile label="Earnings" value={String(filteredSalaryComponents.filter((c) => c.kind === "earning").length)} sub="Salary additions" accent={F.success} />
            <Tile label="Deductions" value={String(filteredSalaryComponents.filter((c) => c.kind === "deduction").length)} sub="Statutory and manual cuts" accent={F.error} />
            <Tile label="Active Rules" value={String(filteredSalaryComponents.filter((c) => c.active).length)} sub="Used in payroll processing" accent="#00A389" />
          </div>
          <div
            style={{
              background: F.card,
              border: `1px solid ${F.border}`,
              borderRadius: 8,
              padding: 14,
              display: "grid",
              gridTemplateColumns: "minmax(220px, 1.5fr) repeat(4, minmax(120px, 1fr)) auto",
              gap: 10,
              alignItems: "end",
            }}
          >
            <ValueHelp
              label="Search Components"
              value={componentFilterDraft.search}
              onChange={(v) => setComponentFilterDraft({ ...componentFilterDraft, search: v })}
              placeholder="Search component, basis, or rule..."
              values={salaryComponents.map((c) => c.name)}
            />
            <Fld label="Group">
              <select value={componentFilterDraft.kind} onChange={(e) => setComponentFilterDraft({ ...componentFilterDraft, kind: e.target.value })} style={iSt}>
                <option>All</option>
                <option value="earning">Earning</option>
                <option value="deduction">Deduction</option>
              </select>
            </Fld>
            <Fld label="Type">
              <select value={componentFilterDraft.type} onChange={(e) => setComponentFilterDraft({ ...componentFilterDraft, type: e.target.value })} style={iSt}>
                <option>All</option>
                <option>Fixed</option>
                <option>Variable</option>
                <option>Statutory</option>
                <option>Manual</option>
              </select>
            </Fld>
            <Fld label="Taxability">
              <select value={componentFilterDraft.taxable} onChange={(e) => setComponentFilterDraft({ ...componentFilterDraft, taxable: e.target.value })} style={iSt}>
                <option>All</option>
                <option>Yes</option>
                <option>No</option>
                <option>Partial</option>
              </select>
            </Fld>
            <Fld label="Status">
              <select value={componentFilterDraft.active} onChange={(e) => setComponentFilterDraft({ ...componentFilterDraft, active: e.target.value })} style={iSt}>
                <option>All</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </Fld>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn onClick={() => { setComponentFilters(componentFilterDraft); setHasRunComponentSearch(true) }}>Go</Btn>
              <Btn
                variant="secondary"
                onClick={() => {
                  const empty = { search: "", kind: "All", type: "All", taxable: "All", active: "All" }
                  setComponentFilterDraft(empty)
                  setComponentFilters(empty)
                  setHasRunComponentSearch(false)
                }}
              >
                Clear
              </Btn>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ color: F.text2, fontSize: 12, fontWeight: 700 }}>
              {filteredSalaryComponents.length} of {salaryComponents.length} component rules shown
            </div>
            <Btn onClick={() => setShowNewComponent(true)}>+ Add Component</Btn>
          </div>
          <div
            style={{
              background: F.card,
              border: `1px solid ${F.border}`,
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: `1px solid ${F.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: F.pageBg,
              }}
            >
              <div>
                <div style={{ fontSize: 16, fontWeight: 900, color: F.text1 }}>
                  Centralized Salary Component Register
                </div>
                <div style={{ fontSize: 12, color: F.text2, marginTop: 2 }}>
                  Earnings and deductions governed from one payroll rule ledger
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Badge label={`${filteredSalaryComponents.filter((c) => c.kind === "earning").length} earnings`} color={F.success} bg={F.successBg} />
                <Badge label={`${filteredSalaryComponents.filter((c) => c.kind === "deduction").length} deductions`} color={F.error} bg={F.errorBg} />
              </div>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <Th>Group</Th>
                  <Th>Component</Th>
                  <Th>Rule & Basis</Th>
                  <Th>Frequency</Th>
                  <Th>Taxability</Th>
                  <Th>Effective</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {filteredSalaryComponents.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: 36, textAlign: "center", color: F.text3 }}>
                      No salary components match the applied filters.
                    </td>
                  </tr>
                ) : (
                  pagedComponents.map((c) => (
                    <TrH key={c.id}>
                      <Td>
                        <Badge
                          label={c.kind === "earning" ? "Earning" : "Deduction"}
                          color={c.kind === "earning" ? F.success : F.error}
                          bg={c.kind === "earning" ? F.successBg : F.errorBg}
                        />
                      </Td>
                      <Td>
                        <div style={{ fontWeight: 900 }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: F.text3 }}>{c.id} - {c.type}</div>
                      </Td>
                      <Td style={{ fontSize: 12, color: F.text2 }}>
                        <div style={{ fontWeight: 700, color: F.text1 }}>{c.calculation}</div>
                        <div style={{ fontSize: 11, color: F.text3 }}>
                          Basis: {c.basis} - {c.rounding}
                        </div>
                      </Td>
                      <Td>{c.frequency}</Td>
                      <Td>
                        <Badge
                          label={c.taxable}
                          color={c.taxable === "Yes" ? F.warning : c.taxable === "Partial" ? F.brand : F.text2}
                          bg={c.taxable === "Yes" ? F.warningBg : c.taxable === "Partial" ? F.infoBg : F.pageBg}
                        />
                      </Td>
                      <Td>{fmtD(c.effectiveFrom)}</Td>
                      <Td>
                        <Badge
                          label={c.active ? "Active" : "Inactive"}
                          color={c.active ? F.success : F.text3}
                          bg={c.active ? F.successBg : F.pageBg}
                          dot={c.active ? F.success : F.text3}
                        />
                      </Td>
                      <Td>
                        <div style={{ display: "flex", gap: 6 }}>
                          <Btn small variant="secondary" onClick={() => setEditComponent({ ...c })}>Edit</Btn>
                          <Btn
                            small
                            variant={c.active ? "ghost" : "success"}
                            onClick={() => {
                              setSalaryComponents((prev) =>
                                prev.map((item) => item.id === c.id ? { ...item, active: !item.active } : item),
                              )
                              toast(`${c.name} ${c.active ? "disabled" : "enabled"}`, "success")
                            }}
                          >
                            {c.active ? "Disable" : "Enable"}
                          </Btn>
                        </div>
                      </Td>
                    </TrH>
                  ))
                )}
              </tbody>
            </table>
            <Pagination page={componentPage} pageSize={salaryTablePageSize} total={filteredSalaryComponents.length} onPageChange={setComponentPage} />
          </div>
        </div>
      )}

      {tab === "templates" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 16, alignItems: "start" }}>
            <div style={{ background: F.card, border: `1px solid ${F.border}`, borderRadius: 8, overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", borderBottom: `1px solid ${F.border}`, background: F.pageBg }}>
                <div style={{ fontSize: 16, fontWeight: 900 }}>Create Salary Structure Template</div>
                <div style={{ fontSize: 12, color: F.text2, marginTop: 2 }}>
                  Build a reusable compensation template and optionally assign it immediately.
                </div>
              </div>
              <div style={{ padding: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Fld label="Template Name">
                  <input
                    value={templateDraft.name}
                    onChange={(e) => setTemplateDraft({ ...templateDraft, name: e.target.value })}
                    style={iSt}
                    placeholder="e.g. AI Engineer Level 2"
                  />
                </Fld>
                <Fld label="Compensation Grade">
                  <select value={templateDraft.grade} onChange={(e) => setTemplateDraft({ ...templateDraft, grade: e.target.value })} style={iSt}>
                    <option>Entry Level</option>
                    <option>Mid Level</option>
                    <option>Senior Level</option>
                    <option>Leadership</option>
                    <option>Executive</option>
                  </select>
                </Fld>
                <Fld label="Basic">
                  <input type="number" value={templateDraft.basic} onChange={(e) => setTemplateDraft({ ...templateDraft, basic: Number(e.target.value) })} style={iSt} />
                </Fld>
                <Fld label="HRA">
                  <input type="number" value={templateDraft.hra} onChange={(e) => setTemplateDraft({ ...templateDraft, hra: Number(e.target.value) })} style={iSt} />
                </Fld>
                <Fld label="Fixed Allowance">
                  <input type="number" value={templateDraft.fixedAllowance} onChange={(e) => setTemplateDraft({ ...templateDraft, fixedAllowance: Number(e.target.value) })} style={iSt} />
                </Fld>
                <Fld label="Special Allowance">
                  <input type="number" value={templateDraft.specialAllowance} onChange={(e) => setTemplateDraft({ ...templateDraft, specialAllowance: Number(e.target.value) })} style={iSt} />
                </Fld>
                <Fld label="Assign Template">
                  <select
                    value={templateDraft.assignMode}
                    onChange={(e) => setTemplateDraft({ ...templateDraft, assignMode: e.target.value, assignTarget: "" })}
                    style={iSt}
                  >
                    <option>No Assignment</option>
                    <option>All Employees</option>
                    <option>Department</option>
                    <option>Designation</option>
                  </select>
                </Fld>
                <Fld label="Assignment Target">
                  <select
                    value={templateDraft.assignTarget}
                    onChange={(e) => setTemplateDraft({ ...templateDraft, assignTarget: e.target.value })}
                    disabled={["No Assignment", "All Employees"].includes(templateDraft.assignMode)}
                    style={iSt}
                  >
                    <option value="">Select target</option>
                    {(templateDraft.assignMode === "Department"
                      ? templateDepartments
                      : templateDesignations
                    ).map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </Fld>
              </div>
              <div style={{ padding: "0 18px 18px", display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <Btn
                  variant="secondary"
                  onClick={() =>
                    setTemplateDraft({
                      name: "",
                      grade: "Mid Level",
                      assignMode: "No Assignment",
                      assignTarget: "",
                      basic: 45000,
                      hra: 18000,
                      fixedAllowance: 9000,
                      specialAllowance: 8000,
                    })
                  }
                >
                  Reset
                </Btn>
                <Btn onClick={createTemplate}>Create Template</Btn>
              </div>
            </div>

            <div style={{ background: F.card, border: `1px solid ${F.border}`, borderRadius: 8, overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", borderBottom: `1px solid ${F.border}`, background: F.successBg }}>
                <div style={{ fontSize: 16, fontWeight: 900, color: F.success }}>Template Preview</div>
                <div style={{ fontSize: 12, color: F.text2, marginTop: 2 }}>{templateDraft.grade} compensation model</div>
              </div>
              <div style={{ padding: 18 }}>
                <IR label="Monthly Gross" value={inr(templateGross)} />
                <IR label="Annual CTC" value={inr(templateGross * 12)} />
                <IR label="Basic Share" value={`${templateGross ? Math.round((templateDraft.basic / templateGross) * 100) : 0}%`} />
                <IR label="Allowance Share" value={`${templateGross ? Math.round(((templateDraft.hra + templateDraft.fixedAllowance + templateDraft.specialAllowance) / templateGross) * 100) : 0}%`} />
                <IR label="Immediate Assignment" value={`${templateAssignees.length} employees`} />
              </div>
            </div>
          </div>

          <div style={{ background: F.card, border: `1px solid ${F.border}`, borderRadius: 8, overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${F.border}`, background: F.pageBg }}>
              <div style={{ fontSize: 16, fontWeight: 900 }}>Existing Structure Templates</div>
              <div style={{ fontSize: 12, color: F.text2, marginTop: 2 }}>
                Reuse templates from the assignment tab or edit them in Salary Structures.
              </div>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <Th>Template</Th>
                  <Th right>Monthly Gross</Th>
                  <Th right>Annual CTC</Th>
                  <Th>Composition</Th>
                  <Th>Usage</Th>
                  <Th>Action</Th>
                </tr>
              </thead>
              <tbody>
                {pagedTemplates.map((s) => {
                  const used = emps.filter((e) => e.salaryStructure === s.name).length
                  return (
                    <TrH key={s.id}>
                      <Td>
                        <div style={{ fontWeight: 900 }}>{s.name}</div>
                        <div style={{ fontSize: 11, color: F.text3 }}>{s.id}</div>
                      </Td>
                      <Td right>{inr(s.gross)}</Td>
                      <Td right>{inr(s.gross * 12)}</Td>
                      <Td>
                        <div style={{ fontSize: 12, color: F.text2 }}>
                          Basic {inr(s.basic)} - HRA {inr(s.hra)}
                        </div>
                        <div style={{ fontSize: 11, color: F.text3 }}>
                          Allowances {inr(s.fixedAllowance + s.specialAllowance)}
                        </div>
                      </Td>
                      <Td>
                        <Badge label={`${used} assigned`} color={used ? F.success : F.text3} bg={used ? F.successBg : F.pageBg} />
                      </Td>
                      <Td>
                        <Btn small variant="secondary" onClick={() => setEditSS({ ...s })}>Edit Template</Btn>
                      </Td>
                    </TrH>
                  )
                })}
              </tbody>
            </table>
            <Pagination page={templatePage} pageSize={salaryTablePageSize} total={ss.length} onPageChange={setTemplatePage} />
          </div>
        </div>
      )}

      {tab === "assignment" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            <Tile label="Filtered Employees" value={String(assignmentRows.length)} sub="Ready for assignment" accent={F.brand} />
            <Tile label="Selected Batch" value={String(selectedEmpIds.length)} sub="Employees selected" accent={F.success} />
            <Tile label="Teams" value={String(new Set(emps.map((e) => e.department)).size)} sub="Department filters" accent="#00A389" />
            <Tile label="Structures" value={String(ss.length)} sub="Available pay templates" accent={F.warning} />
          </div>
          <div
            style={{
              background: F.card,
              border: `1px solid ${F.border}`,
              borderRadius: 8,
              padding: 14,
              display: "grid",
              gridTemplateColumns: "1.4fr repeat(4, minmax(130px, 1fr)) auto auto",
              gap: 10,
              alignItems: "end",
            }}
          >
            <ValueHelp
              label="Search Employees"
              value={assignSearch}
              onChange={setAssignSearch}
              placeholder="Search name, ID, team, designation..."
              values={emps.map((e) => `${e.name} (${e.id})`)}
            />
            <Fld label="Team">
              <select value={assignDept} onChange={(e) => setAssignDept(e.target.value)} style={iSt}>
                <option>All</option>
                {Array.from(new Set(emps.map((e) => e.department))).sort().map((d) => <option key={d}>{d}</option>)}
              </select>
            </Fld>
            <Fld label="Role Type">
              <select value={assignType} onChange={(e) => setAssignType(e.target.value)} style={iSt}>
                <option>All</option>
                <option>Full-Time</option>
                <option>Part-Time</option>
                <option>Contract</option>
              </select>
            </Fld>
            <Fld label="Designation">
              <select value={assignDesignation} onChange={(e) => setAssignDesignation(e.target.value)} style={iSt}>
                <option>All</option>
                {Array.from(new Set(emps.map((e) => e.designation))).sort().map((d) => <option key={d}>{d}</option>)}
              </select>
            </Fld>
            <Fld label="Sort By">
              <select value={assignSort} onChange={(e) => setAssignSort(e.target.value)} style={iSt}>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="team-asc">Team A-Z</option>
                <option value="salary-desc">Salary High-Low</option>
                <option value="salary-asc">Salary Low-High</option>
                <option value="structure-asc">Structure A-Z</option>
              </select>
            </Fld>
            <Btn onClick={applyAssignFilters}>Go</Btn>
            <Btn variant="secondary" onClick={clearAssignFilters}>
              Clear Filters
            </Btn>
          </div>
          <div
            style={{
              background: F.infoBg,
              border: `1px solid ${F.brand}30`,
              borderRadius: 8,
              padding: 14,
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              alignItems: "end",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", gap: 10, alignItems: "end", flexWrap: "wrap" }}>
              <Fld label="Batch Salary Structure">
                <select value={bulkStructure} onChange={(e) => setBulkStructure(e.target.value)} style={{ ...iSt, width: 260 }}>
                  {ss.map((s) => <option key={s.id} value={s.name}>{s.name} - {inr(s.gross)}/mo</option>)}
                </select>
              </Fld>
              <Btn variant="secondary" onClick={toggleVisibleSelection}>
                {allVisibleSelected ? "Clear Visible" : "Select Visible"}
              </Btn>
              <Btn onClick={applyBulkAssignment} disabled={selectedEmpIds.length === 0}>
                Assign Batch
              </Btn>
            </div>
            <Btn
              variant="secondary"
              onClick={() => {
                setAssignDept("All")
                setAssignType("All")
                setAssignDesignation("All")
                setAssignSearch("")
                setSelectedEmpIds([])
              }}
            >
              Reset
            </Btn>
          </div>
          <div
            style={{
              background: F.card,
              border: `1px solid ${F.border}`,
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "12px 18px",
                borderBottom: `1px solid ${F.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 800, color: F.text1 }}>
                Employee Salary Assignment
              </span>
              <Btn small variant="secondary" onClick={() => toast("Assignment report exported", "success")}>
                Export
              </Btn>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <Th>
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleVisibleSelection}
                      title="Select all visible employees"
                    />
                  </Th>
                  <Th>Employee</Th>
                  <Th>Team / Role</Th>
                  <Th>Current Structure</Th>
                  <Th right>Gross</Th>
                  <Th right>Net Approx.</Th>
                  <Th>Action</Th>
                </tr>
              </thead>
              <tbody>
                {assignmentRows.length === 0 ? (
                  <tr><td colSpan={7} style={{ padding: 36, textAlign: "center", color: F.text3 }}>No employees match the assignment filters.</td></tr>
                ) : pagedAssignments.map((e) => {
                  const s = ss.find((x) => x.name === e.salaryStructure)
                  const pf = s ? Math.round(s.basic * 0.12) : 0
                  const tds = Math.round(e.grossSalary * 0.1)
                  const checked = selectedEmpIds.includes(e.id)
                  return (
                    <TrH key={e.id}>
                      <Td>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            setSelectedEmpIds((prev) =>
                              checked ? prev.filter((id) => id !== e.id) : [...prev, e.id],
                            )
                          }
                          title={`Select ${e.name}`}
                        />
                      </Td>
                      <Td>
                        <div style={{ fontWeight: 800 }}>{e.name}</div>
                        <div style={{ fontSize: 11, color: F.text3 }}>{e.id}</div>
                      </Td>
                      <Td>
                        <div style={{ fontWeight: 600 }}>{e.department}</div>
                        <div style={{ fontSize: 11, color: F.text3 }}>{e.designation} - {e.empType}</div>
                      </Td>
                      <Td>
                        <Badge label={e.salaryStructure} color={F.brand} bg={F.infoBg} />
                      </Td>
                      <Td right>{inr(e.grossSalary)}</Td>
                      <Td right><strong>{inr(e.grossSalary - pf - tds - 200)}</strong></Td>
                      <Td>
                        <Btn small variant="secondary" onClick={() => openAssign(e)}>
                          Assign
                        </Btn>
                      </Td>
                    </TrH>
                  )
                })}
              </tbody>
            </table>
            <Pagination page={assignmentPage} pageSize={salaryTablePageSize} total={assignmentRows.length} onPageChange={setAssignmentPage} />
          </div>
        </div>
      )}

      {showGuidedSalaryRun && (
        <Modal
          title="Execute Guided Salary Run"
          onClose={() => {
            setShowGuidedSalaryRun(false)
            setSalaryWizardStep(1)
          }}
          wide
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ color: F.text2, fontSize: 13 }}>
              Calculate salary structures, assignment scope, statutory deductions, and employee net payouts.
            </div>

            {salaryWizardStep === 1 ? (
              <>
                <div
                  style={{
                    borderBottom: `1px solid ${F.border}`,
                    paddingBottom: 10,
                    fontSize: 12,
                    fontWeight: 900,
                    color: "#304156",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  Step 1: Select salary cycle and run scope
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <Fld label="Salary Month">
                    <select
                      value={salaryCycle}
                      onChange={(e) => setSalaryCycle(e.target.value)}
                      style={iSt}
                    >
                      {["June 2026", "July 2026", "August 2026", "September 2026"].map((period) => (
                        <option key={period}>{period}</option>
                      ))}
                    </select>
                  </Fld>
                  <Fld label="Disbursement / Pay Date">
                    <StrictDateInput
                      value={salaryDate}
                      onChange={setSalaryDate}
                      style={iSt}
                    />
                  </Fld>
                </div>
                <Fld label="Salary Run Target Scope">
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                    {(["All Employees", "Specific Employees", "Department Batch"] as const).map((scope) => {
                      const active = salaryScope === scope
                      return (
                        <button
                          key={scope}
                          onClick={() => {
                            setSalaryScope(scope)
                            setWizardSelectedIds([])
                          }}
                          style={{
                            border: `1px solid ${active ? F.brand : F.border}`,
                            borderRadius: 8,
                            background: active ? F.infoBg : F.card,
                            padding: "14px 16px",
                            textAlign: "left",
                            cursor: "pointer",
                            fontFamily: "inherit",
                          }}
                        >
                          <div style={{ fontSize: 13, fontWeight: 900, color: F.text1 }}>{scope}</div>
                          <div style={{ fontSize: 12, color: F.text2, marginTop: 4 }}>
                            {scope === "All Employees"
                              ? "Full organization monthly batch"
                              : scope === "Specific Employees"
                                ? "Off-cycle or selective staff"
                                : "Single department group"}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </Fld>

                {salaryScope === "Specific Employees" && (
                  <div
                    style={{
                      border: `1px solid ${F.border}`,
                      borderRadius: 8,
                      padding: 14,
                      background: F.pageBg,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <strong style={{ fontSize: 13 }}>
                        Select employees for this run ({wizardSelectedIds.length} selected)
                      </strong>
                      <button
                        onClick={() =>
                          setWizardSelectedIds(
                            wizardSelectedIds.length === filteredWizardEmployees.length
                              ? []
                              : filteredWizardEmployees.map((e) => e.id),
                          )
                        }
                        style={{
                          background: "transparent",
                          border: "none",
                          color: F.brand,
                          cursor: "pointer",
                          fontWeight: 800,
                          fontFamily: "inherit",
                        }}
                      >
                        {wizardSelectedIds.length === filteredWizardEmployees.length ? "Clear All" : "Select All"}
                      </button>
                    </div>
                    <ValueHelp
                      value={wizardSearch}
                      onChange={setWizardSearch}
                      placeholder="Search employees by name, code, team, or designation..."
                      values={emps.map((e) => `${e.name} (${e.id})`)}
                    />
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      <Btn small onClick={() => { setAppliedWizardSearch(wizardSearch); setHasRunWizardSearch(true) }}>
                        Go
                      </Btn>
                      <Btn
                        small
                        variant="secondary"
                        onClick={() => {
                          setWizardSearch("")
                          setAppliedWizardSearch("")
                          setHasRunWizardSearch(false)
                        }}
                      >
                        Clear Filters
                      </Btn>
                    </div>
                    <div style={{ marginTop: 12, maxHeight: 220, overflowY: "auto", border: `1px solid ${F.border}`, borderRadius: 8, background: F.card }}>
                      {filteredWizardEmployees.map((emp) => (
                        <label
                          key={emp.id}
                          style={{
                            display: "grid",
                            gridTemplateColumns: "28px 1fr auto",
                            gap: 10,
                            alignItems: "center",
                            padding: "12px 14px",
                            borderBottom: `1px solid ${F.border}60`,
                            cursor: "pointer",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={wizardSelectedIds.includes(emp.id)}
                            onChange={() =>
                              setWizardSelectedIds((prev) =>
                                prev.includes(emp.id)
                                  ? prev.filter((id) => id !== emp.id)
                                  : [...prev, emp.id],
                              )
                            }
                          />
                          <span>
                            <strong>{emp.name}</strong>
                            <span style={{ color: F.text3, fontSize: 11 }}> - {emp.id}</span>
                            <div style={{ color: F.text2, fontSize: 12 }}>
                              {emp.designation} - {emp.department}
                            </div>
                          </span>
                          <strong>{inr(emp.grossSalary * 12)} CTC</strong>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {salaryScope === "Department Batch" && (
                  <Fld label="Department">
                    <select
                      value={wizardSelectedIds[0] ?? ""}
                      onChange={(e) => setWizardSelectedIds(e.target.value ? [e.target.value] : [])}
                      style={iSt}
                    >
                      <option value="">Select department</option>
                      {Array.from(new Set(emps.map((e) => e.department))).sort().map((dept) => (
                        <option key={dept}>{dept}</option>
                      ))}
                    </select>
                  </Fld>
                )}

                <Fld label="Run Description / Cycle Note">
                  <input
                    value={salaryNote}
                    onChange={(e) => setSalaryNote(e.target.value)}
                    style={iSt}
                    placeholder="Add a run note"
                  />
                </Fld>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                  <Btn
                    variant="secondary"
                    onClick={() => {
                      setShowGuidedSalaryRun(false)
                      setSalaryWizardStep(1)
                    }}
                  >
                    Cancel
                  </Btn>
                  <Btn onClick={() => setSalaryWizardStep(2)}>Continue</Btn>
                </div>
              </>
            ) : (
              <>
                <div
                  style={{
                    borderBottom: `1px solid ${F.border}`,
                    paddingBottom: 10,
                    fontSize: 12,
                    fontWeight: 900,
                    color: "#304156",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  Step 2: Verify statutory and salary inputs
                </div>
                <div
                  style={{
                    background: F.pageBg,
                    border: `1px solid ${F.border}`,
                    borderRadius: 8,
                    padding: 18,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <IR label="Run Target" value={`${salaryScope} (${wizardTargetEmployees.length} staff)`} />
                  <IR label="Disbursement Date" value={salaryDate} />
                  <IR label="Salary Structures" value={`${ss.length} active templates available`} />
                  <IR label="Statutory Deductions Engine" value="EPF, Professional Tax and TDS active" />
                  <IR label="Cycle Note" value={salaryNote || "No note added"} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <Btn variant="secondary" onClick={() => setSalaryWizardStep(1)}>
                    Back
                  </Btn>
                  <Btn onClick={executeGuidedSalaryRun}>Execute Salary Run Now</Btn>
                </div>
              </>
            )}
          </div>
        </Modal>
      )}

      {traceRow && (
        <Modal
          title={`Edit Calculation - ${traceRow.emp.name}`}
          onClose={() => setTraceRow(null)}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ background: F.infoBg, border: `1px solid ${F.brand}30`, borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 900 }}>{traceRow.emp.id} - {traceRow.emp.designation}</div>
              <div style={{ fontSize: 12, color: F.text2, marginTop: 4 }}>
                Structure: {traceRow.structure?.name ?? traceRow.emp.salaryStructure}
              </div>
            </div>
            <IR label="Gross Earnings" value={inr(traceRow.gross)} />
            <IR label="Provident Fund" value={`-${inr(traceRow.pf)}`} />
            <IR label="Income Tax TDS" value={`-${inr(traceRow.tds)}`} />
            <IR label="Professional Tax" value={`-${inr(traceRow.pt)}`} />
            <IR label="Total Deductions" value={`-${inr(traceRow.deductions)}`} />
            <div
              style={{
                background: F.successBg,
                border: `1px solid ${F.success}30`,
                borderRadius: 8,
                padding: 14,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <strong>Net Payout</strong>
              <strong style={{ color: F.success, fontSize: 22 }}>{inr(traceRow.net)}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Btn variant="secondary" onClick={() => setTraceRow(null)}>Close</Btn>
            </div>
          </div>
        </Modal>
      )}

      {(showNewComponent || editComponent) && (
        <Modal
          title={editComponent ? `Edit Component - ${editComponent.name}` : "Add Salary Component"}
          onClose={() => {
            setShowNewComponent(false)
            setEditComponent(null)
          }}
        >
          {(() => {
            const draft = editComponent ?? componentDraft
            const update = (patch: Partial<SalaryComponent>) => {
              if (editComponent) setEditComponent({ ...editComponent, ...patch })
              else setComponentDraft({ ...componentDraft, ...patch })
            }
            return (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <Fld label="Component Name">
                    <input
                      value={draft.name}
                      onChange={(e) => update({ name: e.target.value })}
                      style={iSt}
                      placeholder="e.g. Shift Allowance"
                    />
                  </Fld>
                  <Fld label="Component Group">
                    <select value={draft.kind} onChange={(e) => update({ kind: e.target.value as SalaryComponent["kind"] })} style={iSt}>
                      <option value="earning">Earning</option>
                      <option value="deduction">Deduction</option>
                    </select>
                  </Fld>
                  <Fld label="Type">
                    <select value={draft.type} onChange={(e) => update({ type: e.target.value as SalaryComponent["type"] })} style={iSt}>
                      <option>Fixed</option>
                      <option>Variable</option>
                      <option>Statutory</option>
                      <option>Manual</option>
                    </select>
                  </Fld>
                  <Fld label="Taxable">
                    <select value={draft.taxable} onChange={(e) => update({ taxable: e.target.value as SalaryComponent["taxable"] })} style={iSt}>
                      <option>Yes</option>
                      <option>No</option>
                      <option>Partial</option>
                    </select>
                  </Fld>
                  <Fld label="Calculation Basis">
                    <select value={draft.basis} onChange={(e) => update({ basis: e.target.value })} style={iSt}>
                      <option>Gross salary</option>
                      <option>Basic salary</option>
                      <option>Taxable income</option>
                      <option>Structure amount</option>
                      <option>Manual input</option>
                    </select>
                  </Fld>
                  <Fld label="Frequency">
                    <select value={draft.frequency} onChange={(e) => update({ frequency: e.target.value as SalaryComponent["frequency"] })} style={iSt}>
                      <option>Monthly</option>
                      <option>One-time</option>
                      <option>Quarterly</option>
                      <option>Annual</option>
                    </select>
                  </Fld>
                  <Fld label="Effective From">
                    <StrictDateInput
                      value={draft.effectiveFrom}
                      onChange={(value) => update({ effectiveFrom: value })}
                      style={iSt}
                    />
                  </Fld>
                  <Fld label="Rounding Rule">
                    <select value={draft.rounding} onChange={(e) => update({ rounding: e.target.value as SalaryComponent["rounding"] })} style={iSt}>
                      <option>Nearest rupee</option>
                      <option>No rounding</option>
                      <option>Round up</option>
                    </select>
                  </Fld>
                </div>
                <Fld label="Calculation Rule">
                  <input
                    value={draft.calculation}
                    onChange={(e) => update({ calculation: e.target.value })}
                    style={iSt}
                    placeholder="e.g. 10% of Basic or manual payroll input"
                  />
                </Fld>
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: F.text1 }}>
                  <input
                    type="checkbox"
                    checked={draft.active}
                    onChange={(e) => update({ active: e.target.checked })}
                  />
                  Active in payroll processing
                </label>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 10,
                    padding: 12,
                    background: F.pageBg,
                    border: `1px solid ${F.border}`,
                    borderRadius: 8,
                  }}
                >
                  <IR label="Component Group" value={draft.kind === "earning" ? "Earning" : "Deduction"} />
                  <IR label="Payroll Frequency" value={draft.frequency} />
                  <IR label="Impacted Employees" value={String(emps.length)} />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                  <Btn
                    variant="secondary"
                    onClick={() => {
                      setShowNewComponent(false)
                      setEditComponent(null)
                    }}
                  >
                    Cancel
                  </Btn>
                  <Btn onClick={saveComponent}>{editComponent ? "Save Component" : "Add Component"}</Btn>
                </div>
              </div>
            )
          })()}
        </Modal>
      )}

      {showNewSS && (
        <Modal title="New Salary Structure" onClose={() => setShowNewSS(false)}>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <Fld label="Structure Name *">
              <input
                style={iSt}
                value={newSS.name}
                onChange={(e) => setNewSS({ ...newSS, name: e.target.value })}
                placeholder="e.g. Lead Engineer"
              />
            </Fld>
            <div />
            <Fld label="Basic (per month)">
              <input
                type="number"
                style={iSt}
                value={newSS.basic || ""}
                onChange={(e) =>
                  setNewSS({ ...newSS, basic: Number(e.target.value) })
                }
              />
            </Fld>
            <Fld label="HRA (per month)">
              <input
                type="number"
                style={iSt}
                value={newSS.hra || ""}
                onChange={(e) =>
                  setNewSS({ ...newSS, hra: Number(e.target.value) })
                }
              />
            </Fld>
            <Fld label="Fixed Allowance (per month)">
              <input
                type="number"
                style={iSt}
                value={newSS.fixedAllowance || ""}
                onChange={(e) =>
                  setNewSS({ ...newSS, fixedAllowance: Number(e.target.value) })
                }
              />
            </Fld>
            <Fld label="Special Allowance (per month)">
              <input
                type="number"
                style={iSt}
                value={newSS.specialAllowance || ""}
                onChange={(e) =>
                  setNewSS({
                    ...newSS,
                    specialAllowance: Number(e.target.value),
                  })
                }
              />
            </Fld>
          </div>
          <div
            style={{
              marginTop: 12,
              padding: 12,
              background: F.successBg,
              borderRadius: 4,
              fontSize: 13,
              fontWeight: 600,
              color: F.success,
            }}
          >
            Monthly Gross:{" "}
            {inr(
              newSS.basic +
                newSS.hra +
                newSS.fixedAllowance +
                newSS.specialAllowance,
            )}{" "}
            - Annual CTC:{" "}
            {inr(
              (newSS.basic +
                newSS.hra +
                newSS.fixedAllowance +
                newSS.specialAllowance) *
                12,
            )}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              marginTop: 16,
            }}
          >
            <Btn variant="secondary" onClick={() => setShowNewSS(false)}>
              Cancel
            </Btn>
            <Btn onClick={saveNewSS}>Create Structure</Btn>
          </div>
        </Modal>
      )}

      {assignEmp && (
        <Modal
          title={`Assign Salary Structure - ${assignEmp.name}`}
          onClose={() => setAssignEmp(null)}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div
              style={{
                background: F.infoBg,
                border: `1px solid ${F.brand}30`,
                borderRadius: 6,
                padding: 12,
                fontSize: 13,
                color: F.text1,
              }}
            >
              <strong>{assignEmp.id}</strong> currently uses{" "}
              <strong>{assignEmp.salaryStructure}</strong> with gross pay{" "}
              <strong>{inr(assignEmp.grossSalary)}</strong>.
            </div>
            <Fld label="Salary Structure">
              <select
                value={assignStructure}
                onChange={(e) => setAssignStructure(e.target.value)}
                style={iSt}
              >
                {ss.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name} - {inr(s.gross)} monthly gross
                  </option>
                ))}
              </select>
            </Fld>
            {(() => {
              const selected = ss.find((s) => s.name === assignStructure)
              if (!selected) return null
              return (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 10,
                    fontSize: 12,
                  }}
                >
                  <IR label="Basic" value={inr(selected.basic)} />
                  <IR label="HRA" value={inr(selected.hra)} />
                  <IR label="Allowances" value={inr(selected.fixedAllowance + selected.specialAllowance)} />
                  <IR label="Monthly Gross" value={inr(selected.gross)} />
                </div>
              )
            })()}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <Btn variant="secondary" onClick={() => setAssignEmp(null)}>
                Cancel
              </Btn>
              <Btn onClick={saveAssignment}>Assign</Btn>
            </div>
          </div>
        </Modal>
      )}

      {editSS && (
        <Modal
          title={`Edit Structure - ${editSS.name}`}
          onClose={() => setEditSS(null)}
        >
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <Fld label="Structure Name">
              <input
                style={iSt}
                value={editSS.name}
                onChange={(e) => setEditSS({ ...editSS, name: e.target.value })}
              />
            </Fld>
            <div />
            <Fld label="Basic">
              <input
                type="number"
                style={iSt}
                value={editSS.basic}
                onChange={(e) =>
                  setEditSS({ ...editSS, basic: Number(e.target.value) })
                }
              />
            </Fld>
            <Fld label="HRA">
              <input
                type="number"
                style={iSt}
                value={editSS.hra}
                onChange={(e) =>
                  setEditSS({ ...editSS, hra: Number(e.target.value) })
                }
              />
            </Fld>
            <Fld label="Fixed Allowance">
              <input
                type="number"
                style={iSt}
                value={editSS.fixedAllowance}
                onChange={(e) =>
                  setEditSS({
                    ...editSS,
                    fixedAllowance: Number(e.target.value),
                  })
                }
              />
            </Fld>
            <Fld label="Special Allowance">
              <input
                type="number"
                style={iSt}
                value={editSS.specialAllowance}
                onChange={(e) =>
                  setEditSS({
                    ...editSS,
                    specialAllowance: Number(e.target.value),
                  })
                }
              />
            </Fld>
          </div>
          <div
            style={{
              marginTop: 12,
              padding: 12,
              background: F.successBg,
              borderRadius: 4,
              fontSize: 13,
              fontWeight: 600,
              color: F.success,
            }}
          >
            Monthly Gross:{" "}
            {inr(
              editSS.basic +
                editSS.hra +
                editSS.fixedAllowance +
                editSS.specialAllowance,
            )}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              marginTop: 16,
            }}
          >
            <Btn variant="secondary" onClick={() => setEditSS(null)}>
              Cancel
            </Btn>
            <Btn onClick={saveEditSS}>Save Changes</Btn>
          </div>
        </Modal>
      )}
    </div>
  )
}

function PayRunsView({
  payruns,
  setPayruns,
  emps,
  ss,
}: {
  payruns: Payrun[]
  setPayruns: React.Dispatch<React.SetStateAction<Payrun[]>>
  emps: Employee[]
  ss: SalaryStructure[]
}) {
  const toast = useToast()
  const [payrollTab, setPayrollTab] = useState<"run" | "history">("run")
  const [activeRunId, setActiveRunId] = useState<string>(
    payruns.find((p) => p.period === "August 2026")?.id || payruns[0]?.id || ""
  )
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(2) // 0: Attendance, 1: Additions, 2: Review, 3: Approval
  const [historyPage, setHistoryPage] = useState(1)
  const [hasRunHistorySearch, setHasRunHistorySearch] = useState(false)
  const [calculationPage, setCalculationPage] = useState(1)
  const calculationPageSize = 5

  // History Filter Bar State (Draft + Applied)
  const [showHistoryFilterBar, setShowHistoryFilterBar] = useState(true)

  const [periodDraft, setPeriodDraft] = useState("")
  const [yearDraft, setYearDraft] = useState("all")
  const [statusDraft, setStatusDraft] = useState("all")
  const [monthDraft, setMonthDraft] = useState("all")
  const [minAmountDraft, setMinAmountDraft] = useState("all")

  const [appliedPeriod, setAppliedPeriod] = useState("")
  const [appliedYear, setAppliedYear] = useState("all")
  const [appliedStatus, setAppliedStatus] = useState("all")
  const [appliedMonth, setAppliedMonth] = useState("all")
  const [appliedMinAmount, setAppliedMinAmount] = useState("all")

  const [selectedHistoryRun, setSelectedHistoryRun] = useState<Payrun | null>(null)
  const [showNewModal, setShowNewModal] = useState(false)
  const [guidedRunStep, setGuidedRunStep] = useState<1 | 2>(1)
  const [runScope, setRunScope] = useState<"All Employees" | "Specific Employees" | "Department Batch">("All Employees")
  const [runNote, setRunNote] = useState("Regular monthly payroll cycle")
  const [runEmployeeSearch, setRunEmployeeSearch] = useState("")
  const [appliedRunEmployeeSearch, setAppliedRunEmployeeSearch] = useState("")
  const [hasRunRunEmployeeSearch, setHasRunRunEmployeeSearch] = useState(false)
  const [runSelectedIds, setRunSelectedIds] = useState<string[]>([])
  const [newMonth, setNewMonth] = useState(9)
  const [newYear, setNewYear] = useState(2026)
  const payrollEligibleEmployees = emps.filter(
    (e) => e.status !== "Inactive" && e.status !== "Incomplete" && e.grossSalary > 0,
  )

  // Editing Row Modal State
  const [editingRow, setEditingRow] = useState<{
    row: PayrunInputRow
    empName: string
    grossSalary: number
    lopDays: number
    bonus: number
    incentive: number
    tds: number
  } | null>(null)

  const activeRun = payruns.find((p) => p.id === activeRunId) || payruns[0]
  const calculationRows = activeRun?.rows ?? []
  const paginatedCalculationRows = calculationRows.slice(
    (calculationPage - 1) * calculationPageSize,
    calculationPage * calculationPageSize,
  )
  const payrunWorkflowSteps = [
    "Draft",
    "Calculated",
    "Review",
    "Approved",
    "Paid & Disbursed",
    "Locked",
  ]
  const payrunStepIndex = activeRun
    ? activeRun.status === "Draft"
      ? 0
      : activeRun.status === "Calculated"
        ? 1
        : activeRun.status === "Under Review"
          ? 2
          : activeRun.status === "Approved"
            ? 3
            : activeRun.status === "Completed"
              ? 4
              : activeRun.status === "Locked"
                ? 5
                : 0
    : 0
  const filteredRunEmployees = hasRunRunEmployeeSearch ? payrollEligibleEmployees.filter((e) =>
    searchMatches(appliedRunEmployeeSearch, [e.name, e.id, e.department, e.designation]),
  ) : []
  const guidedTargetEmployees = (() => {
    if (runScope === "Specific Employees") {
      return payrollEligibleEmployees.filter((e) => runSelectedIds.includes(e.id))
    }
    if (runScope === "Department Batch") {
      return payrollEligibleEmployees.filter((e) => e.department === runSelectedIds[0])
    }
    return payrollEligibleEmployees
  })()
  const guidedPreviewRows = calcRows(guidedTargetEmployees, ss)
  const guidedPreviewGross = guidedPreviewRows.reduce((sum, row) => sum + row.totalEarnings, 0)
  const guidedPreviewDeductions = guidedPreviewRows.reduce((sum, row) => sum + row.totalDeductions, 0)
  const guidedPreviewNet = guidedPreviewRows.reduce((sum, row) => sum + row.netSalary, 0)
  const guidedScopeLabel = runScope === "Department Batch" ? "Department Payroll" : runScope
  const guidedScopeDetail =
    runScope === "Department Batch"
      ? runSelectedIds[0]
        ? `${runSelectedIds[0]} department payroll batch`
        : "Select a department to preview this payroll batch"
      : runScope === "Specific Employees"
        ? `${runSelectedIds.length} selected employee${runSelectedIds.length !== 1 ? "s" : ""}`
        : "Full organization payroll batch"

  const f4Periods = Array.from(new Set(payruns.map((p) => p.period)))
  const availableYears = Array.from(new Set(payruns.map((p) => String(p.year)))).sort().reverse()

  // Handle Filter Go Action
  const handleHistoryGo = () => {
    setHasRunHistorySearch(true)
    setAppliedPeriod(periodDraft)
    setAppliedYear(yearDraft)
    setAppliedStatus(statusDraft)
    setAppliedMonth(monthDraft)
    setAppliedMinAmount(minAmountDraft)
    toast("Filters applied", "info")
  }

  // Handle Clear History Filters
  const handleHistoryClear = () => {
    setHasRunHistorySearch(false)
    setPeriodDraft("")
    setYearDraft("all")
    setStatusDraft("all")
    setMonthDraft("all")
    setMinAmountDraft("all")

    setAppliedPeriod("")
    setAppliedYear("all")
    setAppliedStatus("all")
    setAppliedMonth("all")
    setAppliedMinAmount("all")
    toast("History filters cleared", "info")
  }

  // Filtered History Runs
  const filteredHistory = hasRunHistorySearch ? payruns.filter((p) => {
    if (!searchMatches(appliedPeriod, [p.period])) {
      return false
    }
    if (appliedYear !== "all" && String(p.year) !== appliedYear) {
      return false
    }
    if (appliedStatus !== "all" && p.status !== appliedStatus) {
      return false
    }
    if (appliedMonth !== "all" && String(p.month) !== appliedMonth) {
      return false
    }
    if (appliedMinAmount !== "all") {
      const minVal = Number(appliedMinAmount)
      if (p.netPayroll < minVal) return false
    }
    return true
  }) : []

  // Advance payrun status in lifecycle
  const advanceRunStatus = (pr: Payrun) => {
    const statusMap: Record<PayrunStatus, PayrunStatus> = {
      Draft: "Calculated",
      Calculated: "Under Review",
      "Under Review": "Approved",
      Approved: "Completed",
      Completed: "Locked",
      Locked: "Locked",
    }
    const nextStatus = statusMap[pr.status]
    const updatedDate = nextStatus === "Completed" ? new Date().toISOString().slice(0, 10) : pr.generatedOn

    setPayruns((prev) =>
      prev.map((item) =>
        item.id === pr.id
          ? {
              ...item,
              status: nextStatus,
              generatedOn: updatedDate,
            }
          : item
      )
    )

    if (nextStatus === "Calculated") setCurrentStepIndex(1)
    if (nextStatus === "Under Review") setCurrentStepIndex(2)
    if (nextStatus === "Approved" || nextStatus === "Completed") setCurrentStepIndex(3)
    if (nextStatus === "Locked") setCurrentStepIndex(4)

    toast(`Pay run ${pr.period} updated to "${nextStatus}"`, "success")
  }

  // Recalculate all employees in the active payrun
  const handleRecalculate = () => {
    if (!activeRun) return
    if (activeRun.status === "Locked") {
      return toast("Locked pay runs cannot be recalculated", "error")
    }
    const employeePool =
      activeRun.employeeIds && activeRun.employeeIds.length > 0
        ? payrollEligibleEmployees.filter((emp) => activeRun.employeeIds?.includes(emp.id))
        : payrollEligibleEmployees
    const newRows = calcRows(employeePool, ss)
    const gross = newRows.reduce((s, r) => s + r.totalEarnings, 0)
    const deductions = newRows.reduce((s, r) => s + r.totalDeductions, 0)

    setPayruns((prev) =>
      prev.map((p) =>
        p.id === activeRun.id
          ? {
              ...p,
              grossPayroll: gross,
              totalDeductions: deductions,
              netPayroll: gross - deductions,
              rows: newRows,
              totalEmployees: newRows.length,
            }
          : p
      )
    )
    toast(`Recalculated salary figures for ${newRows.length} employees`, "success")
  }

  // Save Row Edits
  const handleSaveRow = () => {
    if (!editingRow || !activeRun) return
    if (activeRun.status === "Locked") {
      setEditingRow(null)
      return toast("Locked pay runs cannot be edited", "error")
    }

    const perDayGross = editingRow.grossSalary / 30
    const lopDeduction = Math.round(perDayGross * editingRow.lopDays)
    const totalEarnings = editingRow.grossSalary + editingRow.bonus + editingRow.incentive
    const pf = Math.round(editingRow.grossSalary * 0.12 * 0.5) // ~12% of basic
    const profTax = 200
    const totalDeductions = lopDeduction + pf + editingRow.tds + profTax
    const netSalary = Math.max(0, totalEarnings - totalDeductions)

    const updatedRows = activeRun.rows.map((r) => {
      if (r.empId === editingRow.row.empId) {
        return {
          ...r,
          grossSalary: editingRow.grossSalary,
          lopDays: editingRow.lopDays,
          lopDeduction,
          bonus: editingRow.bonus,
          incentive: editingRow.incentive,
          tds: editingRow.tds,
          pf,
          profTax,
          totalEarnings,
          totalDeductions,
          netSalary,
        }
      }
      return r
    })

    const newGross = updatedRows.reduce((s, r) => s + r.totalEarnings, 0)
    const newDeductions = updatedRows.reduce((s, r) => s + r.totalDeductions, 0)

    setPayruns((prev) =>
      prev.map((p) =>
        p.id === activeRun.id
          ? {
              ...p,
              grossPayroll: newGross,
              totalDeductions: newDeductions,
              netPayroll: newGross - newDeductions,
              rows: updatedRows,
            }
          : p
      )
    )

    setEditingRow(null)
    toast(`Updated salary row for ${editingRow.empName}`, "success")
  }

  // Create new payrun
  const handleCreatePayrun = () => {
    if (runScope === "Specific Employees" && runSelectedIds.length === 0) {
      return toast("Select at least one employee for this payroll run", "error")
    }
    if (runScope === "Department Batch" && !runSelectedIds[0]) {
      return toast("Select a department for this payroll run", "error")
    }
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ]
    const periodName = `${monthNames[newMonth - 1]} ${newYear}`
    if (payruns.some((p) => p.period === periodName)) {
      return toast(`Pay run for ${periodName} already exists`, "error")
    }

    const targetEmployees = guidedTargetEmployees.length
      ? guidedTargetEmployees
      : emps.filter((e) => e.status === "Active")
    const rows = calcRows(targetEmployees, ss)
    const gross = rows.reduce((s, r) => s + r.totalEarnings, 0)
    const deductions = rows.reduce((s, r) => s + r.totalDeductions, 0)

    const newPr: Payrun = {
      id: `PR-${newYear}-${String(newMonth).padStart(2, "0")}`,
      period: periodName,
      month: newMonth,
      year: newYear,
      status: "Draft",
      totalEmployees: rows.length,
      grossPayroll: gross,
      totalDeductions: deductions,
      netPayroll: gross - deductions,
      scope: runScope,
      employeeIds: targetEmployees.map((emp) => emp.id),
      note: runNote,
      generatedBy: "Meena Iyer",
      generatedOn: new Date().toISOString().slice(0, 10),
      rows,
    }

    setPayruns([newPr, ...payruns])
    setActiveRunId(newPr.id)
    setCalculationPage(1)
    setShowNewModal(false)
    setGuidedRunStep(1)
    setRunSelectedIds([])
    setRunEmployeeSearch("")
    setAppliedRunEmployeeSearch("")
    setCurrentStepIndex(0)
    toast(`New Pay run for ${periodName} initialized for ${rows.length} employees`, "success")
  }
  const handleGuidedRunContinue = () => {
    if (runScope === "Specific Employees" && runSelectedIds.length === 0) {
      return toast("Select at least one employee before continuing", "error")
    }
    if (runScope === "Department Batch" && !runSelectedIds[0]) {
      return toast("Select a department before continuing", "error")
    }
    setGuidedRunStep(2)
  }

  // Export Bank Batch CSV
  const handleExportBankBatch = () => {
    if (!activeRun) return
    const csvContent =
      "Employee ID,Employee Name,Account Number,IFSC Code,Net Salary,Payment Period\n" +
      activeRun.rows
        .map(
          (r, i) =>
            `${r.empId},${r.empName},918273645${i + 10},HDFC0001234,${r.netSalary},${activeRun.period}`
        )
        .join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = `Bank_Disbursement_Batch_${activeRun.period.replace(" ", "_")}.csv`
    a.click()
    toast("Bank disbursement batch file generated", "success")
  }

  const currentNetPay = activeRun ? activeRun.netPayroll : 0
  const currentGross = activeRun ? activeRun.grossPayroll : 0
  const currentDeductions = activeRun ? activeRun.totalDeductions : 0
  const currentEmpCount = activeRun ? activeRun.totalEmployees : 0
  const historyActiveFiltersCount =
    (appliedPeriod ? 1 : 0) +
    (appliedYear !== "all" ? 1 : 0) +
    (appliedStatus !== "all" ? 1 : 0) +
    (appliedMonth !== "all" ? 1 : 0) +
    (appliedMinAmount !== "all" ? 1 : 0)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <PH
        title="Payroll & Pay Runs"
        sub="Execute, verify, approve, and disburse monthly employee compensation"
        action={
          <>
          <Btn onClick={() => setShowNewModal(true)}>Execute Guided Payroll Run</Btn>
          <Btn variant="success" onClick={handleExportBankBatch}>
            Export
          </Btn>
          </>
        }
      />

      {/* 4 KPI Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        <EmployeeMetricCard
          label="Active Pay Cycle"
          value={activeRun ? activeRun.period : "None"}
          sub={activeRun ? `Status: ${activeRun.status}` : "No active run"}
          accent={F.brand}
          badgeText={activeRun ? activeRun.status : "Draft"}
          badgeBg={F.infoBg}
          badgeColor={F.brand}
          progress={75}
        />
        <EmployeeMetricCard
          label="Total Net Payroll"
          value={inr(currentNetPay)}
          sub={`From ${inr(currentGross)} gross compensation`}
          accent={F.success}
          badgeText="Net Payable"
          badgeBg={F.successBg}
          badgeColor={F.success}
          progress={currentGross > 0 ? Math.round((currentNetPay / currentGross) * 100) : 0}
        />
        <EmployeeMetricCard
          label="Statutory Deductions"
          value={inr(currentDeductions)}
          sub="PF (12%), TDS Withholdings & PT"
          accent={F.warning}
          badgeText="Withholdings"
          badgeBg={F.warningBg}
          badgeColor={F.warning}
          progress={currentGross > 0 ? Math.round((currentDeductions / currentGross) * 100) : 0}
        />
        <EmployeeMetricCard
          label="Eligible Employees"
          value={`${currentEmpCount} Employees`}
          sub="100% attendance & compensation verified"
          accent="#8B5CF6"
          badgeText="Verified"
          badgeBg="#F5F3FF"
          badgeColor="#7C3AED"
          progress={100}
        />
      </div>

      {/* Tabs Header in Fiori Style */}
      <div
        style={{
          display: "flex",
          borderBottom: `1px solid ${F.border}`,
          gap: 24,
        }}
      >
        <button
          onClick={() => setPayrollTab("run")}
          style={{
            background: "none",
            border: "none",
            borderBottom: `3px solid ${payrollTab === "run" ? F.brand : "transparent"}`,
            padding: "10px 4px",
            fontSize: 13,
            fontWeight: payrollTab === "run" ? 700 : 500,
            color: payrollTab === "run" ? F.brand : F.text2,
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          Active Pay Run Processing
        </button>
        <button
          onClick={() => setPayrollTab("history")}
          style={{
            background: "none",
            border: "none",
            borderBottom: `3px solid ${payrollTab === "history" ? F.brand : "transparent"}`,
            padding: "10px 4px",
            fontSize: 13,
            fontWeight: payrollTab === "history" ? 700 : 500,
            color: payrollTab === "history" ? F.brand : F.text2,
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          Payroll History & Audit Ledger
        </button>
      </div>

      {/* TAB 1: RUN PAYROLL */}
      {payrollTab === "run" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Unified Active Payrun Workflow Card */}
          <div
            style={{
              background: F.card,
              border: `1px solid ${F.border}`,
              borderRadius: 8,
              overflow: "hidden",
              boxShadow: "0 10px 28px rgba(15,23,42,0.08)",
            }}
          >
            <div
              style={{
                padding: "18px 22px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 14,
                borderBottom: `1px solid ${F.border}`,
                background: "linear-gradient(180deg, #FFFFFF 0%, #FAFBFC 100%)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: F.text1 }}>
                  Select Active Pay Run
                </span>
                <select
                  value={activeRun?.id}
                  onChange={(e) => {
                    setActiveRunId(e.target.value)
                    setCalculationPage(1)
                  }}
                  style={{
                    ...iSt,
                    width: 240,
                    height: 38,
                    cursor: "pointer",
                    fontWeight: 800,
                    borderColor: "#C9D7E6",
                    boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
                  }}
                >
                  {payruns.map((pr) => (
                    <option key={pr.id} value={pr.id}>
                      {pr.period} ({pr.status})
                    </option>
                  ))}
                </select>
              </div>

              {activeRun && (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 12, color: F.text2, fontWeight: 700 }}>
                    Current Status
                  </span>
                  {prBadge(activeRun.status)}
                </div>
              )}
            </div>

            <div style={{ padding: "30px 34px 28px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                {payrunWorkflowSteps.map((step, index) => {
                  const complete = index < payrunStepIndex
                  const active = index === payrunStepIndex
                  const doneColor = F.success
                  return (
                    <Fragment key={step}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          minWidth: 100,
                        }}
                      >
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: complete ? doneColor : active ? F.infoBg : F.card,
                            border: `2px solid ${complete ? doneColor : active ? F.brand : "#B8C7D9"}`,
                            color: complete ? "#fff" : active ? F.brand : "#8A9AAF",
                            fontWeight: 900,
                            fontSize: complete ? 18 : 13,
                            lineHeight: 1,
                            boxShadow: complete
                              ? "0 0 0 4px rgba(16,126,62,0.12)"
                              : active
                                ? "0 0 0 4px rgba(0,112,242,0.12)"
                                : "none",
                          }}
                        >
                          {complete ? "✓" : index + 1}
                        </div>
                        <div
                          style={{
                            marginTop: 10,
                            fontSize: 12,
                            fontWeight: active || complete ? 900 : 700,
                            color: complete ? doneColor : active ? F.brand : "#8A9AAF",
                            textAlign: "center",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {step}
                        </div>
                      </div>
                      {index < payrunWorkflowSteps.length - 1 && (
                        <div
                          style={{
                            flex: 1,
                            height: 5,
                            borderRadius: 999,
                            background: index < payrunStepIndex ? doneColor : "#E1E8F0",
                            margin: "0 8px 28px",
                            minWidth: 42,
                            boxShadow: index < payrunStepIndex ? "0 1px 4px rgba(16,126,62,0.16)" : "none",
                          }}
                        />
                      )}
                    </Fragment>
                  )
                })}
              </div>
            </div>

            <div
              style={{
                background: activeRun?.status === "Locked" || activeRun?.status === "Completed" ? F.successBg : F.warningBg,
                borderTop: `1px solid ${activeRun?.status === "Locked" || activeRun?.status === "Completed" ? F.success : F.warning}35`,
                borderLeft: `4px solid ${activeRun?.status === "Locked" || activeRun?.status === "Completed" ? F.success : F.warning}`,
                padding: "18px 22px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 14,
              }}
            >
              <div>
                <strong style={{ color: F.text1, fontSize: 14 }}>
                  Pay Run: {activeRun ? activeRun.period : "August 2026"} &bull; Stage: {activeRun?.status}
                </strong>
                <div style={{ color: F.text2, fontSize: 12, marginTop: 4, lineHeight: 1.45 }}>
                  {activeRun?.status === "Locked"
                    ? "Payroll is locked. Calculations, employee rows, and disbursement totals are read-only."
                    : activeRun?.status === "Completed"
                      ? "Disbursement completed. Lock the run to freeze all payroll records."
                    : "Click 'Advance Status' to progress to the next verification or final disbursement stage."}
                </div>
              </div>
              {activeRun && activeRun.status !== "Locked" && (
                <Btn onClick={() => advanceRunStatus(activeRun)}>
                  {activeRun.status === "Under Review"
                    ? "Authorize & Approve Payroll"
                    : activeRun.status === "Approved"
                      ? "Disburse & Mark as Paid"
                      : activeRun.status === "Completed"
                        ? "Lock Pay Run"
                      : `Advance Status (${activeRun.status})`}
                </Btn>
              )}
            </div>
          </div>

          {/* Employee Pay Run Sheet Table */}
          {activeRun && (
            <div
              style={{
                background: F.card,
                border: `1px solid ${F.border}`,
                borderRadius: 8,
                overflow: "hidden",
                boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
              }}
            >
              <div
                style={{
                  padding: "16px 20px",
                  borderBottom: `1px solid ${F.border}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: F.text1 }}>
                    Employee Payroll Calculations - {activeRun.period}
                  </h2>
                  <div style={{ fontSize: 12, color: F.text2, marginTop: 2 }}>
                    Click Edit to adjust LOP, bonus, tax withholdings, or custom additions
                  </div>
                </div>
                {prBadge(activeRun.status)}
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr
                      style={{
                        borderBottom: `1px solid ${F.border}`,
                        background: F.pageBg,
                        color: F.text2,
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: "uppercase",
                      }}
                    >
                      <th style={{ padding: "10px 18px", textAlign: "left" }}>Employee</th>
                      <th style={{ padding: "10px 14px", textAlign: "left" }}>Department</th>
                      <th style={{ padding: "10px 14px", textAlign: "right" }}>Gross Salary</th>
                      <th style={{ padding: "10px 14px", textAlign: "right" }}>LOP Days</th>
                      <th style={{ padding: "10px 14px", textAlign: "right" }}>LOP Ded.</th>
                      <th style={{ padding: "10px 14px", textAlign: "right" }}>Bonus / Add.</th>
                      <th style={{ padding: "10px 14px", textAlign: "right" }}>EPF (12%)</th>
                      <th style={{ padding: "10px 14px", textAlign: "right" }}>TDS Tax</th>
                      <th style={{ padding: "10px 14px", textAlign: "right" }}>Net Salary</th>
                      <th style={{ padding: "10px 18px", textAlign: "right" }}>Audit & Payslip</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedCalculationRows.map((row) => (
                      <tr
                        key={row.empId}
                        style={{
                          borderBottom: `1px solid ${F.border}60`,
                          transition: "background 0.12s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = F.pageBg)}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <td style={{ padding: "14px 18px" }}>
                          <strong style={{ color: F.text1 }}>{row.empName}</strong>
                          <div style={{ fontSize: 11, color: F.text3, marginTop: 2 }}>
                            ID: {row.empId}
                          </div>
                        </td>
                        <td style={{ padding: "14px 14px", color: F.text2 }}>{row.department}</td>
                        <td style={{ padding: "14px 14px", textAlign: "right", fontWeight: 600, color: F.text1 }}>
                          {inr(row.grossSalary)}
                        </td>
                        <td style={{ padding: "14px 14px", textAlign: "right", color: row.lopDays > 0 ? F.error : F.text3 }}>
                          {row.lopDays} d
                        </td>
                        <td style={{ padding: "14px 14px", textAlign: "right", color: row.lopDeduction > 0 ? F.error : F.text3 }}>
                          {inr(row.lopDeduction)}
                        </td>
                        <td style={{ padding: "14px 14px", textAlign: "right", color: (row.bonus + row.incentive) > 0 ? F.brand : F.text3 }}>
                          +{inr(row.bonus + row.incentive)}
                        </td>
                        <td style={{ padding: "14px 14px", textAlign: "right", color: F.text2 }}>
                          {inr(row.pf)}
                        </td>
                        <td style={{ padding: "14px 14px", textAlign: "right", color: F.warning }}>
                          {inr(row.tds)}
                        </td>
                        <td style={{ padding: "14px 14px", textAlign: "right", fontWeight: 800, color: F.success, fontSize: 14 }}>
                          {inr(row.netSalary)}
                        </td>
                        <td style={{ padding: "14px 18px", textAlign: "right" }}>
                          <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, flexWrap: "wrap" }}>
                            <Btn
                              small
                              variant="secondary"
                              onClick={() => {
                                if (activeRun.status === "Locked") {
                                  toast(`Salary row opened for ${row.empName}. This locked run is read-only.`, "info")
                                  return
                                }
                                setEditingRow({
                                  row,
                                  empName: row.empName,
                                  grossSalary: row.grossSalary,
                                  lopDays: row.lopDays,
                                  bonus: row.bonus,
                                  incentive: row.incentive,
                                  tds: row.tds,
                                })
                              }}
                            >
                              Edit
                            </Btn>
                            <Btn
                              small
                              disabled={!isFinalizedPayrun(activeRun.status)}
                              title={isFinalizedPayrun(activeRun.status) ? `Download PDF payslip for ${row.empName}` : "PDF is available after the pay run is completed"}
                              onClick={() => {
                                const employee = emps.find((item) => item.id === row.empId)
                                if (employee) downloadPayslipPdf(row, activeRun, employee)
                              }}
                            >
                              <DownloadIcon />
                              Download PDF
                            </Btn>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: F.pageBg, borderTop: `2px solid ${F.border}`, fontWeight: 800 }}>
                      <td style={{ padding: "14px 18px", color: F.text1 }} colSpan={2}>
                        Total Summary ({activeRun.rows.length} Employees)
                      </td>
                      <td style={{ padding: "14px 14px", textAlign: "right", color: F.brand }}>
                        {inr(activeRun.grossPayroll)}
                      </td>
                      <td colSpan={3} />
                      <td style={{ padding: "14px 14px", textAlign: "right", color: F.warning }} colSpan={2}>
                        Total Deductions: {inr(activeRun.totalDeductions)}
                      </td>
                      <td style={{ padding: "14px 14px", textAlign: "right", color: F.success, fontSize: 15 }}>
                        {inr(activeRun.netPayroll)}
                      </td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
              <Pagination
                page={calculationPage}
                pageSize={calculationPageSize}
                total={calculationRows.length}
                onPageChange={setCalculationPage}
              />
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PAYROLL HISTORY WITH SAP FIORI FILTER BAR */}
      {payrollTab === "history" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* SAP Fiori Collapsible Filter Bar Panel */}
          <div
            style={{
              background: F.card,
              border: `1px solid ${F.border}`,
              borderRadius: 8,
              boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
              overflow: "hidden",
            }}
          >
            {/* Filter Bar Action Bar Header */}
            <div
              style={{
                padding: "12px 18px",
                borderBottom: showHistoryFilterBar ? `1px solid ${F.border}` : "none",
                background: F.card,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: F.text1 }}>
                  Payroll History Filter Bar
                </span>
                {historyActiveFiltersCount > 0 && (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: F.brand,
                      background: F.infoBg,
                      padding: "2px 8px",
                      borderRadius: 12,
                    }}
                  >
                    {historyActiveFiltersCount} Active Filter{historyActiveFiltersCount !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {/* Action Buttons: Go, Clear Filters, Hide/Show Filter Bar */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Btn onClick={handleHistoryGo} style={{ height: 34, padding: "0 18px", fontWeight: 700 }}>
                  Go
                </Btn>
                <Btn variant="secondary" onClick={handleHistoryClear} style={{ height: 34 }}>
                  Clear Filters
                </Btn>
                <Btn
                  variant="secondary"
                  onClick={() => setShowHistoryFilterBar(!showHistoryFilterBar)}
                  style={{ height: 34 }}
                >
                  {showHistoryFilterBar ? "Hide Filter Bar" : "Show Filter Bar"}
                </Btn>
              </div>
            </div>

            {/* Collapsible Filter Inputs Grid */}
            {showHistoryFilterBar && (
              <div
                style={{
                  padding: "16px 18px",
                  background: F.card,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: 14,
                  alignItems: "flex-end",
                }}
              >
                {/* 1. Search Pay Period (F4 Search) */}
                <div style={{ gridColumn: "span 2", minWidth: 260 }}>
                  <ValueHelp
                    label="Search Pay Period (F4 Search)"
                    value={periodDraft}
                    onChange={setPeriodDraft}
                    placeholder="Search pay period (press Go to apply)…"
                    values={f4Periods}
                  />
                </div>
                <ContextDateRangeFilter />

                {/* 2. Year Filter */}
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: F.text2,
                      marginBottom: 3,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Year
                  </div>
                  <select
                    value={yearDraft}
                    onChange={(e) => setYearDraft(e.target.value)}
                    style={{ ...iSt, cursor: "pointer" }}
                  >
                    <option value="all">All Years</option>
                    {availableYears.map((yr) => (
                      <option key={yr} value={yr}>
                        Year {yr}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. Run Status Filter */}
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: F.text2,
                      marginBottom: 3,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Run Status
                  </div>
                  <select
                    value={statusDraft}
                    onChange={(e) => setStatusDraft(e.target.value)}
                    style={{ ...iSt, cursor: "pointer" }}
                  >
                    <option value="all">All Statuses</option>
                    <option value="Completed">Completed</option>
                    <option value="Approved">Approved</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Draft">Draft</option>
                    <option value="Calculated">Calculated</option>
                    <option value="Locked">Locked</option>
                  </select>
                </div>

                {/* 4. Month Filter */}
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: F.text2,
                      marginBottom: 3,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Month
                  </div>
                  <select
                    value={monthDraft}
                    onChange={(e) => setMonthDraft(e.target.value)}
                    style={{ ...iSt, cursor: "pointer" }}
                  >
                    <option value="all">All Months</option>
                    {[
                      [1, "Jan"], [2, "Feb"], [3, "Mar"], [4, "Apr"],
                      [5, "May"], [6, "Jun"], [7, "Jul"], [8, "Aug"],
                      [9, "Sep"], [10, "Oct"], [11, "Nov"], [12, "Dec"]
                    ].map(([mNum, mName]) => (
                      <option key={mNum} value={String(mNum)}>
                        {mName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 5. Minimum Amount Filter */}
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: F.text2,
                      marginBottom: 3,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Min Net Amount
                  </div>
                  <select
                    value={minAmountDraft}
                    onChange={(e) => setMinAmountDraft(e.target.value)}
                    style={{ ...iSt, cursor: "pointer" }}
                  >
                    <option value="all">All Amounts</option>
                    <option value="500000">&gt; ₹5,00,000</option>
                    <option value="800000">&gt; ₹8,00,000</option>
                    <option value="1000000">&gt; ₹10,00,000</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* History Ledger Table */}
          <div
            style={{
              background: F.card,
              border: `1px solid ${F.border}`,
              borderRadius: 8,
              overflow: "hidden",
              boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: `1px solid ${F.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: F.text1 }}>
                  Payroll History & Audit Records
                </h2>
                <div style={{ fontSize: 12, color: F.text2, marginTop: 2 }}>
                  Showing {filteredHistory.length} of {payruns.length} recorded payroll cycles
                </div>
              </div>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700, fontSize: 13 }}>
              <thead>
                <tr
                  style={{
                    borderBottom: `1px solid ${F.border}`,
                    background: F.pageBg,
                    color: F.text2,
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  <th style={{ padding: "12px 18px", textAlign: "left" }}>Pay Period</th>
                  <th style={{ padding: "12px 14px", textAlign: "left" }}>Payment Date</th>
                  <th style={{ padding: "12px 14px", textAlign: "center" }}>Employees</th>
                  <th style={{ padding: "12px 14px", textAlign: "right" }}>Gross Payroll</th>
                  <th style={{ padding: "12px 14px", textAlign: "right" }}>Deductions</th>
                  <th style={{ padding: "12px 14px", textAlign: "right" }}>Net Disbursed</th>
                  <th style={{ padding: "12px 14px", textAlign: "center" }}>Status</th>
                  <th style={{ padding: "12px 18px", textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: 44, textAlign: "center", color: F.text3 }}>
                      No historical payroll records match your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map((pr) => (
                    <tr
                      key={pr.id}
                      onClick={() => setSelectedHistoryRun(pr)}
                      style={{
                        borderBottom: `1px solid ${F.border}60`,
                        cursor: "pointer",
                        transition: "background 0.12s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = F.pageBg)}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "14px 18px" }}>
                        <div style={{ fontWeight: 800, color: F.text1 }}>{pr.period}</div>
                        <div style={{ fontSize: 11, color: F.text3, marginTop: 2 }}>
                          Ref: {pr.id}
                        </div>
                      </td>
                      <td style={{ padding: "14px 14px", color: F.text2 }}>
                        {fmtD(pr.generatedOn)}
                      </td>
                      <td style={{ padding: "14px 14px", textAlign: "center", fontWeight: 600 }}>
                        {pr.totalEmployees}
                      </td>
                      <td style={{ padding: "14px 14px", textAlign: "right", color: F.text2, fontWeight: 600 }}>
                        {inr(pr.grossPayroll)}
                      </td>
                      <td style={{ padding: "14px 14px", textAlign: "right", color: F.warning, fontWeight: 600 }}>
                        {inr(pr.totalDeductions)}
                      </td>
                      <td style={{ padding: "14px 14px", textAlign: "right", fontWeight: 800, color: F.success, fontSize: 14 }}>
                        {inr(pr.netPayroll)}
                      </td>
                      <td style={{ padding: "14px 14px", textAlign: "center" }}>
                        {prBadge(pr.status)}
                      </td>
                      <td style={{ padding: "14px 18px", textAlign: "right" }}>
                        <Btn small variant="secondary" onClick={() => setSelectedHistoryRun(pr)}>
                          Details &rarr;
                        </Btn>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Employee Row Modal */}
      {editingRow && (
        <Modal title={`Edit Salary Row — ${editingRow.empName}`} onClose={() => setEditingRow(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ fontSize: 13, color: F.text2 }}>
              Adjust salary, attendance LOP, bonuses, and tax withholdings for this payroll run.
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Fld label="Gross Base Salary (₹)">
                <input
                  type="number"
                  value={editingRow.grossSalary}
                  onChange={(e) => setEditingRow({ ...editingRow, grossSalary: Number(e.target.value) })}
                  style={iSt}
                />
              </Fld>

              <Fld label="Loss of Pay (LOP Days)">
                <input
                  type="number"
                  min={0}
                  max={30}
                  value={editingRow.lopDays}
                  onChange={(e) => setEditingRow({ ...editingRow, lopDays: Number(e.target.value) })}
                  style={iSt}
                />
              </Fld>

              <Fld label="Bonus (₹)">
                <input
                  type="number"
                  value={editingRow.bonus}
                  onChange={(e) => setEditingRow({ ...editingRow, bonus: Number(e.target.value) })}
                  style={iSt}
                />
              </Fld>

              <Fld label="Performance Incentive (₹)">
                <input
                  type="number"
                  value={editingRow.incentive}
                  onChange={(e) => setEditingRow({ ...editingRow, incentive: Number(e.target.value) })}
                  style={iSt}
                />
              </Fld>

              <Fld label="Income Tax TDS (₹)">
                <input
                  type="number"
                  value={editingRow.tds}
                  onChange={(e) => setEditingRow({ ...editingRow, tds: Number(e.target.value) })}
                  style={iSt}
                />
              </Fld>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 12 }}>
              <Btn variant="secondary" onClick={() => setEditingRow(null)}>
                Cancel
              </Btn>
              <Btn onClick={handleSaveRow}>Save & Recalculate</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Create New Payrun Modal */}
      {showNewModal && (
        <Modal
          title="Execute Guided Payroll Run"
          onClose={() => {
            setShowNewModal(false)
            setGuidedRunStep(1)
          }}
          wide
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ fontSize: 14, color: F.text2, lineHeight: 1.55 }}>
              Calculate salary structures, attendance proration, LOP, TDS, professional tax, and statutory deductions.
            </div>

            {guidedRunStep === 1 ? (
              <>
                <div style={{ borderBottom: `1px solid ${F.border}`, paddingBottom: 10, fontSize: 12, fontWeight: 900, color: "#304156", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Step 1: Select payroll cycle and run scope
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <Fld label="Payroll Month">
                    <select
                      value={newMonth}
                      onChange={(e) => setNewMonth(Number(e.target.value))}
                      style={{ ...iSt, cursor: "pointer" }}
                    >
                      {[
                        [1, "January"], [2, "February"], [3, "March"], [4, "April"],
                        [5, "May"], [6, "June"], [7, "July"], [8, "August"],
                        [9, "September"], [10, "October"], [11, "November"], [12, "December"]
                      ].map(([num, name]) => (
                        <option key={num} value={num}>
                          {name} {newYear}
                        </option>
                      ))}
                    </select>
                  </Fld>

                  <Fld label="Disbursement / Pay Date">
                    <StrictDateInput
                      value={`${newYear}-${String(newMonth).padStart(2, "0")}-28`}
                      onChange={(value) => {
                        if (!value) return
                        const [year, month] = value.split("-")
                        setNewYear(Number(year))
                        setNewMonth(Number(month))
                      }}
                      style={iSt}
                    />
                  </Fld>
                </div>

                <Fld label="Payroll Run Target Scope">
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                    {(["All Employees", "Specific Employees", "Department Batch"] as const).map((scope) => {
                      const active = runScope === scope
                      const scopeLabel = scope === "Department Batch" ? "Department Payroll" : scope
                      return (
                        <button
                          key={scope}
                          onClick={() => {
                            setRunScope(scope)
                            setRunSelectedIds([])
                          }}
                          style={{
                            border: `1px solid ${active ? F.brand : F.border}`,
                            borderRadius: 8,
                            background: active ? F.infoBg : F.card,
                            padding: "16px 18px",
                            textAlign: "left",
                            cursor: "pointer",
                            fontFamily: "inherit",
                            boxShadow: active ? "0 0 0 1px rgba(0,112,242,0.18)" : "0 1px 2px rgba(15,23,42,0.04)",
                            transition: "border-color 0.14s ease, background 0.14s ease, box-shadow 0.14s ease",
                          }}
                        >
                          <div style={{ fontSize: 14, fontWeight: 900, color: F.text1 }}>{scopeLabel}</div>
                          <div style={{ fontSize: 12, color: F.text2, marginTop: 6, lineHeight: 1.35 }}>
                            {scope === "All Employees"
                              ? "Full organization monthly batch"
                              : scope === "Specific Employees"
                                ? "Off-cycle or selective staff"
                                : "Single department payroll run"}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </Fld>

                {runScope === "Specific Employees" && (
                  <div style={{ border: `1px solid ${F.border}`, borderRadius: 8, padding: 16, background: "#FAFBFC", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <strong style={{ fontSize: 13 }}>
                        Select employees for this run ({runSelectedIds.length} selected)
                      </strong>
                      <button
                        onClick={() =>
                          setRunSelectedIds(
                            runSelectedIds.length === filteredRunEmployees.length
                              ? []
                              : filteredRunEmployees.map((e) => e.id),
                          )
                        }
                        style={{ background: "transparent", border: "none", color: F.brand, cursor: "pointer", fontWeight: 800, fontFamily: "inherit" }}
                      >
                        {runSelectedIds.length === filteredRunEmployees.length ? "Clear All" : "Select All"}
                      </button>
                    </div>
                    <ValueHelp
                      value={runEmployeeSearch}
                      onChange={setRunEmployeeSearch}
                      placeholder="Search employees by name or code..."
                      values={payrollEligibleEmployees.map((e) => `${e.name} (${e.id})`)}
                    />
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      <Btn small onClick={() => { setAppliedRunEmployeeSearch(runEmployeeSearch); setHasRunRunEmployeeSearch(true) }}>
                        Go
                      </Btn>
                      <Btn
                        small
                        variant="secondary"
                        onClick={() => {
                          setRunEmployeeSearch("")
                          setAppliedRunEmployeeSearch("")
                          setHasRunRunEmployeeSearch(false)
                        }}
                      >
                        Clear Filters
                      </Btn>
                    </div>
                    <div style={{ marginTop: 12, maxHeight: 260, overflowY: "auto", border: `1px solid ${F.border}`, borderRadius: 8, background: F.card }}>
                      {filteredRunEmployees.map((emp) => (
                        <label key={emp.id} style={{ display: "grid", gridTemplateColumns: "28px 1fr auto", gap: 12, alignItems: "center", padding: "14px 16px", borderBottom: `1px solid ${F.border}60`, cursor: "pointer" }}>
                          <input
                            type="checkbox"
                            checked={runSelectedIds.includes(emp.id)}
                            onChange={() =>
                              setRunSelectedIds((prev) =>
                                prev.includes(emp.id)
                                  ? prev.filter((id) => id !== emp.id)
                                  : [...prev, emp.id],
                              )
                            }
                          />
                          <span>
                            <strong>{emp.name}</strong>
                            <span style={{ color: F.text3, fontSize: 11 }}> - {emp.id}</span>
                            <div style={{ color: F.text2, fontSize: 12 }}>{emp.designation} - {emp.department}</div>
                          </span>
                          <strong>{inr(emp.grossSalary * 12)} CTC</strong>
                        </label>
                      ))}
                      {filteredRunEmployees.length === 0 && (
                        <div style={{ padding: 28, textAlign: "center", color: F.text3, fontSize: 13 }}>
                          No payroll-ready employees match this search.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {runScope === "Department Batch" && (
                  <Fld label="Department">
                    <select
                      value={runSelectedIds[0] ?? ""}
                      onChange={(e) => setRunSelectedIds(e.target.value ? [e.target.value] : [])}
                      style={iSt}
                    >
                      <option value="">Select department</option>
                      {Array.from(new Set(payrollEligibleEmployees.map((e) => e.department))).sort().map((dept) => (
                        <option key={dept}>{dept}</option>
                      ))}
                    </select>
                  </Fld>
                )}

                <Fld label="Run Description / Cycle Note">
                  <input
                    value={runNote}
                    onChange={(e) => setRunNote(e.target.value)}
                    style={iSt}
                    placeholder="August regular monthly payroll cycle"
                  />
                </Fld>

                <div
                  style={{
                    border: `1px solid ${F.border}`,
                    borderRadius: 8,
                    background: F.pageBg,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      padding: "12px 16px",
                      borderBottom: `1px solid ${F.border}`,
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 900, color: F.text1 }}>
                        Payroll Run Summary
                      </div>
                      <div style={{ marginTop: 2, fontSize: 12, color: F.text2 }}>
                        {guidedScopeLabel} - {guidedScopeDetail}
                      </div>
                    </div>
                    <Badge
                      label={`${guidedTargetEmployees.length} employee${guidedTargetEmployees.length !== 1 ? "s" : ""}`}
                      color={guidedTargetEmployees.length > 0 ? F.success : F.warning}
                      bg={guidedTargetEmployees.length > 0 ? F.successBg : F.warningBg}
                    />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
                    {[
                      ["Scope", guidedScopeLabel],
                      ["Gross Payroll", inr(guidedPreviewGross)],
                      ["Deductions", inr(guidedPreviewDeductions)],
                      ["Net Payable", inr(guidedPreviewNet)],
                    ].map(([label, value], index) => (
                      <div
                        key={label}
                        style={{
                          padding: "13px 16px",
                          borderLeft: index === 0 ? "none" : `1px solid ${F.border}`,
                          background: F.card,
                          minWidth: 0,
                        }}
                      >
                        <div style={{ fontSize: 11, fontWeight: 800, color: F.text3, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                          {label}
                        </div>
                        <div style={{ marginTop: 5, fontSize: 14, fontWeight: 900, color: label === "Net Payable" ? F.success : F.text1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                  <Btn variant="secondary" onClick={() => setShowNewModal(false)}>
                    Cancel
                  </Btn>
                  <Btn onClick={handleGuidedRunContinue}>Continue</Btn>
                </div>
              </>
            ) : (
              <>
                <div style={{ borderBottom: `1px solid ${F.border}`, paddingBottom: 10, fontSize: 12, fontWeight: 900, color: "#304156", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Step 2: Verify statutory and salary inputs
                </div>
                <div style={{ background: F.pageBg, border: `1px solid ${F.border}`, borderRadius: 8, padding: 18, display: "flex", flexDirection: "column", gap: 10 }}>
                  <IR label="Run Target" value={`${guidedScopeLabel} (${guidedTargetEmployees.length} staff)`} />
                  <IR label="Disbursement Date" value={`${newYear}-${String(newMonth).padStart(2, "0")}-28`} />
                  <IR label="Net Payable" value={inr(guidedPreviewNet)} />
                  <IR label="Statutory Deductions Engine" value="EPF, ESI, Professional Tax and TDS active" />
                  <IR label="Run Note" value={runNote || "No note added"} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginTop: 10 }}>
                  <Btn variant="secondary" onClick={() => setGuidedRunStep(1)}>
                    Back
                  </Btn>
                  <Btn onClick={handleCreatePayrun}>Execute Payroll Run Now</Btn>
                </div>
              </>
            )}
          </div>
        </Modal>
      )}

      {/* Payrun Details SlidePanel */}
      {selectedHistoryRun && (
        <SlidePanel
          title={`Pay Run Ledger — ${selectedHistoryRun.period}`}
          sub={`Generated by ${selectedHistoryRun.generatedBy} on ${fmtD(selectedHistoryRun.generatedOn)}`}
          onClose={() => setSelectedHistoryRun(null)}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                background: F.pageBg,
                border: `1px solid ${F.border}`,
                borderRadius: 8,
                padding: "16px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: F.text2, textTransform: "uppercase" }}>
                  Net Disbursed Payroll
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: F.success, marginTop: 2 }}>
                  {inr(selectedHistoryRun.netPayroll)}
                </div>
              </div>
              {prBadge(selectedHistoryRun.status)}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${F.border}60` }}>
                <span style={{ color: F.text2 }}>Gross Payroll:</span>
                <strong>{inr(selectedHistoryRun.grossPayroll)}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${F.border}60` }}>
                <span style={{ color: F.text2 }}>Total Deductions:</span>
                <strong style={{ color: F.warning }}>{inr(selectedHistoryRun.totalDeductions)}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${F.border}60` }}>
                <span style={{ color: F.text2 }}>Total Employees:</span>
                <strong>{selectedHistoryRun.totalEmployees} Employees</strong>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 14 }}>
              <Btn variant="secondary" onClick={() => setSelectedHistoryRun(null)}>
                Close
              </Btn>
              {selectedHistoryRun.status !== "Locked" && (
                <Btn onClick={() => advanceRunStatus(selectedHistoryRun)}>
                  {selectedHistoryRun.status === "Completed"
                    ? "Lock Pay Run"
                    : `Advance Status (${selectedHistoryRun.status}) ->`}
                </Btn>
              )}
            </div>
          </div>
        </SlidePanel>
      )}
    </div>
  )
}

function PayslipsView({
  emps,
  payruns,
  myEmp,
}: {
  emps: Employee[]
  payruns: Payrun[]
  myEmp?: Employee
}) {
  const toast = useToast()
  const [empSearch, setEmpSearch] = useState(myEmp?.name ?? "")
  const [selPeriod, setSelPeriod] = useState("All")
  const [deptF, setDeptF] = useState("All")
  const [typeF, setTypeF] = useState("All")
  const [netMin, setNetMin] = useState("")
  const [netMax, setNetMax] = useState("")
  const [sortBy, setSortBy] = useState<"period" | "net" | "gross">("period")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
  const [payslipPage, setPayslipPage] = useState(1)
  const [hasRunPayslipSearch, setHasRunPayslipSearch] = useState(false)
  const [appliedPayslipListFilters, setAppliedPayslipListFilters] = useState({
    empSearch: myEmp?.name ?? "",
    selPeriod: "All",
    deptF: "All",
    typeF: "All",
    netMin: "",
    netMax: "",
    sortBy: "period" as "period" | "net" | "gross",
    sortDir: "desc" as "asc" | "desc",
  })
  const [showAdv, setShowAdv] = useState(false)
  const [selectedPayslipKeys, setSelectedPayslipKeys] = useState<string[]>([])
  const [viewSlip, setViewSlip] = useState<{
    row: PayrunInputRow
    run: Payrun
  } | null>(null)

  const completed = payruns.filter((p) => isFinalizedPayrun(p.status))
  const depts = ["All", ...Array.from(new Set(emps.map((e) => e.department)))]
  const empNames = emps.map((e) => e.name)

  const allRows: { row: PayrunInputRow run: Payrun emp: Employee }[] = []
  completed.forEach((run) =>
    run.rows.forEach((row) => {
      const emp = emps.find((e) => e.id === row.empId)
      if (emp) allRows.push({ row, run, emp })
    }),
  )

  const rows = hasRunPayslipSearch ? allRows
    .filter(({ row, run, emp: e }) => {
      const nameMatch = myEmp
        ? e.id === myEmp.id
        : searchMatches(appliedPayslipListFilters.empSearch, [e.name, e.id])
      return (
        nameMatch &&
        (appliedPayslipListFilters.selPeriod === "All" || run.period === appliedPayslipListFilters.selPeriod) &&
        (appliedPayslipListFilters.deptF === "All" || e.department === appliedPayslipListFilters.deptF) &&
        (appliedPayslipListFilters.typeF === "All" || e.empType === appliedPayslipListFilters.typeF) &&
        (!appliedPayslipListFilters.netMin || row.netSalary >= parseInt(appliedPayslipListFilters.netMin) * 1000) &&
        (!appliedPayslipListFilters.netMax || row.netSalary <= parseInt(appliedPayslipListFilters.netMax) * 1000)
      )
    }) : []

  const paginatedPayslipRows = rows.slice((payslipPage - 1) * 10, payslipPage * 10)
    .sort((a, b) => {
      let d = 0
      if (appliedPayslipListFilters.sortBy === "net") d = a.row.netSalary - b.row.netSalary
      else if (appliedPayslipListFilters.sortBy === "gross") d = a.row.totalEarnings - b.row.totalEarnings
      else d = a.run.year * 100 + a.run.month - (b.run.year * 100 + b.run.month)
      return appliedPayslipListFilters.sortDir === "asc" ? d : -d
    })
  const payslipKey = (run: Payrun, row: PayrunInputRow) => `${run.id}:${row.empId}`
  const pagePayslipKeys = paginatedPayslipRows.map(({ run, row }) => payslipKey(run, row))
  const allPagePayslipsSelected = pagePayslipKeys.length > 0 && pagePayslipKeys.every((key) => selectedPayslipKeys.includes(key))
  const selectedPayslips = allRows.filter(({ run, row }) => selectedPayslipKeys.includes(payslipKey(run, row)))
  const togglePagePayslips = () => {
    setSelectedPayslipKeys((current) => allPagePayslipsSelected
      ? current.filter((key) => !pagePayslipKeys.includes(key))
      : Array.from(new Set([...current, ...pagePayslipKeys])))
  }

  const activeFilters =
    [appliedPayslipListFilters.selPeriod, appliedPayslipListFilters.deptF, appliedPayslipListFilters.typeF].filter((v) => v !== "All").length +
    (appliedPayslipListFilters.netMin ? 1 : 0) +
    (appliedPayslipListFilters.netMax ? 1 : 0) +
    (!myEmp && activeSearch(appliedPayslipListFilters.empSearch) ? 1 : 0) +
    (appliedPayslipListFilters.sortBy !== "period" || appliedPayslipListFilters.sortDir !== "desc" ? 1 : 0)
  const applyPayslipFilters = () => {
    setHasRunPayslipSearch(true)
    setPayslipPage(1)
    setAppliedPayslipListFilters({
      empSearch,
      selPeriod,
      deptF,
      typeF,
      netMin,
      netMax,
      sortBy,
      sortDir,
    })
  }
  const clearAll = () => {
    setHasRunPayslipSearch(false)
    setPayslipPage(1)
    setEmpSearch(myEmp?.name ?? "")
    setSelPeriod("All")
    setDeptF("All")
    setTypeF("All")
    setNetMin("")
    setNetMax("")
    setSortBy("period")
    setSortDir("desc")
    setAppliedPayslipListFilters({
      empSearch: myEmp?.name ?? "",
      selPeriod: "All",
      deptF: "All",
      typeF: "All",
      netMin: "",
      netMax: "",
      sortBy: "period",
      sortDir: "desc",
    })
  }

  const SortTh = ({
    col,
    children,
  }: {
    col: "period" | "net" | "gross"
    children: React.ReactNode
  }) => (
    <th
      onClick={() => {
        if (sortBy === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"))
        else {
          setSortBy(col)
          setSortDir("desc")
        }
      }}
      style={{
        padding: "9px 14px",
        textAlign: "right",
        fontSize: 11,
        fontWeight: 600,
        color: sortBy === col ? F.brand : F.text2,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        borderBottom: `1px solid ${F.border}`,
        whiteSpace: "nowrap",
        background: F.pageBg,
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      {children} {sortBy === col ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
    </th>
  )

  return (
    <div>
      <PH
        title={myEmp ? "My Payslips" : "Payslips"}
        sub={`${rows.length} payslip${
          rows.length !== 1 ? "s" : ""
        } found · Naxrita Solutions`}
        action={
          <div style={{ display: "flex", gap: 8 }}>
            <Btn
              variant="secondary"
              disabled={selectedPayslips.length === 0}
              onClick={() => downloadPayslipsPdf(selectedPayslips)}
            >
              <DownloadIcon />
              Download Selected ({selectedPayslips.length})
            </Btn>
            <Btn
              variant="secondary"
              disabled={allRows.length === 0}
              onClick={() => downloadPayslipsPdf(allRows)}
            >
              <DownloadIcon />
              Download All
            </Btn>
          </div>
        }
      />

      {/* Primary filters row */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 8,
          flexWrap: "wrap",
          alignItems: "flex-end",
        }}
      >
        {!myEmp && (
          <div style={{ flex: "1 1 250px", minWidth: 220, maxWidth: 320 }}>
            <ValueHelp
              value={empSearch}
              onChange={setEmpSearch}
              placeholder="Search employee name or ID…"
              values={empNames}
            />
          </div>
        )}
        <select
          value={selPeriod}
          onChange={(e) => setSelPeriod(e.target.value)}
          style={{ ...iSt, width: 180 }}
        >
          <option value="All">All Periods</option>
          {completed.map((r) => (
            <option key={r.id}>{r.period}</option>
          ))}
        </select>
        {!myEmp && (
          <select
            value={deptF}
            onChange={(e) => setDeptF(e.target.value)}
            style={{ ...iSt, width: 160 }}
          >
            {depts.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        )}
        <ContextDateRangeFilter />
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end", flexWrap: "nowrap" }}>
          <button
            onClick={() => setShowAdv((v) => !v)}
            style={{
              height: 34,
              padding: "0 14px",
              background: showAdv || activeFilters > 0 ? F.infoBg : F.card,
              border: `1px solid ${activeFilters > 0 ? F.brand : F.border}`,
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              color: activeFilters > 0 ? F.brand : F.text2,
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              gap: 6,
              whiteSpace: "nowrap",
            }}
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
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="8" y1="12" x2="16" y2="12" />
              <line x1="11" y1="18" x2="13" y2="18" />
            </svg>
            More Filters{" "}
            {activeFilters > 0 && (
              <span
                style={{
                  background: F.brand,
                  color: "#fff",
                  borderRadius: 10,
                  padding: "0 6px",
                  fontSize: 11,
                }}
              >
                {activeFilters}
              </span>
            )}
          </button>
          <Btn onClick={applyPayslipFilters} style={{ height: 34 }}>Go</Btn>
          <Btn variant="secondary" onClick={clearAll} style={{ height: 34 }}>
            Clear Filters
          </Btn>
        </div>
      </div>

      {/* Advanced filters */}
      {showAdv && (
        <div
          style={{
            background: F.card,
            border: `1px solid ${F.border}`,
            borderRadius: 8,
            padding: "14px 18px",
            marginBottom: 10,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))",
            gap: 12,
          }}
        >
          <Fld label="Employment Type">
            <select
              value={typeF}
              onChange={(e) => setTypeF(e.target.value)}
              style={iSt}
            >
              {["All", "Full-Time", "Part-Time", "Contract"].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Fld>
          <Fld label="Min Net Pay (₹K)">
            <input
              type="number"
              value={netMin}
              onChange={(e) => setNetMin(e.target.value)}
              placeholder="e.g. 40"
              style={iSt}
            />
          </Fld>
          <Fld label="Max Net Pay (₹K)">
            <input
              type="number"
              value={netMax}
              onChange={(e) => setNetMax(e.target.value)}
              placeholder="e.g. 200"
              style={iSt}
            />
          </Fld>
        </div>
      )}

      {/* Active filter pills */}
      {activeFilters > 0 && (
        <div
          style={{
            display: "flex",
            gap: 6,
            marginBottom: 10,
            flexWrap: "wrap",
          }}
        >
          {appliedPayslipListFilters.selPeriod !== "All" && (
            <span
              style={{
                padding: "3px 10px 3px 8px",
                background: F.infoBg,
                border: `1px solid ${F.brand}40`,
                borderRadius: 12,
                fontSize: 12,
                color: F.brand,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              Period: {appliedPayslipListFilters.selPeriod}
            </span>
          )}
          {appliedPayslipListFilters.deptF !== "All" && (
            <span
              style={{
                padding: "3px 10px 3px 8px",
                background: F.infoBg,
                border: `1px solid ${F.brand}40`,
                borderRadius: 12,
                fontSize: 12,
                color: F.brand,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              Dept: {appliedPayslipListFilters.deptF}
            </span>
          )}
          {appliedPayslipListFilters.typeF !== "All" && (
            <span
              style={{
                padding: "3px 10px 3px 8px",
                background: F.infoBg,
                border: `1px solid ${F.brand}40`,
                borderRadius: 12,
                fontSize: 12,
                color: F.brand,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              Type: {appliedPayslipListFilters.typeF}
            </span>
          )}
          {appliedPayslipListFilters.netMin && (
            <span
              style={{
                padding: "3px 10px 3px 8px",
                background: F.infoBg,
                border: `1px solid ${F.brand}40`,
                borderRadius: 12,
                fontSize: 12,
                color: F.brand,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              Net ≥ ₹{appliedPayslipListFilters.netMin}K
            </span>
          )}
          {appliedPayslipListFilters.netMax && (
            <span
              style={{
                padding: "3px 10px 3px 8px",
                background: F.infoBg,
                border: `1px solid ${F.brand}40`,
                borderRadius: 12,
                fontSize: 12,
                color: F.brand,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              Net ≤ ₹{appliedPayslipListFilters.netMax}K
            </span>
          )}
        </div>
      )}

      <div
        style={{
          background: F.card,
          border: `1px solid ${F.border}`,
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <Th>
                <input
                  type="checkbox"
                  aria-label="Select all payslips on this page"
                  checked={allPagePayslipsSelected}
                  onChange={togglePagePayslips}
                  style={{ width: 16, height: 16, cursor: "pointer" }}
                />
              </Th>
              {!myEmp && <Th>Employee</Th>}
              {!myEmp && <Th>Department</Th>}
              <Th>Pay Period</Th>
              <SortTh col="gross">Gross Earnings</SortTh>
              <SortTh col="net">Net Pay</SortTh>
              <Th right>Deductions</Th>
              <Th>PF</Th>
              <Th>TDS</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={myEmp ? 10 : 11}
                  style={{ padding: 48, textAlign: "center", color: F.text3 }}
                >
                  No payslips match the selected filters.
                </td>
              </tr>
            )}
                  {paginatedPayslipRows.map(({ row, run, emp: e }) => (
              <TrH
                key={`${run.id}-${row.empId}`}
                onClick={() => setViewSlip({ row, run })}
              >
                <Td>
                  <input
                    type="checkbox"
                    aria-label={`Select ${e.name} payslip for ${run.period}`}
                    checked={selectedPayslipKeys.includes(payslipKey(run, row))}
                    onClick={(event) => event.stopPropagation()}
                    onChange={() => setSelectedPayslipKeys((current) => {
                      const key = payslipKey(run, row)
                      return current.includes(key)
                        ? current.filter((item) => item !== key)
                        : [...current, key]
                    })}
                    style={{ width: 16, height: 16, cursor: "pointer" }}
                  />
                </Td>
                {!myEmp && (
                  <Td>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: F.brand,
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 10,
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {e.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>
                          {e.name}
                        </div>
                        <div style={{ fontSize: 11, color: F.text3 }}>
                          {e.id}
                        </div>
                      </div>
                    </div>
                  </Td>
                )}
                {!myEmp && (
                  <Td>
                    <span style={{ fontSize: 12 }}>{e.department}</span>
                  </Td>
                )}
                <Td>
                  <span style={{ fontWeight: 600 }}>{run.period}</span>
                </Td>
                <Td right>{inr(row.totalEarnings)}</Td>
                <Td right>
                  <strong style={{ color: F.success, fontSize: 14 }}>
                    {inr(row.netSalary)}
                  </strong>
                </Td>
                <Td right style={{ color: F.error }}>
                  {inr(row.totalDeductions)}
                </Td>
                <Td>
                  <span style={{ fontSize: 12 }}>{inr(row.pf)}</span>
                </Td>
                <Td>
                  <span style={{ fontSize: 12 }}>{inr(row.tds)}</span>
                </Td>
                <Td>{prBadge("Completed")}</Td>
                <Td>
                  <div
                    style={{ display: "flex", gap: 6, flexWrap: "wrap" }}
                    onClick={(ev) => ev.stopPropagation()}
                  >
                    <Btn
                      small
                      variant="secondary"
                      title={`View payslip for ${e.name} - ${run.period}`}
                      onClick={() => setViewSlip({ row, run })}
                    >
                      View
                    </Btn>
                    <Btn
                      small
                      title={`Download PDF payslip for ${e.name} - ${run.period}`}
                      onClick={() => downloadPayslipPdf(row, run, e)}
                    >
                      <DownloadIcon />
                      Download PDF
                    </Btn>
                  </div>
                </Td>
              </TrH>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={payslipPage} pageSize={10} total={rows.length} onPageChange={setPayslipPage} />
      {viewSlip && (
        <Modal
          title={`Payslip - ${viewSlip.run.period}`}
          onClose={() => setViewSlip(null)}
          wide
        >
          <PayslipSheet
            row={viewSlip.row}
            run={viewSlip.run}
            emp={emps.find((e) => e.id === viewSlip.row.empId)!}
          />
        </Modal>
      )}
    </div>
  )
}

function ReportsView({
  emps,
  ss,
  payruns,
}: {
  emps: Employee[]
  ss: SalaryStructure[]
  payruns: Payrun[]
}) {
  const toast = useToast()
  const [active, setActive] = useState<string | null>(null)
  const [reportDraft, setReportDraft] = useState("payroll_summary")
  const [period, setPeriod] = useState("July 2026")
  const completedPeriods = payruns
    .filter((p) => isFinalizedPayrun(p.status))
    .map((p) => p.period)
  const pr =
    payruns.find((p) => p.period === period && isFinalizedPayrun(p.status)) ??
    payruns.find((p) => isFinalizedPayrun(p.status))
  const REPORT_LIST = [
    { id: "payroll_summary", label: "Payroll Summary" },
    { id: "employee_payroll", label: "Employee Payroll" },
    { id: "earnings", label: "Earnings Report" },
    { id: "deductions", label: "Deductions Report" },
    { id: "lop", label: "LOP Report" },
    { id: "payslip", label: "Payslip Report" },
  ]

  return (
    <div>
      <PH
        title="Reports"
        sub="Payroll, earnings, deduction, and LOP reports"
        action={
          <>
            <Btn
              variant="secondary"
              onClick={() => toast("All reports exported", "success")}
            >
              Export All
            </Btn>
            <UniversalColumnCustomizer persona="reports" inline />
          </>
        }
      />
      <div className="report-type-selector">
        <label>
          Report type
          <select value={reportDraft} onChange={(event) => setReportDraft(event.target.value)}>
            {REPORT_LIST.map((report) => <option key={report.id} value={report.id}>{report.label}</option>)}
          </select>
        </label>
        <Btn onClick={() => setActive(reportDraft)}>Go</Btn>
      </div>
      {active && <div className="report-content">
        <div
          style={{
            background: F.card,
            border: `1px solid ${F.border}`,
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <div
            className="report-toolbar"
            style={{
              padding: "12px 18px",
              borderBottom: `1px solid ${F.border}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span className="report-toolbar-title" style={{ fontSize: 14, fontWeight: 600, color: F.text1 }}>
              {REPORT_LIST.find((r) => r.id === active)?.label}
            </span>
            <div className="report-toolbar-actions" style={{ display: "flex", gap: 8, alignItems: "flex-end", flexWrap: "wrap" }}>
              <ContextDateRangeFilter />
              <label className="report-period-field">
                Pay period
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  style={{ ...iSt, width: 160 }}
                >
                  {completedPeriods.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </label>
              <Btn
                small
                onClick={() =>
                  toast(
                    `${REPORT_LIST.find((r) => r.id === active)?.label} exported`,
                    "success",
                  )
                }
              >
                Export CSV
              </Btn>
            </div>
          </div>
          {!pr && (
            <div
              style={{
                padding: 32,
                textAlign: "center",
                color: F.text3,
                fontSize: 13,
              }}
            >
              No completed pay runs for the selected period.
            </div>
          )}
          {pr &&
            (active === "payroll_summary" || active === "employee_payroll") && (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <Th>Employee</Th>
                    <Th>Department</Th>
                    <Th right>Gross</Th>
                    <Th right>Bonus</Th>
                    <Th right>Total Earnings</Th>
                    <Th right>Total Deductions</Th>
                    <Th right>Net Salary</Th>
                  </tr>
                </thead>
                <tbody>
                  {pr.rows.map((r) => (
                    <TrH key={r.empId}>
                      <Td>
                        <div style={{ fontWeight: 600 }}>{r.empName}</div>
                        <div style={{ fontSize: 11, color: F.text3 }}>
                          {r.empId}
                        </div>
                      </Td>
                      <Td>{r.department}</Td>
                      <Td right>{inr(r.grossSalary)}</Td>
                      <Td
                        right
                        style={{ color: r.bonus > 0 ? F.success : F.text3 }}
                      >
                        {r.bonus > 0 ? inr(r.bonus) : "--"}
                      </Td>
                      <Td right>{inr(r.totalEarnings)}</Td>
                      <Td right style={{ color: F.error }}>
                        {inr(r.totalDeductions)}
                      </Td>
                      <Td right>
                        <strong style={{ color: F.success }}>
                          {inr(r.netSalary)}
                        </strong>
                      </Td>
                    </TrH>
                  ))}
                </tbody>
              </table>
            )}
          {pr && active === "deductions" && (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <Th>Employee</Th>
                  <Th right>PF</Th>
                  <Th right>ESI</Th>
                  <Th right>TDS</Th>
                  <Th right>Prof. Tax</Th>
                  <Th right>LOP Ded.</Th>
                  <Th right>Total</Th>
                </tr>
              </thead>
              <tbody>
                {pr.rows.map((r) => (
                  <TrH key={r.empId}>
                    <Td>
                      <div style={{ fontWeight: 600 }}>{r.empName}</div>
                    </Td>
                    <Td right>{inr(r.pf)}</Td>
                    <Td right>{r.esi > 0 ? inr(r.esi) : "--"}</Td>
                    <Td right>{inr(r.tds)}</Td>
                    <Td right>{inr(r.profTax)}</Td>
                    <Td
                      right
                      style={{ color: r.lopDeduction > 0 ? F.error : F.text3 }}
                    >
                      {r.lopDeduction > 0 ? inr(r.lopDeduction) : "Nil"}
                    </Td>
                    <Td right>
                      <strong>{inr(r.totalDeductions)}</strong>
                    </Td>
                  </TrH>
                ))}
              </tbody>
            </table>
          )}
          {pr && active === "earnings" && (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <Th>Employee</Th>
                  <Th right>Basic</Th>
                  <Th right>HRA</Th>
                  <Th right>Fixed Allow.</Th>
                  <Th right>Special Allow.</Th>
                  <Th right>Bonus</Th>
                  <Th right>Gross</Th>
                </tr>
              </thead>
              <tbody>
                {pr.rows.map((r) => {
                  const s = ss.find(
                    (x) =>
                      x.name ===
                      emps.find((e) => e.id === r.empId)?.salaryStructure,
                  )!
                  return (
                    <TrH key={r.empId}>
                      <Td>
                        <div style={{ fontWeight: 600 }}>{r.empName}</div>
                      </Td>
                      <Td right>{inr(s?.basic ?? 0)}</Td>
                      <Td right>{inr(s?.hra ?? 0)}</Td>
                      <Td right>{inr(s?.fixedAllowance ?? 0)}</Td>
                      <Td right>{inr(s?.specialAllowance ?? 0)}</Td>
                      <Td
                        right
                        style={{ color: r.bonus > 0 ? F.success : F.text3 }}
                      >
                        {r.bonus > 0 ? inr(r.bonus) : "--"}
                      </Td>
                      <Td right>
                        <strong>{inr(r.totalEarnings)}</strong>
                      </Td>
                    </TrH>
                  )
                })}
              </tbody>
            </table>
          )}
          {pr && active === "lop" && (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <Th>Employee</Th>
                  <Th>Department</Th>
                  <Th right>LOP Days</Th>
                  <Th right>Per-Day Salary</Th>
                  <Th right>LOP Deduction</Th>
                  <Th right>Net After LOP</Th>
                </tr>
              </thead>
              <tbody>
                {pr.rows.map((r) => {
                  const emp = emps.find((e) => e.id === r.empId)!
                  return (
                    <TrH key={r.empId}>
                      <Td>
                        <div style={{ fontWeight: 600 }}>{r.empName}</div>
                      </Td>
                      <Td>{emp?.department}</Td>
                      <Td
                        right
                        style={{ color: r.lopDays > 0 ? F.error : F.text3 }}
                      >
                        {r.lopDays > 0 ? r.lopDays : "--"}
                      </Td>
                      <Td right>
                        {inr(Math.round((emp?.grossSalary ?? 0) / 26))}
                      </Td>
                      <Td
                        right
                        style={{
                          color: r.lopDeduction > 0 ? F.error : F.text3,
                        }}
                      >
                        {r.lopDeduction > 0 ? inr(r.lopDeduction) : "Nil"}
                      </Td>
                      <Td right>
                        <strong>{inr(r.netSalary)}</strong>
                      </Td>
                    </TrH>
                  )
                })}
              </tbody>
            </table>
          )}
          {active === "payslip" && (
            <div style={{ padding: 24 }}>
              <p style={{ fontSize: 13, color: F.text2, marginBottom: 16 }}>
                Generate individual payslips for any employee and period.
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <select style={{ ...iSt, width: 200 }}>
                  <option>All Employees</option>
                  {emps.map((e) => (
                    <option key={e.id}>{e.name}</option>
                  ))}
                </select>
                <Btn
                  onClick={() =>
                    toast("Payslips generated and ready to download", "success")
                  }
                >
                  Generate Payslips
                </Btn>
                <Btn
                  variant="secondary"
                  onClick={() =>
                    toast("Payslip report exported as PDF", "success")
                  }
                >
                  Export PDF
                </Btn>
              </div>
            </div>
          )}
        </div>
      </div>}
    </div>
  )
}

interface UserRow {
  name: string
  role: "Org Admin" | "Employee"
  status: "Active" | "Locked"
}
interface UserRow {
  name: string
  role: "Org Admin" | "Employee"
  status: "Active" | "Locked"
  department?: string
  scope?: string
}

function AccessManagementView({ emps }: { emps: Employee[] }) {
  const toast = useToast()

  // Initialize users roster with rich metadata
  const [users, setUsers] = useState<UserRow[]>([
    {
      name: "Meena Iyer",
      role: "Org Admin",
      status: "Active",
      department: "Executive & Admin",
      scope: "Full Admin Access",
    },
    ...emps
      .filter((e) => e.id !== "EMP-003")
      .map((e) => ({
        name: e.name,
        role: "Employee" as const,
        status: e.id === "EMP-006" ? ("Locked" as const) : ("Active" as const),
        department: e.department || "Operations",
        scope: "Self-Service Only",
      })),
  ])

  // Filter Bar state: Draft inputs + Applied filters
  const [showFilterBar, setShowFilterBar] = useState(true)

  const [searchDraft, setSearchDraft] = useState("")
  const [roleDraft, setRoleDraft] = useState("all")
  const [statusDraft, setStatusDraft] = useState("all")
  const [deptDraft, setDeptDraft] = useState("all")
  const [scopeDraft, setScopeDraft] = useState("all")
  const [userPage, setUserPage] = useState(1)
  const [hasRunUserSearch, setHasRunUserSearch] = useState(false)

  const [appliedSearch, setAppliedSearch] = useState("")
  const [appliedRole, setAppliedRole] = useState("all")
  const [appliedStatus, setAppliedStatus] = useState("all")
  const [appliedDept, setAppliedDept] = useState("all")
  const [appliedScope, setAppliedScope] = useState("all")

  const [showAdd, setShowAdd] = useState(false)
  const [newUser, setNewUser] = useState({
    name: "",
    role: "Employee" as UserRow["role"],
    department: "Engineering",
  })
  const [editUser, setEditUser] = useState<UserRow | null>(null)
  const [confirm, setConfirm] = useState<{
    msg: string
    onOk: () => void
  } | null>(null)

  const f4UserNames = Array.from(new Set(users.map((u) => u.name)))
  const availableDepts = Array.from(new Set(users.map((u) => u.department || "Operations")))

  // Execute filter search on "Go"
  const handleGo = () => {
    setHasRunUserSearch(true)
    setUserPage(1)
    setAppliedSearch(searchDraft)
    setAppliedRole(roleDraft)
    setAppliedStatus(statusDraft)
    setAppliedDept(deptDraft)
    setAppliedScope(scopeDraft)
    toast("Filters applied", "info")
  }

  // Clear all filters
  const handleClear = () => {
    setHasRunUserSearch(false)
    setUserPage(1)
    setSearchDraft("")
    setRoleDraft("all")
    setStatusDraft("all")
    setDeptDraft("all")
    setScopeDraft("all")

    setAppliedSearch("")
    setAppliedRole("all")
    setAppliedStatus("all")
    setAppliedDept("all")
    setAppliedScope("all")

    toast("All filters cleared", "info")
  }

  // Filter evaluation logic
  const filteredUsers = hasRunUserSearch ? users.filter((u) => {
    if (!searchMatches(appliedSearch, [u.name, u.role])) {
      return false
    }
    if (appliedRole !== "all" && u.role !== appliedRole) {
      return false
    }
    if (appliedStatus !== "all" && u.status !== appliedStatus) {
      return false
    }
    if (appliedDept !== "all" && u.department !== appliedDept) {
      return false
    }
    if (appliedScope !== "all" && u.scope !== appliedScope) {
      return false
    }
    return true
  }) : []
  const paginatedUsers = filteredUsers.slice((userPage - 1) * 10, userPage * 10)

  const toggleLock = (u: UserRow) => {
    const next = u.status === "Active" ? "Locked" : "Active"
    setConfirm({
      msg: `${next === "Locked" ? "Lock" : "Unlock"} access for ${u.name}?`,
      onOk: () => {
        setUsers(
          users.map((x) => (x.name === u.name ? { ...x, status: next } : x)),
        )
        toast(
          `${u.name} ${next === "Locked" ? "locked" : "unlocked"}`,
          "success",
        )
        setConfirm(null)
      },
    })
  }

  const addUser = () => {
    if (!newUser.name) return toast("Name is required", "error")
    setUsers([
      ...users,
      {
        ...newUser,
        status: "Active",
        scope: newUser.role === "Org Admin" ? "Full Admin Access" : "Self-Service Only",
      },
    ])
    setShowAdd(false)
    setNewUser({ name: "", role: "Employee", department: "Engineering" })
    toast(`${newUser.name} added as ${newUser.role}`, "success")
  }

  const saveEditUser = () => {
    if (!editUser) return
    setUsers(users.map((u) => (u.name === editUser.name ? editUser : u)))
    setEditUser(null)
    toast("User role updated successfully", "success")
  }

  const orgAdminsCount = users.filter((u) => u.role === "Org Admin").length
  const employeesCount = users.filter((u) => u.role === "Employee").length
  const lockedCount = users.filter((u) => u.status === "Locked").length
  const activeFiltersCount =
    (activeSearch(appliedSearch) ? 1 : 0) +
    (appliedRole !== "all" ? 1 : 0) +
    (appliedStatus !== "all" ? 1 : 0) +
    (appliedDept !== "all" ? 1 : 0) +
    (appliedScope !== "all" ? 1 : 0)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <PH
        title="Access Management & Roles"
        sub="Configure user accounts, role assignments, and security permissions"
        action={
          <>
          <Btn onClick={() => setShowAdd(true)}>+ Add User</Btn>
          <Btn variant="secondary" onClick={() => toast("User roster exported", "info")}>
            Download User List
          </Btn>
          </>
        }
      />

      {/* 4 KPI Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        <EmployeeMetricCard
          label="Total Users"
          value={`${users.length} Users`}
          sub="Registered organization platform logins"
          accent={F.brand}
          badgeText="Active Roster"
          badgeBg={F.infoBg}
          badgeColor={F.brand}
          progress={100}
        />
        <EmployeeMetricCard
          label="Organization Admins"
          value={`${orgAdminsCount} Admin`}
          sub="Full administrative & payroll execution rights"
          accent="#8B5CF6"
          badgeText="Admin"
          badgeBg="#F5F3FF"
          badgeColor="#7C3AED"
          progress={100}
        />
        <EmployeeMetricCard
          label="Employee Self-Service"
          value={`${employeesCount} Employees`}
          sub="Restricted to own salary, payslips & tax data"
          accent={F.success}
          badgeText="Standard Access"
          badgeBg={F.successBg}
          badgeColor={F.success}
          progress={100}
        />
        <EmployeeMetricCard
          label="Account Security"
          value={`${lockedCount} Locked`}
          sub={lockedCount > 0 ? "Accounts restricted from sign-in" : "All user accounts active"}
          accent={lockedCount > 0 ? F.warning : F.text3}
          badgeText={lockedCount > 0 ? "Security Alert" : "Protected"}
          badgeBg={lockedCount > 0 ? F.warningBg : F.pageBg}
          badgeColor={lockedCount > 0 ? F.warning : F.text2}
          progress={100}
        />
      </div>

      {/* SAP Fiori Filter Bar Panel */}
      <div
        style={{
          background: F.card,
          border: `1px solid ${F.border}`,
          borderRadius: 8,
          boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
          // Let the value-help suggestions extend beyond the filter row.
          // The filter panel stays above the results card while the menu is open.
          overflow: "visible",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Filter Bar Action Bar Header */}
        <div
          style={{
            padding: "12px 18px",
            borderBottom: showFilterBar ? `1px solid ${F.border}` : "none",
            background: F.card,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: F.text1 }}>
              Filter Bar
            </span>
            {activeFiltersCount > 0 && (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: F.brand,
                  background: F.infoBg,
                  padding: "2px 8px",
                  borderRadius: 12,
                }}
              >
                {activeFiltersCount} Active Filter{activeFiltersCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Action Row: Go, Clear Filters, Hide/Show Filter Bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Btn onClick={handleGo} style={{ height: 34, padding: "0 18px", fontWeight: 700 }}>
              Go
            </Btn>
            <Btn variant="secondary" onClick={handleClear} style={{ height: 34 }}>
              Clear Filters
            </Btn>
            <Btn
              variant="secondary"
              onClick={() => setShowFilterBar(!showFilterBar)}
              style={{ height: 34 }}
            >
              {showFilterBar ? "Hide Filter Bar" : "Show Filter Bar"}
            </Btn>
          </div>
        </div>

        {/* Collapsible Filter Inputs Panel */}
        {showFilterBar && (
          <div
            style={{
              padding: "16px 18px",
              background: F.card,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 14,
              alignItems: "flex-end",
            }}
          >
            {/* 1. Search User (F4 Search) */}
            <div style={{ gridColumn: "span 2", minWidth: 260 }}>
              <ValueHelp
                label="Search User (F4 Search)"
                value={searchDraft}
                onChange={setSearchDraft}
                placeholder="Search user name or role (press Go to apply)…"
                values={f4UserNames}
              />
            </div>

            {/* 2. Role Filter */}
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: F.text2,
                  marginBottom: 3,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Role Filter
              </div>
              <select
                value={roleDraft}
                onChange={(e) => setRoleDraft(e.target.value)}
                style={{ ...iSt, cursor: "pointer" }}
              >
                <option value="all">All Roles</option>
                <option value="Org Admin">Org Admin</option>
                <option value="Employee">Employee</option>
              </select>
            </div>

            {/* 3. Account Status Filter */}
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: F.text2,
                  marginBottom: 3,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Account Status
              </div>
              <select
                value={statusDraft}
                onChange={(e) => setStatusDraft(e.target.value)}
                style={{ ...iSt, cursor: "pointer" }}
              >
                <option value="all">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Locked">Locked</option>
              </select>
            </div>

            {/* 4. Department Filter */}
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: F.text2,
                  marginBottom: 3,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Department
              </div>
              <select
                value={deptDraft}
                onChange={(e) => setDeptDraft(e.target.value)}
                style={{ ...iSt, cursor: "pointer" }}
              >
                <option value="all">All Departments</option>
                {availableDepts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* 5. Permission Scope Filter */}
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: F.text2,
                  marginBottom: 3,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Access Scope
              </div>
              <select
                value={scopeDraft}
                onChange={(e) => setScopeDraft(e.target.value)}
                style={{ ...iSt, cursor: "pointer" }}
              >
                <option value="all">All Scopes</option>
                <option value="Full Admin Access">Full Admin Access</option>
                <option value="Self-Service Only">Self-Service Only</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* User Roster Table */}
      <div
        style={{
          background: F.card,
          border: `1px solid ${F.border}`,
          borderRadius: 8,
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: `1px solid ${F.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: F.text1 }}>
              Platform User Roster
            </h2>
            <div style={{ fontSize: 12, color: F.text2, marginTop: 2 }}>
              Showing {filteredUsers.length} of {users.length} registered user accounts
            </div>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700, fontSize: 13 }}>
            <thead>
              <tr
                style={{
                  borderBottom: `1px solid ${F.border}`,
                  background: F.pageBg,
                  color: F.text2,
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                <th style={{ padding: "12px 18px", textAlign: "left" }}>Platform User</th>
                <th style={{ padding: "12px 14px", textAlign: "left" }}>Assigned Role</th>
                <th style={{ padding: "12px 14px", textAlign: "left" }}>Department</th>
                <th style={{ padding: "12px 14px", textAlign: "left" }}>Permission Scope</th>
                <th style={{ padding: "12px 14px", textAlign: "center" }}>Account Status</th>
                <th style={{ padding: "12px 18px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: 44, textAlign: "center", color: F.text3 }}>
                    No platform users match your filter criteria. Click "Clear Filters" or adjust search.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((u) => (
                  <tr
                    key={u.name}
                    style={{
                      borderBottom: `1px solid ${F.border}60`,
                      transition: "background 0.12s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = F.pageBg)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "14px 18px" }}>
                      <strong style={{ color: F.text1 }}>{u.name}</strong>
                    </td>
                    <td style={{ padding: "14px 14px" }}>
                      <Badge
                        label={u.role}
                        color={u.role === "Org Admin" ? F.brand : F.text2}
                        bg={u.role === "Org Admin" ? F.infoBg : F.pageBg}
                      />
                    </td>
                    <td style={{ padding: "14px 14px", color: F.text2 }}>
                      {u.department || "Operations"}
                    </td>
                    <td style={{ padding: "14px 14px", color: F.text3, fontSize: 12 }}>
                      {u.scope || "Self-Service Only"}
                    </td>
                    <td style={{ padding: "14px 14px", textAlign: "center" }}>
                      <Badge
                        label={u.status}
                        color={u.status === "Active" ? F.success : F.error}
                        bg={u.status === "Active" ? F.successBg : F.errorBg}
                        dot={u.status === "Active" ? F.success : F.error}
                      />
                    </td>
                    <td style={{ padding: "14px 18px", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <Btn small variant="secondary" onClick={() => setEditUser({ ...u })}>
                          Edit Role
                        </Btn>
                        <Btn
                          small
                          variant="secondary"
                          onClick={() => toggleLock(u)}
                          style={{
                            color: u.status === "Active" ? F.error : F.success,
                          }}
                        >
                          {u.status === "Active" ? "Lock" : "Unlock"}
                        </Btn>
                        <Btn
                          small
                          variant="secondary"
                          onClick={() => toast(`Password reset email sent to ${u.name}`, "info")}
                        >
                          Reset Pwd
                        </Btn>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination page={userPage} pageSize={10} total={filteredUsers.length} onPageChange={setUserPage} />
      </div>

      {/* Add User Modal */}
      {showAdd && (
        <Modal title="Add New Platform User" onClose={() => setShowAdd(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Fld label="User Full Name">
              <input
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="Enter name (e.g. Ananya Roy)"
                style={iSt}
              />
            </Fld>
            <Fld label="Department">
              <select
                value={newUser.department}
                onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                style={{ ...iSt, cursor: "pointer" }}
              >
                <option value="Engineering">Engineering</option>
                <option value="HR & Payroll">HR & Payroll</option>
                <option value="Operations">Operations</option>
                <option value="Finance">Finance</option>
                <option value="Executive & Admin">Executive & Admin</option>
              </select>
            </Fld>
            <Fld label="Assign Role">
              <select
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value as UserRow["role"] })
                }
                style={{ ...iSt, cursor: "pointer" }}
              >
                <option value="Employee">Employee (Self-Service)</option>
                <option value="Org Admin">Organization Admin</option>
              </select>
            </Fld>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
              <Btn variant="secondary" onClick={() => setShowAdd(false)}>
                Cancel
              </Btn>
              <Btn onClick={addUser}>Add User</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Role Modal */}
      {editUser && (
        <Modal title={`Edit Role — ${editUser.name}`} onClose={() => setEditUser(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Fld label="User Role">
              <select
                value={editUser.role}
                onChange={(e) =>
                  setEditUser({
                    ...editUser,
                    role: e.target.value as UserRow["role"],
                    scope: e.target.value === "Org Admin" ? "Full Admin Access" : "Self-Service Only",
                  })
                }
                style={{ ...iSt, cursor: "pointer" }}
              >
                <option value="Employee">Employee (Self-Service)</option>
                <option value="Org Admin">Organization Admin</option>
              </select>
            </Fld>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
              <Btn variant="secondary" onClick={() => setEditUser(null)}>
                Cancel
              </Btn>
              <Btn onClick={saveEditUser}>Save Role Changes</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Confirm Action Dialog */}
      {confirm && (
        <Modal title="Confirm Security Action" onClose={() => setConfirm(null)}>
          <p style={{ color: F.text2, fontSize: 13 }}>{confirm.msg}</p>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
            <Btn variant="secondary" onClick={() => setConfirm(null)}>
              Cancel
            </Btn>
            <Btn onClick={confirm.onOk}>Confirm Action</Btn>
          </div>
        </Modal>
      )}
    </div>
  )
}

function AuditHistoryView({
  logs,
  errorLogs = [],
}: {
  logs: AuditLog[]
  errorLogs?: ErrorLog[]
}) {
  const toast = useToast()
  const [tab, setTab] = useState<"audit" | "errors">("audit")
  const [auditPage, setAuditPage] = useState(1)
  const [hasRunAuditSearch, setHasRunAuditSearch] = useState(false)
  const [filterDraft, setFilterDraft] = useState({
    search: "",
    module: "All",
    user: "All",
    dateFrom: "",
    dateTo: "",
    severity: "All",
    status: "All",
  })
  const [appliedFilters, setAppliedFilters] = useState(filterDraft)
  const activeRows = tab === "audit" ? logs : errorLogs
  const modules = ["All", ...Array.from(new Set(activeRows.map((a) => a.module)))]
  const users = ["All", ...Array.from(new Set(activeRows.map((a) => a.user)))]
  const withinDate = (timestamp: string) => {
    const day = timestamp.slice(0, 10)
    return (
      (!appliedFilters.dateFrom || day >= appliedFilters.dateFrom) &&
      (!appliedFilters.dateTo || day <= appliedFilters.dateTo)
    )
  }
  const filtered = logs.filter(
    (a) =>
      (appliedFilters.module === "All" || a.module === appliedFilters.module) &&
      (appliedFilters.user === "All" || a.user === appliedFilters.user) &&
      withinDate(a.timestamp) &&
      searchMatches(appliedFilters.search, [a.action, a.user, a.module, a.oldValue, a.newValue]),
  )
  const filteredErrors = errorLogs.filter(
    (a) =>
      (appliedFilters.module === "All" || a.module === appliedFilters.module) &&
      (appliedFilters.user === "All" || a.user === appliedFilters.user) &&
      (appliedFilters.severity === "All" || a.severity === appliedFilters.severity) &&
      (appliedFilters.status === "All" || a.status === appliedFilters.status) &&
      withinDate(a.timestamp) &&
      searchMatches(appliedFilters.search, [a.issue, a.user, a.module, a.route, a.status, a.severity]),
  )
  const activeFilteredRows = hasRunAuditSearch ? (tab === "audit" ? filtered : filteredErrors) : []
  const visibleAuditRows = hasRunAuditSearch
    ? filtered.slice((auditPage - 1) * 10, auditPage * 10)
    : []
  const visibleErrorRows = hasRunAuditSearch
    ? filteredErrors.slice((auditPage - 1) * 10, auditPage * 10)
    : []
  const clearFilters = () => {
    setHasRunAuditSearch(false)
    const empty = {
      search: "",
      module: "All",
      user: "All",
      dateFrom: "",
      dateTo: "",
      severity: "All",
      status: "All",
    }
    setFilterDraft(empty)
    setAppliedFilters(empty)
    toast("Filters cleared", "info")
  }
  const applyFilters = () => {
    setHasRunAuditSearch(true)
    setAuditPage(1)
    setAppliedFilters(filterDraft)
    toast("Filters applied", "success")
  }
  const activeFilterCount =
    (activeSearch(appliedFilters.search) ? 1 : 0) +
    (appliedFilters.module !== "All" ? 1 : 0) +
    (appliedFilters.user !== "All" ? 1 : 0) +
    (appliedFilters.dateFrom ? 1 : 0) +
    (appliedFilters.dateTo ? 1 : 0) +
    (tab === "errors" && appliedFilters.severity !== "All" ? 1 : 0) +
    (tab === "errors" && appliedFilters.status !== "All" ? 1 : 0)
  return (
    <div>
      <PH
        title="Audit & Error Logs"
        sub="Role-scoped tracking for sensitive activity, broken flows, and operational issues"
        action={
          <Btn
            variant="secondary"
            onClick={() =>
              toast(
                tab === "audit"
                  ? "Audit log exported as CSV"
                  : "Error log exported as CSV",
                "success",
              )
            }
          >
            Export {tab === "audit" ? "Audit" : "Errors"}
          </Btn>
        }
      />
      <TabBar
        tabs={[
          { id: "audit", label: "Audit History" },
          { id: "errors", label: "Error Logs" },
        ]}
        active={tab}
        onSelect={(id) => {
          setTab(id as "audit" | "errors")
          clearFilters()
        }}
      />
      <div
        style={{
          background: F.card,
          border: `1px solid ${F.border}`,
          borderRadius: 8,
          padding: 14,
          marginBottom: 14,
          display: "grid",
          gridTemplateColumns: "minmax(260px, 1.6fr) repeat(4, minmax(130px, 1fr))",
          gap: 10,
          alignItems: "end",
        }}
      >
        <Fld label={tab === "audit" ? "Search Audit Trail" : "Search Error Details"}>
        <input
          value={filterDraft.search}
          onChange={(e) => setFilterDraft({ ...filterDraft, search: e.target.value })}
          placeholder={
            tab === "audit"
              ? "Search action, user, or module (min 3 chars)..."
              : "Search issue, user, route, or module (min 3 chars)..."
          }
          style={iSt}
        />
        </Fld>
        <Fld label="Module">
        <select
          value={filterDraft.module}
          onChange={(e) => setFilterDraft({ ...filterDraft, module: e.target.value })}
          style={iSt}
        >
          {modules.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
        </Fld>
        <Fld label="User">
        <select
          value={filterDraft.user}
          onChange={(e) => setFilterDraft({ ...filterDraft, user: e.target.value })}
          style={iSt}
        >
          {users.map((u) => (
            <option key={u}>{u}</option>
          ))}
        </select>
        </Fld>
        <Fld label="Record Date From">
          <StrictDateInput
            ariaLabel="Record date from"
            value={filterDraft.dateFrom}
            onChange={(value) => setFilterDraft({ ...filterDraft, dateFrom: value })}
            style={iSt}
          />
        </Fld>
        <Fld label="Record Date To">
          <StrictDateInput
            ariaLabel="Record date to"
            value={filterDraft.dateTo}
            onChange={(value) => setFilterDraft({ ...filterDraft, dateTo: value })}
            style={iSt}
          />
        </Fld>
        {tab === "errors" && (
          <>
            <Fld label="Severity">
              <select
                value={filterDraft.severity}
                onChange={(e) => setFilterDraft({ ...filterDraft, severity: e.target.value })}
                style={iSt}
              >
                <option>All</option>
                <option>Critical</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </Fld>
            <Fld label="Status">
              <select
                value={filterDraft.status}
                onChange={(e) => setFilterDraft({ ...filterDraft, status: e.target.value })}
                style={iSt}
              >
                <option>All</option>
                <option>Open</option>
                <option>Investigating</option>
                <option>Resolved</option>
              </select>
            </Fld>
          </>
        )}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", gridColumn: "1 / -1" }}>
          <Btn onClick={applyFilters}>Go</Btn>
          <Btn variant="secondary" onClick={clearFilters}>Clear Filters</Btn>
        </div>
      </div>
      {activeFilterCount > 0 && (
        <div style={{ marginBottom: 12, fontSize: 12, color: F.text2, fontWeight: 700 }}>
          Showing filtered results - {activeFilterCount} active filter{activeFilterCount !== 1 ? "s" : ""}
        </div>
      )}
      {tab === "audit" ? (
        <div
        style={{
          background: F.card,
          border: `1px solid ${F.border}`,
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <Th>Timestamp</Th>
              <Th>User</Th>
              <Th>Module</Th>
              <Th>Action</Th>
              <Th>Old Value</Th>
              <Th>New Value</Th>
            </tr>
          </thead>
          <tbody>
            {visibleAuditRows.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    padding: 32,
                    textAlign: "center",
                    color: F.text3,
                    fontSize: 13,
                  }}
                >
                  {hasRunAuditSearch ? "No matching audit events." : "Select filters and click Go to load audit events."}
                </td>
              </tr>
            )}
            {visibleAuditRows.map((a) => (
              <TrH key={a.id}>
                <Td mono>
                  <span style={{ fontSize: 11, color: F.text2 }}>
                    {a.timestamp}
                  </span>
                </Td>
                <Td>
                  <span style={{ fontWeight: 600 }}>{a.user}</span>
                </Td>
                <Td>
                  <Badge label={a.module} color={F.brand} bg={F.infoBg} />
                </Td>
                <Td>
                  <span style={{ fontSize: 12, fontWeight: 500 }}>
                    {a.action}
                  </span>
                </Td>
                <Td>
                  <span
                    style={{
                      fontSize: 11,
                      color: F.text3,
                      fontFamily: "'JetBrains Mono',monospace",
                    }}
                  >
                    {a.oldValue}
                  </span>
                </Td>
                <Td>
                  <span
                    style={{
                      fontSize: 11,
                      color: F.success,
                      fontFamily: "'JetBrains Mono',monospace",
                    }}
                  >
                    {a.newValue}
                  </span>
                </Td>
              </TrH>
            ))}
          </tbody>
        </table>
        </div>
      ) : (
        <div
          style={{
            background: F.card,
            border: `1px solid ${F.border}`,
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <Th>Timestamp</Th>
                <Th>User</Th>
                <Th>Module</Th>
                <Th>Severity</Th>
                <Th>Issue</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {visibleErrorRows.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      padding: 32,
                      textAlign: "center",
                      color: F.text3,
                      fontSize: 13,
                    }}
                  >
                    {hasRunAuditSearch ? "No matching error events." : "Select filters and click Go to load error events."}
                  </td>
                </tr>
              )}
              {visibleErrorRows.map((a) => (
                <TrH key={a.id}>
                  <Td mono>
                    <span style={{ fontSize: 11, color: F.text2 }}>
                      {a.timestamp}
                    </span>
                  </Td>
                  <Td>
                    <span style={{ fontWeight: 600 }}>{a.user}</span>
                    <div style={{ fontSize: 11, color: F.text3 }}>{a.id}</div>
                  </Td>
                  <Td>
                    <Badge label={a.module} color={F.brand} bg={F.infoBg} />
                  </Td>
                  <Td>
                    <Badge
                      label={a.severity}
                      color={
                        a.severity === "Critical" || a.severity === "High"
                          ? F.error
                          : a.severity === "Medium"
                            ? F.warning
                            : F.text2
                      }
                      bg={
                        a.severity === "Critical" || a.severity === "High"
                          ? F.errorBg
                          : a.severity === "Medium"
                            ? F.warningBg
                            : F.pageBg
                      }
                    />
                  </Td>
                  <Td>
                    <span style={{ fontSize: 12, fontWeight: 500 }}>
                      {a.issue}
                    </span>
                    <div style={{ fontSize: 11, color: F.text3, marginTop: 3 }}>
                      {a.route}
                    </div>
                  </Td>
                  <Td>
                    <Badge
                      label={a.status}
                      color={a.status === "Resolved" ? F.success : F.warning}
                      bg={a.status === "Resolved" ? F.successBg : F.warningBg}
                    />
                  </Td>
                </TrH>
              ))}
            </tbody>
          </table>
          <Pagination page={auditPage} pageSize={10} total={activeFilteredRows.length} onPageChange={setAuditPage} />
        </div>
      )}
    </div>
  )
}

function PlatformDashboard({
  orgs,
  logs,
  onNav,
}: {
  orgs: Organization[]
  logs: AuditLog[]
  onNav: (v: string) => void
}) {
  const toast = useToast()
  const { text: greeting, icon: greetingIcon } = getTimeGreeting()
  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
  const totalEmployees = orgs.reduce((sum, o) => sum + o.employees, 0)
  const active = orgs.filter((o) => o.status === "Active").length
  const draft = orgs.filter((o) => o.status === "Draft").length
  const inactive = orgs.filter((o) => o.status === "Inactive").length
  const suspended = orgs.filter((o) => o.status === "Suspended").length
  const statusSegments = [
    { label: "Active", value: active, color: F.success },
    {
      label: "Draft",
      value: draft,
      color: F.brand,
    },
    {
      label: "Inactive",
      value: inactive,
      color: F.warning,
    },
    {
      label: "Suspended",
      value: suspended,
      color: F.error,
    },
  ].filter((x) => x.value > 0)
  const trend = [72, 78, 82, 86, 91, 96, Math.max(totalEmployees, 100)]
  const cardStyle: React.CSSProperties = {
    background: F.card,
    border: `1px solid ${F.border}`,
    borderRadius: 8,
    padding: "20px 22px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
  }

  const growthPct = 8.7
  const activeRatio = orgs.length > 0 ? Math.round((active / orgs.length) * 100) : 100
  const employeeDistribution = [...orgs]
    .sort((a, b) => b.employees - a.employees)
    .map((org, index) => ({
      label: org.code,
      sub: org.name,
      value: org.employees,
      color: index === 0 ? F.brand : org.status === "Active" ? F.success : org.status === "Draft" ? F.warning : F.text3,
    }))
  const activationTrend = [
    { label: "Mar", value: 58 },
    { label: "Apr", value: 62 },
    { label: "May", value: 67 },
    { label: "Jun", value: 67 },
    { label: "Jul", value: 70 },
    { label: "Aug", value: 72 },
    { label: "Sep", value: activeRatio },
  ]
  const adminSecuritySegments = [
    { label: "MFA Enabled", value: 3, color: F.success },
    { label: "MFA Required", value: 1, color: F.warning },
    { label: "Locked", value: 1, color: F.error },
  ]

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* ── Top Header Profile & Status Banner ── */}
      <div
        style={{
          background: F.card,
          border: `1px solid ${F.border}`,
          borderRadius: 8,
          padding: "20px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 20,
          flexWrap: "wrap",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${F.brand}, #0854A0)`,
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              fontWeight: 800,
              boxShadow: "0 2px 8px rgba(0,112,242,0.25)",
              flexShrink: 0,
            }}
          >
            PA
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: F.text2,
                }}
              >
                PLATFORM WORKSPACE
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: F.brand,
                  background: F.infoBg,
                  padding: "2px 10px",
                  borderRadius: 12,
                }}
              >
                {todayStr}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 18 }}>{greetingIcon}</span>
              <h1
                style={{
                  margin: 0,
                  fontSize: 24,
                  fontWeight: 800,
                  color: F.text1,
                  letterSpacing: "-0.01em",
                }}
              >
                {greeting}, <span style={{ fontWeight: 800 }}>Platform Admin</span>
              </h1>
              <Badge
                label="Operational"
                color={F.success}
                bg={F.successBg}
                dot={F.success}
              />
              <Badge
                label="99.9% Uptime"
                color={F.brand}
                bg={F.infoBg}
              />
            </div>
            <div
              style={{
                marginTop: 4,
                fontSize: 13,
                color: F.text2,
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              <span>Super Administrator</span>
              <span>&bull;</span>
              <span>Naxpayroll Global Control Center</span>
              <span>&bull;</span>
              <span style={{ color: F.text3 }}>ID: PLT-ADM-01</span>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <Btn
            onClick={() => onNav("orgs")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontWeight: 700,
            }}
          >
            <span>Manage Organizations</span>
            <span style={{ fontSize: 14 }}>&rarr;</span>
          </Btn>
        </div>
      </div>

      {/* ── KPI Metric Summary Cards Grid (4 Columns) ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        <EmployeeMetricCard
          label="ACTIVE WORKSPACES"
          value={String(active)}
          sub={`${orgs.length} total registered organizations`}
          accent={F.brand}
          badgeText={`${activeRatio}% Active`}
          badgeBg={F.infoBg}
          badgeColor={F.brand}
          progress={activeRatio}
          onClick={() => onNav("orgs")}
        />
        <EmployeeMetricCard
          label="MANAGED WORKFORCE"
          value={totalEmployees.toLocaleString("en-IN")}
          sub="Employees across active client workspaces"
          accent={F.success}
          badgeText={`+${growthPct}% MoM`}
          badgeBg={F.successBg}
          badgeColor={F.success}
          progress={92}
          onClick={() => onNav("orgs")}
        />
        <EmployeeMetricCard
          label="PRODUCT ADMINISTRATORS"
          value="4"
          sub="Platform-level privileged admins"
          accent={F.warning}
          badgeText="Privileged"
          badgeBg={F.warningBg}
          badgeColor={F.warning}
          progress={100}
          onClick={() => onNav("access")}
        />
        <EmployeeMetricCard
          label="SYSTEM RELIABILITY"
          value="99.9%"
          sub="Continuous uptime across 30 days"
          accent="#8A5CF6"
          badgeText="SLA Met"
          badgeBg="#F3E8FF"
          badgeColor="#8A5CF6"
          progress={99}
          onClick={() => onNav("audit")}
        />
      </div>

      {/* ── Main Analytics Section: Workforce Growth + Organization Status Breakdown ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.45fr) minmax(320px, 0.95fr)",
          gap: 20,
        }}
      >
        <section style={cardStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 16,
              gap: 12,
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 800,
                  color: F.text1,
                }}
              >
                Workforce Growth Trend
              </h2>
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: 12,
                  color: F.text2,
                }}
              >
                Total managed employee headcount over the last 7 months
              </p>
            </div>
            <div
              style={{
                fontSize: 11,
                color: F.text3,
                fontWeight: 600,
                background: F.pageBg,
                padding: "3px 8px",
                borderRadius: 4,
              }}
            >
              Last 7 Months
            </div>
          </div>
          <div
            style={{
              height: 160,
              display: "flex",
              alignItems: "end",
              gap: 16,
              padding: "0 10px",
              borderBottom: `1px solid ${F.border}`,
            }}
          >
            {trend.map((v, i) => (
              <div
                key={i}
                style={{
                  height: "100%",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "end",
                  alignItems: "center",
                  gap: 7,
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: F.text2 }}>{v}</div>
                <div
                  style={{
                    width: "100%",
                    maxWidth: 46,
                    height: `${(v / Math.max(...trend)) * 100}%`,
                    minHeight: 14,
                    borderRadius: "4px 4px 0 0",
                    background: i === trend.length - 1 ? F.brand : "#93C5FD",
                    transition: "all 0.2s ease",
                  }}
                />
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 11,
              fontWeight: 600,
              color: F.text3,
              marginTop: 10,
              padding: "0 6px",
            }}
          >
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>
          </div>
        </section>

        <section style={cardStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 14,
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 800,
                  color: F.text1,
                }}
              >
                Workspace Status
              </h2>
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: 12,
                  color: F.text2,
                }}
              >
                Organization lifecycle distribution
              </p>
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: F.brand,
                background: F.infoBg,
                padding: "2px 8px",
                borderRadius: 4,
              }}
            >
              {orgs.length} Total
            </span>
          </div>
          <AnalyticsDonutChart
            segments={statusSegments}
            centerLabel="Total Orgs"
            valueFormatter={(value) => String(value)}
          />
        </section>
      </div>

      <div
        className="product-admin-insights"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr) minmax(320px, 0.9fr)",
          gap: 20,
        }}
      >
        <section style={cardStyle}>
          <div style={{ marginBottom: 14 }}>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: F.text1 }}>
              Workforce by Organization
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: F.text2 }}>
              Bar chart showing employee distribution across tenants
            </p>
          </div>
          <ProductAdminBarChart
            data={employeeDistribution}
            valueLabel={(value) => `${value} employees`}
          />
        </section>

        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", marginBottom: 10 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: F.text1 }}>
                Workspace Activation Trend
              </h2>
              <p style={{ margin: "4px 0 0", fontSize: 12, color: F.text2 }}>
                Line chart of active workspace percentage
              </p>
            </div>
            <Badge
              label={`${activeRatio}% active`}
              color={activeRatio >= 70 ? F.success : F.warning}
              bg={activeRatio >= 70 ? F.successBg : F.warningBg}
            />
          </div>
          <ProductAdminLineChart data={activationTrend} suffix="%" color={F.success} />
        </section>

        <section style={cardStyle}>
          <div style={{ marginBottom: 14 }}>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: F.text1 }}>
              Admin Security Coverage
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: F.text2 }}>
              Donut chart for product admin MFA and lock status
            </p>
          </div>
          <AnalyticsDonutChart
            segments={adminSecuritySegments}
            size={150}
            strokeWidth={24}
            centerLabel="Admin Checks"
            valueFormatter={(value) => String(value)}
          />
        </section>
      </div>

      {/* ── Lower Section: Platform Alerts + Recent Audit Activity ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.2fr) minmax(320px, 1fr)",
          gap: 20,
        }}
      >
        <div
          style={{
            background: F.card,
            border: `1px solid ${F.border}`,
            borderRadius: 8,
            padding: "18px 20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>
                Platform alerts
              </div>
              <div style={{ fontSize: 12, color: F.text3, marginTop: 3 }}>
                Items requiring platform attention
              </div>
            </div>
            <Btn small variant="ghost" onClick={() => onNav("audit")}>
              View audit
            </Btn>
          </div>
          {[
            [
              "1 organization needs administrator assignment",
              F.warning,
              "Setup",
            ],
            ["New feature 'Bulk Export' deployed", F.brand, "System"],
            ["2 platform users locked out", F.error, "Security"],
          ].map(([title, color, tag]) => (
            <div
              key={String(title)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 0",
                borderTop: `1px solid ${F.border}`,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: String(color),
                }}
              />
              <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>
                {title}
              </span>
              <span style={{ fontSize: 11, color: F.text3 }}>{tag}</span>
            </div>
          ))}
        </div>
        <div
          style={{
            background: F.card,
            border: `1px solid ${F.border}`,
            borderRadius: 8,
            padding: "18px 20px",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 15 }}>
            Recent platform activity
          </div>
          <div
            style={{
              fontSize: 12,
              color: F.text3,
              marginTop: 3,
              marginBottom: 10,
            }}
          >
            Latest audited actions across the platform
          </div>
          {logs
            .filter(
              (a) =>
                ["Access", "Organizations", "Platform"].includes(a.module) ||
                a.action.includes("Org") ||
                a.action.includes("Access"),
            )
            .slice(0, 3)
            .map((a) => (
              <div
                key={a.id}
                style={{
                  padding: "10px 0",
                  borderTop: `1px solid ${F.border}`,
                  display: "flex",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 4,
                    background: F.infoBg,
                    color: F.brand,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 11,
                    fontWeight: 800,
                  }}
                >
                  {a.module.slice(0, 2)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>
                    {a.action}
                  </div>
                  <div style={{ fontSize: 11, color: F.text3, marginTop: 2 }}>
                    {a.user} · {a.timestamp.slice(0, 10)}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

type PlatformAdminStatus = "Active" | "Locked" | "Invited"
type PlatformAdminRole = "Super Admin" | "Security Admin" | "Support Admin" | "Billing Admin"
type PlatformOrgPermission =
  | "payrollOverride"
  | "userProvisioning"
  | "auditExport"
  | "billingAccess"
  | "apiAccess"
  | "enforceMfa"

interface PlatformAdminUser {
  id: string
  name: string
  email: string
  role: PlatformAdminRole
  status: PlatformAdminStatus
  assignedOrgIds: string[]
  lastSeen: string
  mfa: boolean
}

function PlatformAccessManagementView({
  orgs,
  setOrgs,
}: {
  orgs: Organization[]
  setOrgs: React.Dispatch<React.SetStateAction<Organization[]>>
}) {
  const toast = useToast()
  const [selectedOrgId, setSelectedOrgId] = useState(orgs[0]?.id ?? "")
  const [accessTab, setAccessTab] = useState<"organizations" | "tenant" | "admins" | "activity">("organizations")
  const [orgSearchDraft, setOrgSearchDraft] = useState("")
  const [orgStatusDraft, setOrgStatusDraft] = useState("All")
  const [orgAdminDraft, setOrgAdminDraft] = useState("All")
  const [orgFyDraft, setOrgFyDraft] = useState("All")
  const [orgSortDraft, setOrgSortDraft] = useState("name-asc")
  const [orgFilters, setOrgFilters] = useState({
    search: "",
    status: "All",
    admin: "All",
    fy: "All",
    sort: "name-asc",
  })
  const [hasRunPlatformOrgSearch, setHasRunPlatformOrgSearch] = useState(false)
  const [searchDraft, setSearchDraft] = useState("")
  const [roleDraft, setRoleDraft] = useState("All")
  const [statusDraft, setStatusDraft] = useState("All")
  const [sortDraft, setSortDraft] = useState("name-asc")
  const [filters, setFilters] = useState({
    search: "",
    role: "All",
    status: "All",
    sort: "name-asc",
  })
  const [hasRunPlatformAdminSearch, setHasRunPlatformAdminSearch] = useState(false)
  const [showInvite, setShowInvite] = useState(false)
  const [inviteDraft, setInviteDraft] = useState({
    name: "",
    email: "",
    role: "Support Admin" as PlatformAdminRole,
    orgId: orgs[0]?.id ?? "",
  })
  const [admins, setAdmins] = useState<PlatformAdminUser[]>([
    {
      id: "PA-001",
      name: "Platform Admin",
      email: "platform.admin@naxpayroll.com",
      role: "Super Admin",
      status: "Active",
      assignedOrgIds: orgs.map((o) => o.id),
      lastSeen: "Today, 09:42",
      mfa: true,
    },
    {
      id: "PA-002",
      name: "Ananya Rao",
      email: "ananya.rao@naxpayroll.com",
      role: "Security Admin",
      status: "Active",
      assignedOrgIds: orgs.filter((o) => o.status === "Active").map((o) => o.id),
      lastSeen: "Today, 08:18",
      mfa: true,
    },
    {
      id: "PA-003",
      name: "Vikram Shah",
      email: "vikram.shah@naxpayroll.com",
      role: "Support Admin",
      status: "Invited",
      assignedOrgIds: orgs.slice(0, 1).map((o) => o.id),
      lastSeen: "Invite pending",
      mfa: false,
    },
    {
      id: "PA-004",
      name: "Neha Menon",
      email: "neha.menon@naxpayroll.com",
      role: "Billing Admin",
      status: "Locked",
      assignedOrgIds: orgs.slice(1, 2).map((o) => o.id),
      lastSeen: "12 Sep, 18:10",
      mfa: true,
    },
  ])
  const [orgControls, setOrgControls] = useState<
    Record<string, Record<PlatformOrgPermission, boolean>>
  >(() =>
    Object.fromEntries(
      orgs.map((org) => [
        org.id,
        {
          payrollOverride: org.status !== "Suspended",
          userProvisioning: org.status !== "Suspended",
          auditExport: true,
          billingAccess: org.status === "Active",
          apiAccess: org.status === "Active",
          enforceMfa: true,
        },
      ]),
    ),
  )
  const [activity, setActivity] = useState([
    "Security Admin reviewed MFA coverage across active tenants",
    "Naxrita Solutions access policy synchronized",
    "BrightEdge Consulting remains in draft workspace mode",
  ])

  const selectedOrg = orgs.find((o) => o.id === selectedOrgId) ?? orgs[0]
  const selectedControls =
    (selectedOrg && orgControls[selectedOrg.id]) ||
    {
      payrollOverride: false,
      userProvisioning: false,
      auditExport: false,
      billingAccess: false,
      apiAccess: false,
      enforceMfa: false,
    }
  const activeOrgs = orgs.filter((o) => o.status === "Active").length
  const lockedAdmins = admins.filter((a) => a.status === "Locked").length
  const mfaCoverage = admins.length
    ? Math.round((admins.filter((a) => a.mfa).length / admins.length) * 100)
    : 0
  const exposedTenants = orgs.filter((org) => orgControls[org.id]?.apiAccess).length
  const orgAdminOptions = [
    "All",
    ...Array.from(new Set(orgs.map((org) => org.admin).filter((admin) => admin !== "-"))),
    "Unassigned",
  ]
  const orgFyOptions = ["All", ...Array.from(new Set(orgs.map((org) => org.financialYear)))]

  const filteredOrgs = (hasRunPlatformOrgSearch ? orgs : [])
    .filter((org) => {
      if (!searchMatches(orgFilters.search, [org.name, org.legalName, org.code, org.id, org.admin])) {
        return false
      }
      if (orgFilters.status !== "All" && org.status !== orgFilters.status) return false
      if (orgFilters.admin === "Unassigned" && org.admin !== "-") return false
      if (orgFilters.admin !== "All" && orgFilters.admin !== "Unassigned" && org.admin !== orgFilters.admin) return false
      if (orgFilters.fy !== "All" && org.financialYear !== orgFilters.fy) return false
      return true
    })
    .sort((a, b) => {
      const dir = orgFilters.sort.endsWith("-desc") ? -1 : 1
      if (orgFilters.sort.startsWith("employees")) return (a.employees - b.employees) * dir
      if (orgFilters.sort.startsWith("status")) return a.status.localeCompare(b.status) * dir
      if (orgFilters.sort.startsWith("code")) return a.code.localeCompare(b.code) * dir
      return a.name.localeCompare(b.name) * dir
    })

  const filteredAdmins = (hasRunPlatformAdminSearch ? admins : [])
    .filter((admin) => {
      if (!searchMatches(filters.search, [admin.name, admin.email, admin.role])) {
        return false
      }
      if (filters.role !== "All" && admin.role !== filters.role) return false
      if (filters.status !== "All" && admin.status !== filters.status) return false
      return true
    })
    .sort((a, b) => {
      const dir = filters.sort.endsWith("-desc") ? -1 : 1
      if (filters.sort.startsWith("role")) return a.role.localeCompare(b.role) * dir
      if (filters.sort.startsWith("status")) return a.status.localeCompare(b.status) * dir
      if (filters.sort.startsWith("orgs")) {
        return (a.assignedOrgIds.length - b.assignedOrgIds.length) * dir
      }
      return a.name.localeCompare(b.name) * dir
    })

  const pushActivity = (msg: string) =>
    setActivity((prev) => [msg, ...prev].slice(0, 6))

  const setOrgStatus = (org: Organization, status: OrgStatus) => {
    setOrgs((prev) => prev.map((o) => (o.id === org.id ? { ...o, status } : o)))
    if (status === "Suspended") {
      setOrgControls((prev) => ({
        ...prev,
        [org.id]: {
          ...(prev[org.id] ?? selectedControls),
          payrollOverride: false,
          userProvisioning: false,
          billingAccess: false,
          apiAccess: false,
        },
      }))
    }
    pushActivity(`${org.name} changed to ${status}`)
    toast(`${org.name} is now ${status}`, "success")
  }

  const toggleOrgControl = (key: PlatformOrgPermission) => {
    if (!selectedOrg) return
    setOrgControls((prev) => ({
      ...prev,
      [selectedOrg.id]: {
        ...(prev[selectedOrg.id] ?? selectedControls),
        [key]: !(prev[selectedOrg.id] ?? selectedControls)[key],
      },
    }))
    pushActivity(`${selectedOrg.name}: ${key} policy updated`)
  }

  const toggleAdminStatus = (admin: PlatformAdminUser) => {
    const status: PlatformAdminStatus = admin.status === "Locked" ? "Active" : "Locked"
    setAdmins((prev) =>
      prev.map((item) => (item.id === admin.id ? { ...item, status } : item)),
    )
    pushActivity(`${admin.name} ${status === "Locked" ? "locked" : "unlocked"}`)
    toast(`${admin.name} ${status === "Locked" ? "locked" : "unlocked"}`, "success")
  }

  const toggleAdminMfa = (admin: PlatformAdminUser) => {
    setAdmins((prev) =>
      prev.map((item) => (item.id === admin.id ? { ...item, mfa: !item.mfa } : item)),
    )
    pushActivity(`${admin.name} MFA ${admin.mfa ? "disabled" : "enabled"}`)
    toast(`MFA ${admin.mfa ? "disabled" : "enabled"} for ${admin.name}`, "info")
  }

  const inviteAdmin = () => {
    if (!inviteDraft.name.trim() || !inviteDraft.email.trim()) {
      toast("Admin name and email are required", "error")
      return
    }
    const assignedOrgIds =
      inviteDraft.role === "Super Admin"
        ? orgs.map((o) => o.id)
        : inviteDraft.orgId
          ? [inviteDraft.orgId]
          : []
    setAdmins((prev) => [
      {
        id: `PA-${String(prev.length + 1).padStart(3, "0")}`,
        name: inviteDraft.name.trim(),
        email: inviteDraft.email.trim(),
        role: inviteDraft.role,
        status: "Invited",
        assignedOrgIds,
        lastSeen: "Invite pending",
        mfa: false,
      },
      ...prev,
    ])
    setShowInvite(false)
    setInviteDraft({
      name: "",
      email: "",
      role: "Support Admin",
      orgId: orgs[0]?.id ?? "",
    })
    pushActivity(`${inviteDraft.name.trim()} invited as ${inviteDraft.role}`)
    toast("Product admin invitation sent", "success")
  }

  const controlItems: {
    key: PlatformOrgPermission
    label: string
    desc: string
    accent: string
  }[] = [
    {
      key: "payrollOverride",
      label: "Payroll override",
      desc: "Allow platform admins to reopen, approve, or lock pay runs.",
      accent: F.brand,
    },
    {
      key: "userProvisioning",
      label: "User provisioning",
      desc: "Create, lock, and reset organization user accounts.",
      accent: "#00A389",
    },
    {
      key: "auditExport",
      label: "Audit export",
      desc: "Download tenant audit trails and security events.",
      accent: "#7C3AED",
    },
    {
      key: "billingAccess",
      label: "Billing controls",
      desc: "Manage plan, invoice, and payment configuration.",
      accent: F.warning,
    },
    {
      key: "apiAccess",
      label: "API access",
      desc: "Enable tenant integrations and external sync credentials.",
      accent: "#0854A0",
    },
    {
      key: "enforceMfa",
      label: "Force MFA",
      desc: "Require two-step verification for all tenant admins.",
      accent: F.success,
    },
  ]

  return (
    <div className="platform-access-view" style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
      <PH
        title="Product Admin Access Control"
        sub="Manage platform admins, tenant permissions, MFA, API access, and organization status."
        action={
          <Btn variant="secondary" onClick={() => toast("Access matrix exported", "success")}>
            Export Matrix
          </Btn>
        }
      />

      <div
        className="platform-access-kpis"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(150px, 1fr))",
          gap: 10,
        }}
      >
        {[
          { l: "Active Organizations", v: `${activeOrgs}/${orgs.length}`, s: "Tenant workspaces online", c: F.success },
          { l: "Platform Admins", v: String(admins.length), s: `${lockedAdmins} locked account${lockedAdmins !== 1 ? "s" : ""}`, c: F.brand },
          { l: "MFA Coverage", v: `${mfaCoverage}%`, s: "Across product admin roster", c: "#7C3AED" },
          { l: "API Enabled", v: String(exposedTenants), s: "Organizations with integrations", c: F.warning },
        ].map((item) => (
          <div
            key={item.l}
            style={{
              background: F.card,
              border: `1px solid ${F.border}`,
              borderTop: `3px solid ${item.c}`,
              borderRadius: 8,
              padding: "10px 14px",
              minHeight: 92,
            }}
          >
            <div style={{ fontSize: 11, color: F.text3, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {item.l}
            </div>
            <div style={{ marginTop: 6, fontSize: 22, fontWeight: 900, color: F.text1, lineHeight: 1.05 }}>{item.v}</div>
            <div style={{ marginTop: 3, fontSize: 12, color: F.text2 }}>{item.s}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, minWidth: 0 }}>
        <div
          style={{
            background: F.card,
            border: `1px solid ${F.border}`,
            borderRadius: 8,
            padding: "12px 18px 0",
          }}
        >
          <TabBar
            tabs={[
              { id: "organizations", label: "Organizations" },
              { id: "tenant", label: "Tenant Access" },
              { id: "admins", label: "Product Admins" },
              { id: "activity", label: "Activity" },
            ]}
            active={accessTab}
            onSelect={(id) => setAccessTab(id as typeof accessTab)}
          />
        </div>

        {accessTab === "organizations" && (
        <div
          style={{
            background: F.card,
            border: `1px solid ${F.border}`,
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "14px 18px",
              borderBottom: `1px solid ${F.border}`,
              background: F.pageBg,
              display: "flex",
              justifyContent: "space-between",
              gap: 14,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 900, color: F.text1 }}>Organizations</div>
              <div style={{ marginTop: 2, fontSize: 12, color: F.text2 }}>
                Tenant directory with status, administrator, and workforce details.
              </div>
            </div>
            {selectedOrg && (
              <div style={{ fontSize: 12, color: F.text2 }}>
                Selected: <strong style={{ color: F.text1 }}>{selectedOrg.name}</strong>
              </div>
            )}
          </div>
          <div
            className="org-access-filter"
            style={{
              padding: "14px 18px",
              borderBottom: `1px solid ${F.border}`,
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr)",
              gap: 10,
              alignItems: "end",
              background: F.card,
            }}
          >
            <div
              style={{
              display: "grid",
              gridTemplateColumns: "minmax(260px, 1.3fr) repeat(4, minmax(130px, 0.7fr)) auto auto",
              gap: 10,
              alignItems: "end",
              minWidth: 0,
            }}
            >
              <Fld label="Search Organizations">
                <input
                  value={orgSearchDraft}
                  onChange={(e) => setOrgSearchDraft(e.target.value)}
                  placeholder="Search organization, code, tenant ID..."
                  style={iSt}
                />
              </Fld>
              <Fld label="Status">
                <select value={orgStatusDraft} onChange={(e) => setOrgStatusDraft(e.target.value)} style={iSt}>
                  <option>All</option>
                  <option>Active</option>
                  <option>Draft</option>
                  <option>Inactive</option>
                  <option>Suspended</option>
                </select>
              </Fld>
              <Fld label="Administrator">
                <select value={orgAdminDraft} onChange={(e) => setOrgAdminDraft(e.target.value)} style={iSt}>
                  {orgAdminOptions.map((admin) => (
                    <option key={admin}>{admin}</option>
                  ))}
                </select>
              </Fld>
              <Fld label="Financial Year">
                <select value={orgFyDraft} onChange={(e) => setOrgFyDraft(e.target.value)} style={iSt}>
                  {orgFyOptions.map((fy) => (
                    <option key={fy}>{fy}</option>
                  ))}
                </select>
              </Fld>
              <Fld label="Sort">
                <select value={orgSortDraft} onChange={(e) => setOrgSortDraft(e.target.value)} style={iSt}>
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                  <option value="code-asc">Code A-Z</option>
                  <option value="employees-desc">Most Employees</option>
                  <option value="employees-asc">Fewest Employees</option>
                  <option value="status-asc">Status A-Z</option>
                </select>
              </Fld>
              <Btn
                style={{ alignSelf: "end", justifyContent: "center" }}
                onClick={() => {
                  setHasRunPlatformOrgSearch(true)
                  setOrgFilters({
                    search: orgSearchDraft,
                    status: orgStatusDraft,
                    admin: orgAdminDraft,
                    fy: orgFyDraft,
                    sort: orgSortDraft,
                  })
                }}
              >
                Go
              </Btn>
              <Btn
                variant="secondary"
                style={{ alignSelf: "end", justifyContent: "center", whiteSpace: "nowrap" }}
                onClick={() => {
                  setOrgSearchDraft("")
                  setOrgStatusDraft("All")
                  setOrgAdminDraft("All")
                  setOrgFyDraft("All")
                  setOrgSortDraft("name-asc")
                  setOrgFilters({ search: "", status: "All", admin: "All", fy: "All", sort: "name-asc" })
                  setHasRunPlatformOrgSearch(false)
                }}
              >
                Clear Filters
              </Btn>
            </div>
          </div>
          <div className="fiori-table-wrap" style={{ border: "none", borderRadius: 0 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 980 }}>
              <thead>
                <tr>
                  <Th>Organization</Th>
                  <Th>Tenant ID</Th>
                  <Th>Code</Th>
                  <Th>Admin</Th>
                  <Th>Financial Year</Th>
                  <Th right>Employees</Th>
                  <Th>Status</Th>
                  <Th right>Action</Th>
                </tr>
              </thead>
              <tbody>
                {filteredOrgs.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: 42, textAlign: "center", color: F.text3 }}>
                      No organizations match the applied filters.
                    </td>
                  </tr>
                ) : filteredOrgs.map((org) => {
                  const selected = org.id === selectedOrg?.id
                  return (
                    <tr
                      key={org.id}
                      onClick={() => setSelectedOrgId(org.id)}
                      title={`Select ${org.name}`}
                      style={{
                        borderBottom: `1px solid ${F.border}`,
                        background: selected ? F.infoBg : F.card,
                        boxShadow: selected ? `inset 3px 0 0 ${F.brand}` : undefined,
                        cursor: "pointer",
                      }}
                    >
                      <Td style={{ whiteSpace: "normal", maxWidth: 340 }}>
                        <div style={{ fontWeight: 900, color: selected ? F.brand : F.text1 }}>
                          {org.name}
                        </div>
                        <div style={{ marginTop: 2, fontSize: 11, color: F.text3 }}>
                          {org.legalName}
                        </div>
                      </Td>
                      <Td mono>{org.id}</Td>
                      <Td>{org.code}</Td>
                      <Td>
                        <span style={{ color: org.admin === "-" ? F.text3 : F.text1, fontStyle: org.admin === "-" ? "italic" : undefined }}>
                          {org.admin === "-" ? "Unassigned" : org.admin}
                        </span>
                      </Td>
                      <Td>{org.financialYear}</Td>
                      <Td right>{org.employees}</Td>
                      <Td>{orgBadge(org.status)}</Td>
                      <Td right>
                        <Btn
                          small
                          variant={selected ? "secondary" : "primary"}
                          onClick={(event) => {
                            event.stopPropagation()
                            setSelectedOrgId(org.id)
                            setAccessTab("tenant")
                          }}
                        >
                          {selected ? "Open Access" : "View Access"}
                        </Btn>
                      </Td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
        )}

          {accessTab === "tenant" && selectedOrg && (
            <div
              style={{
                background: F.card,
                border: `1px solid ${F.border}`,
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: 18,
                  borderBottom: `1px solid ${F.border}`,
                  background: F.pageBg,
                  display: "grid",
                  gap: 10,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 900, color: F.text1 }}>Tenant Workspaces</div>
                    <div style={{ marginTop: 2, fontSize: 12, color: F.text2 }}>
                      Select an organization to review status and platform access permissions.
                    </div>
                  </div>
                  <Fld label="Quick Select">
                    <select
                      value={selectedOrg.id}
                      onChange={(e) => setSelectedOrgId(e.target.value)}
                      style={{ ...iSt, minWidth: 260 }}
                    >
                      {orgs.map((org) => (
                        <option key={org.id} value={org.id}>
                          {org.name} - {org.status}
                        </option>
                      ))}
                    </select>
                  </Fld>
                </div>
                <div className="fiori-table-wrap" style={{ borderRadius: 6 }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 880 }}>
                    <thead>
                      <tr>
                        <Th>Organization</Th>
                        <Th>Tenant ID</Th>
                        <Th>Admin</Th>
                        <Th right>Employees</Th>
                        <Th>Status</Th>
                        <Th right>Action</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {orgs.map((org) => {
                        const selected = org.id === selectedOrg.id
                        return (
                          <tr
                            key={org.id}
                            style={{
                              borderBottom: `1px solid ${F.border}`,
                              background: selected ? F.infoBg : F.card,
                              boxShadow: selected ? `inset 3px 0 0 ${F.brand}` : undefined,
                            }}
                          >
                            <Td style={{ whiteSpace: "normal", maxWidth: 320 }}>
                              <div style={{ fontWeight: 900, color: selected ? F.brand : F.text1 }}>{org.name}</div>
                              <div style={{ marginTop: 2, fontSize: 11, color: F.text3 }}>{org.code} · {org.legalName}</div>
                            </Td>
                            <Td mono>{org.id}</Td>
                            <Td>
                              <span style={{ color: org.admin === "-" ? F.text3 : F.text1, fontStyle: org.admin === "-" ? "italic" : undefined }}>
                                {org.admin === "-" ? "Unassigned" : org.admin}
                              </span>
                            </Td>
                            <Td right>{org.employees}</Td>
                            <Td>{orgBadge(org.status)}</Td>
                            <Td right>
                              <Btn
                                small
                                variant={selected ? "secondary" : "primary"}
                                disabled={selected}
                                onClick={() => setSelectedOrgId(org.id)}
                              >
                                {selected ? "Selected" : "View Access"}
                              </Btn>
                            </Td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              <div
                style={{
                  padding: "17px 20px",
                  borderBottom: `1px solid ${F.border}`,
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 14,
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: F.text1 }}>
                      {selectedOrg.name}
                    </h2>
                    {orgBadge(selectedOrg.status)}
                  </div>
                  <div style={{ marginTop: 4, fontSize: 12, color: F.text2 }}>
                    Admin: {selectedOrg.admin} · {selectedOrg.country} · FY {selectedOrg.financialYear}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  <Btn
                    small
                    variant="success"
                    disabled={selectedOrg.status === "Active"}
                    onClick={() => setOrgStatus(selectedOrg, "Active")}
                  >
                    Activate
                  </Btn>
                  <Btn
                    small
                    variant="secondary"
                    disabled={selectedOrg.status === "Inactive"}
                    onClick={() => setOrgStatus(selectedOrg, "Inactive")}
                  >
                    Deactivate
                  </Btn>
                  <Btn
                    small
                    variant="danger"
                    disabled={selectedOrg.status === "Suspended"}
                    onClick={() => setOrgStatus(selectedOrg, "Suspended")}
                  >
                    Suspend
                  </Btn>
                </div>
              </div>

              <div style={{ padding: 18, display: "grid", gap: 14 }}>
                <div className="fiori-table-wrap" style={{ borderRadius: 6 }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
                    <thead>
                      <tr>
                        <Th>Tenant ID</Th>
                        <Th>Currency</Th>
                        <Th>Country</Th>
                        <Th>Financial Year</Th>
                        <Th>Legal Entity</Th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: `1px solid ${F.border}` }}>
                        <Td mono>{selectedOrg.id}</Td>
                        <Td>{selectedOrg.currency}</Td>
                        <Td>{selectedOrg.country}</Td>
                        <Td>{selectedOrg.financialYear}</Td>
                        <Td style={{ maxWidth: 340 }}>{selectedOrg.legalName}</Td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="fiori-table-wrap" style={{ borderRadius: 6 }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 980 }}>
                    <thead>
                      <tr>
                        <Th>Permission</Th>
                        <Th>Description</Th>
                        <Th>Status</Th>
                        <Th right>Action</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {controlItems.map((item) => {
                        const enabled = Boolean(selectedControls[item.key])
                        return (
                          <tr key={item.key} style={{ borderBottom: `1px solid ${F.border}` }}>
                            <Td>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <span
                                  style={{
                                    width: 4,
                                    height: 28,
                                    borderRadius: 4,
                                    background: enabled ? item.accent : F.border,
                                    flexShrink: 0,
                                  }}
                                />
                                <strong>{item.label}</strong>
                              </div>
                            </Td>
                            <Td style={{ whiteSpace: "normal", maxWidth: 520, color: F.text2, lineHeight: 1.35 }}>
                              {item.desc}
                            </Td>
                            <Td>
                              <Badge
                                label={enabled ? "ON" : "OFF"}
                                color={enabled ? F.success : F.text3}
                                bg={enabled ? F.successBg : F.pageBg}
                              />
                            </Td>
                            <Td right>
                              <Btn small variant={enabled ? "secondary" : "success"} onClick={() => toggleOrgControl(item.key)}>
                                {enabled ? "Turn Off" : "Turn On"}
                              </Btn>
                            </Td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {accessTab === "admins" && (
            <div
            style={{
              background: F.card,
              border: `1px solid ${F.border}`,
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <div
              className="admin-access-filter"
              style={{
                padding: "14px 18px",
                borderBottom: `1px solid ${F.border}`,
                display: "grid",
                gridTemplateColumns: "1.5fr repeat(3, minmax(145px, 1fr)) auto auto",
                gap: 10,
                alignItems: "end",
                background: F.pageBg,
              }}
            >
              <ValueHelp
                label="Search Admins"
                value={searchDraft}
                onChange={setSearchDraft}
                placeholder="Search name, email, or role..."
                values={admins.map((a) => `${a.name} (${a.email})`)}
              />
              <Fld label="Role">
                <select value={roleDraft} onChange={(e) => setRoleDraft(e.target.value)} style={iSt}>
                  <option>All</option>
                  <option>Super Admin</option>
                  <option>Security Admin</option>
                  <option>Support Admin</option>
                  <option>Billing Admin</option>
                </select>
              </Fld>
              <Fld label="Status">
                <select value={statusDraft} onChange={(e) => setStatusDraft(e.target.value)} style={iSt}>
                  <option>All</option>
                  <option>Active</option>
                  <option>Invited</option>
                  <option>Locked</option>
                </select>
              </Fld>
              <Fld label="Sort">
                <select value={sortDraft} onChange={(e) => setSortDraft(e.target.value)} style={iSt}>
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                  <option value="role-asc">Role A-Z</option>
                  <option value="status-asc">Status A-Z</option>
                  <option value="orgs-desc">Most Organizations</option>
                </select>
              </Fld>
              <Btn onClick={() => { setFilters({ search: searchDraft, role: roleDraft, status: statusDraft, sort: sortDraft }); setHasRunPlatformAdminSearch(true) }}>
                Go
              </Btn>
              <Btn
                variant="secondary"
                onClick={() => {
                  setSearchDraft("")
                  setRoleDraft("All")
                  setStatusDraft("All")
                  setSortDraft("name-asc")
                  setFilters({ search: "", role: "All", status: "All", sort: "name-asc" })
                  setHasRunPlatformAdminSearch(false)
                }}
              >
                Clear Filters
              </Btn>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 980 }}>
              <thead>
                <tr>
                  <Th>Product Admin</Th>
                  <Th>Role</Th>
                  <Th>Organizations</Th>
                  <Th>MFA</Th>
                  <Th>Status</Th>
                  <Th>Last Seen</Th>
                  <Th right>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {filteredAdmins.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: 42, textAlign: "center", color: F.text3 }}>
                      No product admins match the applied filters.
                    </td>
                  </tr>
                ) : (
                  filteredAdmins.map((admin) => (
                    <TrH key={admin.id}>
                      <Td>
                        <div style={{ fontWeight: 900, color: F.text1 }}>{admin.name}</div>
                        <div style={{ fontSize: 11, color: F.text3 }}>{admin.email}</div>
                      </Td>
                      <Td><Badge label={admin.role} color={F.brand} bg={F.infoBg} /></Td>
                      <Td>
                        <div style={{ fontWeight: 800 }}>{admin.assignedOrgIds.length}</div>
                        <div style={{ fontSize: 11, color: F.text3 }}>
                          {admin.assignedOrgIds.length === orgs.length
                            ? "All organizations"
                            : admin.assignedOrgIds
                                .map((id) => orgs.find((o) => o.id === id)?.code)
                                .filter(Boolean)
                                .join(", ") || "No orgs"}
                        </div>
                      </Td>
                      <Td>
                        <Badge
                          label={admin.mfa ? "Enabled" : "Required"}
                          color={admin.mfa ? F.success : F.warning}
                          bg={admin.mfa ? F.successBg : F.warningBg}
                        />
                      </Td>
                      <Td>
                        <Badge
                          label={admin.status}
                          color={admin.status === "Active" ? F.success : admin.status === "Locked" ? F.error : F.warning}
                          bg={admin.status === "Active" ? F.successBg : admin.status === "Locked" ? F.errorBg : F.warningBg}
                        />
                      </Td>
                      <Td style={{ color: F.text2 }}>{admin.lastSeen}</Td>
                      <Td right>
                        <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", flexWrap: "wrap" }}>
                          <Btn small variant="secondary" onClick={() => toggleAdminMfa(admin)}>
                            {admin.mfa ? "Reset MFA" : "Enable MFA"}
                          </Btn>
                          <Btn
                            small
                            variant={admin.status === "Locked" ? "success" : "danger"}
                            onClick={() => toggleAdminStatus(admin)}
                          >
                            {admin.status === "Locked" ? "Unlock" : "Lock"}
                          </Btn>
                        </div>
                      </Td>
                    </TrH>
                  ))
                )}
              </tbody>
            </table>
          </div>
          )}

          {accessTab === "activity" && (
            <div
            style={{
              background: F.card,
              border: `1px solid ${F.border}`,
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "14px 18px",
                borderBottom: `1px solid ${F.border}`,
                background: F.pageBg,
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 900, color: F.text1 }}>Recent Access Activity</div>
                <div style={{ marginTop: 2, fontSize: 12, color: F.text2 }}>
                  Latest tenant, permission, and administrator changes.
                </div>
              </div>
              <Badge label={`${activity.length} events`} color={F.brand} bg={F.infoBg} />
            </div>
            <div className="fiori-table-wrap" style={{ border: "none", borderRadius: 0 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 840 }}>
                <thead>
                  <tr>
                    <Th>Time</Th>
                    <Th>Activity</Th>
                    <Th>Scope</Th>
                    <Th>Status</Th>
                  </tr>
                </thead>
                <tbody>
                  {activity.map((item, index) => {
                    const scope = orgs.find((org) => item.includes(org.name))?.name ?? (item.includes("MFA") ? "Product admins" : "Platform")
                    return (
                      <tr key={`${item}-${index}`} style={{ borderBottom: `1px solid ${F.border}` }}>
                        <Td style={{ color: F.text2 }}>{index === 0 ? "Just now" : `${index + 1} updates ago`}</Td>
                        <Td style={{ whiteSpace: "normal", maxWidth: 520 }}>
                          <div style={{ fontWeight: 800, color: F.text1 }}>{item}</div>
                        </Td>
                        <Td>{scope}</Td>
                        <Td>
                          <Badge
                            label={index === 0 ? "Latest" : "Logged"}
                            color={index === 0 ? F.brand : F.text2}
                            bg={index === 0 ? F.infoBg : F.pageBg}
                          />
                        </Td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            </div>
          )}
      </div>

      {showInvite && (
        <Modal title="Invite Product Admin" onClose={() => setShowInvite(false)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Fld label="Full Name">
              <input
                value={inviteDraft.name}
                onChange={(e) => setInviteDraft({ ...inviteDraft, name: e.target.value })}
                style={iSt}
                placeholder="Admin name"
              />
            </Fld>
            <Fld label="Work Email">
              <input
                value={inviteDraft.email}
                onChange={(e) => setInviteDraft({ ...inviteDraft, email: e.target.value })}
                style={iSt}
                placeholder="admin@company.com"
              />
            </Fld>
            <Fld label="Role">
              <select
                value={inviteDraft.role}
                onChange={(e) => setInviteDraft({ ...inviteDraft, role: e.target.value as PlatformAdminRole })}
                style={iSt}
              >
                <option>Super Admin</option>
                <option>Security Admin</option>
                <option>Support Admin</option>
                <option>Billing Admin</option>
              </select>
            </Fld>
            <Fld label="Organization Scope">
              <select
                value={inviteDraft.orgId}
                onChange={(e) => setInviteDraft({ ...inviteDraft, orgId: e.target.value })}
                style={iSt}
                disabled={inviteDraft.role === "Super Admin"}
              >
                {orgs.map((org) => (
                  <option key={org.id} value={org.id}>{org.name}</option>
                ))}
              </select>
            </Fld>
          </div>
          <div style={{ marginTop: 18, display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Btn variant="secondary" onClick={() => setShowInvite(false)}>Cancel</Btn>
            <Btn onClick={inviteAdmin}>Send Invite</Btn>
          </div>
        </Modal>
      )}
    </div>
  )
}

function OrganizationsView({
  orgs,
  setOrgs,
}: {
  orgs: Organization[]
  setOrgs: React.Dispatch<React.SetStateAction<Organization[]>>
}) {
  const toast = useToast()
  const [showAdd, setShowAdd] = useState(false)
  const [editOrg, setEditOrg] = useState<Organization | null>(null)
  const [confirm, setConfirm] = useState<{
    msg: string
    onOk: () => void
  } | null>(null)
  const [form, setForm] = useState({
    name: "",
    code: "",
    legalName: "",
    country: "India",
    currency: "INR",
    financialYear: "April-March",
    admin: "",
    adminEmail: "",
    employees: 0,
    status: "Draft" as OrgStatus,
  })
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")
  const [country, setCountry] = useState("")
  const [currency, setCurrency] = useState("")
  const [fy, setFy] = useState("")
  const [orgSort, setOrgSort] = useState("name-asc")
  const [appliedOrgFilters, setAppliedOrgFilters] = useState({
    search: "",
    status: "",
    country: "",
    currency: "",
    fy: "",
    orgSort: "name-asc",
  })
  const [selected, setSelected] = useState<string[]>([])
  const [filtersOpen, setFiltersOpen] = useState(true)
  const [hasRunOrgSearch, setHasRunOrgSearch] = useState(false)

  const [page, setPage] = useState(1)
  const rowsPerPage = 15

  useEffect(() => {
    setPage(1)
  }, [appliedOrgFilters])

  const addOrg = () => {
    if (!form.name || !form.code)
      return toast("Name and code are required", "error")
    const o: Organization = {
      id: `ORG-${String(orgs.length + 1).padStart(3, "0")}`,
      name: form.name.trim(),
      code: form.code.trim().toUpperCase(),
      legalName: form.legalName.trim() || form.name.trim(),
      country: form.country,
      currency: form.currency,
      financialYear: form.financialYear,
      status: form.status,
      employees: Math.max(0, Number(form.employees) || 0),
      admin: form.admin.trim() || "-",
      adminEmail: form.adminEmail.trim() || undefined,
    }
    setOrgs([...orgs, o])
    setShowAdd(false)
    setForm({
      name: "",
      code: "",
      legalName: "",
      country: "India",
      currency: "INR",
      financialYear: "April-March",
      admin: "",
      adminEmail: "",
      employees: 0,
      status: "Draft",
    })
    toast(`Organization "${o.name}" created`, "success")
  }

  const toggleStatus = (org: Organization) => {
    const next: OrgStatus = org.status === "Active" ? "Inactive" : "Active"
    setConfirm({
      msg: `Set "${org.name}" to ${next}?`,
      onOk: () => {
        setOrgs(orgs.map((o) => (o.id === org.id ? { ...o, status: next } : o)))
        toast(`Organization status updated to ${next}`, "success")
        setConfirm(null)
      },
    })
  }

  const saveEdit = () => {
    if (!editOrg) return
    setOrgs(orgs.map((o) => (o.id === editOrg.id ? editOrg : o)))
    setEditOrg(null)
    toast("Organization updated", "success")
  }

  const filtered = hasRunOrgSearch ? orgs.filter((o) => {
    return (
      searchMatches(appliedOrgFilters.search, [o.name, o.code, o.id, o.legalName, o.admin]) &&
      (!appliedOrgFilters.status || o.status === appliedOrgFilters.status) &&
      (!appliedOrgFilters.country || o.country === appliedOrgFilters.country) &&
      (!appliedOrgFilters.currency || o.currency === appliedOrgFilters.currency) &&
      (!appliedOrgFilters.fy || o.financialYear === appliedOrgFilters.fy)
    )
  }).sort((a, b) => {
    const dir = appliedOrgFilters.orgSort.endsWith("-desc") ? -1 : 1
    if (appliedOrgFilters.orgSort.startsWith("employees")) {
      return (a.employees - b.employees) * dir
    }
    if (appliedOrgFilters.orgSort.startsWith("status")) {
      return a.status.localeCompare(b.status) * dir
    }
    if (appliedOrgFilters.orgSort.startsWith("country")) {
      return a.country.localeCompare(b.country) * dir
    }
    return a.name.localeCompare(b.name) * dir
  }) : []

  const totalPages = Math.ceil(filtered.length / rowsPerPage) || 1
  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage)

  const toggleOne = (id: string) =>
    setSelected((v) =>
      v.includes(id) ? v.filter((x) => x !== id) : [...v, id],
    )
  const resetFilters = () => {
    setHasRunOrgSearch(false)
    setSearch("")
    setStatus("")
    setCountry("")
    setCurrency("")
    setFy("")
    setOrgSort("name-asc")
    setAppliedOrgFilters({
      search: "",
      status: "",
      country: "",
      currency: "",
      fy: "",
      orgSort: "name-asc",
    })
  }
  const applyOrgFilters = () => {
    setHasRunOrgSearch(true)
    setAppliedOrgFilters({ search, status, country, currency, fy, orgSort })
  }
  const orgActiveFilters =
    (activeSearch(appliedOrgFilters.search) ? 1 : 0) +
    [appliedOrgFilters.status, appliedOrgFilters.country, appliedOrgFilters.currency, appliedOrgFilters.fy].filter(Boolean).length +
    (appliedOrgFilters.orgSort !== "name-asc" ? 1 : 0)
  const allVisible =
    paginated.length > 0 && paginated.every((o) => selected.includes(o.id))

  const searchSuggestions = [
    ...new Set(
      orgs
        .flatMap((o) => [o.name, o.code, o.id, o.admin])
        .filter((x) => x !== "-"),
    ),
  ]

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <PH
        title="Organizations"
        sub="All organizations managed by this platform"
        action={
          <div style={{ display: "flex", gap: 8 }}>
            <Btn
              variant="secondary"
              onClick={() =>
                toast("Organization list exported as CSV", "success")
              }
            >
              Export
            </Btn>
            <Btn onClick={() => setShowAdd(true)}>+ Create Organization</Btn>
          </div>
        }
      />
      <div
        style={{
          background: F.card,
          border: `1px solid ${F.border}`,
          borderRadius: 8,
          marginBottom: 14,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            padding: "14px 18px",
            display: "flex",
            gap: 16,
            alignItems: "flex-end",
            borderBottom: filtersOpen ? `1px solid ${F.border}` : undefined,
          }}
        >
          <div style={{ flex: 1, minWidth: 280 }}>
            <ValueHelp
              label="Search Organization"
              value={search}
              onChange={setSearch}
              placeholder="Search by name, code, admin..."
              values={searchSuggestions}
            />
          </div>
          <Btn variant="secondary" onClick={() => setFiltersOpen((x) => !x)}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginRight: 6 }}
            >
              <path d="M4 5h16M7 12h10M10 19h4" />
            </svg>{" "}
            Filters{" "}
            {orgActiveFilters > 0 && `(${orgActiveFilters})`}
          </Btn>
          <Btn onClick={applyOrgFilters}>Go</Btn>
          <Btn variant="secondary" onClick={resetFilters}>Clear Filters</Btn>
        </div>
        {filtersOpen && (
          <div
            style={{
              padding: "14px 18px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 16,
              alignItems: "end",
              background: "#FAFBFC",
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
            }}
          >
            <ValueHelp
              label="Status"
              value={status}
              onChange={setStatus}
              placeholder="All statuses"
              values={["Active", "Draft", "Inactive", "Suspended"]}
            />
            <ValueHelp
              label="Country"
              value={country}
              onChange={setCountry}
              placeholder="All countries"
              values={[...new Set(orgs.map((o) => o.country))]}
            />
            <ValueHelp
              label="Currency"
              value={currency}
              onChange={setCurrency}
              placeholder="All currencies"
              values={[...new Set(orgs.map((o) => o.currency))]}
            />
            <ValueHelp
              label="Financial year"
              value={fy}
              onChange={setFy}
              placeholder="All financial years"
              values={[...new Set(orgs.map((o) => o.financialYear))]}
            />
            <Fld label="Sort By">
              <select
                value={orgSort}
                onChange={(e) => setOrgSort(e.target.value)}
                style={iSt}
              >
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="employees-desc">Employees High-Low</option>
                <option value="employees-asc">Employees Low-High</option>
                <option value="status-asc">Status A-Z</option>
                <option value="country-asc">Country A-Z</option>
              </select>
            </Fld>
          </div>
        )}
      </div>

      {selected.length > 0 && (
        <div
          style={{
            padding: "10px 16px",
            background: F.infoBg,
            border: `1px solid #B8D9F5`,
            borderRadius: 5,
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 12,
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 600, color: F.brand }}>
            {selected.length} organizations selected
          </span>
          <Btn
            small
            variant="ghost"
            onClick={() =>
              toast(
                `${selected.length} organization records exported`,
                "success",
              )
            }
          >
            Export selected
          </Btn>
          <Btn small variant="ghost" onClick={() => setSelected([])}>
            Clear selection
          </Btn>
        </div>
      )}

      <div
        style={{
          background: F.card,
          border: `1px solid ${F.border}`,
          borderRadius: 8,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          flex: 1,
        }}
      >
        <div style={{ overflow: "auto", flex: 1 }}>
          <table
            style={{
              width: "100%",
              minWidth: 1000,
              borderCollapse: "collapse",
            }}
          >
            <thead
              style={{
                position: "sticky",
                top: 0,
                zIndex: 10,
                background: F.pageBg,
                boxShadow: `0 1px 0 ${F.border}`,
              }}
            >
              <tr>
                <Th>
                  <input
                    aria-label="Select all"
                    type="checkbox"
                    checked={allVisible}
                    onChange={() =>
                      setSelected(
                        allVisible
                          ? selected.filter(
                              (x) => !paginated.some((o) => o.id === x),
                            )
                          : [
                              ...new Set([
                                ...selected,
                                ...paginated.map((o) => o.id),
                              ]),
                            ],
                      )
                    }
                  />
                </Th>
                <Th>Organization</Th>
                <Th>Code</Th>
                <Th>Country</Th>
                <Th>Financial Year</Th>
                <Th>Administrator</Th>
                <Th right>Employees</Th>
                <Th>Status</Th>
                <Th right>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    style={{
                      padding: 60,
                      textAlign: "center",
                      color: F.text3,
                      fontSize: 14,
                    }}
                  >
                    No organizations match your filters.{" "}
                    <button
                      onClick={resetFilters}
                      style={{
                        color: F.brand,
                        border: 0,
                        background: "none",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        fontWeight: 600,
                        marginLeft: 4,
                      }}
                    >
                      Reset all filters
                    </button>
                  </td>
                </tr>
              ) : (
                paginated.map((org) => (
                  <TrH key={org.id} onClick={() => setEditOrg({ ...org })}>
                    <Td style={{ width: 40 }}>
                      <input
                        aria-label={`Select ${org.name}`}
                        type="checkbox"
                        checked={selected.includes(org.id)}
                        onClick={(e) => e.stopPropagation()}
                        onChange={() => toggleOne(org.id)}
                      />
                    </Td>
                    <Td>
                      <div
                        style={{
                          fontWeight: 700,
                          color: F.text1,
                          marginBottom: 3,
                        }}
                      >
                        {org.name}
                      </div>
                      <div style={{ fontSize: 11, color: F.text3 }}>
                        {org.legalName} · {org.id}
                      </div>
                    </Td>
                    <Td mono style={{ color: F.text2, fontWeight: 600 }}>
                      {org.code}
                    </Td>
                    <Td>
                      <div style={{ color: F.text1, marginBottom: 3 }}>
                        {org.country}
                      </div>
                      <div style={{ fontSize: 11, color: F.text3 }}>
                        {org.currency}
                      </div>
                    </Td>
                    <Td style={{ color: F.text2 }}>{org.financialYear}</Td>
                    <Td>
                      {org.admin === "-" ? (
                        <span style={{ color: F.text3, fontStyle: "italic" }}>
                          Unassigned
                        </span>
                      ) : (
                        <span>
                          <span style={{ color: F.text1, fontWeight: 500 }}>
                            {org.admin}
                          </span>
                          {org.adminEmail && (
                            <div style={{ fontSize: 11, color: F.text3, marginTop: 3 }}>
                              {org.adminEmail}
                            </div>
                          )}
                        </span>
                      )}
                    </Td>
                    <Td right>
                      <span style={{ fontWeight: 800, color: F.text1 }}>
                        {org.employees}
                      </span>
                    </Td>
                    <Td>{orgBadge(org.status)}</Td>
                    <Td right>
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          justifyContent: "flex-end",
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Btn
                          small
                          variant="secondary"
                          onClick={() => setEditOrg({ ...org })}
                        >
                          Edit
                        </Btn>
                        <Btn
                          small
                          variant="ghost"
                          onClick={() => toggleStatus(org)}
                        >
                          {org.status === "Active" ? "Deactivate" : "Activate"}
                        </Btn>
                      </div>
                    </Td>
                  </TrH>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div
          style={{
            padding: "12px 18px",
            borderTop: `1px solid ${F.border}`,
            background: F.pageBg,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: 12, color: F.text3 }}>
            Showing {(page - 1) * rowsPerPage + 1} -{" "}
            {Math.min(page * rowsPerPage, filtered.length)} of {filtered.length}{" "}
            organizations
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <Btn
              small
              variant="secondary"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Btn>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0 8px",
                fontSize: 12,
                fontWeight: 600,
                color: F.text2,
              }}
            >
              Page {page} of {totalPages}
            </div>
            <Btn
              small
              variant="secondary"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Btn>
          </div>
        </div>
      </div>
      {showAdd && (
        <Modal title="Create Organization" onClose={() => setShowAdd(false)} wide>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 900, color: F.text2, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
                Organization Details
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Fld label="Organization Name *">
                  <input
                    style={iSt}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Acme Corp Pvt. Ltd."
                  />
                </Fld>
                <Fld label="Org Code *">
                  <input
                    style={iSt}
                    value={form.code}
                    onChange={(e) =>
                      setForm({ ...form, code: e.target.value.toUpperCase() })
                    }
                    placeholder="e.g. ACM"
                  />
                </Fld>
                <Fld label="Legal Name">
                  <input
                    style={iSt}
                    value={form.legalName}
                    onChange={(e) =>
                      setForm({ ...form, legalName: e.target.value })
                    }
                    placeholder="Registered legal entity name"
                  />
                </Fld>
                <Fld label="Launch Status">
                  <select
                    style={iSt}
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as OrgStatus })}
                  >
                    <option>Draft</option>
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>Suspended</option>
                  </select>
                </Fld>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 900, color: F.text2, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
                Workspace Settings
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <Fld label="Country">
                  <select
                    style={iSt}
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                  >
                    <option>India</option>
                    <option>USA</option>
                    <option>UK</option>
                    <option>Singapore</option>
                  </select>
                </Fld>
                <Fld label="Currency">
                  <select
                    style={iSt}
                    value={form.currency}
                    onChange={(e) => setForm({ ...form, currency: e.target.value })}
                  >
                    <option>INR</option>
                    <option>USD</option>
                    <option>GBP</option>
                    <option>SGD</option>
                  </select>
                </Fld>
                <Fld label="Financial Year">
                  <select
                    style={iSt}
                    value={form.financialYear}
                    onChange={(e) =>
                      setForm({ ...form, financialYear: e.target.value })
                    }
                  >
                    <option>April-March</option>
                    <option>January-December</option>
                    <option>July-June</option>
                  </select>
                </Fld>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 900, color: F.text2, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
                Admin Setup
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 180px", gap: 12 }}>
                <Fld label="Organization Admin">
                  <input
                    style={iSt}
                    value={form.admin}
                    onChange={(e) => setForm({ ...form, admin: e.target.value })}
                    placeholder="e.g. Rohan Gupta"
                  />
                </Fld>
                <Fld label="Admin Email">
                  <input
                    style={iSt}
                    type="email"
                    value={form.adminEmail}
                    onChange={(e) => setForm({ ...form, adminEmail: e.target.value })}
                    placeholder="admin@company.com"
                  />
                </Fld>
                <Fld label="Initial Employees">
                  <input
                    style={iSt}
                    type="number"
                    min={0}
                    value={form.employees}
                    onChange={(e) => setForm({ ...form, employees: Number(e.target.value) })}
                    placeholder="0"
                  />
                </Fld>
              </div>
            </div>

            <div
              style={{
                border: `1px solid ${F.border}`,
                borderRadius: 8,
                background: F.pageBg,
                padding: "12px 14px",
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                gap: 12,
              }}
            >
              {[
                ["Status", form.status],
                ["Admin", form.admin.trim() || "Unassigned"],
                ["Currency", form.currency],
                ["Employees", String(form.employees || 0)],
              ].map(([label, value]) => (
                <div key={label} style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: F.text3, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {label}
                  </div>
                  <div style={{ marginTop: 4, fontSize: 13, fontWeight: 900, color: F.text1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              marginTop: 18,
            }}
          >
            <Btn variant="secondary" onClick={() => setShowAdd(false)}>
              Cancel
            </Btn>
            <Btn onClick={addOrg}>Create Organization</Btn>
          </div>
        </Modal>
      )}
      {editOrg && (
        <Modal
          title={`Edit - ${editOrg.name}`}
          onClose={() => setEditOrg(null)}
        >
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <Fld label="Organization Name">
              <input
                style={iSt}
                value={editOrg.name}
                onChange={(e) =>
                  setEditOrg({ ...editOrg, name: e.target.value })
                }
              />
            </Fld>
            <Fld label="Org Code">
              <input
                style={iSt}
                value={editOrg.code}
                onChange={(e) =>
                  setEditOrg({ ...editOrg, code: e.target.value.toUpperCase() })
                }
              />
            </Fld>
            <Fld label="Legal Name">
              <input
                style={iSt}
                value={editOrg.legalName}
                onChange={(e) =>
                  setEditOrg({ ...editOrg, legalName: e.target.value })
                }
              />
            </Fld>
            <Fld label="Org Admin">
              <input
                style={iSt}
                value={editOrg.admin}
                onChange={(e) =>
                  setEditOrg({ ...editOrg, admin: e.target.value })
                }
              />
            </Fld>
            <Fld label="Status">
              <select
                style={iSt}
                value={editOrg.status}
                onChange={(e) =>
                  setEditOrg({
                    ...editOrg,
                    status: e.target.value as OrgStatus,
                  })
                }
              >
                <option>Active</option>
                <option>Draft</option>
                <option>Inactive</option>
                <option>Suspended</option>
              </select>
            </Fld>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              marginTop: 18,
            }}
          >
            <Btn variant="secondary" onClick={() => setEditOrg(null)}>
              Cancel
            </Btn>
            <Btn onClick={saveEdit}>Save Changes</Btn>
          </div>
        </Modal>
      )}
      {confirm && (
        <Confirm
          msg={confirm.msg}
          onOk={confirm.onOk}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  )
}

interface AdminProfileData {
  id: string
  name: string
  email: string
  role: string
  designation: string
  department: string
  location: string
  phone: string
  timezone: string
  language: string
  status: EmpStatus
  bio: string
  organization?: string
  securityClearance?: string
  accessLevel?: string
  managedWorkspaces?: number
  managedEmployees?: number
  systemUptime?: string
  activeAdmins?: number
  currentPayRun?: string
  grossMonthlyPayroll?: string
  complianceScore?: string
  emergencyName?: string
  emergencyPhone?: string
  emergencyRelation?: string
}

const DEFAULT_ADMIN_PROFILES: Record<"product_admin" | "org_admin", AdminProfileData> = {
  product_admin: {
    id: "ADM-ROOT-001",
    name: "Platform Admin",
    email: "admin@naxpayroll.io",
    role: "Product Admin",
    designation: "Platform Super Administrator",
    department: "Platform Engineering & IT Operations",
    location: "San Francisco HQ (Cloud Ops)",
    phone: "+1 (555) 019-2834",
    timezone: "UTC-07:00 (Pacific Time)",
    language: "English (US)",
    status: "Active",
    bio: "Platform Superuser responsible for multi-tenant infrastructure, system health, security policies, and global compliance audit pipelines.",
    securityClearance: "Tier-1 Root Superuser",
    managedWorkspaces: 3,
    managedEmployees: 33,
    systemUptime: "99.9%",
    activeAdmins: 4,
    emergencyName: "SecOps Escalation Desk",
    emergencyPhone: "+1 (555) 019-9900",
    emergencyRelation: "Security Operations",
  },
  org_admin: {
    id: "ORG-ADM-001",
    name: "Meena Iyer",
    email: "meena.iyer@naxrita.com",
    role: "Organization Admin",
    designation: "Head of HR & People Operations",
    department: "Human Resources & Payroll",
    organization: "Naxrita Solutions Pvt. Ltd.",
    location: "Mumbai / Bangalore HQ, India",
    phone: "+91 98201 45890",
    timezone: "IST (UTC+05:30) - Asia/Kolkata",
    language: "English (India)",
    status: "Active",
    bio: "Organization Administrator managing full payroll processing, salary structures, workforce directory, and statutory tax compliance at Naxrita Solutions.",
    accessLevel: "Full Organization Admin Access",
    managedEmployees: 11,
    currentPayRun: "August 2026 (Under Review)",
    grossMonthlyPayroll: "₹10,70,000",
    complianceScore: "98.2%",
    emergencyName: "Suresh Iyer",
    emergencyPhone: "+91 98200 11223",
    emergencyRelation: "Spouse",
  },
}

function UnifiedProfileView({
  persona,
  emp,
  onUpdateEmp,
  adminProfiles = DEFAULT_ADMIN_PROFILES,
  onUpdateAdminProfile,
  onNav,
  onSwitchPersona,
}: {
  persona: Persona
  emp: Employee
  onUpdateEmp?: (emp: Employee) => void
  adminProfiles?: Record<"product_admin" | "org_admin", AdminProfileData>
  onUpdateAdminProfile?: (role: "product_admin" | "org_admin", data: AdminProfileData) => void
  onNav?: (view: string) => void
  onSwitchPersona?: (persona: Persona) => void
}) {
  const toast = useToast()
  const [activeTab, setActiveTab] = useState<"overview" | "security" | "permissions" | "preferences">("overview")
  const [editing, setEditing] = useState(false)
  const [changePwModal, setChangePwModal] = useState(false)
  const [mfaEnabled, setMfaEnabled] = useState(true)

  // Password state
  const [currPw, setCurrPw] = useState("")
  const [newPw, setNewPw] = useState("")
  const [confPw, setConfPw] = useState("")
  const [showPws, setShowPws] = useState(false)

  // Preferences state
  const preferenceKey = `naxpayroll-preferences-${persona}`
  const savedPreferences = (() => {
    try {
      return JSON.parse(sessionStorage.getItem(preferenceKey) || "null") as Record<string, boolean> | null
    } catch {
      return null
    }
  })()
  const [notifEmailPayroll, setNotifEmailPayroll] = useState(savedPreferences?.emailPayroll ?? true)
  const [notifEmailSecurity, setNotifEmailSecurity] = useState(savedPreferences?.emailSecurity ?? true)
  const [notifEmailReports, setNotifEmailReports] = useState(savedPreferences?.emailReports ?? true)
  const [notifInAppAlerts, setNotifInAppAlerts] = useState(savedPreferences?.inAppAlerts ?? true)
  const [notifSound, setNotifSound] = useState(savedPreferences?.sound ?? false)
  useEffect(() => {
    const next = savedPreferences
    setNotifEmailPayroll(next?.emailPayroll ?? true)
    setNotifEmailSecurity(next?.emailSecurity ?? true)
    setNotifEmailReports(next?.emailReports ?? true)
    setNotifInAppAlerts(next?.inAppAlerts ?? true)
    setNotifSound(next?.sound ?? false)
  }, [persona])

  // Active sessions state
  const [sessions, setSessions] = useState([
    {
      id: "sess-1",
      device: "MacBook Pro (Apple Silicon)",
      browser: "Chrome 128.0 (macOS Sequoia)",
      location: "Bangalore, India",
      ip: "103.21.144.62",
      current: true,
      lastActive: "Active Now",
    },
    {
      id: "sess-2",
      device: "iPhone 15 Pro",
      browser: "Naxpayroll iOS App v2.4",
      location: "Mumbai, India",
      ip: "49.37.112.90",
      current: false,
      lastActive: "3 hours ago",
    },
  ])

  // Draft editing state
  const currentAdmin = persona === "employee" ? null : adminProfiles[persona]
  const [draftAdmin, setDraftAdmin] = useState<AdminProfileData>(
    currentAdmin || DEFAULT_ADMIN_PROFILES.org_admin,
  )
  const [draftEmp, setDraftEmp] = useState<Employee>(emp)
  const [empEmergency, setEmpEmergency] = useState({
    name: "Ramesh Nair",
    phone: "+91 94471 22334",
    relation: "Father",
    bio: "Senior Software Engineer focused on core backend payroll calculation engines, microservices orchestration, and tax algorithm compliance.",
  })
  const countryCodes = ["+91", "+1", "+44", "+61", "+65", "+971"]
  const [mobileCountryCode, setMobileCountryCode] = useState("+91")
  const [emergencyCountryCode, setEmergencyCountryCode] = useState("+91")

  // Sync draft when persona changes
  useEffect(() => {
    if (persona === "product_admin" || persona === "org_admin") {
      setDraftAdmin(adminProfiles[persona])
    } else {
      setDraftEmp(emp)
    }
    setEditing(false)
  }, [persona, adminProfiles, emp])

  const phoneToValidate =
    persona === "employee"
      ? (draftEmp.mobile ?? "").replace(/[\s-]/g, "")
      : (draftAdmin.phone ?? "").replace(/[\s-]/g, "")

  const phoneValid = /^\+?[0-9]{8,15}$/.test(phoneToValidate)
  const emailToValidate = persona === "employee" ? draftEmp.email : draftAdmin.email
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailToValidate)

  const emergencyPhoneRaw = persona === "employee" ? empEmergency.phone : (draftAdmin.emergencyPhone ?? "")
  const emergencyPhone = `${emergencyPhoneRaw.trim().startsWith("+") ? "+" : ""}${emergencyPhoneRaw.replace(/\D/g, "")}`
  const emergencyName = persona === "employee" ? empEmergency.name : (draftAdmin.emergencyName ?? "")
  const emergencyRelation = persona === "employee" ? empEmergency.relation : (draftAdmin.emergencyRelation ?? "")
  const emergencyPhoneValid = /^\+?[0-9]{10,15}$/.test(emergencyPhone)
  const emergencyTextValid = (value: string) => /^[A-Za-z ]*$/.test(value)

  const handleSaveProfile = () => {
    if (!emailValid) {
      toast("Please enter a valid email address", "error")
      return
    }
    if (!emergencyPhoneValid) {
      toast("Emergency phone must contain 10 digits, plus an optional country code", "error")
      return
    }
    if (!emergencyTextValid(emergencyName) || !emergencyTextValid(emergencyRelation)) {
      toast("Emergency contact name and relationship may contain letters and spaces only", "error")
      return
    }
    const location = persona === "employee" ? draftEmp.location : draftAdmin.location
    if (!emergencyTextValid(location)) {
      toast("Work location / base office may contain letters and spaces only", "error")
      return
    }
    if (!phoneValid) {
      toast("Please enter a valid phone number with country code", "error")
      return
    }

    if (persona === "employee") {
      onUpdateEmp?.(draftEmp)
      toast("Employee profile details updated successfully", "success")
    } else {
      onUpdateAdminProfile?.(persona, draftAdmin)
      toast(`${draftAdmin.name}'s profile updated successfully`, "success")
    }
    setEditing(false)
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currPw.trim()) {
      toast("Please enter your current password", "warning")
      return
    }
    if (newPw.length < 8) {
      toast("New password must be at least 8 characters long", "error")
      return
    }
    if (newPw !== confPw) {
      toast("New passwords do not match", "error")
      return
    }
    setChangePwModal(false)
    setCurrPw("")
    setNewPw("")
    setConfPw("")
    toast("Password changed successfully. Security notification sent to email.", "success")
  }

  // Password strength calculation
  const getPwStrength = (pw: string) => {
    if (!pw) return { score: 0, text: "None", color: "#ccc" }
    let s = 0
    if (pw.length >= 8) s += 1
    if (/[A-Z]/.test(pw)) s += 1
    if (/[0-9]/.test(pw)) s += 1
    if (/[^A-Za-z0-9]/.test(pw)) s += 1
    if (s <= 1) return { score: 25, text: "Weak", color: F.error }
    if (s <= 3) return { score: 70, text: "Good", color: F.warning }
    return { score: 100, text: "Strong", color: F.success }
  }
  const pwStrength = getPwStrength(newPw)

  // Persona metadata resolution
  const profileName =
    persona === "employee"
      ? editing ? draftEmp.name : emp.name
      : editing ? draftAdmin.name : adminProfiles[persona].name

  const profileRole =
    persona === "employee"
      ? emp.designation
      : adminProfiles[persona].role

  const profileEmail =
    persona === "employee"
      ? editing ? draftEmp.email : emp.email
      : editing ? draftAdmin.email : adminProfiles[persona].email

  const profilePhone =
    persona === "employee"
      ? editing ? (draftEmp.mobile ?? "") : (emp.mobile ?? "Not provided")
      : editing ? draftAdmin.phone : adminProfiles[persona].phone

  const profileLocation =
    persona === "employee"
      ? editing ? draftEmp.location : emp.location
      : editing ? draftAdmin.location : adminProfiles[persona].location

  const profileInitials = profileName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "NX"

  const avatarGradient =
    persona === "product_admin"
      ? "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)"
      : persona === "org_admin"
        ? "linear-gradient(135deg, #0070F2 0%, #0051B3 100%)"
        : "linear-gradient(135deg, #107E3E 0%, #0A5A2B 100%)"

  const roleThemeColor =
    persona === "product_admin"
      ? "#6D28D9"
      : persona === "org_admin"
        ? "#0070F2"
        : "#107E3E"

  const roleBadgeBg =
    persona === "product_admin"
      ? "#F5F3FF"
      : persona === "org_admin"
        ? "#EFF6FF"
        : "#ECFDF5"

  const roleBadgeBorder =
    persona === "product_admin"
      ? "#DDD6FE"
      : persona === "org_admin"
        ? "#BFDBFE"
        : "#A7F3D0"

  const roleSubtitle =
    persona === "product_admin"
      ? "Platform Administrator Account & Cloud Infrastructure Credentials"
      : persona === "org_admin"
        ? ""
        : "Personal & Employment Profile • Employee Self-Service"

  return (
    <div style={{ maxWidth: 1020, margin: "0 auto", paddingBottom: 40 }}>
      {/* 1. Top Breadcrumb & Quick Switcher */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <button
          onClick={() => onNav?.("dashboard")}
          title="Back to dashboard"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "transparent",
            border: "none",
            color: F.brand,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            padding: 0,
            fontFamily: "inherit",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span>Back to Dashboard</span>
        </button>

      </div>

      {/* 2. Page Header Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h1
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 800,
                color: F.text1,
                letterSpacing: "-0.4px",
              }}
            >
              My Profile
            </h1>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 12,
                background: roleBadgeBg,
                color: roleThemeColor,
                border: `1px solid ${roleBadgeBorder}`,
              }}
            >
              {persona === "product_admin"
                ? "👑 Superuser Account"
                : persona === "org_admin"
                  ? "🏢 Org Administrator"
                  : "👤 Employee Self-Service"}
            </span>
          </div>
          {roleSubtitle && (
            <p style={{ margin: "4px 0 0", fontSize: 13, color: F.text2 }}>
              {roleSubtitle}
            </p>
          )}
        </div>

        {/* Header Action Buttons */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {editing ? (
            <>
              <Btn
                variant="secondary"
                onClick={() => {
                  if (persona === "employee") setDraftEmp(emp)
                  else setDraftAdmin(adminProfiles[persona])
                  setEditing(false)
                }}
              >
                Cancel
              </Btn>
              <Btn onClick={handleSaveProfile}>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Save Changes</span>
              </Btn>
            </>
          ) : (
            <>
              <Btn variant="primary" onClick={() => setEditing(true)}>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                <span>Edit Profile</span>
              </Btn>
            </>
          )}
        </div>
      </div>

      {/* 3. Hero Profile Card Banner */}
      <div
        style={{
          background: F.card,
          border: `1px solid ${F.border}`,
          borderRadius: 8,
          padding: "24px 28px",
          marginBottom: 20,
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle accent bar on top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: avatarGradient,
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 22,
            flexWrap: "wrap",
          }}
        >
          {/* Avatar with Initials */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: "50%",
                background: avatarGradient,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
                fontWeight: 800,
                letterSpacing: "-0.5px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                border: "3px solid #fff",
              }}
            >
              {profileInitials}
            </div>
            <button
              onClick={() => toast("Profile photo upload is enabled on enterprise tier", "info")}
              title="Change avatar photo"
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 26,
                height: 26,
                borderRadius: "50%",
                background: "#fff",
                border: `1px solid ${F.border}`,
                boxShadow: "0 2px 4px rgba(0,0,0,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke={F.text1}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </button>
          </div>

          {/* Profile Identity Details */}
          <div style={{ flex: 1, minWidth: 260 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: 22,
                  fontWeight: 800,
                  color: F.text1,
                }}
              >
                {profileName}
              </h2>

              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "3px 8px",
                  borderRadius: 12,
                  background: F.successBg,
                  color: F.success,
                  border: "1px solid #c7eed8",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: F.success,
                    display: "inline-block",
                  }}
                />
                Active
              </span>
            </div>

            <div
              style={{
                fontSize: 13,
                color: F.text2,
                marginTop: 3,
                fontWeight: 500,
              }}
            >
              {persona === "product_admin" && (
                <span>
                  {adminProfiles.product_admin.designation} • {adminProfiles.product_admin.department}
                </span>
              )}
              {persona === "org_admin" && (
                <span>
                  {adminProfiles.org_admin.designation} • {adminProfiles.org_admin.organization}
                </span>
              )}
              {persona === "employee" && (
                <span>
                  {emp.designation} • {emp.department} • Naxrita Solutions Pvt. Ltd.
                </span>
              )}
            </div>

            {/* Micro Metadata Chips */}
            <div
              style={{
                display: "flex",
                gap: 16,
                marginTop: 10,
                flexWrap: "wrap",
                fontSize: 12,
                color: F.text2,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <span>{profileEmail}</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>{profilePhone}</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>{profileLocation}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Role-Specific KPI Metric Summary Strip */}
      {persona !== "org_admin" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: 14,
            marginBottom: 22,
          }}
        >
        {persona === "product_admin" && (
          <>
            <div
              style={{
                background: F.card,
                border: `1px solid ${F.border}`,
                borderRadius: 6,
                padding: "14px 16px",
                borderTop: "3px solid #4F46E5",
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 600, color: F.text2, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Active Workspaces
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: F.text1, marginTop: 4 }}>
                {adminProfiles.product_admin.managedWorkspaces}
              </div>
              <div style={{ fontSize: 11, color: F.text3, marginTop: 2 }}>
                Across global tenants
              </div>
            </div>

            <div
              style={{
                background: F.card,
                border: `1px solid ${F.border}`,
                borderRadius: 6,
                padding: "14px 16px",
                borderTop: "3px solid #0070F2",
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 600, color: F.text2, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Managed Employees
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: F.text1, marginTop: 4 }}>
                {adminProfiles.product_admin.managedEmployees}
              </div>
              <div style={{ fontSize: 11, color: F.text3, marginTop: 2 }}>
                Platform active accounts
              </div>
            </div>

            <div
              style={{
                background: F.card,
                border: `1px solid ${F.border}`,
                borderRadius: 6,
                padding: "14px 16px",
                borderTop: "3px solid #7C3AED",
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 600, color: F.text2, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Product Admins
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: F.text1, marginTop: 4 }}>
                {adminProfiles.product_admin.activeAdmins}
              </div>
              <div style={{ fontSize: 11, color: F.text3, marginTop: 2 }}>
                Platform superusers
              </div>
            </div>

            <div
              style={{
                background: F.card,
                border: `1px solid ${F.border}`,
                borderRadius: 6,
                padding: "14px 16px",
                borderTop: "3px solid #107E3E",
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 600, color: F.text2, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                System Uptime
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: F.success, marginTop: 4 }}>
                {adminProfiles.product_admin.systemUptime}
              </div>
              <div style={{ fontSize: 11, color: F.text3, marginTop: 2 }}>
                Past 30 days SLA
              </div>
            </div>
          </>
        )}

        {persona === "org_admin" && (
          <>
            <div
              style={{
                background: F.card,
                border: `1px solid ${F.border}`,
                borderRadius: 6,
                padding: "14px 16px",
                borderTop: `3px solid ${F.brand}`,
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 600, color: F.text2, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Managed Workforce
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: F.text1, marginTop: 4 }}>
                {adminProfiles.org_admin.managedEmployees}
              </div>
              <div style={{ fontSize: 11, color: F.text3, marginTop: 2 }}>
                Active organization employees
              </div>
            </div>

            <div
              style={{
                background: F.card,
                border: `1px solid ${F.border}`,
                borderRadius: 6,
                padding: "14px 16px",
                borderTop: `3px solid ${F.warning}`,
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 600, color: F.text2, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Current Pay Run
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: F.text1, marginTop: 6 }}>
                Aug 2026
              </div>
              <div style={{ fontSize: 11, color: F.warning, fontWeight: 600, marginTop: 2 }}>
                Under Review
              </div>
            </div>

            <div
              style={{
                background: F.card,
                border: `1px solid ${F.border}`,
                borderRadius: 6,
                padding: "14px 16px",
                borderTop: "3px solid #0854A0",
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 600, color: F.text2, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Monthly Payroll
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: F.text1, marginTop: 4 }}>
                {adminProfiles.org_admin.grossMonthlyPayroll}
              </div>
              <div style={{ fontSize: 11, color: F.text3, marginTop: 2 }}>
                Gross payroll budget
              </div>
            </div>

            <div
              style={{
                background: F.card,
                border: `1px solid ${F.border}`,
                borderRadius: 6,
                padding: "14px 16px",
                borderTop: `3px solid ${F.success}`,
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 600, color: F.text2, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Payroll Compliance
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: F.success, marginTop: 4 }}>
                {adminProfiles.org_admin.complianceScore}
              </div>
              <div style={{ fontSize: 11, color: F.text3, marginTop: 2 }}>
                PF, ESI & TDS verified
              </div>
            </div>
          </>
        )}

        {persona === "employee" && (
          <>
            <div
              style={{
                background: F.card,
                border: `1px solid ${F.border}`,
                borderRadius: 6,
                padding: "14px 16px",
                borderTop: `3px solid ${F.success}`,
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 600, color: F.text2, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Monthly Gross CTC
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: F.text1, marginTop: 4 }}>
                ₹{emp.grossSalary.toLocaleString("en-IN")}
              </div>
              <div style={{ fontSize: 11, color: F.text3, marginTop: 2 }}>
                Structure: {emp.salaryStructure}
              </div>
            </div>

            <div
              style={{
                background: F.card,
                border: `1px solid ${F.border}`,
                borderRadius: 6,
                padding: "14px 16px",
                borderTop: `3px solid ${F.brand}`,
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 600, color: F.text2, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Estimated Net Pay
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: F.brand, marginTop: 4 }}>
                ₹92,800
              </div>
              <div style={{ fontSize: 11, color: F.text3, marginTop: 2 }}>
                After statutory deductions
              </div>
            </div>

            <div
              style={{
                background: F.card,
                border: `1px solid ${F.border}`,
                borderRadius: 6,
                padding: "14px 16px",
                borderTop: "3px solid #7C3AED",
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 600, color: F.text2, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Tenure
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: F.text1, marginTop: 4 }}>
                5.5 Years
              </div>
              <div style={{ fontSize: 11, color: F.text3, marginTop: 2 }}>
                Joined {fmtD(emp.doj)}
              </div>
            </div>

            <div
              style={{
                background: F.card,
                border: `1px solid ${F.border}`,
                borderRadius: 6,
                padding: "14px 16px",
                borderTop: `3px solid ${F.warning}`,
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 600, color: F.text2, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Leave Balance
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: F.text1, marginTop: 4 }}>
                18 Days
              </div>
              <div style={{ fontSize: 11, color: F.text3, marginTop: 2 }}>
                Paid annual leave quota
              </div>
            </div>
          </>
        )}
        </div>
      )}

      {/* 5. Tab Navigation Bar */}
      <TabBar
        tabs={[
          { id: "overview", label: "Profile & Employment" },
          { id: "security", label: "Security & Credentials" },
          { id: "permissions", label: "Roles & Permissions" },
          { id: "preferences", label: "Preferences & Notifications" },
        ]}
        active={activeTab}
        onSelect={(t) => setActiveTab(t as any)}
      />

      {/* ─────────────────────────────────────────────────────────────
          TAB 1: OVERVIEW & PROFILE DETAILS
         ───────────────────────────────────────────────────────────── */}
      {activeTab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Card: Personal & Contact Information */}
          <div
            style={{
              background: F.card,
              border: `1px solid ${F.border}`,
              borderRadius: 6,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "12px 18px",
                background: F.pageBg,
                borderBottom: `1px solid ${F.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 700, color: F.text1 }}>
                Personal & Contact Details
              </span>
              {editing && (
                <span style={{ fontSize: 11, color: F.brand, fontWeight: 600 }}>
                  Editing in progress…
                </span>
              )}
            </div>

            <div
              style={{
                padding: 18,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              <Fld label="Full Name">
                <input
                  style={{
                    ...iSt,
                    borderColor: editing ? F.brand : F.border,
                    background: editing ? "#fff" : F.pageBg,
                  }}
                  value={
                    persona === "employee"
                      ? editing ? draftEmp.name : emp.name
                      : editing ? draftAdmin.name : adminProfiles[persona].name
                  }
                  readOnly={!editing}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^A-Za-z ]/g, "")
                    if (persona === "employee") {
                      setDraftEmp({ ...draftEmp, name: value })
                    } else {
                      setDraftAdmin({ ...draftAdmin, name: value })
                    }
                  }}
                />
              </Fld>

              <Fld label="Official Work Email *">
                <input
                  style={{
                    ...iSt,
                    borderColor: editing && !emailValid ? F.error : editing ? F.brand : F.border,
                    background: editing ? "#fff" : F.pageBg,
                  }}
                  value={
                    persona === "employee"
                      ? editing ? draftEmp.email : emp.email
                      : editing ? draftAdmin.email : adminProfiles[persona].email
                  }
                  readOnly={!editing}
                  onChange={(e) => {
                    if (persona === "employee") {
                      setDraftEmp({ ...draftEmp, email: e.target.value })
                    } else {
                      setDraftAdmin({ ...draftAdmin, email: e.target.value })
                    }
                  }}
                />
              </Fld>

              <Fld label="Mobile Phone Number *">
                <div style={{ display: "flex", gap: 8 }}>
                <select value={mobileCountryCode} disabled={!editing} onChange={(e) => setMobileCountryCode(e.target.value)} style={{ ...iSt, width: 90 }}>
                  {countryCodes.map((code) => <option key={code}>{code}</option>)}
                </select>
                <input
                  style={{
                    ...iSt,
                    borderColor: editing && !phoneValid ? F.error : editing ? F.brand : F.border,
                    background: editing ? "#fff" : F.pageBg,
                  }}
                  value={
                    persona === "employee"
                      ? editing ? (draftEmp.mobile ?? "").replace(/\D/g, "").slice(-10) : (emp.mobile ?? "")
                      : editing ? draftAdmin.phone.replace(/\D/g, "").slice(-10) : adminProfiles[persona].phone
                  }
                  readOnly={!editing}
                  placeholder="+91 98765 43210"
                  onChange={(e) => {
                    const value = `${mobileCountryCode}${e.target.value.replace(/\D/g, "").slice(0, 10)}`
                    if (persona === "employee") {
                      setDraftEmp({ ...draftEmp, mobile: value })
                    } else {
                      setDraftAdmin({ ...draftAdmin, phone: value })
                    }
                  }}
                />
                </div>
                {editing && !phoneValid && (
                  <span style={{ fontSize: 11, color: F.error }}>
                    Please enter a valid phone number with country code.
                  </span>
                )}
              </Fld>

              <Fld label="Work Location / Base Office">
                <input
                  style={{
                    ...iSt,
                    borderColor: editing ? F.brand : F.border,
                    background: editing ? "#fff" : F.pageBg,
                  }}
                  value={
                    persona === "employee"
                      ? editing ? draftEmp.location : emp.location
                      : editing ? draftAdmin.location : adminProfiles[persona].location
                  }
                  readOnly={!editing}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^A-Za-z ]/g, "")
                    if (persona === "employee") {
                      setDraftEmp({ ...draftEmp, location: value })
                    } else {
                      setDraftAdmin({ ...draftAdmin, location: value })
                    }
                  }}
                />
              </Fld>

              <Fld label="System Timezone">
                <input
                  style={{
                    ...iSt,
                    borderColor: editing ? F.brand : F.border,
                    background: editing ? "#fff" : F.pageBg,
                  }}
                  value={
                    persona === "employee"
                      ? "IST (UTC+05:30) - Asia/Kolkata"
                      : editing ? draftAdmin.timezone : adminProfiles[persona].timezone
                  }
                  readOnly={!editing}
                  onChange={(e) => {
                    if (persona !== "employee") {
                      setDraftAdmin({ ...draftAdmin, timezone: e.target.value })
                    }
                  }}
                />
              </Fld>

              <Fld label="Preferred Language">
                <input
                  style={{
                    ...iSt,
                    borderColor: editing ? F.brand : F.border,
                    background: editing ? "#fff" : F.pageBg,
                  }}
                  value={
                    persona === "employee"
                      ? "English (India)"
                      : editing ? draftAdmin.language : adminProfiles[persona].language
                  }
                  readOnly={!editing}
                  onChange={(e) => {
                    if (persona !== "employee") {
                      setDraftAdmin({ ...draftAdmin, language: e.target.value })
                    }
                  }}
                />
              </Fld>
            </div>

            {/* Bio / Summary Notes */}
            <div style={{ padding: "0 18px 18px" }}>
              <Fld label="About / Profile Bio">
                <textarea
                  rows={2}
                  style={{
                    ...iSt,
                    borderColor: editing ? F.brand : F.border,
                    background: editing ? "#fff" : F.pageBg,
                    resize: "vertical",
                  }}
                  value={
                    persona === "employee"
                      ? empEmergency.bio
                      : editing ? draftAdmin.bio : adminProfiles[persona].bio
                  }
                  readOnly={!editing}
                  onChange={(e) => {
                    if (persona === "employee") {
                      setEmpEmergency({ ...empEmergency, bio: e.target.value })
                    } else {
                      setDraftAdmin({ ...draftAdmin, bio: e.target.value })
                    }
                  }}
                />
              </Fld>
            </div>
          </div>

          {/* Card: Professional & Organization Info */}
          <div
            style={{
              background: F.card,
              border: `1px solid ${F.border}`,
              borderRadius: 6,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "12px 18px",
                background: F.pageBg,
                borderBottom: `1px solid ${F.border}`,
                fontSize: 13,
                fontWeight: 700,
                color: F.text1,
              }}
            >
              Professional & Organizational Data
            </div>

            <div
              style={{
                padding: 18,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              {persona === "product_admin" && (
                <>
                  <Fld label="Admin Root Identifier">
                    <input style={iSt} value={adminProfiles.product_admin.id} readOnly />
                  </Fld>
                  <Fld label="Assigned Platform Role">
                    <input style={iSt} value={adminProfiles.product_admin.role} readOnly />
                  </Fld>
                  <Fld label="Department">
                    <input style={iSt} value={adminProfiles.product_admin.department} readOnly />
                  </Fld>
                  <Fld label="Platform Tier">
                    <input style={iSt} value="Enterprise Multi-Tenant SaaS" readOnly />
                  </Fld>
                  <Fld label="Security Clearance">
                    <input style={iSt} value={adminProfiles.product_admin.securityClearance ?? "Tier-1 Root Superuser"} readOnly />
                  </Fld>
                  <Fld label="Tenants Under Oversight">
                    <input style={iSt} value="Naxrita Solutions, Apex Global, Zenith Corp" readOnly />
                  </Fld>
                </>
              )}

              {persona === "org_admin" && (
                <>
                  <Fld label="Admin Account ID">
                    <input style={iSt} value={adminProfiles.org_admin.id} readOnly />
                  </Fld>
                  <Fld label="Organization Name">
                    <input style={iSt} value={adminProfiles.org_admin.organization ?? "Naxrita Solutions Pvt. Ltd."} readOnly />
                  </Fld>
                  <Fld label="Department">
                    <input style={iSt} value={adminProfiles.org_admin.department} readOnly />
                  </Fld>
                  <Fld label="Job Title / Designation">
                    <input style={iSt} value={adminProfiles.org_admin.designation} readOnly />
                  </Fld>
                  <Fld label="Access Role">
                    <input style={iSt} value="Full Organization Administrator" readOnly />
                  </Fld>
                  <Fld label="Direct Reporting Scope">
                    <input style={iSt} value="11 Managed Employees • Payroll Approver" readOnly />
                  </Fld>
                </>
              )}

              {persona === "employee" && (
                <>
                  <Fld label="Employee ID">
                    <input style={iSt} value={emp.id} readOnly />
                  </Fld>
                  <Fld label="Department">
                    <input style={iSt} value={emp.department} readOnly />
                  </Fld>
                  <Fld label="Designation">
                    <input style={iSt} value={emp.designation} readOnly />
                  </Fld>
                  <Fld label="Date of Joining">
                    <input style={iSt} value={fmtD(emp.doj)} readOnly />
                  </Fld>
                  <Fld label="Employment Type">
                    <input style={iSt} value={emp.empType} readOnly />
                  </Fld>
                  <Fld label="Reporting Manager">
                    <input style={iSt} value={emp.manager} readOnly />
                  </Fld>
                  <Fld label="Salary Structure Band">
                    <input style={iSt} value={emp.salaryStructure} readOnly />
                  </Fld>
                  <Fld label="Monthly Gross Salary">
                    <input style={iSt} value={`₹${emp.grossSalary.toLocaleString("en-IN")}`} readOnly />
                  </Fld>
                </>
              )}
            </div>
          </div>

          {/* Card: Emergency Contact Information */}
          <div
            style={{
              background: F.card,
              border: `1px solid ${F.border}`,
              borderRadius: 6,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "12px 18px",
                background: F.pageBg,
                borderBottom: `1px solid ${F.border}`,
                fontSize: 13,
                fontWeight: 700,
                color: F.text1,
              }}
            >
              Emergency Contact Information
            </div>
            <div
              style={{
                padding: 18,
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 14,
              }}
            >
              <Fld label="Contact Name">
                <input
                  style={{
                    ...iSt,
                    borderColor: editing ? F.brand : F.border,
                    background: editing ? "#fff" : F.pageBg,
                  }}
                  value={
                    persona === "employee"
                      ? empEmergency.name
                      : editing
                        ? (draftAdmin.emergencyName ?? "")
                        : (adminProfiles[persona].emergencyName ?? "")
                  }
                  readOnly={!editing}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^A-Za-z ]/g, "")
                    if (persona === "employee") {
                      setEmpEmergency({ ...empEmergency, name: value })
                    } else {
                      setDraftAdmin({ ...draftAdmin, emergencyName: value })
                    }
                  }}
                />
              </Fld>
              <Fld label="Relationship">
                <input
                  style={{
                    ...iSt,
                    borderColor: editing ? F.brand : F.border,
                    background: editing ? "#fff" : F.pageBg,
                  }}
                  value={
                    persona === "employee"
                      ? empEmergency.relation
                      : editing
                        ? (draftAdmin.emergencyRelation ?? "")
                        : (adminProfiles[persona].emergencyRelation ?? "")
                  }
                  readOnly={!editing}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^A-Za-z ]/g, "")
                    if (persona === "employee") {
                      setEmpEmergency({ ...empEmergency, relation: value })
                    } else {
                      setDraftAdmin({ ...draftAdmin, emergencyRelation: value })
                    }
                  }}
                />
              </Fld>
              <Fld label="Emergency Phone">
                <div style={{ display: "flex", gap: 8 }}>
                <select value={emergencyCountryCode} disabled={!editing} onChange={(e) => setEmergencyCountryCode(e.target.value)} style={{ ...iSt, width: 90 }}>
                  {countryCodes.map((code) => <option key={code}>{code}</option>)}
                </select>
                <input
                  style={{
                    ...iSt,
                    borderColor: editing ? F.brand : F.border,
                    background: editing ? "#fff" : F.pageBg,
                  }}
                  value={
                    persona === "employee"
                      ? editing ? empEmergency.phone.replace(/\D/g, "").slice(-10) : empEmergency.phone
                      : editing
                        ? (draftAdmin.emergencyPhone ?? "").replace(/\D/g, "").slice(-10)
                        : (adminProfiles[persona].emergencyPhone ?? "")
                  }
                  readOnly={!editing}
                  onChange={(e) => {
                    const raw = e.target.value
                    const value = `${emergencyCountryCode}${raw.replace(/\D/g, "").slice(0, 10)}`
                    if (persona === "employee") {
                      setEmpEmergency({ ...empEmergency, phone: value })
                    } else {
                      setDraftAdmin({ ...draftAdmin, emergencyPhone: value })
                    }
                  }}
                />
                </div>
              </Fld>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 2: SECURITY & CREDENTIALS
         ───────────────────────────────────────────────────────────── */}
      {activeTab === "security" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Card 1: Password Management */}
          <div
            style={{
              background: F.card,
              border: `1px solid ${F.border}`,
              borderRadius: 6,
              padding: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: 14,
              }}
            >
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: F.text1 }}>
                  Account Password
                </div>
                <div style={{ fontSize: 13, color: F.text2, marginTop: 3 }}>
                  Your password was last updated 42 days ago. Minimum 8 characters with numbers and symbols required.
                </div>
                <div style={{ marginTop: 10, display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontFamily: "monospace", letterSpacing: 2 }}>
                    ••••••••••••••••
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: F.success,
                      background: F.successBg,
                      padding: "2px 8px",
                      borderRadius: 10,
                      border: "1px solid #c7eed8",
                    }}
                  >
                    Strong
                  </span>
                </div>
              </div>
              <Btn onClick={() => setChangePwModal(true)}>
                Update Password
              </Btn>
            </div>
          </div>

          {/* Card 2: Two-Factor Authentication (2FA / MFA) */}
          <div
            style={{
              background: F.card,
              border: `1px solid ${F.border}`,
              borderRadius: 6,
              padding: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 14,
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: F.text1 }}>
                    Two-Factor Authentication (2FA)
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: 12,
                      background: mfaEnabled ? F.successBg : F.errorBg,
                      color: mfaEnabled ? F.success : F.error,
                      border: `1px solid ${mfaEnabled ? "#c7eed8" : "#f5c2c2"}`,
                    }}
                  >
                    {mfaEnabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: F.text2, marginTop: 4 }}>
                  Protect your account with a secondary verification code via Google Authenticator or SMS token.
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                onClick={() => {
                  const next = !mfaEnabled
                  setMfaEnabled(next)
                  toast(
                    next
                      ? "Two-Factor Authentication enabled"
                      : "Two-Factor Authentication turned off",
                    next ? "success" : "warning",
                  )
                }}
                style={{
                  width: 46,
                  height: 24,
                  borderRadius: 12,
                  background: mfaEnabled ? F.brand : "#ccc",
                  border: "none",
                  cursor: "pointer",
                  position: "relative",
                  padding: 2,
                  transition: "background 0.2s",
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "#fff",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
                    transform: mfaEnabled ? "translateX(22px)" : "translateX(0)",
                    transition: "transform 0.2s",
                  }}
                />
              </button>
            </div>

            {/* Methods Breakdown */}
            <div
              style={{
                marginTop: 18,
                paddingTop: 16,
                borderTop: `1px solid ${F.border}`,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 12,
              }}
            >
              <div
                style={{
                  padding: "12px 14px",
                  background: F.pageBg,
                  borderRadius: 6,
                  border: `1px solid ${F.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: F.text1 }}>
                    Authenticator App
                  </div>
                  <div style={{ fontSize: 11, color: F.text2 }}>
                    Google Authenticator / Okta Verify
                  </div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: F.success }}>
                  Configured ✓
                </span>
              </div>

              <div
                style={{
                  padding: "12px 14px",
                  background: F.pageBg,
                  borderRadius: 6,
                  border: `1px solid ${F.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: F.text1 }}>
                    SMS Backup Token
                  </div>
                  <div style={{ fontSize: 11, color: F.text2 }}>
                    Verified on {profilePhone}
                  </div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: F.brand }}>
                  Active ✓
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Active Sessions & Logged-In Devices */}
          <div
            style={{
              background: F.card,
              border: `1px solid ${F.border}`,
              borderRadius: 6,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "14px 18px",
                background: F.pageBg,
                borderBottom: `1px solid ${F.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <span style={{ fontSize: 14, fontWeight: 700, color: F.text1 }}>
                  Active Sessions & Devices
                </span>
                <div style={{ fontSize: 11, color: F.text2 }}>
                  Devices currently authorized to access this Naxpayroll account
                </div>
              </div>
              <Btn
                variant="danger"
                small
                onClick={() => {
                  setSessions(sessions.filter((s) => s.current))
                  toast("Terminated all remote active sessions", "info")
                }}
              >
                Sign Out Other Devices
              </Btn>
            </div>

            <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
              {sessions.map((s) => (
                <div
                  key={s.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 14px",
                    borderRadius: 6,
                    border: `1px solid ${s.current ? F.brand : F.border}`,
                    background: s.current ? "#F8FAFC" : "#fff",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 6,
                        background: s.current ? F.infoBg : F.pageBg,
                        color: s.current ? F.brand : F.text2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                      </svg>
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: F.text1 }}>
                          {s.device}
                        </span>
                        {s.current && (
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              padding: "1px 6px",
                              borderRadius: 8,
                              background: F.brand,
                              color: "#fff",
                            }}
                          >
                            Current Session
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: F.text2, marginTop: 2 }}>
                        {s.browser} • {s.location} (IP: {s.ip})
                      </div>
                    </div>
                  </div>

                  <span style={{ fontSize: 12, color: s.current ? F.success : F.text3, fontWeight: 600 }}>
                    {s.lastActive}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 3: ROLES & PERMISSIONS MATRIX
         ───────────────────────────────────────────────────────────── */}
      {activeTab === "permissions" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Role Summary Banner */}
          <div
            style={{
              padding: 18,
              background: roleBadgeBg,
              border: `1px solid ${roleBadgeBorder}`,
              borderRadius: 6,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: roleThemeColor }}>
                {persona === "product_admin"
                  ? "Platform Administrator Privileges"
                  : persona === "org_admin"
                    ? "Organization Administrator Privileges"
                    : "Employee Self-Service Privileges"}
              </span>
            </div>
            <div style={{ fontSize: 13, color: F.text1, marginTop: 6, lineHeight: 1.5 }}>
              {persona === "product_admin" &&
                "As a Platform Administrator, you hold unrestricted root-level access across the entire multi-tenant Naxpayroll cluster, tenant provisioning, system health monitoring, and global audit enforcement."}
              {persona === "org_admin" &&
                "As an Organization Administrator for Naxrita Solutions Pvt. Ltd., you have full authority to process and approve pay runs, configure statutory salary structures, manage the employee directory, and generate compliance reports."}
              {persona === "employee" &&
                "As an Employee, you have full self-service permissions to access your monthly payslips, compensation breakdown, tax declarations, company policies, and keep personal contact details updated."}
            </div>
          </div>

          {/* Permissions Table Card */}
          <div
            style={{
              background: F.card,
              border: `1px solid ${F.border}`,
              borderRadius: 6,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "12px 18px",
                background: F.pageBg,
                borderBottom: `1px solid ${F.border}`,
                fontSize: 13,
                fontWeight: 700,
                color: F.text1,
              }}
            >
              Access Control & Permissions Matrix
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <Th>Functional Domain</Th>
                  <Th>Specific Privilege</Th>
                  <Th>Access Level</Th>
                  <Th>Enforcement Scope</Th>
                </tr>
              </thead>
              <tbody>
                {persona === "product_admin" && (
                  <>
                    <tr style={{ borderBottom: `1px solid ${F.border}` }}>
                      <td style={{ padding: "11px 14px", fontSize: 13, fontWeight: 600 }}>
                        Platform & Multi-Tenancy
                      </td>
                      <td style={{ padding: "11px 14px", fontSize: 13, color: F.text2 }}>
                        Create, suspend, and configure client organizations
                      </td>
                      <td style={{ padding: "11px 14px" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: F.success, background: F.successBg, padding: "3px 8px", borderRadius: 4 }}>
                          Full Control
                        </span>
                      </td>
                      <td style={{ padding: "11px 14px", fontSize: 12, color: F.text2 }}>
                        Global Cluster
                      </td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${F.border}` }}>
                      <td style={{ padding: "11px 14px", fontSize: 13, fontWeight: 600 }}>
                        Global Audit & Security
                      </td>
                      <td style={{ padding: "11px 14px", fontSize: 13, color: F.text2 }}>
                        Inspect immutable audit trail across all workspaces
                      </td>
                      <td style={{ padding: "11px 14px" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: F.success, background: F.successBg, padding: "3px 8px", borderRadius: 4 }}>
                          Full Control
                        </span>
                      </td>
                      <td style={{ padding: "11px 14px", fontSize: 12, color: F.text2 }}>
                        Platform-Wide
                      </td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${F.border}` }}>
                      <td style={{ padding: "11px 14px", fontSize: 13, fontWeight: 600 }}>
                        Infrastructure Operations
                      </td>
                      <td style={{ padding: "11px 14px", fontSize: 13, color: F.text2 }}>
                        System telemetry, uptime monitoring, DB migrations
                      </td>
                      <td style={{ padding: "11px 14px" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: F.success, background: F.successBg, padding: "3px 8px", borderRadius: 4 }}>
                          Full Control
                        </span>
                      </td>
                      <td style={{ padding: "11px 14px", fontSize: 12, color: F.text2 }}>
                        Root Infrastructure
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: "11px 14px", fontSize: 13, fontWeight: 600 }}>
                        Tenant Level Pay Runs
                      </td>
                      <td style={{ padding: "11px 14px", fontSize: 13, color: F.text2 }}>
                        Individual monthly salary calculations
                      </td>
                      <td style={{ padding: "11px 14px" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: F.brand, background: F.infoBg, padding: "3px 8px", borderRadius: 4 }}>
                          Supervised View
                        </span>
                      </td>
                      <td style={{ padding: "11px 14px", fontSize: 12, color: F.text2 }}>
                        Tenant Delegation
                      </td>
                    </tr>
                  </>
                )}

                {persona === "org_admin" && (
                  <>
                    <tr style={{ borderBottom: `1px solid ${F.border}` }}>
                      <td style={{ padding: "11px 14px", fontSize: 13, fontWeight: 600 }}>
                        Payroll Processing
                      </td>
                      <td style={{ padding: "11px 14px", fontSize: 13, color: F.text2 }}>
                        Generate, recalculate, review, and approve monthly pay runs
                      </td>
                      <td style={{ padding: "11px 14px" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: F.success, background: F.successBg, padding: "3px 8px", borderRadius: 4 }}>
                          Full Authority
                        </span>
                      </td>
                      <td style={{ padding: "11px 14px", fontSize: 12, color: F.text2 }}>
                        Naxrita Solutions
                      </td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${F.border}` }}>
                      <td style={{ padding: "11px 14px", fontSize: 13, fontWeight: 600 }}>
                        Employee Master DB
                      </td>
                      <td style={{ padding: "11px 14px", fontSize: 13, color: F.text2 }}>
                        Onboard, update status, and manage salary structure assignments
                      </td>
                      <td style={{ padding: "11px 14px" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: F.success, background: F.successBg, padding: "3px 8px", borderRadius: 4 }}>
                          Full Control
                        </span>
                      </td>
                      <td style={{ padding: "11px 14px", fontSize: 12, color: F.text2 }}>
                        11 Employees
                      </td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${F.border}` }}>
                      <td style={{ padding: "11px 14px", fontSize: 13, fontWeight: 600 }}>
                        Statutory Compliance
                      </td>
                      <td style={{ padding: "11px 14px", fontSize: 13, color: F.text2 }}>
                        Download PF ECR, ESI returns, Form 16, and TDS reports
                      </td>
                      <td style={{ padding: "11px 14px" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: F.success, background: F.successBg, padding: "3px 8px", borderRadius: 4 }}>
                          Full Control
                        </span>
                      </td>
                      <td style={{ padding: "11px 14px", fontSize: 12, color: F.text2 }}>
                        Financial Year 2026-27
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: "11px 14px", fontSize: 13, fontWeight: 600 }}>
                        Platform Root Ops
                      </td>
                      <td style={{ padding: "11px 14px", fontSize: 13, color: F.text2 }}>
                        Manage multi-tenant infrastructure and servers
                      </td>
                      <td style={{ padding: "11px 14px" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: F.text3, background: F.pageBg, padding: "3px 8px", borderRadius: 4 }}>
                          Restricted
                        </span>
                      </td>
                      <td style={{ padding: "11px 14px", fontSize: 12, color: F.text2 }}>
                        Platform Admin Only
                      </td>
                    </tr>
                  </>
                )}

                {persona === "employee" && (
                  <>
                    <tr style={{ borderBottom: `1px solid ${F.border}` }}>
                      <td style={{ padding: "11px 14px", fontSize: 13, fontWeight: 600 }}>
                        Monthly Payslips
                      </td>
                      <td style={{ padding: "11px 14px", fontSize: 13, color: F.text2 }}>
                        View breakdown and download digitally signed PDF payslips
                      </td>
                      <td style={{ padding: "11px 14px" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: F.success, background: F.successBg, padding: "3px 8px", borderRadius: 4 }}>
                          Self-Service
                        </span>
                      </td>
                      <td style={{ padding: "11px 14px", fontSize: 12, color: F.text2 }}>
                        Personal Records
                      </td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${F.border}` }}>
                      <td style={{ padding: "11px 14px", fontSize: 13, fontWeight: 600 }}>
                        Tax & Declarations
                      </td>
                      <td style={{ padding: "11px 14px", fontSize: 13, color: F.text2 }}>
                        Submit Form 12BB, Section 80C investment proofs, HRA receipts
                      </td>
                      <td style={{ padding: "11px 14px" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: F.success, background: F.successBg, padding: "3px 8px", borderRadius: 4 }}>
                          Self-Service
                        </span>
                      </td>
                      <td style={{ padding: "11px 14px", fontSize: 12, color: F.text2 }}>
                        Personal Records
                      </td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${F.border}` }}>
                      <td style={{ padding: "11px 14px", fontSize: 13, fontWeight: 600 }}>
                        Personal Details
                      </td>
                      <td style={{ padding: "11px 14px", fontSize: 13, color: F.text2 }}>
                        Update mobile number, address, and emergency contact
                      </td>
                      <td style={{ padding: "11px 14px" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: F.success, background: F.successBg, padding: "3px 8px", borderRadius: 4 }}>
                          Editable
                        </span>
                      </td>
                      <td style={{ padding: "11px 14px", fontSize: 12, color: F.text2 }}>
                        Self-Service
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: "11px 14px", fontSize: 13, fontWeight: 600 }}>
                        Pay Run Approvals
                      </td>
                      <td style={{ padding: "11px 14px", fontSize: 13, color: F.text2 }}>
                        Approve team pay runs and company statutory submissions
                      </td>
                      <td style={{ padding: "11px 14px" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: F.text3, background: F.pageBg, padding: "3px 8px", borderRadius: 4 }}>
                          Restricted
                        </span>
                      </td>
                      <td style={{ padding: "11px 14px", fontSize: 12, color: F.text2 }}>
                        Org Admin Only
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 4: PREFERENCES & NOTIFICATIONS
         ───────────────────────────────────────────────────────────── */}
      {activeTab === "preferences" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Email Notifications Card */}
          <div
            style={{
              background: F.card,
              border: `1px solid ${F.border}`,
              borderRadius: 6,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "12px 18px",
                background: F.pageBg,
                borderBottom: `1px solid ${F.border}`,
                fontSize: 13,
                fontWeight: 700,
                color: F.text1,
              }}
            >
              Email Notification Subscriptions
            </div>

            <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: F.text1 }}>
                    Payroll & Pay Run Status Alerts
                  </div>
                  <div style={{ fontSize: 11, color: F.text2 }}>
                    Receive emails when monthly pay run is approved, reviewed, or disbursed
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifEmailPayroll}
                  onChange={(e) => setNotifEmailPayroll(e.target.checked)}
                  style={{ width: 18, height: 18, cursor: "pointer", accentColor: F.brand }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: F.text1 }}>
                    Security & Account Activity Notices
                  </div>
                  <div style={{ fontSize: 11, color: F.text2 }}>
                    Immediate notifications for logins from new devices, password changes, or MFA resets
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifEmailSecurity}
                  onChange={(e) => setNotifEmailSecurity(e.target.checked)}
                  style={{ width: 18, height: 18, cursor: "pointer", accentColor: F.brand }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: F.text1 }}>
                    Monthly Analytics & Statutory Digest
                  </div>
                  <div style={{ fontSize: 11, color: F.text2 }}>
                    Monthly summary email with tax compliance and workforce highlights
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifEmailReports}
                  onChange={(e) => setNotifEmailReports(e.target.checked)}
                  style={{ width: 18, height: 18, cursor: "pointer", accentColor: F.brand }}
                />
              </div>
            </div>
          </div>

          {/* In-App Notifications Card */}
          <div
            style={{
              background: F.card,
              border: `1px solid ${F.border}`,
              borderRadius: 6,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "12px 18px",
                background: F.pageBg,
                borderBottom: `1px solid ${F.border}`,
                fontSize: 13,
                fontWeight: 700,
                color: F.text1,
              }}
            >
              In-App Notification & Sound Alerts
            </div>

            <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: F.text1 }}>
                    Floating Banner & Notification Badges
                  </div>
                  <div style={{ fontSize: 11, color: F.text2 }}>
                    Show unread count indicator in the top navigation bar
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifInAppAlerts}
                  onChange={(e) => setNotifInAppAlerts(e.target.checked)}
                  style={{ width: 18, height: 18, cursor: "pointer", accentColor: F.brand }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: F.text1 }}>
                    Audible Alert Chime
                  </div>
                  <div style={{ fontSize: 11, color: F.text2 }}>
                    Play a subtle sound when a high-priority approval notification arrives
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifSound}
                  onChange={(e) => setNotifSound(e.target.checked)}
                  style={{ width: 18, height: 18, cursor: "pointer", accentColor: F.brand }}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              paddingTop: 2,
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <Btn
              onClick={() => {
                sessionStorage.setItem(preferenceKey, JSON.stringify({
                  emailPayroll: notifEmailPayroll,
                  emailSecurity: notifEmailSecurity,
                  emailReports: notifEmailReports,
                  inAppAlerts: notifInAppAlerts,
                  sound: notifSound,
                }))
                toast("Preferences updated successfully.", "success")
              }}
            >
              Save Preferences
            </Btn>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          CHANGE PASSWORD MODAL
         ───────────────────────────────────────────────────────────── */}
      {changePwModal && (
        <Modal title="Change Account Password" onClose={() => setChangePwModal(false)}>
          <form onSubmit={handlePasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Fld label="Current Password">
              <input
                type={showPws ? "text" : "password"}
                style={iSt}
                value={currPw}
                onChange={(e) => setCurrPw(e.target.value)}
                placeholder="Enter current password"
                required
              />
            </Fld>

            <Fld label="New Password (min. 8 characters)">
              <input
                type={showPws ? "text" : "password"}
                style={iSt}
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="Enter strong new password"
                required
              />
            </Fld>

            {/* Password strength meter */}
            {newPw && (
              <div style={{ marginTop: -6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                  <span style={{ color: F.text2 }}>Password strength:</span>
                  <span style={{ fontWeight: 700, color: pwStrength.color }}>
                    {pwStrength.text}
                  </span>
                </div>
                <div
                  style={{
                    height: 4,
                    width: "100%",
                    background: "#eee",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${pwStrength.score}%`,
                      background: pwStrength.color,
                      transition: "width 0.2s ease, background 0.2s ease",
                    }}
                  />
                </div>
              </div>
            )}

            <Fld label="Confirm New Password">
              <input
                type={showPws ? "text" : "password"}
                style={iSt}
                value={confPw}
                onChange={(e) => setConfPw(e.target.value)}
                placeholder="Re-enter new password"
                required
              />
            </Fld>

            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input
                type="checkbox"
                id="showPwsCheck"
                checked={showPws}
                onChange={(e) => setShowPws(e.target.checked)}
                style={{ cursor: "pointer" }}
              />
              <label htmlFor="showPwsCheck" style={{ fontSize: 12, color: F.text2, cursor: "pointer" }}>
                Show password text
              </label>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 8,
                marginTop: 10,
                borderTop: `1px solid ${F.border}`,
                paddingTop: 14,
              }}
            >
              <Btn variant="secondary" onClick={() => setChangePwModal(false)}>
                Cancel
              </Btn>
              <Btn onClick={() => {}}>
                Save New Password
              </Btn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

function MyProfileView(props: { emp: Employee }) {
  return <UnifiedProfileView persona="employee" {...props} />
}


interface NotifItem {
  id: number
  msg: string
  time: string
  read: boolean
  module: string
}
const INIT_NOTIFS: NotifItem[] = [
  {
    id: 1,
    msg: "August 2026 payroll is Under Review — approval required",
    time: "2 hours ago",
    read: false,
    module: "Payroll",
  },
  {
    id: 2,
    msg: "Vikram Reddy's leave status updated to On Leave",
    time: "5 hours ago",
    read: false,
    module: "Employees",
  },
  {
    id: 3,
    msg: "Salary structure 'Senior Engineer' was updated (Gross: ₹1,10,000)",
    time: "1 day ago",
    read: false,
    module: "Salary",
  },
  {
    id: 4,
    msg: "Pay run PR-2026-08 generated by Meena Iyer",
    time: "2 days ago",
    read: false,
    module: "Payroll",
  },
  {
    id: 5,
    msg: "Rahul Mehta onboarded — salary assignment pending",
    time: "3 days ago",
    read: true,
    module: "Employees",
  },
  {
    id: 6,
    msg: "July 2026 payroll completed — payslips generated",
    time: "5 days ago",
    read: true,
    module: "Payroll",
  },
  {
    id: 7,
    msg: "Access role changed for Rajesh Kumar (Associate → Manager)",
    time: "6 days ago",
    read: true,
    module: "Access",
  },
]

function NotificationBell({
  showToast,
  onNavigate,
}: {
  showToast: (msg: string, type?: ToastType) => void
  onNavigate: (view: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const [notifs, setNotifs] = useState<NotifItem[]>(INIT_NOTIFS)
  const unread = notifs.filter((n) => !n.read).length

  const moduleColor: Record<string, string> = {
    Payroll: F.brand,
    Employees: F.success,
    Salary: F.warning,
    Access: "#8A5CF6",
  }
  const moduleIcon: Record<string, React.ReactNode> = {
    Payroll: (
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
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    Employees: (
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
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
      </svg>
    ),
    Salary: (
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
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    Access: (
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
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  }

  const markAllRead = () => {
    setNotifs(notifs.map((n) => ({ ...n, read: true })))
    showToast("All notifications marked as read", "success")
  }
  const clearAll = () => {
    setNotifs([])
    showToast("Notifications cleared", "info")
  }
  const dismiss = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setNotifs(notifs.filter((n) => n.id !== id))
  }
  const markRead = (id: number) =>
    setNotifs(notifs.map((n) => (n.id === id ? { ...n, read: true } : n)))
  const openNotification = (n: NotifItem) => {
    markRead(n.id)
    setOpen(false)
    setShowAll(false)
    const view = n.module === "Employees" ? "employees" : n.module === "Salary" ? "salary" : n.module === "Access" ? "access" : "payruns"
    onNavigate(view)
  }

  return (
    <div className="sap-notification-center" style={{ position: "relative", flexShrink: 0 }}>
      <button
        className="sap-shell-action"
        onClick={() => setOpen((o) => !o)}
        title="Notifications"
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 36,
          height: 36,
          borderRadius: 8,
          background: open
            ? "rgba(255,255,255,0.22)"
            : "rgba(255,255,255,0.12)",
          border: `1px solid ${
            open ? "rgba(255,255,255,0.32)" : "rgba(255,255,255,0.18)"
          }`,
          cursor: "pointer",
          transition: "all 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.22)"
          e.currentTarget.style.border = "1px solid rgba(255,255,255,0.32)"
        }}
        onMouseLeave={(e) => {
          if (!open) {
            e.currentTarget.style.background = "rgba(255,255,255,0.12)"
            e.currentTarget.style.border = "1px solid rgba(255,255,255,0.18)"
          }
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unread > 0 && (
          <span
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              minWidth: 16,
              height: 16,
              borderRadius: 8,
              background: F.error,
              border: `2px solid ${F.shell}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 9,
              fontWeight: 800,
              color: "#fff",
              padding: "0 3px",
              lineHeight: 1,
            }}
          >
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div
            style={{ position: "fixed", inset: 0, zIndex: 148 }}
            onClick={() => setOpen(false)}
          />
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "calc(100% + 10px)",
              width: 380,
              background: F.card,
              border: `1px solid ${F.border}`,
              borderRadius: 10,
              boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
              zIndex: 149,
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "16px 18px 12px",
                borderBottom: `1px solid ${F.border}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: 2,
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 700, color: F.text1 }}>
                  Notifications ({notifs.length})
                </span>
                {unread > 0 && (
                  <span
                    style={{ fontSize: 12, color: F.brand, fontWeight: 600 }}
                  >
                    {unread} unread
                  </span>
                )}
              </div>
              {/* Action buttons */}
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button
                  onClick={markAllRead}
                  style={{
                    flex: 1,
                    padding: "7px 0",
                    background: F.infoBg,
                    border: `1px solid ${F.brand}30`,
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 600,
                    color: F.brand,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    fontFamily: "inherit",
                  }}
                >
                  Mark all read
                </button>
                <button
                  onClick={clearAll}
                  style={{
                    flex: 1,
                    padding: "7px 0",
                    background: F.errorBg,
                    border: `1px solid ${F.error}30`,
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 600,
                    color: F.error,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    fontFamily: "inherit",
                  }}
                >
                  Clear notifications
                </button>
              </div>
            </div>

            {/* List */}
            <div style={{ maxHeight: 360, overflowY: "auto" }}>
              {notifs.length === 0 && (
                <div
                  style={{
                    padding: "36px 18px",
                    textAlign: "center",
                    color: F.text3,
                    fontSize: 13,
                  }}
                >
                  No notifications
                </div>
              )}
              {notifs.map((n, i) => {
                const col = moduleColor[n.module] ?? F.brand
                return (
                  <div
                    key={n.id}
                    onClick={() => openNotification(n)}
                    style={{
                      display: "flex",
                      gap: 12,
                      padding: "14px 18px",
                      borderBottom:
                        i < notifs.length - 1
                          ? `1px solid ${F.border}`
                          : "none",
                      background: n.read ? "transparent" : F.infoBg,
                      cursor: "pointer",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = n.read
                        ? F.pageBg
                        : `${F.brand}10`)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = n.read
                        ? "transparent"
                        : F.infoBg)
                    }
                  >
                    {/* Module icon circle */}
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        background: `${col}18`,
                        border: `1.5px solid ${col}40`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: col,
                        flexShrink: 0,
                        marginTop: 1,
                      }}
                    >
                      <span style={{ fontSize: 10, fontWeight: 900 }}>
                        {n.module.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 13,
                          color: F.text1,
                          lineHeight: 1.5,
                          fontWeight: n.read ? 400 : 500,
                        }}
                      >
                        {n.msg}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          marginTop: 5,
                        }}
                      >
                        <span style={{ fontSize: 11, color: F.text3 }}>
                          {n.time}
                        </span>
                        {!n.read && (
                          <span
                            style={{
                              width: 7,
                              height: 7,
                              borderRadius: "50%",
                              background: F.brand,
                              display: "inline-block",
                              flexShrink: 0,
                            }}
                          />
                        )}
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 600,
                            color: col,
                            background: `${col}15`,
                            padding: "1px 6px",
                            borderRadius: 4,
                          }}
                        >
                          {n.module}
                        </span>
                      </div>
                    </div>
                    {/* Dismiss */}
                    <button
                      onClick={(e) => dismiss(n.id, e)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: F.text3,
                        padding: "2px 4px",
                        borderRadius: 4,
                        flexShrink: 0,
                        alignSelf: "flex-start",
                        marginTop: 2,
                        lineHeight: 1,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = F.errorBg
                        e.currentTarget.style.color = F.error
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "none"
                        e.currentTarget.style.color = F.text3
                      }}
                    >
                      ×
                    </button>
                  </div>
                )
              })}
            </div>

            {/* Footer */}
            {notifs.length > 0 && (
              <div
                style={{
                  padding: "10px 18px",
                  borderTop: `1px solid ${F.border}`,
                  textAlign: "center",
                }}
              >
                <button
                  onClick={() => {
                    setOpen(false)
                    setShowAll(true)
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 12,
                    color: F.brand,
                    fontWeight: 600,
                    fontFamily: "inherit",
                  }}
                >
                  View all notifications →
                </button>
              </div>
            )}
          </div>
        </>
      )}
      {showAll && (
        <Modal title={`All Notifications (${notifs.length})`} onClose={() => setShowAll(false)} wide>
          <div style={{ maxHeight: 520, overflowY: "auto" }}>
            {notifs.length === 0 ? (
              <div style={{ padding: 36, textAlign: "center", color: F.text3 }}>No notifications</div>
            ) : notifs.map((n) => (
              <div key={n.id} onClick={() => openNotification(n)} style={{ display: "flex", gap: 12, padding: "14px 4px", borderBottom: `1px solid ${F.border}`, background: n.read ? "transparent" : F.infoBg, cursor: "pointer" }}>
                <div style={{ color: moduleColor[n.module] ?? F.brand, flexShrink: 0 }}>{moduleIcon[n.module]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: F.text1 }}>{n.msg}</div>
                  <div style={{ fontSize: 11, color: F.text3, marginTop: 5 }}>{n.time}</div>
                </div>
                {!n.read && <Badge label="Unread" color={F.brand} bg={F.infoBg} />}
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  )
}

function ProfileMenu({
  persona,
  onProfile,
  personaUser,
  personaRole,
  personaInit,
  showToast,
  onSignOut,
}: {
  persona: Persona
  onProfile: () => void
  personaUser: Record<Persona, string>
  personaRole: Record<Persona, string>
  personaInit: Record<Persona, string>
  showToast: (msg: string, type?: ToastType) => void
  onSignOut?: () => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="sap-profile-menu"
      style={{
        position: "relative",
        paddingLeft: 10,
        borderLeft: "1px solid rgba(255,255,255,0.15)",
      }}
    >
      <button
        className="sap-profile-trigger"
        onClick={() => setOpen(!open)}
        title="Open profile menu"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "4px 6px",
          borderRadius: 4,
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(255,255,255,0.08)")
        }
        onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: F.brand,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 800,
            color: "#fff",
            flexShrink: 0,
          }}
        >
          {personaInit[persona]}
        </div>
        <div style={{ textAlign: "left" }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#fff",
              lineHeight: 1.2,
            }}
          >
            {personaUser[persona]}
          </div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>
            {personaRole[persona]}
          </div>
        </div>
        <span
          aria-hidden="true"
          style={{
            width: 7,
            height: 7,
            borderRight: "1.5px solid rgba(255,255,255,0.5)",
            borderBottom: "1.5px solid rgba(255,255,255,0.5)",
            transform: open ? "rotate(225deg)" : "rotate(45deg)",
            transition: "transform 0.15s ease",
            marginLeft: 2,
            marginTop: open ? 3 : -3,
          }}
        />
      </button>
      {open && (
        <>
          <div
            style={{ position: "fixed", inset: 0, zIndex: 149 }}
            onClick={() => setOpen(false)}
          />
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "calc(100% + 8px)",
              width: 240,
              background: F.card,
              border: `1px solid ${F.border}`,
              borderRadius: 6,
              boxShadow: "0 8px 24px rgba(0,0,0,0.16)",
              zIndex: 150,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "14px 16px",
                background: "#1D2D3E",
                borderBottom: `1px solid rgba(255,255,255,0.1)`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: F.brand,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 800,
                    color: "#fff",
                  }}
                >
                  {personaInit[persona]}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>
                    {personaUser[persona]}
                  </div>
                  <div
                    style={{ fontSize: 11, color: "rgba(255,255,255,0.55)" }}
                  >
                    {personaRole[persona]}
                  </div>
                </div>
              </div>
            </div>
            <div style={{ padding: "6px 0" }}>
              <button
                onClick={() => {
                  setOpen(false)
                  onProfile()
                }}
                title="Open my profile"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: "9px 16px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  textAlign: "left",
                  color: F.text1,
                  fontSize: 13,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = F.highlight)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <span>My Profile</span>
              </button>
            </div>
            <div
              style={{ borderTop: `1px solid ${F.border}`, padding: "6px 0" }}
            >
              <button
                onClick={() => {
                  showToast("Logged out successfully", "info")
                  setOpen(false)
                  onSignOut?.()
                }}
                title="Sign out"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  width: "100%",
                  padding: "9px 16px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  color: F.error,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = F.errorBg)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <span style={{ fontSize: 13, fontWeight: 500 }}>Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function NavIcon({ id }: { id: string }) {
  const s = { width: 16, height: 16, flexShrink: 0 } as React.CSSProperties
  const p = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  }
  if (id === "dashboard")
    return (
      <svg style={s} viewBox="0 0 24 24" {...p}>
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    )
  if (id === "employees")
    return (
      <svg style={s} viewBox="0 0 24 24" {...p}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )
  if (id === "salary")
    return (
      <svg style={s} viewBox="0 0 24 24" {...p}>
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    )
  if (id === "payruns")
    return (
      <svg style={s} viewBox="0 0 24 24" {...p}>
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    )
  if (id === "payslips")
    return (
      <svg style={s} viewBox="0 0 24 24" {...p}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    )
  if (id === "reports")
    return (
      <svg style={s} viewBox="0 0 24 24" {...p}>
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    )
  if (id === "analytics")
    return (
      <svg style={s} viewBox="0 0 24 24" {...p}>
        <path d="M3 3v18h18" />
        <rect x="7" y="12" width="3" height="5" />
        <rect x="12" y="8" width="3" height="9" />
        <rect x="17" y="5" width="3" height="12" />
      </svg>
    )
  if (id === "access")
    return (
      <svg style={s} viewBox="0 0 24 24" {...p}>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    )
  if (id === "audit")
    return (
      <svg style={s} viewBox="0 0 24 24" {...p}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    )
  if (id === "orgs")
    return (
      <svg style={s} viewBox="0 0 24 24" {...p}>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    )
  if (id === "documents")
    return (
      <svg style={s} viewBox="0 0 24 24" {...p}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
      </svg>
    )
  if (id === "financial")
    return (
      <svg style={s} viewBox="0 0 24 24" {...p}>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
        <line x1="6" y1="15" x2="10" y2="15" />
      </svg>
    )
  if (id === "profile")
    return (
      <svg style={s} viewBox="0 0 24 24" {...p}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    )
  return (
    <svg style={s} viewBox="0 0 24 24" {...p}>
      <circle cx="12" cy="12" r="10" />
    </svg>
  )
}

const ORG_NAV = [
  { id: "dashboard", label: "Dashboard" },
  { id: "employees", label: "Employees" },
  { id: "salary", label: "Salary Management" },
  { id: "payruns", label: "Payroll / Pay Runs" },
  { id: "payslips", label: "Payslips" },
  { id: "documents", label: "Documents" },
  { id: "reports", label: "Reports" },
  { id: "access", label: "Access Management" },
  { id: "audit", label: "Audit History" },
]
const PROD_NAV = [
  { id: "dashboard", label: "Dashboard" },
  { id: "orgs", label: "Organizations" },
  { id: "access", label: "Access Management" },
  { id: "audit", label: "Audit History" },
]
const EMP_NAV = [
  { id: "dashboard", label: "Dashboard" },
  { id: "salary", label: "My Salary" },
  { id: "payruns", label: "Payroll History" },
  { id: "payslips", label: "My Payslips" },
  { id: "documents", label: "Documents" },
  { id: "financial", label: "Financial Data" },
]
const MY_EMP_ID = "EMP-001"
function navLabelForView(id: string) {
  return (
    [...ORG_NAV, ...PROD_NAV, ...EMP_NAV].find((item) => item.id === id)?.label ??
    id
  )
}

// Employee data access boundary. Every employee view derives its data from this
// identity; a route/query parameter can never select a different employee.
function ownPayruns(payruns: Payrun[], employeeId: string) {
  return payruns.filter((run) =>
    run.rows.some((row) => row.empId === employeeId),
  )
}

function employeeRows(emp: Employee, payruns: Payrun[]) {
  return ownPayruns(payruns, emp.id)
    .map((run) => ({
      run,
      row: run.rows.find((item) => item.empId === emp.id),
    }))
    .filter((item): item is { run: Payrun row: PayrunInputRow } =>
      Boolean(item.row),
    )
    .sort((a, b) =>
      a.run.year !== b.run.year
        ? a.run.year - b.run.year
        : a.run.month - b.run.month,
    )
}

function EmployeeMetricCard({
  label,
  value,
  sub,
  accent,
  badgeText,
  badgeBg,
  badgeColor,
  icon,
  progress,
  onClick,
}: {
  label: string
  value: string
  sub: string
  accent: string
  badgeText?: string
  badgeBg?: string
  badgeColor?: string
  icon?: string
  progress?: number
  onClick?: () => void
}) {
  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                onClick()
              }
            }
          : undefined
      }
      onMouseEnter={
        onClick
          ? (e) => {
              e.currentTarget.style.transform = "translateY(-3px)"
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.08)"
            }
          : undefined
      }
      onMouseLeave={
        onClick
          ? (e) => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"
            }
          : undefined
      }
      style={{
        background: F.card,
        border: `1px solid ${F.border}`,
        borderRadius: 8,
        padding: "18px 20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        cursor: onClick ? "pointer" : "default",
        transition: "box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease",
        userSelect: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: accent,
        }}
      />
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <span
            style={{
              color: F.text2,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {label}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {badgeText && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: 12,
                  background: badgeBg || F.pageBg,
                  color: badgeColor || F.text2,
                  border: `1px solid ${accent}25`,
                }}
              >
                {badgeText}
              </span>
            )}
            {onClick && (
              <span
                style={{
                  fontSize: 12,
                  color: accent,
                  fontWeight: 800,
                  opacity: 0.8,
                }}
              >
                &rarr;
              </span>
            )}
          </div>
        </div>
        <div
          style={{
            color: F.text1,
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
          }}
        >
          {value}
        </div>
      </div>
      <div style={{ marginTop: 12 }}>
        <div style={{ color: F.text2, fontSize: 12, lineHeight: 1.4 }}>{sub}</div>
        {typeof progress === "number" && (
          <div
            style={{
              marginTop: 10,
              height: 4,
              borderRadius: 2,
              background: F.pageBg,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${Math.min(100, Math.max(0, progress))}%`,
                height: "100%",
                background: accent,
                borderRadius: 2,
                transition: "width 0.6s ease",
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function useDelayedLoad(ms = 350) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setReady(true), ms)
    return () => clearTimeout(t)
  }, [ms])
  return ready
}

function SkeletonCard({ height = 104 }: { height?: number }) {
  return (
    <div
      style={{
        height,
        background: F.card,
        border: `1px solid ${F.border}`,
        borderRadius: 8,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          height: "100%",
          width: "100%",
          background: `linear-gradient(90deg, ${F.pageBg} 0%, #E9ECEF 50%, ${F.pageBg} 100%)`,
          backgroundSize: "200% 100%",
          animation: "dashShimmer 1.5s infinite",
        }}
      />
    </div>
  )
}

function AnalyticsDonutChart({
  segments,
  size = 170,
  strokeWidth = 28,
  valueFormatter = inr,
  centerLabel = "Total Gross",
}: {
  segments: { label: string; value: number; color: string }[]
  size?: number
  strokeWidth?: number
  valueFormatter?: (value: number) => string
  centerLabel?: string
}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const total = segments.reduce((s, seg) => s + seg.value, 0)

  if (total === 0) {
    return (
      <div
        style={{
          color: F.text3,
          fontSize: 13,
          padding: 30,
          textAlign: "center",
        }}
      >
        No breakdown data available for this period
      </div>
    )
  }

  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const center = size / 2

  let accumulated = 0
  const activeSeg = hoveredIdx !== null ? segments[hoveredIdx] : null

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        flexWrap: "wrap",
        padding: "8px 0",
      }}
    >
      {/* SVG Chart */}
      <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
        <svg
          width={size}
          height={size}
          style={{ transform: "rotate(-90deg)", overflow: "visible" }}
        >
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={F.pageBg}
            strokeWidth={strokeWidth}
          />
          {segments.map((seg, i) => {
            const pct = seg.value / total
            const dashLen = pct * circumference
            const offset = -(accumulated / total) * circumference
            accumulated += seg.value
            const isHovered = hoveredIdx === i

            return (
              <circle
                key={seg.label}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={`${Math.max(0, dashLen - 2)} ${circumference - Math.max(0, dashLen - 2)}`}
                strokeDashoffset={offset}
                strokeLinecap="round"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  cursor: "pointer",
                  transition: "stroke-width 0.2s ease, opacity 0.2s ease",
                  opacity: hoveredIdx !== null && !isHovered ? 0.45 : 1,
                }}
              />
            )
          })}
        </svg>

        {/* Center label */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: size,
            height: size,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            textAlign: "center",
            padding: 10,
          }}
        >
          {activeSeg ? (
            <>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: F.text2,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                {activeSeg.label}
              </div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: F.text1,
                  marginTop: 2,
                }}
              >
                {valueFormatter(activeSeg.value)}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: activeSeg.color,
                  fontWeight: 700,
                }}
              >
                {Math.round((activeSeg.value / total) * 100)}%
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: F.text2,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                {centerLabel}
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: F.text1,
                  marginTop: 2,
                }}
              >
                {valueFormatter(total)}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: F.text3,
                  marginTop: 1,
                }}
              >
                100%
              </div>
            </>
          )}
        </div>
      </div>

      {/* Legend list */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          flex: 1,
          minWidth: 160,
        }}
      >
        {segments.map((seg, i) => {
          const isHovered = hoveredIdx === i
          const pct = Math.round((seg.value / total) * 100)
          return (
            <div
              key={seg.label}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "6px 10px",
                borderRadius: 6,
                background: isHovered ? F.pageBg : "transparent",
                cursor: "pointer",
                transition: "background 0.15s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 3,
                    background: seg.color,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: isHovered ? 700 : 500,
                    color: isHovered ? F.text1 : F.text2,
                  }}
                >
                  {seg.label}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: F.text1,
                  }}
                >
                  {valueFormatter(seg.value)}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: F.text3,
                    minWidth: 32,
                    textAlign: "right",
                  }}
                >
                  {pct}%
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ProductAdminBarChart({
  data,
  valueLabel = (value) => String(value),
}: {
  data: { label: string; sub?: string; value: number; color?: string }[]
  valueLabel?: (value: number) => string
}) {
  const max = Math.max(...data.map((item) => item.value), 1)
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {data.map((item) => {
        const pct = Math.round((item.value / max) * 100)
        return (
          <div key={item.label}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                alignItems: "baseline",
                marginBottom: 5,
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: F.text1 }}>
                  {item.label}
                </div>
                {item.sub && (
                  <div style={{ marginTop: 1, fontSize: 11, color: F.text3 }}>
                    {item.sub}
                  </div>
                )}
              </div>
              <div style={{ fontSize: 12, fontWeight: 900, color: F.text1 }}>
                {valueLabel(item.value)}
              </div>
            </div>
            <div style={{ height: 10, borderRadius: 999, background: F.pageBg, overflow: "hidden" }}>
              <div
                style={{
                  width: `${pct}%`,
                  height: "100%",
                  borderRadius: 999,
                  background: item.color ?? F.brand,
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ProductAdminLineChart({
  data,
  color = F.brand,
  suffix = "",
}: {
  data: { label: string; value: number }[]
  color?: string
  suffix?: string
}) {
  const width = 520
  const height = 190
  const padX = 34
  const padY = 24
  const max = Math.max(...data.map((item) => item.value), 1)
  const min = Math.min(...data.map((item) => item.value), 0)
  const range = Math.max(max - min, 1)
  const points = data.map((item, index) => {
    const x = padX + (index / Math.max(data.length - 1, 1)) * (width - padX * 2)
    const y = height - padY - ((item.value - min) / range) * (height - padY * 2)
    return { ...item, x, y }
  })
  const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ")
  const area = `${path} L ${points[points.length - 1]?.x ?? padX} ${height - padY} L ${padX} ${height - padY} Z`

  return (
    <div>
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ display: "block" }}>
        {[0, 0.5, 1].map((tick) => {
          const y = padY + tick * (height - padY * 2)
          return (
            <line
              key={tick}
              x1={padX}
              x2={width - padX}
              y1={y}
              y2={y}
              stroke={F.border}
              strokeDasharray="4 4"
            />
          )
        })}
        <path d={area} fill={color} opacity="0.08" />
        <path d={path} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((point) => (
          <g key={point.label}>
            <circle cx={point.x} cy={point.y} r="4.5" fill={F.card} stroke={color} strokeWidth="3" />
            <text x={point.x} y={point.y - 11} textAnchor="middle" fontSize="10" fontWeight="700" fill={F.text2}>
              {point.value}{suffix}
            </text>
          </g>
        ))}
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "0 24px", fontSize: 11, color: F.text3, fontWeight: 700 }}>
        {data.map((item) => (
          <span key={item.label}>{item.label}</span>
        ))}
      </div>
    </div>
  )
}

function DualBarTrendChart({
  data,
}: {
  data: {
    period: string
    gross: number
    deductions: number
    net: number
    status: string
  }[]
}) {
  const [viewMode, setViewMode] = useState<"both" | "net" | "gross">("both")
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  if (data.length === 0) {
    return (
      <div
        style={{
          color: F.text3,
          fontSize: 13,
          padding: 40,
          textAlign: "center",
        }}
      >
        No payroll trend data available
      </div>
    )
  }

  const maxVal = Math.max(
    ...data.map((d) => (viewMode === "net" ? d.net : d.gross)),
    50000,
  )
  const chartH = 180
  const yTicks = [
    maxVal,
    Math.round((maxVal * 0.75) / 1000) * 1000,
    Math.round((maxVal * 0.5) / 1000) * 1000,
    Math.round((maxVal * 0.25) / 1000) * 1000,
    0,
  ]

  return (
    <div>
      {/* Header controls & legend */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        {/* Legend */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {(viewMode === "both" || viewMode === "gross") && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  background: "#93C5FD",
                }}
              />
              <span style={{ fontSize: 12, color: F.text2, fontWeight: 500 }}>
                Gross Salary
              </span>
            </div>
          )}
          {(viewMode === "both" || viewMode === "net") && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  background: F.brand,
                }}
              />
              <span style={{ fontSize: 12, color: F.text2, fontWeight: 500 }}>
                Net Pay (Take-Home)
              </span>
            </div>
          )}
        </div>

        {/* View mode toggle button pills */}
        <div
          style={{
            display: "inline-flex",
            background: F.pageBg,
            padding: 2,
            borderRadius: 6,
            border: `1px solid ${F.border}`,
          }}
        >
          {(
            [
              ["both", "Combined"],
              ["net", "Net Pay"],
              ["gross", "Gross Pay"],
            ] as const
          ).map(([key, title]) => {
            const active = viewMode === key
            return (
              <button
                key={key}
                onClick={() => setViewMode(key)}
                style={{
                  padding: "4px 10px",
                  fontSize: 11,
                  fontWeight: active ? 700 : 500,
                  background: active ? F.card : "transparent",
                  color: active ? F.brand : F.text2,
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  boxShadow: active ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
                  transition: "all 0.15s ease",
                }}
              >
                {title}
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Chart Canvas with Y-axis and Bars */}
      <div style={{ display: "flex", gap: 8, height: chartH + 34, position: "relative" }}>
        {/* Y-axis labels */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: chartH,
            paddingRight: 6,
            minWidth: 46,
            textAlign: "right",
          }}
        >
          {yTicks.map((val, idx) => (
            <span
              key={idx}
              style={{
                fontSize: 10,
                color: F.text3,
                lineHeight: 1,
              }}
            >
              {val >= 1000 ? `₹${Math.round(val / 1000)}k` : `₹${val}`}
            </span>
          ))}
        </div>

        {/* Bars Container */}
        <div
          style={{
            flex: 1,
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Horizontal Gridlines */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: chartH,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              pointerEvents: "none",
            }}
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  borderBottom: `1px ${i === 4 ? "solid" : "dashed"} ${F.border}`,
                  width: "100%",
                }}
              />
            ))}
          </div>

          {/* Bar Columns */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 8,
              height: chartH,
              position: "relative",
              zIndex: 1,
            }}
          >
            {data.map((d, i) => {
              const grossH = Math.max(6, (d.gross / maxVal) * chartH)
              const netH = Math.max(6, (d.net / maxVal) * chartH)
              const isHovered = hoveredIdx === i

              return (
                <div
                  key={d.period}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    height: "100%",
                    justifyContent: "flex-end",
                    cursor: "pointer",
                    position: "relative",
                  }}
                >
                  {/* Floating tooltip on hover */}
                  {isHovered && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: Math.max(grossH, netH) + 12,
                        background: "#1E293B",
                        color: "#FFFFFF",
                        padding: "8px 12px",
                        borderRadius: 6,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.18)",
                        fontSize: 11,
                        whiteSpace: "nowrap",
                        zIndex: 20,
                        pointerEvents: "none",
                        lineHeight: 1.4,
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 12,
                          marginBottom: 3,
                          color: "#F8FAFC",
                        }}
                      >
                        {d.period} ({d.status})
                      </div>
                      <div style={{ color: "#94A3B8" }}>
                        Gross:{" "}
                        <strong style={{ color: "#93C5FD" }}>
                          {inr(d.gross)}
                        </strong>
                      </div>
                      <div style={{ color: "#94A3B8" }}>
                        Deductions:{" "}
                        <strong style={{ color: "#FCA5A5" }}>
                          {inr(d.deductions)}
                        </strong>
                      </div>
                      <div
                        style={{
                          color: "#94A3B8",
                          borderTop: "1px solid #334155",
                          paddingTop: 3,
                          marginTop: 3,
                        }}
                      >
                        Net Take-Home:{" "}
                        <strong style={{ color: "#4ADE80" }}>
                          {inr(d.net)}
                        </strong>
                      </div>
                    </div>
                  )}

                  {/* Bars */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      gap: 3,
                      width: "100%",
                      maxWidth: viewMode === "both" ? 44 : 26,
                      justifyContent: "center",
                    }}
                  >
                    {(viewMode === "both" || viewMode === "gross") && (
                      <div
                        style={{
                          flex: 1,
                          height: grossH,
                          background: isHovered
                            ? "#60A5FA"
                            : "linear-gradient(180deg, #93C5FD 0%, #60A5FA 100%)",
                          borderRadius: "4px 4px 0 0",
                          transition: "height 0.4s ease, background 0.2s ease",
                        }}
                      />
                    )}
                    {(viewMode === "both" || viewMode === "net") && (
                      <div
                        style={{
                          flex: 1,
                          height: netH,
                          background: isHovered
                            ? F.brandHover
                            : `linear-gradient(180deg, ${F.brand} 0%, ${F.brandHover} 100%)`,
                          borderRadius: "4px 4px 0 0",
                          transition: "height 0.4s ease, background 0.2s ease",
                        }}
                      />
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* X-axis labels */}
          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 8,
              height: 20,
            }}
          >
            {data.map((d, i) => {
              const parts = d.period.split(" ")
              const shortLabel = parts[0]?.slice(0, 3) || d.period
              const isHovered = hoveredIdx === i

              return (
                <div
                  key={d.period}
                  style={{
                    flex: 1,
                    textAlign: "center",
                    fontSize: 10,
                    fontWeight: isHovered ? 700 : 500,
                    color: isHovered ? F.brand : F.text2,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {shortLabel}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function SalaryDistributionBar({
  structure,
}: {
  structure?: SalaryStructure
}) {
  if (!structure) {
    return (
      <div style={{ color: F.text3, fontSize: 12, padding: 10 }}>
        No salary structure linked
      </div>
    )
  }

  const components = [
    { label: "Basic Pay", value: Number(structure.basic), color: F.brand },
    { label: "HRA", value: Number(structure.hra), color: "#00A389" },
    {
      label: "Fixed Allowance",
      value: Number(structure.fixedAllowance),
      color: "#F59E0B",
    },
    {
      label: "Special Allowance",
      value: Number(structure.specialAllowance),
      color: "#8B5CF6",
    },
  ]

  const total = components.reduce((s, c) => s + c.value, 0)
  if (total === 0) return null

  return (
    <div>
      {/* Horizontal stacked progress bar */}
      <div
        style={{
          display: "flex",
          height: 10,
          borderRadius: 6,
          overflow: "hidden",
          background: F.pageBg,
          gap: 2,
        }}
      >
        {components.map((c) => {
          const pct = (c.value / total) * 100
          return (
            <div
              key={c.label}
              style={{
                width: `${pct}%`,
                background: c.color,
                transition: "width 0.5s ease",
              }}
              title={`${c.label}: ${inr(c.value)} (${Math.round(pct)}%)`}
            />
          )
        })}
      </div>

      {/* Aligned items below */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px 16px",
          marginTop: 14,
        }}
      >
        {components.map((c) => {
          const pct = Math.round((c.value / total) * 100)
          return (
            <div
              key={c.label}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: c.color,
                  }}
                />
                <span style={{ color: F.text2 }}>{c.label}</span>
              </div>
              <div style={{ fontWeight: 700, color: F.text1 }}>
                {inr(c.value)}{" "}
                <span style={{ color: F.text3, fontSize: 10, fontWeight: 500 }}>
                  ({pct}%)
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function EmployeeDashboardView({
  emp,
  payruns,
  structures,
  onNav,
}: {
  emp: Employee
  payruns: Payrun[]
  structures: SalaryStructure[]
  onNav: (view: string) => void
}) {
  const ready = useDelayedLoad(350)
  const { text: greeting, icon: greetingIcon } = getTimeGreeting()
  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
  const rows = employeeRows(emp, payruns)
  const completed = rows.filter((item) => isFinalizedPayrun(item.run.status))
  const latestCompleted = completed[completed.length - 1] ?? rows[rows.length - 1]
  const salary = structures.find((item) => item.name === emp.salaryStructure)

  // Financial year scope (April–March)
  const now = new Date()
  const fyStartYear =
    now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1
  const isFY = (run: Payrun) =>
    (run.year === fyStartYear && run.month >= 4) ||
    (run.year === fyStartYear + 1 && run.month <= 3)
  const fyRows = rows.filter(
    (item) => isFY(item.run) && isFinalizedPayrun(item.run.status),
  )

  // YTD calculations
  const ytdGross = fyRows.reduce(
    (sum, item) => sum + item.row.totalEarnings,
    0,
  )
  const ytdDeductions = fyRows.reduce(
    (sum, item) => sum + item.row.totalDeductions,
    0,
  )
  const ytdNet = fyRows.reduce((sum, item) => sum + item.row.netSalary, 0)
  const ytdLopDays = fyRows.reduce((sum, item) => sum + item.row.lopDays, 0)
  const ytdLopAmount = fyRows.reduce(
    (sum, item) => sum + item.row.lopDeduction,
    0,
  )

  // Trend dataset (Last 12 months)
  const trendData = rows.slice(-12).map(({ run, row }) => ({
    period: run.period,
    gross: row.totalEarnings,
    deductions: row.totalDeductions,
    net: row.netSalary,
    status: run.status,
  }))

  // Donut chart segments for latest completed payslip
  const donutSegments = latestCompleted
    ? [
        {
          label: "Take-Home Net",
          value: latestCompleted.row.netSalary,
          color: F.success,
        },
        { label: "Provident Fund", value: latestCompleted.row.pf, color: F.brand },
        { label: "Income Tax (TDS)", value: latestCompleted.row.tds, color: F.warning },
        {
          label: "Professional Tax",
          value: latestCompleted.row.profTax,
          color: "#8B5CF6",
        },
        ...(latestCompleted.row.esi > 0
          ? [{ label: "ESI Deduction", value: latestCompleted.row.esi, color: "#64748B" }]
          : []),
        ...(latestCompleted.row.lopDeduction > 0
          ? [
              {
                label: "LOP Deduction",
                value: latestCompleted.row.lopDeduction,
                color: F.error,
              },
            ]
          : []),
      ]
    : []

  // Recent payroll status
  const recentPayruns = rows.slice().reverse().slice(0, 3)

  const cardStyle: React.CSSProperties = {
    background: F.card,
    border: `1px solid ${F.border}`,
    borderRadius: 8,
    padding: "20px 22px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
  }

  const deductionRatio = ytdGross > 0 ? Math.round((ytdDeductions / ytdGross) * 100) : 0
  const takeHomeRatio = ytdGross > 0 ? Math.round((ytdNet / ytdGross) * 100) : 0

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* ── Top Header Profile & Status Banner ── */}
      <div
        style={{
          background: F.card,
          border: `1px solid ${F.border}`,
          borderRadius: 8,
          padding: "20px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 20,
          flexWrap: "wrap",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${F.brand}, #0854A0)`,
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              fontWeight: 800,
              boxShadow: "0 2px 8px rgba(0,112,242,0.25)",
            }}
          >
            {emp.name
              .split(" ")
              .map((part) => part[0])
              .join("")}
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: F.text2,
                }}
              >
                EMPLOYEE WORKSPACE
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: F.brand,
                  background: F.infoBg,
                  padding: "2px 10px",
                  borderRadius: 12,
                }}
              >
                {todayFormatted}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>{greetingIcon}</span>
              <h1
                style={{
                  margin: 0,
                  fontSize: 24,
                  fontWeight: 800,
                  color: F.text1,
                  letterSpacing: "-0.01em",
                }}
              >
                {greeting}, <span style={{ fontWeight: 800 }}>{emp.name.split(" ")[0]}</span>
              </h1>
              <Badge
                label={emp.status}
                color={F.success}
                bg={F.successBg}
                dot={F.success}
              />
            </div>
            <div
              style={{
                marginTop: 4,
                fontSize: 13,
                color: F.text2,
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              <span>{emp.designation}</span>
              <span>&bull;</span>
              <span>{emp.department}</span>
              <span>&bull;</span>
              <span>{emp.location}</span>
              <span>&bull;</span>
              <span style={{ color: F.text3 }}>ID: {emp.id}</span>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              textAlign: "right",
              paddingRight: 12,
              borderRight: `1px solid ${F.border}`,
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: F.text3 }}>
              FINANCIAL YEAR
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: F.text1,
                marginTop: 2,
              }}
            >
              FY {fyStartYear}&ndash;{(fyStartYear + 1).toString().slice(2)}
            </div>
          </div>
          {latestCompleted && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <Btn variant="secondary" onClick={() => onNav("payslips")}>
                View Latest Payslip
              </Btn>
              <Btn
                title={`Download PDF payslip for ${latestCompleted.run.period}`}
                onClick={() => downloadPayslipPdf(latestCompleted.row, latestCompleted.run, emp)}
              >
                <DownloadIcon />
                Download PDF
              </Btn>
            </div>
          )}
        </div>
      </div>

      {/* ── KPI Metric Summary Cards Grid (4 Columns) ── */}
      {!ready ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} height={124} />
          ))}
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          <EmployeeMetricCard
            label="YTD Gross Earnings"
            value={inr(ytdGross)}
            sub={`${fyRows.length} completed payruns in FY ${fyStartYear}-${(fyStartYear + 1).toString().slice(2)}`}
            accent={F.brand}
            badgeText="Gross"
            badgeBg={F.infoBg}
            badgeColor={F.brand}
            progress={100}
            onClick={() => onNav("history")}
          />
          <EmployeeMetricCard
            label="YTD Total Deductions"
            value={inr(ytdDeductions)}
            sub={`${deductionRatio}% statutory & tax deductions from gross`}
            accent={F.warning}
            badgeText={`${deductionRatio}% Ratio`}
            badgeBg={F.warningBg}
            badgeColor={F.warning}
            progress={deductionRatio}
            onClick={() => onNav("history")}
          />
          <EmployeeMetricCard
            label="YTD Net Take-Home"
            value={inr(ytdNet)}
            sub={`${takeHomeRatio}% net realization across FY`}
            accent={F.success}
            badgeText="Take-Home"
            badgeBg={F.successBg}
            badgeColor={F.success}
            progress={takeHomeRatio}
            onClick={() => onNav("payslips")}
          />
          <EmployeeMetricCard
            label="Loss Of Pay (LOP)"
            value={`${ytdLopDays} ${ytdLopDays === 1 ? "Day" : "Days"}`}
            sub={
              ytdLopAmount > 0
                ? `${inr(ytdLopAmount)} total salary deduction`
                : "Perfect attendance record this FY"
            }
            accent={ytdLopDays > 0 ? F.error : "#00A389"}
            badgeText={ytdLopDays > 0 ? "LOP Impact" : "No Deductions"}
            badgeBg={ytdLopDays > 0 ? F.errorBg : "#E6F4EA"}
            badgeColor={ytdLopDays > 0 ? F.error : "#137333"}
            onClick={() => onNav("salary")}
          />
        </div>
      )}

      {/* ── Main Analytics Section: Dual Bar Trend + Donut Breakdown ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.45fr) minmax(320px, 0.95fr)",
          gap: 20,
        }}
      >
        {/* Left Card: Monthly Trend Bar Graph */}
        <section style={cardStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 16,
              gap: 12,
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 800,
                  color: F.text1,
                }}
              >
                Earnings & Net Pay Trend
              </h2>
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: 12,
                  color: F.text2,
                }}
              >
                Monthly Gross salary vs Net Take-Home pay over recent pay cycles
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  fontSize: 11,
                  color: F.text3,
                  fontWeight: 600,
                  background: F.pageBg,
                  padding: "3px 8px",
                  borderRadius: 4,
                }}
              >
                Last 12 Months
              </div>
              <Btn small variant="ghost" onClick={() => onNav("history")}>
                View History &rarr;
              </Btn>
            </div>
          </div>
          {!ready ? (
            <SkeletonCard height={240} />
          ) : (
            <DualBarTrendChart data={trendData} />
          )}
        </section>

        {/* Right Card: Donut / Pie Chart Breakdown */}
        <section style={cardStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 14,
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 800,
                  color: F.text1,
                }}
              >
                Period Breakdown
              </h2>
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: 12,
                  color: F.text2,
                }}
              >
                {latestCompleted?.run.period ?? "Latest cycle"} salary composition
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {latestCompleted && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: F.brand,
                    background: F.infoBg,
                    padding: "2px 8px",
                    borderRadius: 4,
                  }}
                >
                  {latestCompleted.run.period}
                </span>
              )}
              <Btn small variant="ghost" onClick={() => onNav("payslips")}>
                View Payslips &rarr;
              </Btn>
            </div>
          </div>
          {!ready ? (
            <SkeletonCard height={240} />
          ) : (
            <AnalyticsDonutChart segments={donutSegments} />
          )}
        </section>
      </div>

      {/* ── Lower Section: Recent Payslips Ledger + Right Side Cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.4fr) minmax(320px, 1fr)",
          gap: 20,
        }}
      >
        {/* Left: Recent Payslips Table */}
        <section style={cardStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 800,
                  color: F.text1,
                }}
              >
                Recent Payslips
              </h2>
              <p
                style={{
                  margin: "3px 0 0",
                  fontSize: 12,
                  color: F.text2,
                }}
              >
                Verified historical pay run receipts and net disbursements
              </p>
            </div>
            <Btn small variant="secondary" onClick={() => onNav("payslips")}>
              View All Payslips
            </Btn>
          </div>

          {!ready ? (
            <SkeletonCard height={180} />
          ) : completed.length === 0 ? (
            <div
              style={{
                color: F.text3,
                fontSize: 13,
                padding: "30px 0",
                textAlign: "center",
              }}
            >
              No completed payslips recorded yet.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  textAlign: "left",
                  fontSize: 12,
                }}
              >
                <thead>
                  <tr
                    style={{
                      borderBottom: `1px solid ${F.border}`,
                      color: F.text2,
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    <th style={{ padding: "8px 6px" }}>Period</th>
                    <th style={{ padding: "8px 6px", textAlign: "right" }}>
                      Gross
                    </th>
                    <th style={{ padding: "8px 6px", textAlign: "right" }}>
                      Deductions
                    </th>
                    <th style={{ padding: "8px 6px", textAlign: "right" }}>
                      Net Pay
                    </th>
                    <th style={{ padding: "8px 6px", textAlign: "center" }}>
                      Status
                    </th>
                    <th style={{ padding: "8px 6px", textAlign: "right" }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {completed
                    .slice()
                    .reverse()
                    .slice(0, 5)
                    .map(({ run, row }) => (
                      <tr
                        key={run.id}
                        style={{
                          borderBottom: `1px solid ${F.border}60`,
                          transition: "background 0.15s ease",
                        }}
                      >
                        <td
                          style={{
                            padding: "12px 6px",
                            fontWeight: 700,
                            color: F.text1,
                          }}
                        >
                          {run.period}
                        </td>
                        <td
                          style={{
                            padding: "12px 6px",
                            textAlign: "right",
                            color: F.text2,
                          }}
                        >
                          {inr(row.totalEarnings)}
                        </td>
                        <td
                          style={{
                            padding: "12px 6px",
                            textAlign: "right",
                            color: F.warning,
                          }}
                        >
                          {inr(row.totalDeductions)}
                        </td>
                        <td
                          style={{
                            padding: "12px 6px",
                            textAlign: "right",
                            fontWeight: 800,
                            color: F.success,
                          }}
                        >
                          {inr(row.netSalary)}
                        </td>
                        <td
                          style={{
                            padding: "12px 6px",
                            textAlign: "center",
                          }}
                        >
                          {prBadge(run.status)}
                        </td>
                        <td
                          style={{
                            padding: "12px 6px",
                            textAlign: "right",
                          }}
                        >
                          <button
                            onClick={() => downloadPayslipPdf(row, run, emp)}
                            title={`Download PDF payslip for ${run.period}`}
                            style={{
                              background: F.infoBg,
                              border: `1px solid ${F.brand}30`,
                              color: F.brand,
                              fontWeight: 700,
                              cursor: "pointer",
                              fontSize: 12,
                              padding: "6px 9px",
                              borderRadius: 4,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 5,
                            }}
                          >
                            <DownloadIcon />
                            PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Right: Salary Structure & Quick Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Salary Structure Distribution */}
          <section style={cardStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 12,
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 16,
                    fontWeight: 800,
                    color: F.text1,
                  }}
                >
                  Salary Structure
                </h2>
                <p
                  style={{
                    margin: "3px 0 0",
                    fontSize: 12,
                    color: F.text2,
                  }}
                >
                  {emp.salaryStructure}
                </p>
              </div>
              <Btn small variant="secondary" onClick={() => onNav("salary")}>
                View Breakdown
              </Btn>
            </div>

            {!ready ? (
              <SkeletonCard height={140} />
            ) : (
              <SalaryDistributionBar structure={salary} />
            )}
          </section>

          {/* Payroll Run Cycle Status Tracker */}
          <section style={cardStyle}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: F.text2,
                marginBottom: 12,
              }}
            >
              Payroll Processing Status
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {recentPayruns.map(({ run }) => (
                <div
                  key={run.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 14px",
                    background: F.pageBg,
                    borderRadius: 6,
                    border: `1px solid ${F.border}80`,
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: F.text1,
                        fontWeight: 700,
                        fontSize: 13,
                      }}
                    >
                      {run.period}
                    </div>
                    <div style={{ fontSize: 11, color: F.text3, marginTop: 2 }}>
                      Year {run.year} &bull; Month {run.month}
                    </div>
                  </div>
                  {prBadge(run.status)}
                </div>
              ))}
            </div>
          </section>

          {/* Quick Access Shortcuts */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            <button
              onClick={() => onNav("salary")}
              style={{
                background: F.card,
                border: `1px solid ${F.border}`,
                borderRadius: 8,
                padding: "14px 16px",
                textAlign: "left",
                cursor: "pointer",
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                transition: "border-color 0.2s ease, transform 0.2s ease",
              }}
            >
              <div
                style={{
                  color: F.brand,
                  fontWeight: 700,
                  fontSize: 13,
                }}
              >
                Salary Details &rarr;
              </div>
              <div style={{ color: F.text2, fontSize: 11, marginTop: 4 }}>
                Review component breakdown
              </div>
            </button>
            <button
              onClick={() => onNav("financial")}
              style={{
                background: F.card,
                border: `1px solid ${F.border}`,
                borderRadius: 8,
                padding: "14px 16px",
                textAlign: "left",
                cursor: "pointer",
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                transition: "border-color 0.2s ease, transform 0.2s ease",
              }}
            >
              <div
                style={{
                  color: F.brand,
                  fontWeight: 700,
                  fontSize: 13,
                }}
              >
                Tax & Declarations &rarr;
              </div>
              <div style={{ color: F.text2, fontSize: 11, marginTop: 4 }}>
                Regimes and proofs
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function MySalaryView({
  emp,
  structures,
  onNav,
}: {
  emp: Employee
  structures: SalaryStructure[]
  onNav?: (view: string) => void
}) {
  const [componentSearch, setComponentSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<"all" | "earnings" | "deductions">("all")
  const [componentSort, setComponentSort] = useState("name-asc")
  const [hasRunSalarySearch, setHasRunSalarySearch] = useState(false)
  const [appliedSalaryFilters, setAppliedSalaryFilters] = useState({
    componentSearch: "",
    categoryFilter: "all" as "all" | "earnings" | "deductions",
    componentSort: "name-asc",
  })
  const [viewMode, setViewMode] = useState<"monthly" | "annual">("monthly")

  const s = structures.find((item) => item.name === emp.salaryStructure)
  const multiplier = viewMode === "annual" ? 12 : 1

  // Base earnings components
  const earningsComponents = s
    ? [
        {
          name: "Basic Salary",
          category: "Fixed Earnings",
          monthly: Number(s.basic),
          annual: Number(s.basic) * 12,
          taxability: "Taxable as per Income Tax Slabs",
          color: F.brand,
        },
        {
          name: "House Rent Allowance (HRA)",
          category: "Fixed Allowance",
          monthly: Number(s.hra),
          annual: Number(s.hra) * 12,
          taxability: "Exempt u/s 10(13A) on actual rent paid (Old Regime)",
          color: "#00A389",
        },
        {
          name: "Fixed Allowance",
          category: "Supplementary Allowance",
          monthly: Number(s.fixedAllowance),
          annual: Number(s.fixedAllowance) * 12,
          taxability: "Fully Taxable",
          color: "#F59E0B",
        },
        {
          name: "Special Allowance",
          category: "Performance / Role Allowance",
          monthly: Number(s.specialAllowance),
          annual: Number(s.specialAllowance) * 12,
          taxability: "Fully Taxable",
          color: "#8B5CF6",
        },
      ]
    : []

  const totalMonthlyGross = earningsComponents.reduce((sum, c) => sum + c.monthly, 0) || emp.grossSalary
  const totalAnnualGross = totalMonthlyGross * 12

  // Statutory deductions estimate
  const pfMonthly = Math.round(Number(s?.basic || 0) * 0.12) || 7200
  const ptMonthly = 200
  const estTdsMonthly = Math.round(totalMonthlyGross * 0.08)
  const totalMonthlyDeductions = pfMonthly + ptMonthly + estTdsMonthly
  const totalAnnualDeductions = totalMonthlyDeductions * 12

  const deductionComponents = [
    {
      name: "Provident Fund (Employee PF)",
      type: "Statutory",
      monthly: pfMonthly,
      annual: pfMonthly * 12,
      act: "EPF Act, 1952 (12% of Basic)",
      note: "Deposited to EPFO member account",
    },
    {
      name: "Professional Tax (PT)",
      type: "Statutory",
      monthly: ptMonthly,
      annual: ptMonthly * 12,
      act: "State Professional Tax Act",
      note: "Standard monthly state contribution",
    },
    {
      name: "Income Tax Estimate (TDS)",
      type: "Tax Deduction",
      monthly: estTdsMonthly,
      annual: estTdsMonthly * 12,
      act: "Income Tax Act, 1961 (Sec 192)",
      note: "Projected monthly tax withholding",
    },
  ]

  // F4 Value Help list
  const f4Values = [
    "Basic Salary",
    "House Rent Allowance (HRA)",
    "Fixed Allowance",
    "Special Allowance",
    "Provident Fund (Employee PF)",
    "Professional Tax (PT)",
    "Income Tax Estimate (TDS)",
  ]

  // Filtered earnings
  const filteredEarnings = hasRunSalarySearch ? earningsComponents.filter((c) => {
    if (appliedSalaryFilters.categoryFilter === "deductions") return false
    return searchMatches(appliedSalaryFilters.componentSearch, [c.name, c.category])
  }).sort((a, b) => {
    const dir = appliedSalaryFilters.componentSort.endsWith("-desc") ? -1 : 1
    if (appliedSalaryFilters.componentSort.startsWith("amount")) {
      return (a.monthly - b.monthly) * dir
    }
    return a.name.localeCompare(b.name) * dir
  }) : []

  // Filtered deductions
  const filteredDeductions = hasRunSalarySearch ? deductionComponents.filter((d) => {
    if (appliedSalaryFilters.categoryFilter === "earnings") return false
    return searchMatches(appliedSalaryFilters.componentSearch, [d.name, d.type])
  }).sort((a, b) => {
    const dir = appliedSalaryFilters.componentSort.endsWith("-desc") ? -1 : 1
    if (appliedSalaryFilters.componentSort.startsWith("amount")) {
      return (a.monthly - b.monthly) * dir
    }
    return a.name.localeCompare(b.name) * dir
  }) : []

  const hasFilter = Boolean(
    activeSearch(appliedSalaryFilters.componentSearch) ||
      appliedSalaryFilters.categoryFilter !== "all" ||
      appliedSalaryFilters.componentSort !== "name-asc",
  )
  const applySalaryFilters = () => {
    setHasRunSalarySearch(true)
    setAppliedSalaryFilters({ componentSearch, categoryFilter, componentSort })
  }
  const clearSalaryFilters = () => {
    setHasRunSalarySearch(false)
    setComponentSearch("")
    setCategoryFilter("all")
    setComponentSort("name-asc")
    setAppliedSalaryFilters({
      componentSearch: "",
      categoryFilter: "all",
      componentSort: "name-asc",
    })
  }
  const estMonthlyTakeHome = totalMonthlyGross - totalMonthlyDeductions
  const estAnnualTakeHome = totalAnnualGross - totalAnnualDeductions

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* ── Page Header ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 24,
              fontWeight: 800,
              color: F.text1,
              letterSpacing: "-0.01em",
            }}
          >
            My Salary & Compensation
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: F.text2 }}>
            Current structure: <strong>{emp.salaryStructure}</strong> &bull; Employment: {emp.empType}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {/* Monthly / Annual CTC Toggle */}
          <div
            style={{
              display: "inline-flex",
              background: F.pageBg,
              padding: 2,
              borderRadius: 6,
              border: `1px solid ${F.border}`,
            }}
          >
            <button
              onClick={() => setViewMode("monthly")}
              style={{
                padding: "6px 14px",
                fontSize: 12,
                fontWeight: viewMode === "monthly" ? 700 : 500,
                background: viewMode === "monthly" ? F.card : "transparent",
                color: viewMode === "monthly" ? F.brand : F.text2,
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                boxShadow: viewMode === "monthly" ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.15s ease",
              }}
            >
              Monthly Breakdown
            </button>
            <button
              onClick={() => setViewMode("annual")}
              style={{
                padding: "6px 14px",
                fontSize: 12,
                fontWeight: viewMode === "annual" ? 700 : 500,
                background: viewMode === "annual" ? F.card : "transparent",
                color: viewMode === "annual" ? F.brand : F.text2,
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                boxShadow: viewMode === "annual" ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.15s ease",
              }}
            >
              Annualized (CTC)
            </button>
          </div>
        </div>
      </div>

      {/* ── 4 KPI Summary Cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        <EmployeeMetricCard
          label={viewMode === "annual" ? "Annual Gross CTC" : "Monthly Gross Salary"}
          value={inr(viewMode === "annual" ? totalAnnualGross : totalMonthlyGross)}
          sub="Fixed gross remuneration before statutory deductions"
          accent={F.brand}
          badgeText={viewMode === "annual" ? "Annual" : "Monthly"}
          badgeBg={F.infoBg}
          badgeColor={F.brand}
          progress={100}
        />
        <EmployeeMetricCard
          label={viewMode === "annual" ? "Est. Annual Deductions" : "Est. Monthly Deductions"}
          value={inr(viewMode === "annual" ? totalAnnualDeductions : totalMonthlyDeductions)}
          sub="Includes EPF (12%), Professional Tax & TDS withholding"
          accent={F.warning}
          badgeText="Statutory"
          badgeBg={F.warningBg}
          badgeColor={F.warning}
          progress={Math.round((totalMonthlyDeductions / totalMonthlyGross) * 100)}
        />
        <EmployeeMetricCard
          label={viewMode === "annual" ? "Est. Annual Take-Home" : "Est. Net Take-Home"}
          value={inr(viewMode === "annual" ? estAnnualTakeHome : estMonthlyTakeHome)}
          sub="Projected net realization credited to salary account"
          accent={F.success}
          badgeText="In-Hand"
          badgeBg={F.successBg}
          badgeColor={F.success}
          progress={Math.round((estMonthlyTakeHome / totalMonthlyGross) * 100)}
        />
        <EmployeeMetricCard
          label="Tax Regime Preference"
          value="New Regime"
          sub="Income Tax Sec 115BAC with Standard Deduction"
          accent="#8B5CF6"
          badgeText="Active"
          badgeBg="#F5F3FF"
          badgeColor="#7C3AED"
        />
      </div>

      {/* ── Visual Salary Proportional Distribution Bar ── */}
      <div
        style={{
          background: F.card,
          border: `1px solid ${F.border}`,
          borderRadius: 8,
          padding: "20px 22px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: F.text2,
            }}
          >
            Component Distribution Overview
          </span>
          <span style={{ fontSize: 12, color: F.text3 }}>
            Total Remuneration: {inr(viewMode === "annual" ? totalAnnualGross : totalMonthlyGross)}
          </span>
        </div>
        <SalaryDistributionBar structure={s} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 10,
            marginTop: 16,
          }}
        >
          {earningsComponents.map((component) => {
            const amount = viewMode === "annual" ? component.annual : component.monthly
            const pct = Math.round((component.monthly / totalMonthlyGross) * 100)
            return (
              <div
                key={component.name}
                style={{
                  border: `1px solid ${F.border}`,
                  borderLeft: `4px solid ${component.color}`,
                  borderRadius: 6,
                  padding: "12px 14px",
                  background: "#FFFFFF",
                  minHeight: 86,
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 900, color: F.text1 }}>
                  {component.name}
                </div>
                <div style={{ marginTop: 8, fontSize: 20, fontWeight: 900, color: F.text1 }}>
                  {inr(amount)}
                </div>
                <div style={{ marginTop: 4, fontSize: 11, color: F.text2 }}>
                  {pct}% of gross - {component.category}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Filters & F4 Search Bar ── */}
      <div
        style={{
          background: F.card,
          border: `1px solid ${F.border}`,
          borderRadius: 8,
          padding: "16px 20px",
          display: "flex",
          alignItems: "flex-end",
          gap: 16,
          flexWrap: "wrap",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        }}
      >
        {/* F4 Value Help Search */}
        <div style={{ flex: 2, minWidth: 260 }}>
          <ValueHelp
            label="Search Salary Component (F4 Search)"
            value={componentSearch}
            onChange={setComponentSearch}
            placeholder="Type or pick from F4 value help…"
            values={f4Values}
          />
        </div>

        {/* Category Filter Pills */}
        <div style={{ flex: 1.5, minWidth: 240 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: F.text2,
              marginBottom: 3,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Category Filter
          </div>
          <div
            style={{
              display: "flex",
              background: F.pageBg,
              padding: 2,
              borderRadius: 6,
              border: `1px solid ${F.border}`,
            }}
          >
            {(
              [
                ["all", "All"],
                ["earnings", "Earnings Only"],
                ["deductions", "Deductions Only"],
              ] as const
            ).map(([cat, label]) => {
              const active = categoryFilter === cat
              return (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  style={{
                    flex: 1,
                    padding: "6px 8px",
                    fontSize: 11,
                    fontWeight: active ? 700 : 500,
                    background: active ? F.card : "transparent",
                    color: active ? F.brand : F.text2,
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    boxShadow: active ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
                    transition: "all 0.15s ease",
                  }}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        <div style={{ width: 170 }}>
          <Fld label="Sort By">
            <select
              value={componentSort}
              onChange={(e) => setComponentSort(e.target.value)}
              style={iSt}
            >
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="amount-desc">Amount High-Low</option>
              <option value="amount-asc">Amount Low-High</option>
            </select>
          </Fld>
        </div>

        <Btn onClick={applySalaryFilters}>Go</Btn>

        {/* Reset Action */}
        <Btn variant="secondary" onClick={clearSalaryFilters}>
          Clear Filters
        </Btn>
      </div>

      {/* ── Earnings Component Table ── */}
      {(appliedSalaryFilters.categoryFilter === "all" || appliedSalaryFilters.categoryFilter === "earnings") && (
        <div
          style={{
            background: F.card,
            border: `1px solid ${F.border}`,
            borderRadius: 8,
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
          }}
        >
          <div
            style={{
              padding: "16px 20px",
              borderBottom: `1px solid ${F.border}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: `linear-gradient(90deg, ${F.card}, ${F.infoBg})`,
            }}
          >
            <div>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: F.text1 }}>
                Earnings Components
              </h2>
              <div style={{ fontSize: 12, color: F.text2, marginTop: 2 }}>
                Regular taxable and exempt monthly salary elements
              </div>
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: F.brand,
                background: F.card,
                padding: "4px 10px",
                borderRadius: 20,
                border: `1px solid ${F.brand}30`,
              }}
            >
              {filteredEarnings.length} of {earningsComponents.length} components
            </span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
              <thead>
                <tr
                  style={{
                    borderBottom: `1px solid ${F.border}`,
                    color: F.text2,
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    background: F.pageBg,
                  }}
                >
                  <th style={{ padding: "10px 18px" }}>Component Name</th>
                  <th style={{ padding: "10px 14px" }}>Classification</th>
                  <th style={{ padding: "10px 14px", textAlign: "right" }}>
                    {viewMode === "annual" ? "Annual Amount" : "Monthly Amount"}
                  </th>
                  <th style={{ padding: "10px 14px", textAlign: "right" }}>% of Gross</th>
                  <th style={{ padding: "10px 18px" }}>Taxability & Exemptions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEarnings.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: 30, textAlign: "center", color: F.text3 }}>
                      No earnings match the applied filters.
                    </td>
                  </tr>
                ) : (
                  filteredEarnings.map((c) => {
                    const amount = c.monthly * multiplier
                    const pct = Math.round((c.monthly / totalMonthlyGross) * 100)
                    return (
                      <tr
                        key={c.name}
                        style={{
                          borderBottom: `1px solid ${F.border}60`,
                          transition: "background 0.12s ease",
                        }}
                      >
                        <td style={{ padding: "14px 18px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span
                              style={{
                                width: 10,
                                height: 10,
                                borderRadius: 3,
                                background: c.color,
                                flexShrink: 0,
                              }}
                            />
                            <strong style={{ color: F.text1 }}>{c.name}</strong>
                          </div>
                        </td>
                        <td style={{ padding: "14px 14px", color: F.text2 }}>{c.category}</td>
                        <td
                          style={{
                            padding: "14px 14px",
                            textAlign: "right",
                            fontWeight: 700,
                            color: F.text1,
                          }}
                        >
                          {inr(amount)}
                        </td>
                        <td
                          style={{
                            padding: "14px 14px",
                            textAlign: "right",
                            color: F.text3,
                            fontWeight: 600,
                          }}
                        >
                          {pct}%
                        </td>
                        <td style={{ padding: "14px 18px", color: F.text2, fontSize: 12 }}>
                          {c.taxability}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
              <tfoot>
                <tr
                  style={{
                    background: F.pageBg,
                    borderTop: `2px solid ${F.border}`,
                    fontWeight: 800,
                  }}
                >
                  <td style={{ padding: "14px 18px", color: F.text1 }} colSpan={2}>
                    Total Gross Earnings
                  </td>
                  <td style={{ padding: "14px 14px", textAlign: "right", color: F.brand, fontSize: 15 }}>
                    {inr(viewMode === "annual" ? totalAnnualGross : totalMonthlyGross)}
                  </td>
                  <td style={{ padding: "14px 14px", textAlign: "right", color: F.brand }}>100%</td>
                  <td style={{ padding: "14px 18px", color: F.text3, fontSize: 11 }}>
                    Base for Income Tax calculation
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* ── Deductions Component Table ── */}
      {(appliedSalaryFilters.categoryFilter === "all" || appliedSalaryFilters.categoryFilter === "deductions") && (
        <div
          style={{
            background: F.card,
            border: `1px solid ${F.border}`,
            borderRadius: 8,
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
          }}
        >
          <div
            style={{
              padding: "16px 20px",
              borderBottom: `1px solid ${F.border}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: `linear-gradient(90deg, ${F.card}, ${F.warningBg})`,
            }}
          >
            <div>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: F.text1 }}>
                Statutory Deductions & Contributions
              </h2>
              <div style={{ fontSize: 12, color: F.text2, marginTop: 2 }}>
                Mandatory withholdings deducted from monthly salary
              </div>
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: F.warning,
                background: F.card,
                padding: "4px 10px",
                borderRadius: 20,
                border: `1px solid ${F.warning}30`,
              }}
            >
              {filteredDeductions.length} of {deductionComponents.length} items
            </span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
              <thead>
                <tr
                  style={{
                    borderBottom: `1px solid ${F.border}`,
                    color: F.text2,
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    background: F.pageBg,
                  }}
                >
                  <th style={{ padding: "10px 18px" }}>Deduction Item</th>
                  <th style={{ padding: "10px 14px" }}>Type</th>
                  <th style={{ padding: "10px 14px", textAlign: "right" }}>
                    {viewMode === "annual" ? "Annual Estimated" : "Monthly Estimated"}
                  </th>
                  <th style={{ padding: "10px 18px" }}>Regulatory Act / Mandate</th>
                  <th style={{ padding: "10px 18px" }}>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeductions.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: 30, textAlign: "center", color: F.text3 }}>
                      No deductions match the applied filters.
                    </td>
                  </tr>
                ) : (
                  filteredDeductions.map((d) => {
                    const amount = d.monthly * multiplier
                    return (
                      <tr
                        key={d.name}
                        style={{
                          borderBottom: `1px solid ${F.border}60`,
                          transition: "background 0.12s ease",
                        }}
                      >
                        <td style={{ padding: "14px 18px" }}>
                          <strong style={{ color: F.text1 }}>{d.name}</strong>
                        </td>
                        <td style={{ padding: "14px 14px", color: F.text2 }}>{d.type}</td>
                        <td
                          style={{
                            padding: "14px 14px",
                            textAlign: "right",
                            fontWeight: 700,
                            color: F.warning,
                          }}
                        >
                          {inr(amount)}
                        </td>
                        <td style={{ padding: "14px 18px", color: F.text2, fontSize: 12 }}>
                          {d.act}
                        </td>
                        <td style={{ padding: "14px 18px", color: F.text3, fontSize: 12 }}>
                          {d.note}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
              <tfoot>
                <tr
                  style={{
                    background: F.pageBg,
                    borderTop: `2px solid ${F.border}`,
                    fontWeight: 800,
                  }}
                >
                  <td style={{ padding: "14px 18px", color: F.text1 }} colSpan={2}>
                    Total Estimated Deductions
                  </td>
                  <td style={{ padding: "14px 14px", textAlign: "right", color: F.warning, fontSize: 15 }}>
                    {inr(viewMode === "annual" ? totalAnnualDeductions : totalMonthlyDeductions)}
                  </td>
                  <td style={{ padding: "14px 18px", color: F.text3, fontSize: 11 }} colSpan={2}>
                    Directly subtracted from Gross to calculate Net Pay
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* ── Read-only Notice & HR Contact Banner ── */}
      <div
        style={{
          background: F.card,
          border: `1px solid ${F.border}`,
          borderLeft: `4px solid ${F.brand}`,
          borderRadius: 8,
          padding: "16px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <strong style={{ color: F.text1, fontSize: 14 }}>
            Official Compensation Record
          </strong>
          <div style={{ color: F.text2, fontSize: 12, marginTop: 4, lineHeight: 1.4 }}>
            Salary component structures are revised in accordance with corporate policy. For inquiries regarding allowances, tax declarations, or structure revisions, contact human resources.
          </div>
        </div>
        {onNav && (
          <Btn small variant="secondary" onClick={() => onNav("financial")}>
            Manage Tax Proofs &rarr;
          </Btn>
        )}
      </div>
    </div>
  )
}

function PayrollHistoryView({
  emp,
  payruns,
  onNav,
}: {
  emp: Employee
  payruns: Payrun[]
  onNav?: (view: string) => void
}) {
  const [periodSearch, setPeriodSearch] = useState("")
  const [yearFilter, setYearFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [minNetFilter, setMinNetFilter] = useState("")
  const [maxNetFilter, setMaxNetFilter] = useState("")
  const [deductionFilter, setDeductionFilter] = useState("all")
  const [lopFilter, setLopFilter] = useState("all")
  const [appliedHistoryFilters, setAppliedHistoryFilters] = useState({
    periodSearch: "",
    yearFilter: "all",
    statusFilter: "all",
    minNetFilter: "",
    maxNetFilter: "",
    deductionFilter: "all",
    lopFilter: "all",
  })
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc")
  const [hasRunPayrollHistorySearch, setHasRunPayrollHistorySearch] = useState(false)
  const [selectedRun, setSelectedRun] = useState<{
    run: Payrun
    row: PayrunInputRow
  } | null>(null)

  // Extract all completed and historical runs for this employee
  const runs = ownPayruns(payruns, emp.id)
    .map((run) => ({
      run,
      row: run.rows.find((item) => item.empId === emp.id)!,
    }))
    .filter((item) => Boolean(item.row))

  // F4 Value Help list for periods
  const f4Periods = Array.from(new Set(runs.map((r) => r.run.period)))
  const availableYears = Array.from(new Set(runs.map((r) => String(r.run.year)))).sort().reverse()

  // Apply filters
  const minNet = Number(appliedHistoryFilters.minNetFilter) || 0
  const maxNet = Number(appliedHistoryFilters.maxNetFilter) || Number.POSITIVE_INFINITY
  const filteredRuns = (hasRunPayrollHistorySearch ? runs : [])
    .filter(({ run, row }) => {
      // F4 Period filter / search
      if (!searchMatches(appliedHistoryFilters.periodSearch, [run.period])) {
        return false
      }
      // Year filter
      if (appliedHistoryFilters.yearFilter !== "all" && String(run.year) !== appliedHistoryFilters.yearFilter) {
        return false
      }
      // Status filter
      if (appliedHistoryFilters.statusFilter !== "all" && run.status !== appliedHistoryFilters.statusFilter) {
        return false
      }
      if (row.netSalary < minNet || row.netSalary > maxNet) {
        return false
      }
      if (appliedHistoryFilters.deductionFilter === "high" && row.totalDeductions < 18000) {
        return false
      }
      if (appliedHistoryFilters.deductionFilter === "standard" && row.totalDeductions >= 18000) {
        return false
      }
      if (appliedHistoryFilters.lopFilter === "with" && row.lopDays <= 0) {
        return false
      }
      if (appliedHistoryFilters.lopFilter === "without" && row.lopDays > 0) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      const aVal = a.run.year * 100 + a.run.month
      const bVal = b.run.year * 100 + b.run.month
      return sortOrder === "desc" ? bVal - aVal : aVal - bVal
    })

  // Calculations for summary KPI cards
  const completedRuns = runs.filter((r) => isFinalizedPayrun(r.run.status))
  const totalDisbursedYtd = completedRuns.reduce((sum, r) => sum + r.row.netSalary, 0)
  const totalGrossYtd = completedRuns.reduce((sum, r) => sum + r.row.totalEarnings, 0)
  const avgMonthlyNet = completedRuns.length > 0 ? Math.round(totalDisbursedYtd / completedRuns.length) : 0
  const latestCompleted = completedRuns[completedRuns.length - 1]

  const hasActiveFilters = Boolean(
    activeSearch(appliedHistoryFilters.periodSearch) ||
      appliedHistoryFilters.yearFilter !== "all" ||
      appliedHistoryFilters.statusFilter !== "all" ||
      appliedHistoryFilters.minNetFilter ||
      appliedHistoryFilters.maxNetFilter ||
      appliedHistoryFilters.deductionFilter !== "all" ||
      appliedHistoryFilters.lopFilter !== "all",
  )

  if (selectedRun) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div>
            <button
              onClick={() => setSelectedRun(null)}
              title="Back to payroll history"
              style={{
                background: "transparent",
                border: "none",
                color: F.brand,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 800,
                padding: 0,
                marginBottom: 8,
                fontFamily: "inherit",
              }}
            >
              Back to Payroll History
            </button>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: F.text1 }}>
              Disbursement Details - {selectedRun.run.period}
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: F.text2 }}>
              Status: {selectedRun.run.status} - Processed on {fmtD(selectedRun.run.generatedOn)}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn onClick={() => downloadPayslipPdf(selectedRun.row, selectedRun.run, emp)}>
              <DownloadIcon />
              Download PDF
            </Btn>
            {onNav && (
              <Btn variant="secondary" onClick={() => onNav("payslips")}>Open Full Payslip</Btn>
            )}
            <Btn variant="secondary" onClick={() => setSelectedRun(null)}>
              Close
            </Btn>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          <Tile label="Net Take-Home" value={inr(selectedRun.row.netSalary)} sub={`Ref: PR-${selectedRun.run.id}`} accent={F.success} />
          <Tile label="Gross Earnings" value={inr(selectedRun.row.totalEarnings)} sub="Base salary plus variable pay" accent={F.brand} />
          <Tile label="Deductions" value={inr(selectedRun.row.totalDeductions)} sub={`${selectedRun.row.lopDays} LOP day(s) recorded`} accent={F.warning} />
          <Tile label="Payrun Status" value={selectedRun.run.status} sub={`Generated by ${selectedRun.run.generatedBy}`} accent="#00A389" />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.15fr 0.85fr",
            gap: 16,
            alignItems: "start",
          }}
        >
          <div style={{ background: F.card, border: `1px solid ${F.border}`, borderRadius: 8, overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: `1px solid ${F.border}`, fontWeight: 900 }}>
              Itemized Pay Statement
            </div>
            <div style={{ padding: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 900, color: F.success, marginBottom: 10 }}>Earnings Breakdown</div>
                <IR label="Gross Base Salary" value={inr(selectedRun.row.grossSalary)} />
                <IR label="Bonus" value={inr(selectedRun.row.bonus)} />
                <IR label="Incentive" value={inr(selectedRun.row.incentive)} />
                <IR label="Total Earnings" value={inr(selectedRun.row.totalEarnings)} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 900, color: F.error, marginBottom: 10 }}>Deductions</div>
                <IR label="Provident Fund" value={inr(selectedRun.row.pf)} />
                <IR label="ESI" value={inr(selectedRun.row.esi)} />
                <IR label="TDS" value={inr(selectedRun.row.tds)} />
                <IR label="Professional Tax" value={inr(selectedRun.row.profTax)} />
                <IR label="LOP Deduction" value={inr(selectedRun.row.lopDeduction)} />
                <IR label="Total Deductions" value={inr(selectedRun.row.totalDeductions)} />
              </div>
            </div>
            <div
              style={{
                padding: "18px 22px",
                background: F.successBg,
                borderTop: `1px solid ${F.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 900 }}>Net Disbursed Salary</span>
              <span style={{ fontSize: 28, fontWeight: 900, color: F.success }}>
                {inr(selectedRun.row.netSalary)}
              </span>
            </div>
          </div>

          <div style={{ background: F.card, border: `1px solid ${F.border}`, borderRadius: 8, overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: `1px solid ${F.border}`, fontWeight: 900 }}>
              Employee & Cycle Details
            </div>
            <div style={{ padding: 18 }}>
              <IR label="Employee" value={`${emp.name} (${emp.id})`} />
              <IR label="Department" value={emp.department} />
              <IR label="Designation" value={emp.designation} />
              <IR label="Salary Structure" value={emp.salaryStructure} />
              <IR label="Pay Period" value={selectedRun.run.period} />
              <IR label="Disbursed Date" value={fmtD(selectedRun.run.generatedOn)} />
              <IR label="Reference" value={`PR-${selectedRun.run.id}`} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* ── Top Header ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 24,
              fontWeight: 800,
              color: F.text1,
              letterSpacing: "-0.01em",
            }}
          >
            Payroll History & Disbursements
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: F.text2 }}>
            Complete ledger of past compensation cycles, deductions, and payment receipts
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {onNav && (
            <Btn
              variant="secondary"
              onClick={() => onNav("payslips")}
              style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700 }}
            >
              <span>Payslips Portal</span>
              <span style={{ fontSize: 14 }}>&rarr;</span>
            </Btn>
          )}
        </div>
      </div>

      {/* ── 4 KPI Summary Cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        <EmployeeMetricCard
          label="Completed Payroll Cycles"
          value={`${completedRuns.length} Cycles`}
          sub="Verified and finalized disbursements on file"
          accent={F.brand}
          badgeText="Disbursed"
          badgeBg={F.infoBg}
          badgeColor={F.brand}
          progress={100}
        />
        <EmployeeMetricCard
          label="Total Net Disbursed (YTD)"
          value={inr(totalDisbursedYtd)}
          sub={`From ${inr(totalGrossYtd)} total cumulative gross`}
          accent={F.success}
          badgeText="Take-Home"
          badgeBg={F.successBg}
          badgeColor={F.success}
          progress={totalGrossYtd > 0 ? Math.round((totalDisbursedYtd / totalGrossYtd) * 100) : 0}
        />
        <EmployeeMetricCard
          label="Avg. Monthly Take-Home"
          value={inr(avgMonthlyNet)}
          sub="Average in-hand salary per processed cycle"
          accent="#00A389"
          badgeText="Average"
          badgeBg="#E6F4EA"
          badgeColor="#137333"
        />
        <EmployeeMetricCard
          label="Latest Disbursed Period"
          value={latestCompleted?.run.period ?? "None"}
          sub={latestCompleted ? `Disbursed on ${fmtD(latestCompleted.run.generatedOn)}` : "No completed runs"}
          accent="#8B5CF6"
          badgeText="Latest"
          badgeBg="#F5F3FF"
          badgeColor="#7C3AED"
        />
      </div>

      {/* ── Filters & F4 Value Search Bar ── */}
      <div
        style={{
          background: F.card,
          border: `1px solid ${F.border}`,
          borderRadius: 8,
          padding: "16px 20px",
          display: "flex",
          alignItems: "flex-end",
          gap: 16,
          flexWrap: "wrap",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        }}
      >
        {/* F4 Value Help Search for Pay Period */}
        <div style={{ flex: 2, minWidth: 260 }}>
          <ValueHelp
            label="Search Pay Period (F4 Search)"
            value={periodSearch}
            onChange={setPeriodSearch}
            placeholder="Search or pick pay period (e.g. July 2026)…"
            values={f4Periods}
          />
        </div>

        {/* Year Filter */}
        <div style={{ flex: 1, minWidth: 140 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: F.text2,
              marginBottom: 3,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Year
          </div>
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            style={{ ...iSt, cursor: "pointer" }}
          >
            <option value="all">All Years</option>
            {availableYears.map((yr) => (
              <option key={yr} value={yr}>
                Year {yr}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div style={{ flex: 1, minWidth: 150 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: F.text2,
              marginBottom: 3,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Run Status
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ ...iSt, cursor: "pointer" }}
          >
            <option value="all">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Approved">Approved</option>
            <option value="Under Review">Under Review</option>
            <option value="Draft">Draft</option>
            <option value="Locked">Locked</option>
          </select>
        </div>

        <div style={{ flex: 1, minWidth: 130 }}>
          <Fld label="Min Net Pay">
            <input
              type="number"
              value={minNetFilter}
              onChange={(e) => setMinNetFilter(e.target.value)}
              placeholder="e.g. 90000"
              style={iSt}
            />
          </Fld>
        </div>

        <div style={{ flex: 1, minWidth: 130 }}>
          <Fld label="Max Net Pay">
            <input
              type="number"
              value={maxNetFilter}
              onChange={(e) => setMaxNetFilter(e.target.value)}
              placeholder="e.g. 110000"
              style={iSt}
            />
          </Fld>
        </div>

        <div style={{ flex: 1, minWidth: 160 }}>
          <Fld label="Deduction Level">
            <select
              value={deductionFilter}
              onChange={(e) => setDeductionFilter(e.target.value)}
              style={{ ...iSt, cursor: "pointer" }}
            >
              <option value="all">All Levels</option>
              <option value="high">High Deductions</option>
              <option value="standard">Standard Deductions</option>
            </select>
          </Fld>
        </div>

        <div style={{ flex: 1, minWidth: 140 }}>
          <Fld label="LOP Impact">
            <select
              value={lopFilter}
              onChange={(e) => setLopFilter(e.target.value)}
              style={{ ...iSt, cursor: "pointer" }}
            >
              <option value="all">All Runs</option>
              <option value="with">With LOP</option>
              <option value="without">Without LOP</option>
            </select>
          </Fld>
        </div>

        <ContextDateRangeFilter />

        {/* Sort Order Toggle */}
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: F.text2,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Order
          </div>
          <button
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            style={{
              background: F.pageBg,
              border: `1px solid ${F.border}`,
              borderRadius: 6,
              padding: "7px 12px",
              color: F.text1,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              height: 34,
            }}
            title="Toggle Sort Order"
          >
            <span>{sortOrder === "desc" ? "Newest First ↓" : "Oldest First ↑"}</span>
          </button>
        </div>

        {/* Reset Filters */}
        <Btn
          onClick={() => {
            setHasRunPayrollHistorySearch(true)
            setAppliedHistoryFilters({
              periodSearch,
              yearFilter,
              statusFilter,
              minNetFilter,
              maxNetFilter,
              deductionFilter,
              lopFilter,
            })
          }}
          style={{ height: 34 }}
        >
          Go
        </Btn>

        {(hasActiveFilters ||
          activeSearch(periodSearch) ||
          yearFilter !== "all" ||
          statusFilter !== "all" ||
          minNetFilter ||
          maxNetFilter ||
          deductionFilter !== "all" ||
          lopFilter !== "all") && (
          <button
            onClick={() => {
              setPeriodSearch("")
              setYearFilter("all")
              setStatusFilter("all")
              setMinNetFilter("")
              setMaxNetFilter("")
              setDeductionFilter("all")
              setLopFilter("all")
              setAppliedHistoryFilters({
                periodSearch: "",
                yearFilter: "all",
                statusFilter: "all",
                minNetFilter: "",
                maxNetFilter: "",
                deductionFilter: "all",
                lopFilter: "all",
              })
              setHasRunPayrollHistorySearch(false)
            }}
            style={{
              background: F.pageBg,
              border: `1px solid ${F.border}`,
              borderRadius: 6,
              padding: "7px 14px",
              color: F.text2,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              height: 34,
            }}
          >
            <span>&times;</span>
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {/* ── Payroll History Table ── */}
      <div
        style={{
          background: F.card,
          border: `1px solid ${F.border}`,
          borderRadius: 8,
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: `1px solid ${F.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: F.card,
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: F.text1 }}>
              Historical Payroll Ledger
            </h2>
            <div style={{ fontSize: 12, color: F.text2, marginTop: 2 }}>
              Showing {filteredRuns.length} of {runs.length} recorded pay cycles
            </div>
          </div>
          {filteredRuns.length > 0 && (
            <span style={{ fontSize: 12, color: F.text3 }}>
              Click any row to open itemized disbursement details
            </span>
          )}
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13, minWidth: 700 }}>
            <thead>
              <tr
                style={{
                  borderBottom: `1px solid ${F.border}`,
                  color: F.text2,
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  background: F.pageBg,
                }}
              >
                <th style={{ padding: "10px 18px" }}>Pay Period</th>
                <th style={{ padding: "10px 14px" }}>Disbursed Date</th>
                <th style={{ padding: "10px 14px", textAlign: "right" }}>Gross Earnings</th>
                <th style={{ padding: "10px 14px", textAlign: "right" }}>Total Deductions</th>
                <th style={{ padding: "10px 14px", textAlign: "right" }}>Net Salary</th>
                <th style={{ padding: "10px 14px" }}>Reference</th>
                <th style={{ padding: "10px 14px", textAlign: "center" }}>Status</th>
                <th style={{ padding: "10px 18px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRuns.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: 48, textAlign: "center", color: F.text3 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: F.text2, marginBottom: 6 }}>
                      No payroll records match your filter criteria
                    </div>
                    <div style={{ fontSize: 12, color: F.text3 }}>
                      Try selecting another period with F4 search or reset your filters.
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRuns.map(({ run, row }) => (
                  <tr
                    key={run.id}
                    onClick={() => setSelectedRun({ run, row })}
                    style={{
                      borderBottom: `1px solid ${F.border}60`,
                      cursor: "pointer",
                      transition: "background 0.12s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = F.pageBg
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent"
                    }}
                  >
                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ fontWeight: 800, color: F.text1 }}>{run.period}</div>
                      <div style={{ fontSize: 11, color: F.text3, marginTop: 2 }}>
                        Month {run.month} &bull; {run.year}
                      </div>
                    </td>
                    <td style={{ padding: "14px 14px", color: F.text2 }}>
                      {fmtD(run.generatedOn)}
                    </td>
                    <td style={{ padding: "14px 14px", textAlign: "right", color: F.text2, fontWeight: 600 }}>
                      {inr(row.totalEarnings)}
                    </td>
                    <td style={{ padding: "14px 14px", textAlign: "right", color: F.warning, fontWeight: 600 }}>
                      <span>{inr(row.totalDeductions)}</span>
                      {row.lopDays > 0 && (
                        <span
                          style={{
                            display: "block",
                            fontSize: 10,
                            color: F.error,
                            fontWeight: 700,
                          }}
                        >
                          ({row.lopDays}d LOP)
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "14px 14px", textAlign: "right", fontWeight: 800, color: F.success, fontSize: 14 }}>
                      {inr(row.netSalary)}
                    </td>
                    <td style={{ padding: "14px 14px", color: F.text3, fontSize: 11 }}>
                      PR-{run.id.slice(0, 8)}
                    </td>
                    <td style={{ padding: "14px 14px", textAlign: "center" }}>
                      {prBadge(run.status)}
                    </td>
                    <td style={{ padding: "14px 18px", textAlign: "right" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, flexWrap: "wrap" }}>
                        <Btn
                          small
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedRun({ run, row })
                          }}
                        >
                          Details
                        </Btn>
                        <Btn
                          small
                          title={`Download PDF payslip for ${run.period}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            downloadPayslipPdf(row, run, emp)
                          }}
                        >
                          <DownloadIcon />
                          Download PDF
                        </Btn>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── SlidePanel / Drawer for Itemized Payrun Details ── */}
      {selectedRun && (
        <SlidePanel
          title={`Disbursement Details - ${selectedRun.run.period}`}
          sub={`Status: ${selectedRun.run.status} - Processed on ${fmtD(selectedRun.run.generatedOn)}`}
          onClose={() => setSelectedRun(null)}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Net Amount Banner */}
            <div
              style={{
                background: `linear-gradient(135deg, ${F.successBg}, #E8F5E9)`,
                border: `1px solid ${F.success}30`,
                borderRadius: 8,
                padding: "18px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: F.text2, textTransform: "uppercase" }}>
                  Net Take-Home Disbursed
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: F.success, marginTop: 4 }}>
                  {inr(selectedRun.row.netSalary)}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                {prBadge(selectedRun.run.status)}
                <div style={{ fontSize: 11, color: F.text3, marginTop: 4 }}>
                  Ref: PR-{selectedRun.run.id}
                </div>
              </div>
            </div>

            {/* Earnings Breakdown */}
            <div
              style={{
                background: F.pageBg,
                borderRadius: 8,
                padding: "16px 18px",
                border: `1px solid ${F.border}`,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: F.text2,
                  marginBottom: 10,
                }}
              >
                Earnings Breakdown
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: F.text2 }}>Gross Base Salary:</span>
                  <strong>{inr(selectedRun.row.grossSalary)}</strong>
                </div>
                {selectedRun.row.bonus > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: F.text2 }}>Bonus:</span>
                    <strong style={{ color: F.brand }}>+{inr(selectedRun.row.bonus)}</strong>
                  </div>
                )}
                {selectedRun.row.incentive > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: F.text2 }}>Incentive:</span>
                    <strong style={{ color: F.brand }}>+{inr(selectedRun.row.incentive)}</strong>
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderTop: `1px solid ${F.border}`,
                    paddingTop: 8,
                    fontWeight: 700,
                  }}
                >
                  <span>Total Earnings:</span>
                  <span style={{ color: F.brand }}>{inr(selectedRun.row.totalEarnings)}</span>
                </div>
              </div>
            </div>

            {/* Deductions Breakdown */}
            <div
              style={{
                background: F.pageBg,
                borderRadius: 8,
                padding: "16px 18px",
                border: `1px solid ${F.border}`,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: F.text2,
                  marginBottom: 10,
                }}
              >
                Statutory & Other Deductions
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: F.text2 }}>Provident Fund (EPF):</span>
                  <strong>{inr(selectedRun.row.pf)}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: F.text2 }}>TDS (Income Tax):</span>
                  <strong>{inr(selectedRun.row.tds)}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: F.text2 }}>Professional Tax:</span>
                  <strong>{inr(selectedRun.row.profTax)}</strong>
                </div>
                {selectedRun.row.esi > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: F.text2 }}>ESI Contribution:</span>
                    <strong>{inr(selectedRun.row.esi)}</strong>
                  </div>
                )}
                {selectedRun.row.lopDeduction > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: F.error }}>Loss of Pay ({selectedRun.row.lopDays} days):</span>
                    <strong style={{ color: F.error }}>-{inr(selectedRun.row.lopDeduction)}</strong>
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderTop: `1px solid ${F.border}`,
                    paddingTop: 8,
                    fontWeight: 700,
                  }}
                >
                  <span>Total Deductions:</span>
                  <span style={{ color: F.warning }}>{inr(selectedRun.row.totalDeductions)}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              {onNav && (
                <Btn
                  onClick={() => {
                    setSelectedRun(null)
                    onNav("payslips")
                  }}
                  style={{ flex: 1 }}
                >
                  Open Full Payslip
                </Btn>
              )}
              <Btn variant="secondary" onClick={() => setSelectedRun(null)}>
                Close
              </Btn>
            </div>
          </div>
        </SlidePanel>
      )}
    </div>
  )
}

function EmployeePayslipsView({
  emp,
  payruns,
}: {
  emp: Employee
  payruns: Payrun[]
}) {
  const [selected, setSelected] = useState<{
    run: Payrun
    row: PayrunInputRow
  } | null>(null)
  const [periodSearch, setPeriodSearch] = useState("")
  const [selectedYear, setSelectedYear] = useState("all")
  const [minNetFilter, setMinNetFilter] = useState("")
  const [maxNetFilter, setMaxNetFilter] = useState("")
  const [deductionFilter, setDeductionFilter] = useState("all")
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc")
  const [selectedRunIds, setSelectedRunIds] = useState<string[]>([])
  const [hasRunEmployeePayslipSearch, setHasRunEmployeePayslipSearch] = useState(false)
  const [appliedPayslipFilters, setAppliedPayslipFilters] = useState({
    periodSearch: "",
    selectedYear: "all",
    minNetFilter: "",
    maxNetFilter: "",
    deductionFilter: "all",
  })

  const runs = ownPayruns(payruns, emp.id).filter(
    (r) => isFinalizedPayrun(r.status),
  )

  const f4Periods = Array.from(new Set(runs.map((r) => r.period)))
  const availableYears = Array.from(
    new Set(runs.map((r) => String(r.year))),
  ).sort().reverse()

  const minNet = Number(appliedPayslipFilters.minNetFilter) || 0
  const maxNet = Number(appliedPayslipFilters.maxNetFilter) || Number.POSITIVE_INFINITY
  const filteredRuns = (hasRunEmployeePayslipSearch ? runs : []).filter((run) => {
    const row = run.rows.find((r) => r.empId === emp.id)
    if (!row) return false
    if (!searchMatches(appliedPayslipFilters.periodSearch, [run.period])) {
      return false
    }
    if (appliedPayslipFilters.selectedYear !== "all" && String(run.year) !== appliedPayslipFilters.selectedYear) {
      return false
    }
    if (row.netSalary < minNet || row.netSalary > maxNet) {
      return false
    }
    if (appliedPayslipFilters.deductionFilter === "high" && row.totalDeductions < 18000) {
      return false
    }
    if (appliedPayslipFilters.deductionFilter === "standard" && row.totalDeductions >= 18000) {
      return false
    }
    return true
  }).sort((a, b) => {
    const aVal = a.year * 100 + a.month
    const bVal = b.year * 100 + b.month
    return sortOrder === "desc" ? bVal - aVal : aVal - bVal
  })
  const allFilteredRunsSelected = filteredRuns.length > 0 && filteredRuns.every((run) => selectedRunIds.includes(run.id))
  const selectedEmployeePayslips: PayslipPdfEntry[] = runs
    .filter((run) => selectedRunIds.includes(run.id))
    .flatMap((run) => {
      const row = run.rows.find((item) => item.empId === emp.id)
      return row ? [{ row, run, emp }] : []
    })
  const toggleFilteredRuns = () => {
    const visibleIds = filteredRuns.map((run) => run.id)
    setSelectedRunIds((current) => allFilteredRunsSelected
      ? current.filter((id) => !visibleIds.includes(id))
      : Array.from(new Set([...current, ...visibleIds])))
  }

  const hasPayslipFilters = Boolean(
    activeSearch(appliedPayslipFilters.periodSearch) ||
      appliedPayslipFilters.selectedYear !== "all" ||
      appliedPayslipFilters.minNetFilter ||
      appliedPayslipFilters.maxNetFilter ||
      appliedPayslipFilters.deductionFilter !== "all",
  )

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 800,
              color: F.text1,
              letterSpacing: "-0.01em",
            }}
          >
            My Payslips
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: F.text2 }}>
            Secure digital payslip archive & salary statements
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <div style={{ fontSize: 12, color: F.text3, fontWeight: 600 }}>
            {filteredRuns.length} Payslip{filteredRuns.length !== 1 ? "s" : ""} Available
          </div>
          <Btn
            disabled={selectedEmployeePayslips.length === 0}
            onClick={() => downloadPayslipsPdf(selectedEmployeePayslips)}
          >
            <DownloadIcon />
            Download Selected ({selectedEmployeePayslips.length})
          </Btn>
        </div>
      </div>

      {/* Filter & F4 Search Toolbar */}
      <div
        style={{
          background: F.card,
          border: `1px solid ${F.border}`,
          borderRadius: 8,
          padding: "14px 18px",
          display: "flex",
          alignItems: "flex-end",
          gap: 14,
          flexWrap: "wrap",
          boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
        }}
      >
        <div style={{ flex: 2, minWidth: 240 }}>
          <ValueHelp
            label="Search Pay Period (F4 Search)"
            value={periodSearch}
            onChange={setPeriodSearch}
            placeholder="Search period (e.g. July 2026)…"
            values={f4Periods}
          />
        </div>

        <div style={{ width: 140 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: F.text2,
              marginBottom: 3,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Filter Year
          </div>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            style={{ ...iSt, cursor: "pointer" }}
          >
            <option value="all">All Years</option>
            {availableYears.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>

        <Fld label="Min Net Pay">
          <input
            type="number"
            value={minNetFilter}
            onChange={(e) => setMinNetFilter(e.target.value)}
            placeholder="90000"
            style={{ ...iSt, width: 130 }}
          />
        </Fld>

        <Fld label="Max Net Pay">
          <input
            type="number"
            value={maxNetFilter}
            onChange={(e) => setMaxNetFilter(e.target.value)}
            placeholder="110000"
            style={{ ...iSt, width: 130 }}
          />
        </Fld>

        <Fld label="Deduction Level">
          <select
            value={deductionFilter}
            onChange={(e) => setDeductionFilter(e.target.value)}
            style={{ ...iSt, width: 170, cursor: "pointer" }}
          >
            <option value="all">All Levels</option>
            <option value="high">High Deductions</option>
            <option value="standard">Standard Deductions</option>
          </select>
        </Fld>

        <Fld label="Order">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "desc" | "asc")}
            style={{ ...iSt, width: 150, cursor: "pointer" }}
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </Fld>

        <ContextDateRangeFilter />

        <Btn
          onClick={() => {
            setHasRunEmployeePayslipSearch(true)
            setAppliedPayslipFilters({
              periodSearch,
              selectedYear,
              minNetFilter,
              maxNetFilter,
              deductionFilter,
            })
          }}
          style={{ height: 34 }}
        >
          Go
        </Btn>

        {(hasPayslipFilters ||
          activeSearch(periodSearch) ||
          selectedYear !== "all" ||
          minNetFilter ||
          maxNetFilter ||
          deductionFilter !== "all") && (
          <button
            onClick={() => {
              setPeriodSearch("")
              setSelectedYear("all")
              setMinNetFilter("")
              setMaxNetFilter("")
              setDeductionFilter("all")
              setAppliedPayslipFilters({
                periodSearch: "",
                selectedYear: "all",
                minNetFilter: "",
                maxNetFilter: "",
                deductionFilter: "all",
              })
              setHasRunEmployeePayslipSearch(false)
            }}
            style={{
              background: F.pageBg,
              border: `1px solid ${F.border}`,
              borderRadius: 6,
              padding: "7px 12px",
              color: F.text2,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              height: 34,
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Payslips Table */}
      <div
        style={{
          background: F.card,
          border: `1px solid ${F.border}`,
          borderRadius: 8,
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 620, fontSize: 13 }}>
          <thead>
            <tr
              style={{
                borderBottom: `1px solid ${F.border}`,
                background: F.pageBg,
                color: F.text2,
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              <th style={{ padding: "12px 10px", textAlign: "center" }}>
                <input
                  type="checkbox"
                  aria-label="Select all filtered payslips"
                  checked={allFilteredRunsSelected}
                  onChange={toggleFilteredRuns}
                  style={{ width: 16, height: 16, cursor: "pointer" }}
                />
              </th>
              <th style={{ padding: "12px 18px", textAlign: "left" }}>Pay Period</th>
                <th style={{ padding: "12px 14px", textAlign: "left" }}>Generated On</th>
                <th style={{ padding: "12px 14px", textAlign: "right" }}>Gross Earnings</th>
                <th style={{ padding: "12px 14px", textAlign: "right" }}>Deductions</th>
                <th style={{ padding: "12px 14px", textAlign: "right" }}>Net Take-Home</th>
                <th style={{ padding: "12px 14px", textAlign: "center" }}>Status</th>
                <th style={{ padding: "12px 18px", textAlign: "right" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRuns.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: 40, textAlign: "center", color: F.text3 }}>
                  No payslips match your search criteria.
                </td>
              </tr>
            ) : (
              filteredRuns.map((run) => {
                const row = run.rows.find((r) => r.empId === emp.id)!
                return (
                  <tr
                    key={run.id}
                    onClick={() => setSelected({ run, row })}
                    style={{
                      borderBottom: `1px solid ${F.border}60`,
                      cursor: "pointer",
                      transition: "background 0.12s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = F.pageBg)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "14px 10px", textAlign: "center" }}>
                      <input
                        type="checkbox"
                        aria-label={`Select payslip for ${run.period}`}
                        checked={selectedRunIds.includes(run.id)}
                        onClick={(event) => event.stopPropagation()}
                        onChange={() => setSelectedRunIds((current) => current.includes(run.id)
                          ? current.filter((id) => id !== run.id)
                          : [...current, run.id])}
                        style={{ width: 16, height: 16, cursor: "pointer" }}
                      />
                    </td>
                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ fontWeight: 800, color: F.text1 }}>{run.period}</div>
                      <div style={{ fontSize: 11, color: F.text3, marginTop: 2 }}>
                        Ref: PR-{run.id.slice(0, 8)}
                      </div>
                    </td>
                    <td style={{ padding: "14px 14px", color: F.text2 }}>
                      {fmtD(run.generatedOn)}
                    </td>
                    <td style={{ padding: "14px 14px", textAlign: "right", color: F.text2, fontWeight: 600 }}>
                      {inr(row.totalEarnings)}
                    </td>
                    <td style={{ padding: "14px 14px", textAlign: "right", color: F.warning, fontWeight: 600 }}>
                      {inr(row.totalDeductions)}
                    </td>
                    <td style={{ padding: "14px 14px", textAlign: "right" }}>
                      <strong style={{ color: F.success, fontSize: 14 }}>
                        {inr(row.netSalary)}
                      </strong>
                    </td>
                    <td style={{ padding: "14px 14px", textAlign: "center" }}>
                      <Badge label="Completed" color={F.success} bg={F.successBg} />
                    </td>
                    <td style={{ padding: "14px 18px", textAlign: "right" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, flexWrap: "wrap" }}>
                        <Btn
                          small
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelected({ run, row })
                          }}
                        >
                          View
                        </Btn>
                        <Btn
                          small
                          title={`Download PDF payslip for ${run.period}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            downloadPayslipPdf(row, run, emp)
                          }}
                        >
                          <DownloadIcon />
                          Download PDF
                        </Btn>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <Modal
          title={`Payslip Sheet — ${selected.run.period}`}
          onClose={() => setSelected(null)}
          wide
        >
          <PayslipSheet
            row={selected.row}
            run={selected.run}
            emp={emp}
            showDownload
          />
        </Modal>
      )}
    </div>
  )
}

function OrgDocumentsView({
  docs,
  setDocs,
  emps,
}: {
  docs: OrgDocument[]
  setDocs: React.Dispatch<React.SetStateAction<OrgDocument[]>>
  emps: Employee[]
}) {
  const toast = useToast()
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [status, setStatus] = useState("All")
  const [docSort, setDocSort] = useState("created-desc")
  const [hasRunOrgDocumentSearch, setHasRunOrgDocumentSearch] = useState(false)
  const [appliedOrgDocFilters, setAppliedOrgDocFilters] = useState({
    search: "",
    category: "All",
    status: "All",
    docSort: "created-desc",
  })
  const [showAdd, setShowAdd] = useState(false)
  const [draft, setDraft] = useState({
    title: "",
    category: "Policy" as OrgDocument["category"],
    assignmentMode: "All Employees",
    assignmentValue: "",
    status: "Published" as OrgDocument["status"],
    description: "",
    fileName: "",
  })
  const departments = Array.from(
    new Set(emps.map((e) => e.department.trim()).filter(Boolean)),
  ).sort()
  const designations = Array.from(
    new Set(emps.map((e) => e.designation.trim()).filter(Boolean)),
  ).sort()
  const categories: OrgDocument["category"][] = [
    "Policy",
    "Payroll",
    "Compliance",
    "HR Letter",
    "Tax",
  ]
  const filteredDocs = (hasRunOrgDocumentSearch ? docs : []).filter(
    (doc) =>
      searchMatches(appliedOrgDocFilters.search, [doc.title, doc.description, doc.assignedTo]) &&
      (appliedOrgDocFilters.category === "All" || doc.category === appliedOrgDocFilters.category) &&
      (appliedOrgDocFilters.status === "All" || doc.status === appliedOrgDocFilters.status),
  ).sort((a, b) => {
    const dir = appliedOrgDocFilters.docSort.endsWith("-desc") ? -1 : 1
    if (appliedOrgDocFilters.docSort.startsWith("title")) {
      return a.title.localeCompare(b.title) * dir
    }
    if (appliedOrgDocFilters.docSort.startsWith("assigned")) {
      return (a.assignedCount - b.assignedCount) * dir
    }
    if (appliedOrgDocFilters.docSort.startsWith("status")) {
      return a.status.localeCompare(b.status) * dir
    }
    return (new Date(a.createdOn).getTime() - new Date(b.createdOn).getTime()) * dir
  })
  const clearOrgDocFilters = () => {
    setHasRunOrgDocumentSearch(false)
    setSearch("")
    setCategory("All")
    setStatus("All")
    setDocSort("created-desc")
    setAppliedOrgDocFilters({ search: "", category: "All", status: "All", docSort: "created-desc" })
  }
  const applyOrgDocFilters = () => {
    setHasRunOrgDocumentSearch(true)
    setAppliedOrgDocFilters({ search, category, status, docSort })
  }
  const orgDocActiveFilters =
    (activeSearch(appliedOrgDocFilters.search) ? 1 : 0) +
    (appliedOrgDocFilters.category !== "All" ? 1 : 0) +
    (appliedOrgDocFilters.status !== "All" ? 1 : 0) +
    (appliedOrgDocFilters.docSort !== "created-desc" ? 1 : 0)
  const assignmentCount = () => {
    if (draft.assignmentMode === "All Employees") return emps.length
    if (draft.assignmentMode === "Department")
      return emps.filter((e) => e.department === draft.assignmentValue).length
    if (draft.assignmentMode === "Designation")
      return emps.filter((e) => e.designation === draft.assignmentValue).length
    return 0
  }
  const assignmentLabel = () => {
    if (draft.assignmentMode === "All Employees") return "All Employees"
    return draft.assignmentValue || draft.assignmentMode
  }
  const addDocument = () => {
    if (!draft.title.trim()) return toast("Document title is required", "error")
    if (draft.assignmentMode !== "All Employees" && !draft.assignmentValue)
      return toast("Select an assignment target", "error")
    setDocs((prev) => [
      {
        id: `DOC-${String(prev.length + 1).padStart(3, "0")}`,
        title: draft.title.trim(),
        category: draft.category,
        assignedTo: assignmentLabel(),
        assignedCount: assignmentCount(),
        owner: "Meena Iyer",
        createdOn: new Date().toISOString().slice(0, 10),
        status: draft.status,
        description: draft.description.trim() || "Uploaded HR document for employee access.",
        fileName: draft.fileName,
      },
      ...prev,
    ])
    setShowAdd(false)
    setDraft({
      title: "",
      category: "Policy",
      assignmentMode: "All Employees",
      assignmentValue: "",
      status: "Published",
      description: "",
      fileName: "",
    })
    toast("Document added and assigned successfully", "success")
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <PH
        title="Documents"
        sub="Upload, publish, and assign organization documents to employees"
        action={<Btn onClick={() => setShowAdd(true)}>+ Add Document</Btn>}
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        <Tile label="Total Documents" value={String(docs.length)} sub="HR, payroll, and compliance files" accent={F.brand} />
        <Tile label="Published" value={String(docs.filter((d) => d.status === "Published").length)} sub="Visible to assigned employees" accent={F.success} />
        <Tile label="Drafts" value={String(docs.filter((d) => d.status === "Draft").length)} sub="Pending final release" accent={F.warning} />
        <Tile label="Assignments" value={String(docs.reduce((s, d) => s + d.assignedCount, 0))} sub="Employee-document links" accent="#00A389" />
      </div>
      <div
        style={{
          background: F.card,
          border: `1px solid ${F.border}`,
          borderRadius: 8,
          padding: 14,
          display: "flex",
          gap: 10,
          alignItems: "flex-end",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: "1 1 260px" }}>
          <ValueHelp
            label="Search Documents"
            value={search}
            onChange={setSearch}
            placeholder="Search title, assignment, or notes..."
            values={docs.map((d) => d.title)}
          />
        </div>
        <Fld label="Category">
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ ...iSt, width: 160 }}>
            <option>All</option>
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Fld>
        <Fld label="Status">
          <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ ...iSt, width: 140 }}>
            <option>All</option>
            <option>Published</option>
            <option>Draft</option>
          </select>
        </Fld>
        <Fld label="Sort By">
          <select value={docSort} onChange={(e) => setDocSort(e.target.value)} style={{ ...iSt, width: 170 }}>
            <option value="created-desc">Newest First</option>
            <option value="created-asc">Oldest First</option>
            <option value="title-asc">Title A-Z</option>
            <option value="title-desc">Title Z-A</option>
            <option value="assigned-desc">Assignments High-Low</option>
            <option value="status-asc">Status A-Z</option>
          </select>
        </Fld>
        <ContextDateRangeFilter />
        <Btn onClick={applyOrgDocFilters}>Go</Btn>
        <Btn variant="secondary" onClick={clearOrgDocFilters}>
          Clear Filters
        </Btn>
        {orgDocActiveFilters > 0 && (
          <span style={{ fontSize: 12, color: F.text3, fontWeight: 700 }}>
            {orgDocActiveFilters} active
          </span>
        )}
      </div>
      <div style={{ background: F.card, border: `1px solid ${F.border}`, borderRadius: 8, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <Th>Document</Th>
              <Th>Category</Th>
              <Th>Assigned To</Th>
              <Th right>Employees</Th>
              <Th>Status</Th>
              <Th>Owner</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filteredDocs.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: F.text3 }}>No documents match the selected filters.</td></tr>
            ) : filteredDocs.map((doc) => (
              <TrH key={doc.id}>
                <Td>
                  <div style={{ fontWeight: 800 }}>{doc.title}</div>
                  <div style={{ fontSize: 11, color: F.text3 }}>{doc.description}</div>
                  {doc.fileName && (
                    <div style={{ marginTop: 3, fontSize: 11, color: F.brand, fontWeight: 700 }}>
                      File: {doc.fileName}
                    </div>
                  )}
                </Td>
                <Td><Badge label={doc.category} color={F.brand} bg={F.infoBg} /></Td>
                <Td>{doc.assignedTo}</Td>
                <Td right><strong>{doc.assignedCount}</strong></Td>
                <Td>
                  <Badge
                    label={doc.status}
                    color={doc.status === "Published" ? F.success : F.warning}
                    bg={doc.status === "Published" ? F.successBg : F.warningBg}
                  />
                </Td>
                <Td>
                  <div style={{ fontWeight: 600 }}>{doc.owner}</div>
                  <div style={{ fontSize: 11, color: F.text3 }}>{fmtD(doc.createdOn)}</div>
                </Td>
                <Td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Btn
                      small
                      variant="secondary"
                      onClick={() => toast(`${doc.title} preview opened`, "info")}
                    >
                      View
                    </Btn>
                    <Btn
                      small
                      variant={doc.status === "Published" ? "ghost" : "success"}
                      onClick={() => {
                        setDocs((prev) =>
                          prev.map((d) =>
                            d.id === doc.id
                              ? { ...d, status: d.status === "Published" ? "Draft" : "Published" }
                              : d,
                          ),
                        )
                        toast(`${doc.title} ${doc.status === "Published" ? "moved to draft" : "published"}`, "success")
                      }}
                    >
                      {doc.status === "Published" ? "Unpublish" : "Publish"}
                    </Btn>
                  </div>
                </Td>
              </TrH>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <Modal title="Add Organization Document" onClose={() => setShowAdd(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Fld label="Document Title">
              <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} style={iSt} placeholder="e.g. Leave Policy FY 2026" />
            </Fld>
            <Fld label="Upload Document">
              <label
                style={{
                  border: `1px dashed ${draft.fileName ? F.brand : F.border}`,
                  borderRadius: 8,
                  background: draft.fileName ? F.infoBg : F.pageBg,
                  padding: "16px 18px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 14,
                  cursor: "pointer",
                }}
              >
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: 13, fontWeight: 900, color: F.text1 }}>
                    {draft.fileName || "Choose a file to upload"}
                  </span>
                  <span style={{ display: "block", marginTop: 3, fontSize: 12, color: F.text2 }}>
                    PDF, DOC, DOCX, XLSX, PNG, or JPG document
                  </span>
                </span>
                <span
                  style={{
                    border: `1px solid ${F.border}`,
                    borderRadius: 4,
                    background: F.card,
                    color: F.text1,
                    fontSize: 12,
                    fontWeight: 800,
                    padding: "7px 12px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Browse
                </span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    const inferredTitle = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]+/g, " ")
                    setDraft({
                      ...draft,
                      fileName: file.name,
                      title: draft.title.trim() ? draft.title : inferredTitle,
                    })
                  }}
                  style={{ display: "none" }}
                />
              </label>
            </Fld>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Fld label="Category">
                <select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value as OrgDocument["category"] })} style={iSt}>
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Fld>
              <Fld label="Status">
                <select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as OrgDocument["status"] })} style={iSt}>
                  <option>Published</option>
                  <option>Draft</option>
                </select>
              </Fld>
              <Fld label="Assign By">
                <select
                  value={draft.assignmentMode}
                  onChange={(e) => setDraft({ ...draft, assignmentMode: e.target.value, assignmentValue: "" })}
                  style={iSt}
                >
                  <option>All Employees</option>
                  <option>Department</option>
                  <option>Designation</option>
                </select>
              </Fld>
              <Fld label="Assignment Target">
                <select
                  value={draft.assignmentValue}
                  onChange={(e) => setDraft({ ...draft, assignmentValue: e.target.value })}
                  disabled={draft.assignmentMode === "All Employees"}
                  style={iSt}
                >
                  <option value="">Select target</option>
                  {(draft.assignmentMode === "Department" ? departments : designations).map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </Fld>
            </div>
            <Fld label="Description">
              <textarea
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                style={{ ...iSt, minHeight: 76, resize: "vertical" }}
                placeholder="Short note visible to admins..."
              />
            </Fld>
            <div style={{ padding: 12, borderRadius: 6, background: F.successBg, color: F.success, fontSize: 13, fontWeight: 700 }}>
              This document will be assigned to {assignmentCount()} employee{assignmentCount() !== 1 ? "s" : ""}.
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <Btn variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Btn>
              <Btn onClick={addDocument}>Add & Assign</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

function DocumentsView({
  orgDocs = [],
  emp,
}: {
  orgDocs?: OrgDocument[]
  emp?: Employee
}) {
  const toast = useToast()
  const [docSearch, setDocSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sourceFilter, setSourceFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [docSort, setDocSort] = useState("name-asc")
  const [hasRunDocumentSearch, setHasRunDocumentSearch] = useState(false)
  const [appliedDocumentFilters, setAppliedDocumentFilters] = useState({
    docSearch: "",
    categoryFilter: "all",
    sourceFilter: "all",
    statusFilter: "all",
    docSort: "name-asc",
  })
  const [previewDoc, setPreviewDoc] = useState<{
    name: string
    date: string
    type: string
    size: string
    desc: string
    source: string
    status: string
  } | null>(null)

  const assignedOrgDocs = orgDocs
    .filter(
      (doc) =>
        doc.status === "Published" &&
        (!emp ||
          doc.assignedTo === "All Employees" ||
          doc.assignedTo === emp.department ||
          doc.assignedTo === emp.designation),
    )
    .map((doc) => ({
      name: doc.title,
      date: fmtD(doc.createdOn),
      type: doc.category,
      size: "Managed",
      desc: doc.description,
      source: "Organization",
      status: "Published",
    }))

  const docs = [
    ...assignedOrgDocs,
    {
      name: "Employment Offer Letter",
      date: "15 Mar 2021",
      type: "Employment",
      size: "420 KB",
      desc: "Official appointment contract and terms of employment.",
      source: "Employee File",
      status: "Verified",
    },
    {
      name: "Annual Promotion & Appraisal Letter",
      date: "01 Apr 2024",
      type: "Career",
      size: "310 KB",
      desc: "Designation revision and compensation enhancement notification.",
      source: "Employee File",
      status: "Verified",
    },
    {
      name: "Form 16 Tax Certificate (FY 2025-26)",
      date: "15 Jun 2026",
      type: "Tax",
      size: "850 KB",
      desc: "Part A & Part B TDS certificate issued under Section 203.",
      source: "Payroll",
      status: "Verified",
    },
    {
      name: "Non-Disclosure Agreement (NDA)",
      date: "15 Mar 2021",
      type: "Compliance",
      size: "280 KB",
      desc: "Confidentiality agreement signed at onboarding.",
      source: "Employee File",
      status: "Read Only",
    },
  ]

  const categories = Array.from(new Set(docs.map((d) => d.type)))
  const f4DocNames = docs.map((d) => d.name)

  const filteredDocs = (hasRunDocumentSearch ? docs : []).filter((doc) => {
    if (!searchMatches(appliedDocumentFilters.docSearch, [doc.name])) {
      return false
    }
    if (appliedDocumentFilters.categoryFilter !== "all" && doc.type !== appliedDocumentFilters.categoryFilter) {
      return false
    }
    if (appliedDocumentFilters.sourceFilter !== "all" && doc.source !== appliedDocumentFilters.sourceFilter) {
      return false
    }
    if (appliedDocumentFilters.statusFilter !== "all" && doc.status !== appliedDocumentFilters.statusFilter) {
      return false
    }
    return true
  }).sort((a, b) => {
    const dir = appliedDocumentFilters.docSort.endsWith("-desc") ? -1 : 1
    if (appliedDocumentFilters.docSort.startsWith("date")) {
      return (new Date(a.date).getTime() - new Date(b.date).getTime()) * dir
    }
    if (appliedDocumentFilters.docSort.startsWith("source")) {
      return a.source.localeCompare(b.source) * dir
    }
    if (appliedDocumentFilters.docSort.startsWith("status")) {
      return a.status.localeCompare(b.status) * dir
    }
    return a.name.localeCompare(b.name) * dir
  })

  const documentSources = Array.from(new Set(docs.map((d) => d.source)))
  const documentStatuses = Array.from(new Set(docs.map((d) => d.status)))
  const downloadDocument = (doc: typeof docs[number]) => {
    const content = [
      "Naxpayroll Employee Document",
      `Document: ${doc.name}`,
      `Issue Date: ${doc.date}`,
      `Category: ${doc.type}`,
      `Source: ${doc.source}`,
      `Status: ${doc.status}`,
      "",
      doc.desc,
      "",
      "This file is system-generated for preview/download in the employee document center.",
    ].join("\n")
    const blob = new Blob([content], { type: "application/pdf" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = `${doc.name.replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "")}.pdf`
    a.click()
    URL.revokeObjectURL(a.href)
    toast(`${doc.name} downloaded`, "success")
  }
  const documentBadge = (status: string) => {
    if (status === "Verified") {
      return <Badge label="Verified" color={F.success} bg={F.successBg} dot={F.success} />
    }
    if (status === "Published") {
      return <Badge label="Published" color={F.brand} bg={F.infoBg} dot={F.brand} />
    }
    if (status === "Read Only") {
      return <Badge label="Read Only" color={F.warning} bg={F.warningBg} dot={F.warning} />
    }
    return <Badge label={status} color={F.text2} bg={F.pageBg} dot={F.text3} />
  }
  const hasDocumentFilters = Boolean(
    activeSearch(appliedDocumentFilters.docSearch) ||
      appliedDocumentFilters.categoryFilter !== "all" ||
      appliedDocumentFilters.sourceFilter !== "all" ||
      appliedDocumentFilters.statusFilter !== "all" ||
      appliedDocumentFilters.docSort !== "name-asc",
  )
  const applyDocumentFilters = () => {
    setHasRunDocumentSearch(true)
    setAppliedDocumentFilters({
      docSearch,
      categoryFilter,
      sourceFilter,
      statusFilter,
      docSort,
    })
  }
  const clearDocumentFilters = () => {
    setHasRunDocumentSearch(false)
    setDocSearch("")
    setCategoryFilter("all")
    setSourceFilter("all")
    setStatusFilter("all")
    setDocSort("name-asc")
    setAppliedDocumentFilters({
      docSearch: "",
      categoryFilter: "all",
      sourceFilter: "all",
      statusFilter: "all",
      docSort: "name-asc",
    })
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 800,
              color: F.text1,
              letterSpacing: "-0.01em",
            }}
          >
            My Documents
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: F.text2 }}>
            HR-issued employment letters, tax certificates, and compliance records
          </p>
        </div>
        <div style={{ fontSize: 12, color: F.text3, fontWeight: 600 }}>
          {filteredDocs.length} Document{filteredDocs.length !== 1 ? "s" : ""} Available
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 12 }}>
        <Tile label="Available Documents" value={String(docs.length)} sub="Assigned and employee records" accent={F.brand} />
        <Tile label="Verified Records" value={String(docs.filter((d) => d.status === "Verified").length)} sub="Ready for official use" accent={F.success} />
        <Tile label="Read-only Files" value={String(docs.length)} sub="View and download access only" accent={F.warning} />
        <Tile label="Managed Sources" value={String(documentSources.length)} sub="HR, payroll, and employee file" accent="#00A389" />
      </div>

      {/* Filter & F4 Search Toolbar */}
      <div
        style={{
          background: F.card,
          border: `1px solid ${F.border}`,
          borderRadius: 8,
          padding: "14px 18px",
          display: "flex",
          alignItems: "flex-end",
          gap: 14,
          flexWrap: "wrap",
          boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
        }}
      >
        <div style={{ flex: 2, minWidth: 240 }}>
          <ValueHelp
            label="Search Document Name (F4 Search)"
            value={docSearch}
            onChange={setDocSearch}
            placeholder="Search document name (e.g. Offer Letter)…"
            values={f4DocNames}
          />
        </div>

        <div style={{ width: 160 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: F.text2,
              marginBottom: 3,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Category Filter
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ ...iSt, cursor: "pointer" }}
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div style={{ width: 160 }}>
          <Fld label="Source">
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              style={{ ...iSt, cursor: "pointer" }}
            >
              <option value="all">All Sources</option>
              {documentSources.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </Fld>
        </div>

        <div style={{ width: 190 }}>
          <Fld label="Status">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ ...iSt, cursor: "pointer" }}
            >
              <option value="all">All Statuses</option>
              {documentStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </Fld>
        </div>

        <div style={{ width: 170 }}>
          <Fld label="Sort By">
            <select
              value={docSort}
              onChange={(e) => setDocSort(e.target.value)}
              style={{ ...iSt, cursor: "pointer" }}
            >
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="source-asc">Source A-Z</option>
              <option value="status-asc">Status A-Z</option>
            </select>
          </Fld>
        </div>

        <ContextDateRangeFilter />

        <Btn onClick={applyDocumentFilters}>Go</Btn>
        <Btn variant="secondary" onClick={clearDocumentFilters}>
          Clear Filters
        </Btn>
        {hasDocumentFilters && (
          <span style={{ fontSize: 12, color: F.text3, fontWeight: 700, height: 34, display: "flex", alignItems: "center" }}>
            Filtered
          </span>
        )}
      </div>

      {/* Documents Table */}
      <div
        style={{
          background: F.card,
          border: `1px solid ${F.border}`,
          borderRadius: 8,
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600, fontSize: 13 }}>
          <thead>
            <tr
              style={{
                borderBottom: `1px solid ${F.border}`,
                background: F.pageBg,
                color: F.text2,
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              <th style={{ padding: "12px 18px", textAlign: "left" }}>Document Title</th>
              <th style={{ padding: "12px 14px", textAlign: "left" }}>Issue Date</th>
              <th style={{ padding: "12px 14px", textAlign: "center" }}>Category</th>
              <th style={{ padding: "12px 14px", textAlign: "left" }}>Source</th>
              <th style={{ padding: "12px 14px", textAlign: "center" }}>Status</th>
              <th style={{ padding: "12px 14px", textAlign: "left" }}>File Format</th>
              <th style={{ padding: "12px 18px", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocs.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: 36, textAlign: "center", color: F.text3 }}>
                  No documents match your filter criteria.
                </td>
              </tr>
            ) : (
              filteredDocs.map((doc) => (
                <tr
                  key={doc.name}
                  style={{
                    borderBottom: `1px solid ${F.border}60`,
                    transition: "background 0.12s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = F.pageBg)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "14px 18px" }}>
                    <div style={{ fontWeight: 800, color: F.text1 }}>{doc.name}</div>
                    <div style={{ fontSize: 11, color: F.text3, marginTop: 2 }}>
                      {doc.desc}
                    </div>
                  </td>
                  <td style={{ padding: "14px 14px", color: F.text2 }}>{doc.date}</td>
                  <td style={{ padding: "14px 14px", textAlign: "center" }}>
                    <Badge label={doc.type} color={F.brand} bg={F.infoBg} />
                  </td>
                  <td style={{ padding: "14px 14px", color: F.text2 }}>{doc.source}</td>
                  <td style={{ padding: "14px 14px", textAlign: "center" }}>
                    {documentBadge(doc.status)}
                  </td>
                  <td style={{ padding: "14px 14px", color: F.text3, fontSize: 12 }}>
                    PDF ({doc.size})
                  </td>
                  <td style={{ padding: "14px 18px", textAlign: "right" }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, flexWrap: "wrap" }}>
                      <Btn small variant="secondary" onClick={() => setPreviewDoc(doc)}>
                        View
                      </Btn>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* SAP Fiori Info Note */}
      <div
        style={{
          padding: "14px 18px",
          borderLeft: `4px solid ${F.brand}`,
          background: F.card,
          border: `1px solid ${F.border}`,
          borderLeftColor: F.brand,
          borderRadius: 8,
          color: F.text2,
          fontSize: 12,
          lineHeight: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <strong style={{ color: F.text1 }}>Document Storage Policy:</strong> Documents issued by HR are read-only and digitally verified. Employees can view or download documents, but cannot acknowledge, edit, pin, or change their status.
        </div>
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <Modal
          title={`Document Viewer — ${previewDoc.name}`}
          onClose={() => setPreviewDoc(null)}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                background: "linear-gradient(180deg, #FFFFFF 0%, #F7FAFC 100%)",
                border: `1px solid ${F.border}`,
                borderRadius: 8,
                padding: "20px 24px",
                boxShadow: "0 1px 3px rgba(15,23,42,0.04)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: F.brand, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {previewDoc.type} Document
                  </div>
                  <h3 style={{ margin: "5px 0 6px", fontSize: 18, color: F.text1, lineHeight: 1.25 }}>
                    {previewDoc.name}
                  </h3>
                  <p style={{ margin: 0, fontSize: 13, color: F.text2 }}>
                    Issued on {previewDoc.date} &bull; File Size: {previewDoc.size}
                  </p>
                </div>
                {documentBadge(previewDoc.status)}
              </div>
            </div>

            <div
              style={{
                border: `1px solid ${F.border}`,
                borderRadius: 8,
                padding: "38px 40px",
                textAlign: "center",
                background: "#FBFCFD",
              }}
            >
              <strong style={{ color: F.text1, fontSize: 14, display: "block" }}>
                Digitally Signed & Verified Document
              </strong>
              <div style={{ color: F.text2, fontSize: 12, marginTop: 4 }}>
                {previewDoc.desc}
              </div>
              <div style={{ color: F.text3, fontSize: 12, marginTop: 10 }}>
                Source: {previewDoc.source} - Status: {previewDoc.status}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <Btn variant="secondary" onClick={() => setPreviewDoc(null)}>
                Close
              </Btn>
              <Btn onClick={() => downloadDocument(previewDoc)}>
                Download PDF
              </Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

function FinancialDataView({
  emp,
  payruns,
}: {
  emp: Employee
  payruns: Payrun[]
}) {
  const toast = useToast()
  const [regime, setRegime] = useState("new")
  const [confirmModal, setConfirmModal] = useState(false)
  const [declarationModal, setDeclarationModal] = useState(false)
  const [activeTab, setActiveTab] = useState<"regime" | "declarations" | "deductions">("regime")

  const latest = ownPayruns(payruns, emp.id)
    .find((r) => isFinalizedPayrun(r.status))
    ?.rows.find((r) => r.empId === emp.id)

  const declarations = [
    { section: "Sec 80C", name: "Life Insurance & EPF", declared: "₹1,50,000", status: "Verified" },
    { section: "Sec 80D", name: "Health Insurance Premium", declared: "₹25,000", status: "Under Review" },
    { section: "Sec 24(b)", name: "Home Loan Interest", declared: "₹2,00,000", status: "Declared" },
    { section: "Sec 80CCD", name: "National Pension Scheme (NPS)", declared: "₹50,000", status: "Verified" },
  ]

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 800,
              color: F.text1,
              letterSpacing: "-0.01em",
            }}
          >
            Financial Data & Tax Portal
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: F.text2 }}>
            Income tax regime preference, investment declarations, and statutory withholdings
          </p>
        </div>
        <Badge
          label="Tax Year 2026-27"
          color={F.brand}
          bg={F.infoBg}
        />
      </div>

      {/* Navigation Tabs in Fiori Style */}
      <div
        style={{
          display: "flex",
          borderBottom: `1px solid ${F.border}`,
          gap: 20,
        }}
      >
        {(
          [
            ["regime", "Tax Regime Selection"],
            ["declarations", "Investment Declarations"],
            ["deductions", "Statutory Deductions Summary"],
          ] as const
        ).map(([tabKey, label]) => {
          const active = activeTab === tabKey
          return (
            <button
              key={tabKey}
              onClick={() => setActiveTab(tabKey)}
              style={{
                background: "none",
                border: "none",
                borderBottom: `3px solid ${active ? F.brand : "transparent"}`,
                padding: "10px 4px",
                fontSize: 13,
                fontWeight: active ? 700 : 500,
                color: active ? F.brand : F.text2,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* TAB 1: Tax Regime Selection */}
      {activeTab === "regime" && (
        <div
          style={{
            background: F.card,
            border: `1px solid ${F.border}`,
            borderRadius: 8,
            padding: "20px 24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: F.text1 }}>
                Income Tax Regime Preference
              </h2>
              <p style={{ margin: "3px 0 0", fontSize: 12, color: F.text2 }}>
                Effective from 1 April 2026. Your selection applies for TDS withholding across FY 2026-27.
              </p>
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: F.success,
                background: F.successBg,
                padding: "3px 10px",
                borderRadius: 12,
                height: 22,
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              Active: {regime === "new" ? "New Regime" : "Old Regime"}
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* New Tax Regime Option */}
            <div
              onClick={() => setRegime("new")}
              style={{
                border: `2px solid ${regime === "new" ? F.brand : F.border}`,
                borderRadius: 8,
                padding: "18px 20px",
                cursor: "pointer",
                background: regime === "new" ? F.infoBg : F.card,
                transition: "all 0.15s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <input
                  type="radio"
                  name="regime"
                  checked={regime === "new"}
                  onChange={() => setRegime("new")}
                  style={{ accentColor: F.brand }}
                />
                <strong style={{ fontSize: 15, color: F.text1 }}>
                  New Tax Regime (Sec 115BAC) &mdash; Recommended
                </strong>
              </div>
              <ul style={{ margin: 0, paddingLeft: 24, fontSize: 12, color: F.text2, lineHeight: 1.6 }}>
                <li>Lower slab rates with Standard Deduction of ₹75,000</li>
                <li>No requirement to submit 80C or HRA rent receipts</li>
                <li>Simplified compliance with zero documentation overhead</li>
              </ul>
            </div>

            {/* Old Tax Regime Option */}
            <div
              onClick={() => setRegime("old")}
              style={{
                border: `2px solid ${regime === "old" ? F.brand : F.border}`,
                borderRadius: 8,
                padding: "18px 20px",
                cursor: "pointer",
                background: regime === "old" ? F.infoBg : F.card,
                transition: "all 0.15s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <input
                  type="radio"
                  name="regime"
                  checked={regime === "old"}
                  onChange={() => setRegime("old")}
                  style={{ accentColor: F.brand }}
                />
                <strong style={{ fontSize: 15, color: F.text1 }}>
                  Old Tax Regime (Exemptions & Deductions)
                </strong>
              </div>
              <ul style={{ margin: 0, paddingLeft: 24, fontSize: 12, color: F.text2, lineHeight: 1.6 }}>
                <li>Claim exemptions for HRA, LTA, and Standard Deduction</li>
                <li>Deductions under Sec 80C (up to ₹1.5L), 80D, and Home Loan Interest</li>
                <li>Requires submission of rent receipts & investment proofs</li>
              </ul>
            </div>
          </div>

          <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
            <Btn onClick={() => setConfirmModal(true)}>
              Save Tax Regime Selection
            </Btn>
          </div>
        </div>
      )}

      {/* TAB 2: Investment Declarations */}
      {activeTab === "declarations" && (
        <div
          style={{
            background: F.card,
            border: `1px solid ${F.border}`,
            borderRadius: 8,
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
          }}
        >
          <div
            style={{
              padding: "16px 20px",
              borderBottom: `1px solid ${F.border}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: F.text1 }}>
                Section 80C & IT Deductions Declaration
              </h2>
              <div style={{ fontSize: 12, color: F.text2, marginTop: 2 }}>
                Submit investment proofs to reduce TDS tax liability under Old Regime
              </div>
            </div>
            <Btn small variant="secondary" onClick={() => setDeclarationModal(true)}>
              + Add New Declaration
            </Btn>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr
                style={{
                  borderBottom: `1px solid ${F.border}`,
                  background: F.pageBg,
                  color: F.text2,
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                <th style={{ padding: "10px 18px", textAlign: "left" }}>IT Section</th>
                <th style={{ padding: "10px 14px", textAlign: "left" }}>Investment Name</th>
                <th style={{ padding: "10px 14px", textAlign: "right" }}>Declared Amount</th>
                <th style={{ padding: "10px 18px", textAlign: "center" }}>Proof Verification</th>
              </tr>
            </thead>
            <tbody>
              {declarations.map((d) => (
                <tr key={d.name} style={{ borderBottom: `1px solid ${F.border}60` }}>
                  <td style={{ padding: "14px 18px", fontWeight: 700, color: F.brand }}>
                    {d.section}
                  </td>
                  <td style={{ padding: "14px 14px", color: F.text1 }}>{d.name}</td>
                  <td style={{ padding: "14px 14px", textAlign: "right", fontWeight: 700, color: F.text1 }}>
                    {d.declared}
                  </td>
                  <td style={{ padding: "14px 18px", textAlign: "center" }}>
                    <Badge
                      label={d.status}
                      color={d.status === "Verified" ? F.success : F.warning}
                      bg={d.status === "Verified" ? F.successBg : F.warningBg}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: Statutory Deductions Summary */}
      {activeTab === "deductions" && (
        <div
          style={{
            background: F.card,
            border: `1px solid ${F.border}`,
            borderRadius: 8,
            padding: "20px 24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
          }}
        >
          <h2 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 800, color: F.text1 }}>
            Latest Statutory Deductions Summary
          </h2>
          <p style={{ margin: "0 0 16px", fontSize: 12, color: F.text2 }}>
            Withholding breakdown from your most recent completed payslip
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 16,
            }}
          >
            <div
              style={{
                background: F.pageBg,
                border: `1px solid ${F.border}`,
                borderRadius: 8,
                padding: "16px 18px",
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: F.text2, textTransform: "uppercase" }}>
                Provident Fund (PF)
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: F.brand, marginTop: 4 }}>
                {inr(latest?.pf ?? 7200)}
              </div>
              <div style={{ fontSize: 11, color: F.text3, marginTop: 2 }}>
                12% of Basic Salary
              </div>
            </div>

            <div
              style={{
                background: F.pageBg,
                border: `1px solid ${F.border}`,
                borderRadius: 8,
                padding: "16px 18px",
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: F.text2, textTransform: "uppercase" }}>
                Income Tax (TDS)
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: F.warning, marginTop: 4 }}>
                {inr(latest?.tds ?? 11000)}
              </div>
              <div style={{ fontSize: 11, color: F.text3, marginTop: 2 }}>
                Monthly TDS Withholding
              </div>
            </div>

            <div
              style={{
                background: F.pageBg,
                border: `1px solid ${F.border}`,
                borderRadius: 8,
                padding: "16px 18px",
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: F.text2, textTransform: "uppercase" }}>
                Professional Tax (PT)
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: F.text1, marginTop: 4 }}>
                {inr(latest?.profTax ?? 200)}
              </div>
              <div style={{ fontSize: 11, color: F.text3, marginTop: 2 }}>
                State Statutory Levy
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Regime Confirmation Modal */}
      {declarationModal && (
        <Modal title="Add New Declaration" onClose={() => setDeclarationModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Fld label="Section">
              <select style={iSt} defaultValue="Sec 80C">
                <option>Sec 80C</option>
                <option>Sec 80D</option>
                <option>Sec 24(b)</option>
                <option>Sec 80CCD</option>
              </select>
            </Fld>
            <Fld label="Investment Name">
              <input style={iSt} placeholder="Enter investment name" />
            </Fld>
            <Fld label="Declared Amount">
              <input style={iSt} type="number" min="0" placeholder="Enter amount" />
            </Fld>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <Btn variant="secondary" onClick={() => setDeclarationModal(false)}>Cancel</Btn>
              <Btn onClick={() => { setDeclarationModal(false); toast("Declaration submitted", "success") }}>Submit Declaration</Btn>
            </div>
          </div>
        </Modal>
      )}

      {confirmModal && (
        <Modal title="Confirm Tax Regime Selection" onClose={() => setConfirmModal(false)}>
          <p style={{ color: F.text2, fontSize: 13, lineHeight: 1.5 }}>
            You are selecting the{" "}
            <strong style={{ color: F.brand }}>
              {regime === "new" ? "New Tax Regime (Sec 115BAC)" : "Old Tax Regime"}
            </strong>{" "}
            for FY 2026-27. This selection will be used to calculate monthly TDS deductions on your payroll.
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
              marginTop: 20,
            }}
          >
            <Btn variant="secondary" onClick={() => setConfirmModal(false)}>
              Cancel
            </Btn>
            <Btn
              onClick={() => {
                setConfirmModal(false)
                toast("Tax regime selection updated successfully", "success")
              }}
            >
              Confirm Selection
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  )
}


function LoginPage({ onLogin }: { onLogin: (persona: Persona) => void }) {
  const [activeTab, setActiveTab] = useState<Persona>("org_admin")
  const [email, setEmail] = useState("meena.iyer@naxrita.com")
  const [password, setPassword] = useState("Password@2026")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [forgotModal, setForgotModal] = useState(false)
  const [forgotEmail, setForgotEmail] = useState("")
  const [forgotSubmitted, setForgotSubmitted] = useState(false)
  const toast = useToast()

  const tabAccounts: Record<
    Persona,
    {
      label: string
      email: string
      role: string
    }
  > = {
    org_admin: {
      label: "Organisation Admin",
      email: "meena.iyer@naxrita.com",
      role: "Organization Administrator",
    },
    product_admin: {
      label: "Product Admin",
      email: "admin@naxpayroll.io",
      role: "Platform Administrator",
    },
    employee: {
      label: "Employee Login",
      email: "priya.nair@naxrita.in",
      role: "Employee Self-Service",
    },
  }

  const handleTabSelect = (tab: Persona) => {
    setActiveTab(tab)
    setEmail(tabAccounts[tab].email)
    setPassword("Password@2026")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      toast("Please enter your email or username", "warning")
      return
    }
    if (!password.trim()) {
      toast("Please enter your password", "warning")
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      onLogin(activeTab)
    }, 300)
  }

  return (
    <div
      className="sap-login-page"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#F5F6F7",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        color: F.text1,
        padding: "24px 16px",
      }}
    >
      {/* Enterprise Login Card */}
      <div
        className="sap-login-card"
        style={{
          width: "100%",
          maxWidth: 440,
          background: "#FFFFFF",
          border: `1px solid ${F.border}`,
          borderRadius: 8,
          boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.03)",
          padding: "36px 36px 32px",
          boxSizing: "border-box",
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 42,
              height: 42,
              borderRadius: 8,
              background: "linear-gradient(135deg, #0070F2 0%, #0054A6 100%)",
              marginBottom: 12,
              boxShadow: "0 2px 8px rgba(0, 112, 242, 0.35)",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              <polyline points="10 8 13 11 16 8" />
            </svg>
          </div>
          <h1
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: F.text1,
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            Sign in to Naxpayroll
          </h1>
          <p style={{ fontSize: 13, color: F.text2, margin: "5px 0 0 0" }}>
            Select your portal to continue
          </p>
        </div>

        {/* 3 Tabs: Organisation Admin, Product Admin, Employee Login */}
        <div
          style={{
            display: "flex",
            background: "#F1F3F5",
            padding: 3,
            borderRadius: 6,
            marginBottom: 24,
            gap: 3,
          }}
        >
          {(
            [
              { id: "org_admin" as Persona, label: "Organisation Admin" },
              { id: "product_admin" as Persona, label: "Product Admin" },
              { id: "employee" as Persona, label: "Employee Login" },
            ]
          ).map((tab) => {
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabSelect(tab.id)}
                style={{
                  flex: 1,
                  padding: "8px 6px",
                  background: active ? "#FFFFFF" : "transparent",
                  border: "none",
                  borderRadius: 5,
                  fontSize: 11.5,
                  fontWeight: active ? 600 : 500,
                  color: active ? F.brand : F.text2,
                  boxShadow: active ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                }}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Clean Login Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Email / Username */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 600,
                color: F.text1,
                marginBottom: 6,
              }}
            >
              Email or Username
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: `1px solid ${F.border}`,
                borderRadius: 5,
                background: "#FFFFFF",
                padding: "0 12px",
                height: 40,
                transition: "border-color 0.15s ease",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = F.brand)}
              onBlur={(e) => (e.currentTarget.style.borderColor = F.border)}
            >
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  fontSize: 13,
                  color: F.text1,
                  background: "transparent",
                }}
              />
              {email && (
                <button
                  type="button"
                  onClick={() => setEmail("")}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: F.text3,
                    fontSize: 15,
                    padding: "0 2px",
                  }}
                  title="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Password */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: F.text1,
                }}
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setForgotEmail(email)
                  setForgotModal(true)
                  setForgotSubmitted(false)
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 12,
                  color: F.brand,
                  fontWeight: 500,
                  padding: 0,
                }}
              >
                Forgot password?
              </button>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: `1px solid ${F.border}`,
                borderRadius: 5,
                background: "#FFFFFF",
                padding: "0 12px",
                height: 40,
                transition: "border-color 0.15s ease",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = F.brand)}
              onBlur={(e) => (e.currentTarget.style.borderColor = F.border)}
            >
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  fontSize: 13,
                  color: F.text1,
                  background: "transparent",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: F.text3,
                  padding: "0 2px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {showPassword ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              id="rememberMeCheckbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{
                cursor: "pointer",
                accentColor: F.brand,
                width: 15,
                height: 15,
              }}
            />
            <label
              htmlFor="rememberMeCheckbox"
              style={{
                fontSize: 12.5,
                color: F.text2,
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              Remember me
            </label>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              height: 42,
              background: F.brand,
              color: "#FFFFFF",
              border: "none",
              borderRadius: 5,
              fontSize: 13.5,
              fontWeight: 600,
              cursor: isLoading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: "0 1px 3px rgba(0, 112, 242, 0.3)",
              transition: "background 0.15s ease",
              marginTop: 4,
            }}
            onMouseEnter={(e) => {
              if (!isLoading) e.currentTarget.style.background = F.brandHover
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = F.brand
            }}
          >
            {isLoading ? (
              <span>Signing in...</span>
            ) : (
              <span>Sign In as {tabAccounts[activeTab].label}</span>
            )}
          </button>
        </form>

        {/* Subtle Pre-filled Notice */}
        <div
          style={{
            marginTop: 22,
            paddingTop: 16,
            borderTop: `1px solid ${F.border}`,
            textAlign: "center",
            fontSize: 11.5,
            color: F.text3,
          }}
        >
          <span>Single Sign-On (SSO) active • Demo credentials pre-filled</span>
        </div>
      </div>

      {/* Subtle Footer */}
      <div
        style={{
          marginTop: 24,
          fontSize: 12,
          color: F.text3,
          textAlign: "center",
          display: "flex",
          gap: 16,
        }}
      >
        <span>© 2026 Naxpayroll Inc.</span>
        <span>•</span>
        <span style={{ cursor: "pointer", color: F.text2 }}>Privacy</span>
        <span>•</span>
        <span style={{ cursor: "pointer", color: F.text2 }}>Terms</span>
        <span>•</span>
        <span style={{ cursor: "pointer", color: F.text2 }}>Help</span>
      </div>

      {/* Forgot Password Modal */}
      {forgotModal && (
        <Modal title="Reset Password" onClose={() => setForgotModal(false)}>
          {forgotSubmitted ? (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: F.text1, margin: "0 0 8px" }}>
                Reset Instructions Sent
              </h3>
              <p style={{ fontSize: 13, color: F.text2, margin: 0, lineHeight: 1.5 }}>
                We've sent a password reset link to <strong style={{ color: F.brand }}>{forgotEmail}</strong>.
              </p>
              <div style={{ marginTop: 20 }}>
                <Btn onClick={() => setForgotModal(false)}>Back to Sign In</Btn>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <p style={{ fontSize: 13, color: F.text2, margin: 0, lineHeight: 1.5 }}>
                Enter your work email address and we'll send you a link to reset your password.
              </p>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: F.text1, marginBottom: 5 }}>
                  Work Email Address
                </label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@company.com"
                  style={{
                    width: "100%",
                    height: 38,
                    border: `1px solid ${F.border}`,
                    borderRadius: 4,
                    padding: "0 10px",
                    fontSize: 13,
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                <Btn variant="secondary" onClick={() => setForgotModal(false)}>
                  Cancel
                </Btn>
                <Btn
                  onClick={() => {
                    if (!forgotEmail.trim()) {
                      toast("Please enter your email", "warning")
                      return
                    }
                    setForgotSubmitted(true)
                    toast("Reset link sent", "success")
                  }}
                >
                  Send Reset Link
                </Btn>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  )
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [persona, setPersona] = useState<Persona>("org_admin")
  const [view, setView] = useState("dashboard")
  const [rangeFrom, setRangeFrom] = useState("")
  const [rangeTo, setRangeTo] = useState("")
  const [emps, setEmps] = useState<Employee[]>(INIT_EMPS)
  const [ss, setSS] = useState<SalaryStructure[]>(INIT_SS)
  const [payruns, setPayruns] = useState<Payrun[]>(INIT_PAYRUNS)
  const [orgs, setOrgs] = useState<Organization[]>(INIT_ORGS)
  const [orgDocs, setOrgDocs] = useState<OrgDocument[]>(INIT_ORG_DOCUMENTS)
  const [auditLogs] = useState<AuditLog[]>(INIT_AUDIT)
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>(INIT_ERROR_LOGS)
  const [adminProfiles, setAdminProfiles] = useState<
    Record<"product_admin" | "org_admin", AdminProfileData>
  >(DEFAULT_ADMIN_PROFILES)
  const [toasts, setToasts] = useState<ToastItem[]>([])
  // Numeric fields are non-negative throughout the application.  Enforce this
  // centrally so newly added forms inherit the same rule as existing payroll,
  // salary, tax, and employee inputs.
  useEffect(() => {
    const normalizeNumericInputs = () => {
      document.querySelectorAll<HTMLInputElement>('input[type="number"]').forEach((input) => {
        if (!input.hasAttribute("min")) input.min = "0"
        if (input.value !== "" && Number(input.value) < 0) input.value = "0"
      })
    }
    const enforceNonNegative = (event: Event) => {
      const input = event.target as HTMLInputElement | null
      if (!input || input.tagName !== "INPUT" || input.type !== "number") return
      if (input.value !== "" && (!Number.isFinite(Number(input.value)) || Number(input.value) < 0)) {
        input.value = Number.isFinite(Number(input.value)) ? "0" : ""
      }
    }
    normalizeNumericInputs()
    document.addEventListener("input", enforceNonNegative, true)
    document.addEventListener("change", enforceNonNegative, true)
    const observer = new MutationObserver(normalizeNumericInputs)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => {
      document.removeEventListener("input", enforceNonNegative, true)
      document.removeEventListener("change", enforceNonNegative, true)
      observer.disconnect()
    }
  }, [])
  const showToast = useCallback((msg: string, type: ToastType = "info") => {
    const id = Date.now()
    setToasts((t) => [...t, { id, msg, type }])
    if (type === "error" && persona !== "employee") {
      setErrorLogs((prev) => [
        {
          id: `ERR-${String(prev.length + 1).padStart(3, "0")}`,
          timestamp: new Date().toLocaleString("sv-SE").replace("T", " "),
          role: persona,
          user: adminProfiles[persona].name,
          module: navLabelForView(view),
          severity: "Medium",
          issue: msg,
          route: `/${view}`,
          status: "Open",
        },
        ...prev,
      ])
    }
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200)
  }, [adminProfiles, persona, view])

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const myEmp = emps.find((e) => e.id === MY_EMP_ID)!
  const nav =
    persona === "product_admin"
      ? PROD_NAV
      : persona === "employee"
        ? EMP_NAV
        : ORG_NAV
  const personaUser: Record<Persona, string> = {
    org_admin: adminProfiles.org_admin.name,
    product_admin: adminProfiles.product_admin.name,
    employee: myEmp.name,
  }
  const personaRole: Record<Persona, string> = {
    org_admin: adminProfiles.org_admin.role,
    product_admin: adminProfiles.product_admin.role,
    employee: myEmp.designation,
  }
  const personaInit: Record<Persona, string> = {
    org_admin:
      adminProfiles.org_admin.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "MI",
    product_admin:
      adminProfiles.product_admin.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "PA",
    employee:
      myEmp.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "PN",
  }
  const switchPersona = (p: Persona) => {
    setPersona(p)
    setView("dashboard")
  }
  if (!isLoggedIn) {
    return (
      <ToastCtx.Provider value={showToast}>
        <LoginPage
          onLogin={(p) => {
            setPersona(p)
            setView("dashboard")
            setIsLoggedIn(true)
            showToast(`Welcome back, ${personaUser[p]}! Logged in as ${personaRole[p]}`, "success")
          }}
        />
        <Toasts toasts={toasts} />
      </ToastCtx.Provider>
    )
  }

  return (
    <ToastCtx.Provider value={showToast}>
      <div
        className="sap-app-shell"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          background: F.pageBg,
          fontFamily: "'Inter',Arial,sans-serif",
          color: F.text1,
        }}
      >
        <header
          className="sap-shell-bar"
          style={{
            height: 48,
            background: F.shell,
            display: "flex",
            alignItems: "center",
            paddingInline: 16,
            gap: 10,
            flexShrink: 0,
            boxShadow: "0 1px 0 #d5dadd, 0 2px 8px rgba(34,54,73,0.08)",
            zIndex: 100,
          }}
        >
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            aria-expanded={sidebarOpen}
            style={{
              background: "none",
              border: "none",
              color: F.text2,
              cursor: "pointer",
              padding: 6,
              borderRadius: 4,
              display: "flex",
              flexDirection: "column",
              gap: 4.5,
              flexShrink: 0,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = F.highlight)
            }
            onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
          >
            <span
              aria-hidden="true"
              style={{
                width: 18,
                height: 2,
                background: "currentColor",
                borderRadius: 1,
                display: "block",
              }}
            />
            <span
              aria-hidden="true"
              style={{
                width: 14,
                height: 2,
                background: "currentColor",
                borderRadius: 1,
                display: "block",
              }}
            />
            <span
              aria-hidden="true"
              style={{
                width: 18,
                height: 2,
                background: "currentColor",
                borderRadius: 1,
                display: "block",
              }}
            />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: F.brand,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 800,
                fontSize: 13,
                letterSpacing: "-0.5px",
              }}
            >
              Nx
            </div>
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: F.text1,
                  lineHeight: 1.1,
                }}
              >
                Naxpayroll
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: F.text3,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Payroll Platform
              </div>
            </div>
          </div>
          <div style={{ flex: 1 }} />
          <LiveClock />
          <NotificationBell showToast={showToast} onNavigate={setView} />
          <ProfileMenu
            persona={persona}
            onProfile={() => setView("profile")}
            personaUser={personaUser}
            personaRole={personaRole}
            personaInit={personaInit}
            showToast={showToast}
            onSignOut={() => {
              setIsLoggedIn(false)
            }}
          />
        </header>

        <div
          className={`sap-workspace${sidebarOpen ? "" : " is-collapsed"}`}
          style={{
            display: "grid",
            gridTemplateColumns: sidebarOpen ? "220px minmax(0, 1fr)" : "56px minmax(0, 1fr)",
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
            transition: "grid-template-columns 0.2s ease",
          }}
        >
          <nav
            className="sap-side-navigation"
            style={{
              width: "100%",
              background: F.card,
              display: "flex",
              flexDirection: "column",
              flexShrink: 0,
              overflowY: "auto",
              overflowX: "hidden",
              paddingTop: 8,
              paddingBottom: 16,
              transition: "width 0.2s ease",
            }}
          >
            {nav.map((item) => {
              const active = view === item.id
              return (
                <div
                  key={item.id}
                  title={!sidebarOpen ? item.label : undefined}
                  style={{ position: "relative" }}
                >
                  <button
                    className={`sap-nav-item${active ? " is-active" : ""}`}
                    onClick={() => setView(item.id)}
                    title={item.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: sidebarOpen ? "10px 16px" : "11px 0",
                      justifyContent: sidebarOpen ? "flex-start" : "center",
                      background: active ? F.highlight : "transparent",
                      border: "none",
                      borderLeft: `3px solid ${
                        active ? F.brand : "transparent"
                      }`,
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
                    }}
                    onMouseEnter={(e) => {
                      if (!active)
                        e.currentTarget.style.background =
                            F.pageBg
                    }}
                    onMouseLeave={(e) => {
                      if (!active)
                        e.currentTarget.style.background = "transparent"
                    }}
                  >
                    <NavIcon id={item.id} />
                    {sidebarOpen && (
                      <span
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.label}
                      </span>
                    )}
                  </button>
                </div>
              )
            })}
            <div style={{ flex: 1 }} />
          </nav>

          <main
            className="sap-main-content"
            style={{
              flex: "1 1 0",
              minWidth: 0,
              overflow: "auto",
              padding: "0 24px 28px",
              containerType: "inline-size",
            }}
          >
            <div className="sap-context-bar" aria-label="Breadcrumb">
              <span>Home</span><span className="sap-context-separator">/</span>
              <strong>{navLabelForView(view)}</strong>
              <span className="sap-context-spacer" />
              <span className="sap-context-role">{personaRole[persona]}</span>
            </div>
            <DateFilterCtx.Provider value={{ active: ["payruns", "payslips", "documents", "reports", "audit"].includes(view), from: rangeFrom, to: rangeTo, onFromChange: setRangeFrom, onToChange: setRangeTo, onApply: () => showToast(rangeFrom || rangeTo ? `Showing records from ${rangeFrom || "the beginning"} to ${rangeTo || "today"}` : "Showing all available records", "info") }}>
            {view === "profile" ? (
              <UnifiedProfileView
                persona={persona}
                emp={myEmp}
                onUpdateEmp={(updated) => {
                  setEmps(emps.map((e) => (e.id === updated.id ? updated : e)))
                }}
                adminProfiles={adminProfiles}
                onUpdateAdminProfile={(role, updated) => {
                  setAdminProfiles((prev) => ({ ...prev, [role]: updated }))
                }}
                onNav={setView}
                onSwitchPersona={(p) => {
                  setPersona(p)
                }}
              />
            ) : (
              <>
                {persona === "org_admin" && (
                  <>
                    {view === "dashboard" && (
                      <DashboardView
                        emps={emps}
                        payruns={payruns}
                        ss={ss}
                        onNav={setView}
                      />
                    )}
                    {view === "employees" && (
                      <EmployeesView emps={emps} setEmps={setEmps} ss={ss} />
                    )}
                    {view === "salary" && (
                      <SalaryManagementView
                        emps={emps}
                        ss={ss}
                        setSS={setSS}
                        setEmps={setEmps}
                      />
                    )}
                    {view === "payruns" && (
                      <PayRunsView
                        emps={emps}
                        ss={ss}
                        payruns={payruns}
                        setPayruns={setPayruns}
                      />
                    )}
                    {view === "payslips" && (
                      <PayslipsView emps={emps} payruns={payruns} />
                    )}
                    {view === "documents" && (
                      <OrgDocumentsView
                        docs={orgDocs}
                        setDocs={setOrgDocs}
                        emps={emps}
                      />
                    )}
                    {view === "reports" && (
                      <ReportsView emps={emps} ss={ss} payruns={payruns} />
                    )}
                    {view === "access" && <AccessManagementView emps={emps} />}
                    {view === "audit" && (
                      <AuditHistoryView
                        logs={auditLogs}
                        errorLogs={errorLogs.filter((e) => e.role === "org_admin")}
                      />
                    )}
                  </>
                )}
                {persona === "product_admin" && (
                  <>
                    {view === "dashboard" && (
                      <PlatformDashboard
                        orgs={orgs}
                        logs={auditLogs}
                        onNav={setView}
                      />
                    )}
                    {view === "orgs" && (
                      <OrganizationsView orgs={orgs} setOrgs={setOrgs} />
                    )}
                    {view === "access" && (
                      <PlatformAccessManagementView orgs={orgs} setOrgs={setOrgs} />
                    )}
                    {view === "audit" && (
                      <AuditHistoryView
                        logs={auditLogs.filter(
                          (a) =>
                            ["Platform", "Access", "Organizations"].includes(
                              a.module,
                            ) ||
                            a.action.includes("Org") ||
                            a.action.includes("Access"),
                        )}
                        errorLogs={errorLogs.filter((e) => e.role === "product_admin")}
                      />
                    )}
                  </>
                )}
                {persona === "employee" && (
                  <>
                    {view === "dashboard" && (
                      <EmployeeDashboardView
                        emp={myEmp}
                        payruns={payruns}
                        structures={ss}
                        onNav={setView}
                      />
                    )}
                    {view === "salary" && (
                      <MySalaryView emp={myEmp} structures={ss} onNav={setView} />
                    )}
                    {view === "payruns" && (
                      <PayrollHistoryView emp={myEmp} payruns={payruns} onNav={setView} />
                    )}
                    {view === "payslips" && (
                      <EmployeePayslipsView emp={myEmp} payruns={payruns} />
                    )}
                    {view === "documents" && (
                      <DocumentsView orgDocs={orgDocs} emp={myEmp} />
                    )}
                    {view === "financial" && (
                      <FinancialDataView emp={myEmp} payruns={payruns} />
                    )}
                  </>
                )}
              </>
            )}
            </DateFilterCtx.Provider>
            {/* Each workspace owns its table controls. The former global column
                customizer mutates every table it observes, which can retrigger
                its MutationObserver and block normal row navigation. */}
          </main>
        </div>
      </div>
      <Toasts toasts={toasts} />
    </ToastCtx.Provider>
  )
}
