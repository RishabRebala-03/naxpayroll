import React, { useEffect, useMemo, useRef, useState } from "react"
import LoanFilterPopover from "./LoanFilterPopover"
import type { LoanFilterValues } from "./LoanFilterPopover"

type Employee = { id: string; name: string }
type LoanConfig = { id: string; name: string; type: string; rate: number }
type Repayment = { id: string; date: string; amount: number; mode: "Manual" | "Recurring"; reference: string; account?: string }
export type Loan = { id: string; name: string; employeeId: string; employee: string; amount: number; outstanding: number; installmentAmount?: number; repaymentStartDate?: string; otherInformation?: string; date: string; account: string; reference: string; reason: string; type: string; rate: number; status: "Open" | "Paused" | "Closed"; exempt: boolean; repayments: Repayment[] }
const KEY = "naxpayroll.loans.demo.v1"
const todayIso = () => { const date = new Date(); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}` }
const blank = { name: "", employeeId: "", amount: "", installmentAmount: "", repaymentStartDate: todayIso(), otherInformation: "", date: "", account: "", reference: "", reason: "", type: "Employee loan", rate: "0", exempt: false }
const DEFAULT_LOAN_CONFIGS: LoanConfig[] = [
  { id: "employee-loan", name: "Employee Loan", type: "Employee loan", rate: 0 },
  { id: "salary-advance", name: "Salary Advance", type: "Salary advance", rate: 0 },
  { id: "emergency-loan", name: "Emergency Loan", type: "Emergency loan", rate: 0 },
  { id: "other-loan", name: "Other Loan", type: "Other", rate: 0 },
]
const DEMO_ACCOUNTS = ["Primary Business Account", "Payroll Account", "Cash"]
const displayLoanDate = (iso: string) => { const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/); return match ? `${match[2]}/${match[3]}/${match[1].slice(-2)}` : "" }
function parseLoanDate(display: string) {
  const match = display.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/)
  if (!match) return ""
  const month = Number(match[1]), day = Number(match[2]), rawYear = Number(match[3])
  const year = match[3].length === 2 ? (rawYear < 50 ? 2000 + rawYear : 1900 + rawYear) : rawYear
  const date = new Date(year, month - 1, day)
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}` : ""
}
function isValidIsoLoanDate(value: string) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return false
  const year = Number(match[1]), month = Number(match[2]), day = Number(match[3])
  const date = new Date(year, month - 1, day)
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
}
function readLoanConfigs(): LoanConfig[] {
  try {
    const value = JSON.parse(localStorage.getItem("naxpayroll.loan-configs.demo.v1") ?? "null")
    if (Array.isArray(value)) return value.filter((item) => item && typeof item.id === "string" && typeof item.name === "string" && typeof item.type === "string" && Number.isFinite(item.rate))
  } catch { /* Keep the local demo defaults if browser storage is unavailable. */ }
  return DEFAULT_LOAN_CONFIGS
}
const money = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n)
const moneyWithPaise = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
const loanNumber = (id: string) => `LN-${id.replace(/[^a-z0-9]/gi, "").slice(-8).toUpperCase().padStart(8, "0")}`
export function readLoans(): Loan[] {
  try { const raw = localStorage.getItem(KEY); if (!raw) return []; const value = JSON.parse(raw); return Array.isArray(value) ? value.filter((item) => item && typeof item.id === "string" && typeof item.amount === "number" && Array.isArray(item.repayments)) : [] } catch { return [] }
}
function downloadCsv(rows: Loan[]) {
  const quote = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`
  const lines = [["Loan", "Employee", "Type", "Loan amount", "Outstanding", "Disbursement date", "Status", "Repayments"], ...rows.map((l) => [l.name, l.employee, l.type, l.amount, l.outstanding, l.date, l.status, l.repayments.length])].map((row) => row.map(quote).join(",")).join("\r\n")
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([lines], { type: "text/csv;charset=utf-8" })); a.download = "naxpayroll-loans.csv"; a.click(); URL.revokeObjectURL(a.href)
}

export default function Loans({
  employees,
  onOpenEmployee,
  initialOpenCreate = false,
  initialCreateEmployeeId = null,
  onCloseCreate,
}: {
  employees: Employee[]
  onOpenEmployee: (employeeId: string) => void
  initialOpenCreate?: boolean
  initialCreateEmployeeId?: string | null
  onCloseCreate?: () => void
}) {
  const [loans, setLoans] = useState<Loan[]>(readLoans)
  const [loanConfigs, setLoanConfigs] = useState<LoanConfig[]>(readLoanConfigs)
  const [configDraft, setConfigDraft] = useState<LoanConfig[]>([])
  const [configEditId, setConfigEditId] = useState<string | null>(null)
  const [configCreating, setConfigCreating] = useState(false)
  const [configEditName, setConfigEditName] = useState("")
  const [configEditRate, setConfigEditRate] = useState("0.00")
  const [loanNameSearch, setLoanNameSearch] = useState("")
  const [loanNameDropdownOpen, setLoanNameDropdownOpen] = useState(false)
  const loanNameDropdownRef = useRef<HTMLDivElement>(null)
  const [manageLoansOpen, setManageLoansOpen] = useState(false)
  const [tab, setTab] = useState("All Loans")
  const [search, setSearch] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [employeeFilter, setEmployeeFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [minAmount, setMinAmount] = useState("")
  const [maxAmount, setMaxAmount] = useState("")
  const [minOutstanding, setMinOutstanding] = useState("")
  const [maxOutstanding, setMaxOutstanding] = useState("")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [repaymentFrom, setRepaymentFrom] = useState("")
  const [repaymentTo, setRepaymentTo] = useState("")
  const sortBy: "date" | "amount" | "outstanding" = "date"
  const [form, setForm] = useState<typeof blank | null>(() => {
    if (initialOpenCreate) {
      return { ...blank, employeeId: initialCreateEmployeeId || "" }
    }
    return null
  })
  const [editing, setEditing] = useState<string | null>(null)
  const [employeeSearch, setEmployeeSearch] = useState("")
  const [employeeDropdownOpen, setEmployeeDropdownOpen] = useState(false)
  const [dateText, setDateText] = useState("")
  const datePickerRef = useRef<HTMLInputElement>(null)
  const [selected, setSelected] = useState<Loan | null>(null)
  const [selectedMoreOpen, setSelectedMoreOpen] = useState(false)

  useEffect(() => {
    if (initialOpenCreate) {
      setForm({ ...blank, employeeId: initialCreateEmployeeId || "" })
      setEditing(null)
      setDateText("")
      setEmployeeSearch("")
      setError("")
      setFormErrors({})
    }
  }, [initialOpenCreate, initialCreateEmployeeId])
  const [repaymentFormOpen, setRepaymentFormOpen] = useState(false)
  const [repaymentMode, setRepaymentMode] = useState<"Manual" | "Recurring">("Manual")
  const [repaymentMethodFilter, setRepaymentMethodFilter] = useState<"" | "Manual" | "Recurring">("")
  const [repaymentAmount, setRepaymentAmount] = useState("")
  const [repaymentAccount, setRepaymentAccount] = useState("")
  const [repaymentReference, setRepaymentReference] = useState("")
  const [repaymentDate, setRepaymentDate] = useState(new Date().toISOString().slice(0, 10))
  const [repaymentMonth, setRepaymentMonth] = useState(new Date().toISOString().slice(0, 7))
  const [repaymentEmployee, setRepaymentEmployee] = useState("")
  const [repaymentEmployeeDropdownOpen, setRepaymentEmployeeDropdownOpen] = useState(false)
  const [repaymentEmployeeSearch, setRepaymentEmployeeSearch] = useState("")
  const [repaymentView, setRepaymentView] = useState(false)
  const [statusMenuOpen, setStatusMenuOpen] = useState(false)
  const [moreMenuOpen, setMoreMenuOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [appliedFilters, setAppliedFilters] = useState({ employee: "", type: "", minAmount: "", maxAmount: "", minOutstanding: "", maxOutstanding: "", fromDate: "", toDate: "", repaymentFrom: "", repaymentTo: "" })
  const [error, setError] = useState("")
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [storageError, setStorageError] = useState(false)
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(loans)); setStorageError(false) } catch { setStorageError(true) } }, [loans])
  useEffect(() => { try { localStorage.setItem("naxpayroll.loan-configs.demo.v1", JSON.stringify(loanConfigs)) } catch { setStorageError(true) } }, [loanConfigs])
  useEffect(() => {
    if (!loanNameDropdownOpen) return
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!loanNameDropdownRef.current?.contains(event.target as Node)) setLoanNameDropdownOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setLoanNameDropdownOpen(false); setLoanNameSearch("") }
    }
    document.addEventListener("pointerdown", closeOnOutsideClick)
    document.addEventListener("keydown", closeOnEscape)
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick)
      document.removeEventListener("keydown", closeOnEscape)
    }
  }, [loanNameDropdownOpen])
  const visible = useMemo(() => loans.filter((l) => (tab === "All Loans" || l.status === tab.replace(" Loans", "")) && (!search.trim() || `${l.name} ${l.employee} ${l.employeeId} ${l.reference} ${loanNumber(l.id)}`.toLowerCase().includes(search.trim().toLowerCase())) && (!appliedFilters.employee || l.employeeId === appliedFilters.employee) && (!appliedFilters.type || l.type.toLowerCase() === appliedFilters.type.toLowerCase() || l.name.toLowerCase().includes(appliedFilters.type.toLowerCase())) && (!appliedFilters.minAmount || l.amount >= Number(appliedFilters.minAmount)) && (!appliedFilters.maxAmount || l.amount <= Number(appliedFilters.maxAmount)) && (!appliedFilters.minOutstanding || l.outstanding >= Number(appliedFilters.minOutstanding)) && (!appliedFilters.maxOutstanding || l.outstanding <= Number(appliedFilters.maxOutstanding)) && (!appliedFilters.fromDate || l.date >= appliedFilters.fromDate) && (!appliedFilters.toDate || l.date <= appliedFilters.toDate) && (!appliedFilters.repaymentFrom || l.repayments.some((r) => r.date >= appliedFilters.repaymentFrom)) && (!appliedFilters.repaymentTo || l.repayments.some((r) => r.date <= appliedFilters.repaymentTo))).sort((a, b) => { const delta = sortBy === "date" ? a.date.localeCompare(b.date) : sortBy === "amount" ? a.amount - b.amount : a.outstanding - b.outstanding; return -delta }), [loans, tab, search, appliedFilters, sortBy])
  const field: React.CSSProperties = { display: "block", width: "100%", boxSizing: "border-box", padding: "10px 12px", border: "1px solid #D9E0E7", borderRadius: 6, color: "#1D2D3E", font: "inherit", background: "#fff" }
  const btn: React.CSSProperties = { border: "1px solid #D9E0E7", borderRadius: 6, background: "#fff", color: "#1D2D3E", padding: "9px 13px", fontWeight: 600, cursor: "pointer" }
  const primary: React.CSSProperties = { ...btn, color: "white", background: "#0B6ED0", borderColor: "#0B6ED0" }
  const darkBtn: React.CSSProperties = { ...btn, color: "white", background: "#1E293B", borderColor: "#1E293B" }
  const card: React.CSSProperties = { background: "#fff", border: "1px solid #D9E0E7", borderRadius: 8, padding: 20 }
  const label = (text: string, child: React.ReactNode) => <label style={{ display: "grid", gap: 6, color: "#475E75", fontSize: 13, fontWeight: 600 }}>{text}{child}</label>
  const saveLoan = () => {
    if (!form) return
    const amount = Number(form.amount), rate = Number(form.rate)
    const nextErrors: Record<string, string> = {}
    if (!form.name.trim() || !form.type.trim()) nextErrors.name = "Select a loan name."
    if (!form.employeeId || !employees.some((item) => item.id === form.employeeId)) nextErrors.employeeId = "Select an employee."
    if (!form.amount.trim()) nextErrors.amount = "Enter a loan amount."
    else if (!Number.isFinite(amount) || amount <= 0) nextErrors.amount = "Enter a valid amount greater than zero."
    if (!form.date || !isValidIsoLoanDate(form.date) || parseLoanDate(dateText) !== form.date) nextErrors.date = "Enter a valid disbursement date in MM/dd/yy format."
    if (!form.account.trim()) nextErrors.account = "Select or enter a paid through account."
    if (!form.reason.trim()) nextErrors.reason = "Enter a reason for this loan."
    if (!form.repaymentStartDate || !isValidIsoLoanDate(form.repaymentStartDate)) nextErrors.repaymentStartDate = "Choose a valid EMI deduction start date."
    setFormErrors(nextErrors)
    if (Object.keys(nextErrors).length) { setError(""); return }
    if (!Number.isFinite(rate) || rate < 0 || rate > 100) { setError("Enter a valid annual rate from 0 to 100."); return }
    const emp = employees.find((item) => item.id === form.employeeId)
    if (!emp) return
    if (editing) {
      const existing = loans.find((l) => l.id === editing)
      const paid = existing?.repayments.reduce((sum, item) => sum + item.amount, 0) ?? 0
      if (!existing || amount < paid) { setError("Loan amount cannot be lower than repayments already recorded."); return }
      const installmentAmount = Number(form.installmentAmount)
      if (!Number.isFinite(installmentAmount) || installmentAmount <= 0 || installmentAmount > amount) { setError("Installment amount must be greater than zero and no more than the loan amount."); return }
      setLoans((items) => items.map((l) => { if (l.id !== editing) return l; const outstanding = Math.max(0, amount - paid); return { ...l, name: form.name.trim(), employeeId: emp.id, employee: emp.name, amount, outstanding, installmentAmount, repaymentStartDate: form.repaymentStartDate, otherInformation: form.otherInformation, date: form.date, account: form.account.trim(), reference: form.reference.trim(), reason: form.reason.trim(), type: form.type, rate, exempt: form.exempt, status: outstanding === 0 ? "Closed" : l.status === "Closed" ? "Open" : l.status } }))
    }
    else { const installmentAmount = Number(form.installmentAmount); if (!Number.isFinite(installmentAmount) || installmentAmount <= 0 || installmentAmount > amount) { setError("Installment amount must be greater than zero and no more than the loan amount."); return } setLoans((items) => [{ id: crypto.randomUUID(), name: form.name.trim(), employeeId: emp.id, employee: emp.name, amount, outstanding: amount, installmentAmount, repaymentStartDate: form.repaymentStartDate, otherInformation: form.otherInformation, date: form.date, account: form.account.trim(), reference: form.reference.trim(), reason: form.reason.trim(), type: form.type, rate, exempt: form.exempt, status: "Open", repayments: [] }, ...items]) }
    setForm(null); setEditing(null); setError(""); setFormErrors({}); onCloseCreate?.()
  }
  const changeStatus = (loan: Loan, status: Loan["status"]) => {
    if (!window.confirm(`${status === "Closed" ? "Close" : status === "Paused" ? "Pause" : "Reopen"} ${loan.name}?`)) return
    setLoans((items) => items.map((l) => l.id === loan.id ? { ...l, status } : l))
    if (selected?.id === loan.id) setSelected({ ...loan, status })
  }
  const recordRepayment = () => {
    if (!selected) return
    const amount = Number(repaymentAmount)
    if (!repaymentDate || !Number.isFinite(amount) || amount <= 0) { setError("Enter a valid repayment date and a positive amount."); return }
    if (amount > selected.outstanding) { setError("Repayment cannot exceed the outstanding balance."); return }
    const duplicate = selected.repayments.some((r) => r.date === repaymentDate && r.amount === amount && r.mode === repaymentMode)
    if (duplicate) { setError("This repayment already exists. Change the amount or date to continue."); return }
    if (!repaymentAccount) { setError("Select a deposit account."); return }
    const reference = repaymentReference.trim() || `DEMO-${Date.now()}`
    const updated = { ...selected, outstanding: Math.max(0, selected.outstanding - amount), status: Math.max(0, selected.outstanding - amount) === 0 ? "Closed" as const : selected.status, repayments: [...selected.repayments, { id: crypto.randomUUID(), date: repaymentDate, amount, mode: repaymentMode, reference, account: repaymentAccount }] }
    setLoans((items) => items.map((l) => l.id === updated.id ? updated : l)); setSelected(updated); setRepaymentAmount(""); setRepaymentReference(""); setError(""); setRepaymentFormOpen(false)
  }
  const openLoanDetails = (loan: Loan) => { setSelected(loan); setSelectedMoreOpen(false); setRepaymentFormOpen(false); setError(""); setRepaymentView(false) }
  const closeLoanDetails = () => { setSelected(null); setSelectedMoreOpen(false); setRepaymentFormOpen(false); setError("") }
  const filterValues = { employee: employeeFilter, type: typeFilter, minAmount, maxAmount, minOutstanding, maxOutstanding, fromDate, toDate, repaymentFrom, repaymentTo }
  const loadFilterDraft = (values: typeof appliedFilters) => { setEmployeeFilter(values.employee); setTypeFilter(values.type); setMinAmount(values.minAmount); setMaxAmount(values.maxAmount); setMinOutstanding(values.minOutstanding); setMaxOutstanding(values.maxOutstanding); setFromDate(values.fromDate); setToDate(values.toDate); setRepaymentFrom(values.repaymentFrom); setRepaymentTo(values.repaymentTo) }
  const clearFilters = () => { const cleared = { employee: "", type: "", minAmount: "", maxAmount: "", minOutstanding: "", maxOutstanding: "", fromDate: "", toDate: "", repaymentFrom: "", repaymentTo: "" }; loadFilterDraft(cleared); setAppliedFilters(cleared) }
  const iconButton: React.CSSProperties = { ...btn, width: 38, height: 38, padding: 0, display: "inline-flex", alignItems: "center", justifyContent: "center" }
  const icon = (kind: "filter" | "dots" | "chevron") => kind === "filter" ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 5h16l-6.5 7.5V19l-3 1v-7.5L4 5Z" /></svg> : kind === "dots" ? <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="19" cy="12" r="1.8" /></svg> : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
  const repaymentRows = loans.flatMap((loan) => loan.repayments.filter((repayment) => repayment.date.startsWith(repaymentMonth) && (!repaymentEmployee || loan.employeeId === repaymentEmployee)).map((repayment) => ({ loan, repayment })))
  const closeFilterDrawer = () => { loadFilterDraft(appliedFilters); setFilterOpen(false) }
  const beginConfigEdit = (config: LoanConfig) => { setConfigEditId(config.id); setConfigCreating(false); setConfigEditName(config.name); setConfigEditRate(config.rate.toFixed(2)); setError("") }
  const cancelConfigEdit = () => { setConfigEditId(null); setConfigCreating(false); setConfigEditName(""); setConfigEditRate("0.00"); setError("") }
  const saveConfig = () => {
    const name = configEditName.trim(), rate = Number(configEditRate)
    if (!name) { setError("Enter a loan name."); return }
    if (!configEditRate.trim() || !Number.isFinite(rate) || rate < 0 || rate > 100) { setError("Enter a perquisite rate from 0 to 100."); return }
    if (configDraft.some((item) => item.name.trim().toLowerCase() === name.toLowerCase() && item.id !== configEditId)) { setError("A loan with this name already exists."); return }
    const createdConfig = configCreating ? { id: crypto.randomUUID(), name, type: "Other", rate } : null
    if (createdConfig) setLoanConfigs((items) => [...items, createdConfig])
    else if (configEditId) {
      const previous = configDraft.find((item) => item.id === configEditId)
      const updated = configDraft.map((item) => item.id === configEditId ? { ...item, name, rate } : item)
      setLoanConfigs(updated)
      if (previous && form?.name === previous.name && form.type === previous.type) setForm({ ...form, name, rate: String(rate) })
    }
    setConfigDraft((items) => createdConfig ? [...items, createdConfig] : items.map((item) => item.id === configEditId ? { ...item, name, rate } : item))
    cancelConfigEdit()
  }
  const deleteConfig = (config: LoanConfig) => {
    if (!window.confirm(`Delete ${config.name}?`)) return
    const updated = configDraft.filter((item) => item.id !== config.id)
    setConfigDraft(updated); setLoanConfigs(updated); setError("")
    if (configEditId === config.id) cancelConfigEdit()
  }
  const openManageLoans = () => { setConfigDraft(loanConfigs.map((item) => ({ ...item }))); cancelConfigEdit(); setManageLoansOpen(true); setMoreMenuOpen(false); setLoanNameDropdownOpen(false); setLoanNameSearch("") }
  const manageLoansModal = manageLoansOpen && <div role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) { cancelConfigEdit(); setManageLoansOpen(false) } }} style={{ position: "fixed", inset: 0, zIndex: 10010, background: "#00000066", display: "grid", placeItems: "center", padding: 18 }}><section role="dialog" aria-modal="true" aria-label="Manage Loans" style={{ width: "min(680px, 100%)", maxHeight: "min(720px, 90vh)", overflowY: "auto", background: "#fff", borderRadius: 7, boxShadow: "0 16px 48px #10233644", padding: "22px 26px 20px" }}><header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}><h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: "#243746" }}>Manage Loans</h2><button type="button" aria-label="Close Manage Loans" onClick={() => { cancelConfigEdit(); setManageLoansOpen(false) }} style={{ ...iconButton, border: 0, background: "transparent", color: "#667987", fontSize: 23 }}>Ãƒâ€”</button></header>
    <div style={{ border: "1px solid #DDE3E8", borderRadius: 4, overflow: "hidden" }}><div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 190px 150px", alignItems: "center", padding: "11px 16px", background: "#F7F9FA", borderBottom: "1px solid #DDE3E8", color: "#526675", fontSize: 11, fontWeight: 700, letterSpacing: ".25px" }}><span>LOAN NAME</span><span style={{ textAlign: "right", paddingRight: 14 }}>PERQUISITE RATE</span><span />
    </div>{configDraft.map((config) => configEditId === config.id ? <div key={config.id} style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 190px 150px", gap: 10, alignItems: "center", padding: "10px 16px", borderBottom: "1px solid #E8ECEF" }}><input aria-label="Loan name" autoFocus style={{ ...field, padding: "8px 10px", borderRadius: 4 }} value={configEditName} onChange={(event) => setConfigEditName(event.target.value)} /><div style={{ position: "relative" }}><input aria-label="Perquisite rate" type="number" min="0" max="100" step="0.01" style={{ ...field, padding: "8px 28px 8px 10px", borderRadius: 4, textAlign: "right" }} value={configEditRate} onChange={(event) => setConfigEditRate(event.target.value)} /><span style={{ position: "absolute", right: 10, top: 9, color: "#71869A", fontSize: 13 }}>%</span></div><div style={{ display: "flex", justifyContent: "flex-end", gap: 5 }}><button type="button" onClick={saveConfig} style={{ ...primary, padding: "7px 9px", fontSize: 12, whiteSpace: "nowrap" }}>Save</button><button type="button" onClick={cancelConfigEdit} style={{ ...btn, padding: "7px 9px", fontSize: 12, whiteSpace: "nowrap" }}>Cancel</button></div></div> : <div key={config.id} style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 190px 150px", alignItems: "center", minHeight: 48, padding: "7px 16px", borderBottom: "1px solid #E8ECEF", color: "#263746", fontSize: 13 }}><span>{config.name}</span><span style={{ textAlign: "right", paddingRight: 24 }}>{config.rate.toFixed(2)}%</span><span style={{ display: "flex", justifyContent: "flex-end", gap: 5 }}><button type="button" aria-label={`Edit ${config.name}`} title="Edit" onClick={() => beginConfigEdit(config)} style={{ border: 0, background: "transparent", color: "#1685D1", cursor: "pointer", padding: 5 }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m14 5 5 5M4 20l4.2-.8L19 8.4 15.6 5 4.8 15.8 4 20Z" /></svg></button><button type="button" aria-label={`Delete ${config.name}`} title="Delete" onClick={() => deleteConfig(config)} style={{ border: 0, background: "transparent", color: "#1685D1", cursor: "pointer", padding: 5 }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3" /></svg></button></span></div>)}{configCreating && <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 190px 150px", gap: 10, alignItems: "center", padding: "10px 16px", borderBottom: "1px solid #E8ECEF" }}><input aria-label="New loan name" autoFocus placeholder="Loan name" style={{ ...field, padding: "8px 10px", borderRadius: 4 }} value={configEditName} onChange={(event) => setConfigEditName(event.target.value)} /><div style={{ position: "relative" }}><input aria-label="New perquisite rate" type="number" min="0" max="100" step="0.01" style={{ ...field, padding: "8px 28px 8px 10px", borderRadius: 4, textAlign: "right" }} value={configEditRate} onChange={(event) => setConfigEditRate(event.target.value)} /><span style={{ position: "absolute", right: 10, top: 9, color: "#71869A", fontSize: 13 }}>%</span></div><div style={{ display: "flex", justifyContent: "flex-end", gap: 5 }}><button type="button" onClick={saveConfig} style={{ ...primary, padding: "7px 9px", fontSize: 12, whiteSpace: "nowrap" }}>Save</button><button type="button" onClick={cancelConfigEdit} style={{ ...btn, padding: "7px 9px", fontSize: 12, whiteSpace: "nowrap" }}>Cancel</button></div></div>}
    </div>{error && <p role="alert" style={{ color: "#AA0808", fontSize: 12, margin: "10px 0 0" }}>{error}</p>}<button type="button" onClick={() => { setConfigCreating(true); setConfigEditId(null); setConfigEditName(""); setConfigEditRate("0.00"); setError("") }} style={{ marginTop: 16, border: 0, background: "transparent", color: "#1685D1", padding: 0, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ Create New Loan Type</button><div style={{ marginTop: 18, padding: "12px 14px", border: "1px solid #E4E9ED", borderRadius: 4, background: "#F8FAFC", color: "#657787", fontSize: 12, lineHeight: 1.55 }}>According to Rule 15(5) of the Income Tax Rules, 2026, employees availing medical loans (for treatment of diseases specified in Rule 18) or any other loans below Ã¢â€šÂ¹2,00,000 in aggregate can be exempted from perquisite calculation.</div></section></div>
  if (form) {
    const configuredLoan = loanConfigs.find((item) => item.type === form.type && item.name === form.name)
    const choices: LoanConfig[] = configuredLoan ? loanConfigs : [{ id: "current-loan", name: form.name, type: form.type, rate: Number(form.rate) }, ...loanConfigs]
    const selectedEmployee = employees.find((employee) => employee.id === form.employeeId)
    const matchingEmployees = employees.filter((employee) => employee.name.toLowerCase().includes(employeeSearch.toLowerCase()) || employee.id.toLowerCase().includes(employeeSearch.toLowerCase()))
    const dateInput = (value: string) => { setDateText(value); setForm({ ...form, date: parseLoanDate(value) }); setFormErrors((errors) => ({ ...errors, date: "" })) }
    const cancelForm = () => { setForm(null); setEditing(null); setError(""); setFormErrors({}); setEmployeeDropdownOpen(false); onCloseCreate?.() }
    const formLabel: React.CSSProperties = { display: "grid", gap: 7, color: "#33495E", fontSize: 13, fontWeight: 600 }
    const sectionCard: React.CSSProperties = { background: "#fff", border: "1px solid #D9E0E7", borderRadius: 5, padding: "24px 28px" }
    const wideField: React.CSSProperties = { ...field, height: 42, borderRadius: 4, borderColor: "#C9D1DA" }
    return <div style={{ height: "calc(100dvh - 150px)", minHeight: 480, display: "flex", flexDirection: "column", background: "#F5F7F9", color: "#1D2D3E" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 2px 18px" }}>
        <h1 style={{ margin: 0, fontSize: 23, fontWeight: 600 }}>{editing ? "Edit Loan" : "Create Loan"}</h1>
        <button type="button" aria-label="Close and return to loans" title="Close" onClick={cancelForm} style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid #D9E0E7", background: "#fff", color: "#475E75", fontSize: 22, lineHeight: 1, cursor: "pointer" }}>Ãƒâ€”</button>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", paddingBottom: 12 }}>
        <div style={{ ...sectionCard, marginBottom: 14 }}>
          <div ref={loanNameDropdownRef} style={{ ...formLabel, position: "relative", maxWidth: 650 }}><span>Loan Name<span style={{ color: "#D14343" }}>*</span></span>
            <span style={{ position: "relative", display: "block" }}>
              <input type="text" readOnly style={{ ...wideField, paddingRight: 42, cursor: "pointer" }} value={form.name} placeholder="Select Loan" aria-label="Select Loan" aria-haspopup="listbox" aria-expanded={loanNameDropdownOpen} onClick={() => { setLoanNameSearch(""); setLoanNameDropdownOpen((open) => !open) }} />
              <button type="button" aria-label={loanNameDropdownOpen ? "Close loan options" : "Open loan options"} aria-expanded={loanNameDropdownOpen} onClick={() => { if (loanNameDropdownOpen) { setLoanNameDropdownOpen(false); setLoanNameSearch("") } else { setLoanNameSearch(""); setLoanNameDropdownOpen(true) } }} style={{ position: "absolute", top: 1, right: 1, width: 40, height: 40, display: "grid", placeItems: "center", border: 0, borderLeft: "1px solid #E3E8ED", borderRadius: "0 4px 4px 0", background: "#fff", color: "#5B738B", cursor: "pointer" }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></button>
            </span>
            {formErrors.name && <span role="alert" style={{ color: "#AA0808", fontSize: 12 }}>{formErrors.name}</span>}
            {loanNameDropdownOpen && <div role="listbox" aria-label="Loan options" style={{ position: "absolute", top: "calc(100% + 3px)", left: 0, right: 0, zIndex: 30, background: "#fff", border: "1px solid #C9D1DA", borderRadius: 4, boxShadow: "0 8px 20px #1d2d3e24", overflow: "hidden" }}><div style={{ padding: 9, borderBottom: "1px solid #EDF0F2", background: "#fff" }}><input aria-label="Search loan options" autoFocus style={{ ...wideField, height: 36 }} placeholder="Search loans" value={loanNameSearch} onChange={(event) => setLoanNameSearch(event.target.value)} /></div><div style={{ maxHeight: 200, overflowY: "auto" }}>{choices.filter((item) => item.name.toLowerCase().includes(loanNameSearch.toLowerCase())).map((item) => <button role="option" aria-selected={form.name === item.name} type="button" key={item.id} onMouseDown={(event) => event.preventDefault()} onClick={() => { setForm({ ...form, name: item.name, type: item.type, rate: String(item.rate) }); setFormErrors((errors) => ({ ...errors, name: "" })); setLoanNameDropdownOpen(false); setLoanNameSearch("") }} style={{ display: "block", width: "100%", padding: "10px 12px", border: 0, background: form.name === item.name ? "#F5F9FD" : "#fff", color: "#1D2D3E", textAlign: "left", cursor: "pointer" }}>{item.name}</button>)}</div><button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => { openManageLoans() }} style={{ display: "block", width: "100%", padding: "11px 12px", border: 0, borderTop: "1px solid #EDF0F2", background: "#F8FAFC", color: "#0B6ED0", textAlign: "left", cursor: "pointer", font: "inherit", fontWeight: 600 }}>Manage Loans</button></div>}
          </div>
          <div style={{ marginTop: 14, fontSize: 13, color: "#475E75" }}>Perquisite Rate: <strong style={{ color: "#1D2D3E", fontWeight: 600 }}>{Number(form.rate) || 0}%</strong></div>
        </div>
        <div style={sectionCard}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 310px), 1fr))", columnGap: 34, rowGap: 22 }}>
            <label style={{ ...formLabel, position: "relative" }}>Employee Name <span style={{ color: "#D14343" }}>*</span>
              <input style={wideField} value={employeeDropdownOpen ? employeeSearch : selectedEmployee?.name ?? ""} placeholder="Search or select employee" onFocus={() => { setEmployeeSearch(""); setEmployeeDropdownOpen(true) }} onChange={(event) => { setEmployeeSearch(event.target.value); setEmployeeDropdownOpen(true) }} aria-expanded={employeeDropdownOpen} />
              {employeeDropdownOpen && <div style={{ position: "absolute", top: "calc(100% + 3px)", left: 0, right: 0, zIndex: 15, maxHeight: 220, overflowY: "auto", background: "#fff", border: "1px solid #C9D1DA", borderRadius: 4, boxShadow: "0 6px 18px #1d2d3e20" }}>{matchingEmployees.length ? matchingEmployees.map((employee) => <button type="button" key={employee.id} onMouseDown={(event) => event.preventDefault()} onClick={() => { setForm({ ...form, employeeId: employee.id }); setFormErrors((errors) => ({ ...errors, employeeId: "" })); setEmployeeDropdownOpen(false); setEmployeeSearch("") }} style={{ display: "block", width: "100%", border: 0, padding: "10px 12px", background: "#fff", textAlign: "left", cursor: "pointer", color: "#1D2D3E" }}>{employee.name}</button>) : <div style={{ padding: 12, color: "#71869A", fontSize: 12 }}>No employees found.</div>}</div>}
              {formErrors.employeeId && <span role="alert" style={{ color: "#AA0808", fontSize: 12 }}>{formErrors.employeeId}</span>}
            </label>
            <label style={formLabel}>Loan Amount <span style={{ color: "#D14343" }}>*</span><span style={{ position: "relative" }}><span style={{ position: "absolute", left: 12, top: 11, color: "#71869A", zIndex: 1 }}>Ã¢â€šÂ¹</span><input type="number" min="0.01" step="0.01" style={{ ...wideField, paddingLeft: 30 }} value={form.amount} onChange={(event) => { setForm({ ...form, amount: event.target.value }); setFormErrors((errors) => ({ ...errors, amount: "" })) }} /></span>{formErrors.amount && <span role="alert" style={{ color: "#AA0808", fontSize: 12 }}>{formErrors.amount}</span>}</label>
            <label style={formLabel}>Disbursement Date <span style={{ color: "#D14343" }}>*</span><span style={{ position: "relative", display: "block" }}><input inputMode="numeric" placeholder="MM/dd/yy" style={{ ...wideField, paddingRight: 42 }} value={dateText} onChange={(event) => dateInput(event.target.value)} /><button type="button" aria-label="Choose disbursement date" onClick={() => datePickerRef.current?.showPicker?.()} style={{ position: "absolute", right: 5, top: 4, width: 34, height: 34, border: 0, background: "transparent", color: "#5B738B", cursor: "pointer", fontSize: 18 }}>Ã¢â€“Â¦</button><input ref={datePickerRef} type="date" value={form.date} onChange={(event) => { setForm({ ...form, date: event.target.value }); setDateText(displayLoanDate(event.target.value)); setFormErrors((errors) => ({ ...errors, date: "" })) }} style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }} /></span>{formErrors.date && <span role="alert" style={{ color: "#AA0808", fontSize: 12 }}>{formErrors.date}</span>}</label>
            <label style={formLabel}>Paid Through Account<span style={{ color: "#D14343" }}>*</span><input list="loan-account-options" style={wideField} value={form.account} placeholder="Select or search account" onChange={(event) => { setForm({ ...form, account: event.target.value }); setFormErrors((errors) => ({ ...errors, account: "" })) }} /><datalist id="loan-account-options">{[...new Set([...DEMO_ACCOUNTS, ...(form.account ? [form.account] : [])])].map((account) => <option key={account} value={account} />)}</datalist>{formErrors.account && <span role="alert" style={{ color: "#AA0808", fontSize: 12 }}>{formErrors.account}</span>}</label>
            <label style={formLabel}>Reference Number<input style={wideField} value={form.reference} onChange={(event) => setForm({ ...form, reference: event.target.value })} /></label>
            <label style={{ ...formLabel, gridColumn: "1" }}>Reason<span style={{ color: "#D14343" }}>*</span><textarea rows={3} style={{ ...wideField, height: "auto", minHeight: 82, resize: "vertical" }} value={form.reason} onChange={(event) => { setForm({ ...form, reason: event.target.value }); setFormErrors((errors) => ({ ...errors, reason: "" })) }} />{formErrors.reason && <span role="alert" style={{ color: "#AA0808", fontSize: 12 }}>{formErrors.reason}</span>}</label>
            <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "flex-start", gap: 10, padding: "4px 0 0" }}><input id="loan-exempt" type="checkbox" checked={form.exempt} onChange={(event) => setForm({ ...form, exempt: event.target.checked })} style={{ marginTop: 3, accentColor: "#3986F7" }} /><label htmlFor="loan-exempt" style={{ color: "#172B4D", fontSize: 13, fontWeight: 600 }}>Exempt this loan from perquisite calculation<span style={{ display: "block", maxWidth: 760, marginTop: 5, color: "#5B738B", fontWeight: 400, lineHeight: 1.5 }}>According to Rule 15(5) of the Income Tax Rules, 2026, employees availing medical loans (for treatment of diseases specified in Rule 18) or any other loans below Ã¢â€šÂ¹2,00,000 in aggregate can be exempted from perquisite calculation.</span></label></div>
          </div>
          <section style={{ marginTop: 26, paddingTop: 20, borderTop: "1px solid #E3E8ED" }}><h2 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 600 }}>Repayments</h2><div style={{ display: "grid", gridTemplateColumns: "minmax(240px, 376px) minmax(240px, 376px)", gap: "16px 32px", maxWidth: 780 }}><label style={formLabel}>EMI Deduction Start Date <span style={{ color: "#D14343" }}>*</span> <span title="Date payroll deductions should begin" aria-label="Date payroll deductions should begin" style={{ display: "inline-grid", placeItems: "center", width: 14, height: 14, border: "1px solid #8495A5", borderRadius: "50%", color: "#71869A", fontSize: 10 }}>i</span><input type="date" style={wideField} value={form.repaymentStartDate} onChange={(event) => { setForm({ ...form, repaymentStartDate: event.target.value }); setFormErrors((errors) => ({ ...errors, repaymentStartDate: "" })) }} />{formErrors.repaymentStartDate && <span role="alert" style={{ color: "#AA0808", fontSize: 12 }}>{formErrors.repaymentStartDate}</span>}</label><label style={formLabel}>Instalment Amount<span style={{ color: "#D14343" }}>*</span><span style={{ position: "relative", display: "flex" }}><span style={{ display: "grid", placeItems: "center", width: 34, border: "1px solid #C8D2DC", borderRight: 0, borderRadius: "6px 0 0 6px", color: "#475E75" }}>Ã¢â€šÂ¹</span><input type="number" min="0.01" step="0.01" style={{ ...wideField, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }} value={form.installmentAmount} onChange={(event) => setForm({ ...form, installmentAmount: event.target.value })} /></span></label>{Number(form.amount) > 0 && Number(form.installmentAmount) > 0 && <div role="status" style={{ gridColumn: "1 / -1", padding: "11px 13px", borderRadius: 6, background: "#EDF6FF", color: "#365D83", fontSize: 13 }}>Ã¢â€œËœ This loan will be fully paid off in {Math.ceil(Number(form.amount) / Number(form.installmentAmount))} instalments.</div>}</div></section>
        </div>
      </div>
      <footer style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 2px 4px", flexWrap: "wrap" }}>{error && <div role="alert" style={{ flexBasis: "100%", color: "#AA0808", fontSize: 13 }}>{error}</div>}<button type="button" style={primary} onClick={saveLoan}>Save</button><button type="button" style={btn} onClick={cancelForm}>Cancel</button><span style={{ marginLeft: "auto", color: "#71869A", fontSize: 12 }}>* indicates mandatory fields</span></footer>
      {manageLoansModal}
    </div>
  }
  return <div style={{ color: "#1D2D3E", fontFamily: "inherit", display: "grid", gap: selected ? 0 : 18, paddingBottom: selected ? 0 : 28 }}>
    {manageLoansModal}
    {!selected && !repaymentView && <div style={{ display: "grid", gap: 18 }}>
    <div style={{ ...card, padding: "18px 22px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
        <div style={{ position: "relative", width: "fit-content", flex: "0 1 auto" }}>
            <button type="button" aria-haspopup="listbox" aria-expanded={statusMenuOpen} onClick={() => { setStatusMenuOpen((open) => !open); setMoreMenuOpen(false) }} style={{ border: 0, background: "transparent", color: "#1D2D3E", padding: "4px 0", display: "flex", alignItems: "center", gap: 7, fontSize: 20, lineHeight: 1.3, fontWeight: 600, cursor: "pointer" }}>{tab}{icon("chevron")}</button>
            {statusMenuOpen && <div role="listbox" aria-label="Loan status" style={{ position: "absolute", zIndex: 20, top: "calc(100% + 5px)", left: 0, width: 190, padding: 5, background: "#fff", border: "1px solid #D9E0E7", borderRadius: 7, boxShadow: "0 8px 22px #1d2d3e22" }}>{["All Loans", "Open Loans", "Paused Loans", "Closed Loans"].map((name) => <button role="option" aria-selected={tab === name} key={name} type="button" onClick={() => { setTab(name); setStatusMenuOpen(false) }} style={{ display: "flex", width: "100%", justifyContent: "space-between", padding: "9px 10px", border: 0, borderRadius: 5, background: tab === name ? "#EAF3FC" : "transparent", color: "#1D2D3E", textAlign: "left", cursor: "pointer", font: "inherit" }}>{name}<span style={{ color: "#71869A" }}>{name === "All Loans" ? loans.length : loans.filter((loan) => loan.status === name.replace(" Loans", "")).length}</span></button>)}</div>}
          </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, flex: "0 1 auto", minWidth: 0, marginLeft: "auto", flexWrap: "wrap" }}>
          <button type="button" style={{ ...btn, flexShrink: 0, whiteSpace: "nowrap" }} onClick={() => setRepaymentView(true)}>View Loan Repayments</button>
          <button type="button" style={{ ...darkBtn, flexShrink: 0, whiteSpace: "nowrap" }} onClick={() => { setForm({ ...blank }); setEditing(null); setDateText(""); setEmployeeSearch(""); setError(""); setFormErrors({}) }}>+ Add</button>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}><button type="button" aria-label="Search loans" title="Search loans" aria-expanded={searchOpen} style={iconButton} onClick={() => { if (searchOpen) setSearch(""); setSearchOpen((open) => !open) }}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></svg></button>{searchOpen && <div style={{ display: "flex", alignItems: "center", gap: 6, width: 270, padding: 4, background: "#fff", border: "1px solid #D9E0E7", borderRadius: 7, boxShadow: "0 2px 8px #1d2d3e12" }}><input autoFocus aria-label="Search loans" style={{ ...field, minWidth: 0, flex: 1, height: 36, padding: "7px 9px", border: 0, boxShadow: "none" }} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Employee, ID, loan name or number" /><button type="button" aria-label="Clear and close search" title="Close search" onClick={() => { setSearch(""); setSearchOpen(false) }} style={{ border: 0, background: "transparent", color: "#71869A", cursor: "pointer", padding: "4px 6px", fontSize: 19, lineHeight: 1 }}>Ãƒâ€”</button></div>}</div>
          <button type="button" aria-label="Export loans to CSV" title="Export loans to CSV" style={iconButton} onClick={() => downloadCsv(visible)}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 17v4h14v-4" /></svg></button>
          <div style={{ position: "relative" }}>
            <button type="button" aria-label="More options" title="More options" aria-expanded={moreMenuOpen} style={iconButton} onClick={() => { setMoreMenuOpen((open) => !open); setStatusMenuOpen(false); setFilterOpen(false) }}>{icon("dots")}</button>
            {moreMenuOpen && <div style={{ position: "absolute", zIndex: 20, top: "calc(100% + 5px)", right: 0, width: 190, padding: 5, background: "#fff", border: "1px solid #D9E0E7", borderRadius: 7, boxShadow: "0 8px 22px #1d2d3e22" }}><button type="button" onClick={openManageLoans} style={{ display: "block", width: "100%", border: 0, borderRadius: 5, background: "transparent", color: "#1D2D3E", padding: "10px 11px", textAlign: "left", font: "inherit", cursor: "pointer" }}>Manage Loans</button></div>}
          </div>
          <div style={{ position: "relative" }}>
            <button
              type="button"
              aria-label="Open filters"
              title="Filter loans"
              style={{
                ...iconButton,
                color: "#2563EB",
                background: "#fff",
                borderColor: filterOpen ? "#2563EB" : "#D9E0E7",
              }}
              onClick={() => {
                setFilterOpen((o) => !o)
                setMoreMenuOpen(false)
              }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" aria-hidden="true">
                <path d="M4 5h16l-6.5 7.5V19l-3 1v-7.5L4 5Z" />
              </svg>
            </button>
            {filterOpen && (
              <LoanFilterPopover
                employees={employees}
                loanConfigs={loanConfigs}
                existingTypes={loans.map((l) => l.type)}
                appliedFilters={appliedFilters}
                onApply={(newFilters) => {
                  setAppliedFilters(newFilters)
                  setFilterOpen(false)
                }}
                onClear={() => {
                  setAppliedFilters({
                    employee: "",
                    type: "",
                    minAmount: "",
                    maxAmount: "",
                    minOutstanding: "",
                    maxOutstanding: "",
                    fromDate: "",
                    toDate: "",
                    repaymentFrom: "",
                    repaymentTo: "",
                  })
                  setFilterOpen(false)
                }}
                onClose={() => setFilterOpen(false)}
              />
            )}
          </div>
          <button type="button" aria-label="Help" title="Help" style={{ width: 38, height: 38, background: "#F97316", border: 0, borderRadius: 6, color: "#fff", display: "grid", placeItems: "center", cursor: "pointer", fontWeight: 700, fontSize: 16 }}>?</button>
        </div>
      </div>
    </div>
    </div>}
    {storageError && <div role="alert" style={{ ...card, borderColor: "#AA0808", color: "#AA0808" }}>Could not save loan data in browser storage. Changes may be lost when this page closes.</div>}
    {repaymentView ? <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "4px 0 18px", borderBottom: "1px solid #E6EBF0" }}><div style={{ display: "flex", alignItems: "center", gap: 12 }}><button type="button" aria-label="Back to loans" onClick={() => { setRepaymentView(false); setRepaymentEmployeeDropdownOpen(false) }} style={{ width: 34, height: 34, display: "grid", placeItems: "center", border: 0, borderRadius: "50%", background: "#EAF3FC", color: "#1673E6", cursor: "pointer" }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m14 18-6-6 6-6" /><path d="M20 12H8" /></svg></button><h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: "#263746" }}>Loan Repayments</h2></div></div>
      <section style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 10, padding: "14px 0", borderBottom: "1px solid #E6EBF0" }}><label style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", border: "1px solid #D9E0E7", borderRadius: 6, background: "#fff", color: "#52677A", fontSize: 13, whiteSpace: "nowrap" }}>Month:<input aria-label="Filter repayments by month" type="month" value={repaymentMonth} onChange={(event) => setRepaymentMonth(event.target.value)} style={{ border: 0, outline: 0, color: "#34495E", font: "inherit", background: "transparent" }} /></label><label style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", border: "1px solid #D9E0E7", borderRadius: 6, background: "#fff", color: "#52677A", fontSize: 13, whiteSpace: "nowrap" }}>Repayment Method:<select aria-label="Filter by repayment method" value={repaymentMethodFilter} onChange={(event) => setRepaymentMethodFilter(event.target.value as "" | "Manual" | "Recurring")} style={{ maxWidth: 220, border: 0, outline: 0, color: "#34495E", font: "inherit", background: "transparent" }}><option value="">Loan Repayment Method</option><option value="Manual">Manual</option><option value="Recurring">Recurring</option></select></label><div style={{ position: "relative" }}><button type="button" aria-haspopup="listbox" aria-expanded={repaymentEmployeeDropdownOpen} onClick={() => { setRepaymentEmployeeDropdownOpen((open) => !open); setRepaymentEmployeeSearch("") }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", border: "1px solid #D9E0E7", borderRadius: 6, background: "#fff", color: "#52677A", font: "inherit", fontSize: 13, cursor: "pointer" }}>Employees: <span style={{ color: "#34495E" }}>{employees.find((employee) => employee.id === repaymentEmployee)?.name ?? "Select an Employee"}</span>{icon("chevron")}</button>{repaymentEmployeeDropdownOpen && <div role="listbox" aria-label="Select an employee" style={{ position: "absolute", zIndex: 60, top: "calc(100% + 6px)", left: 0, width: 300, padding: 8, border: "1px solid #E5E7EB", borderRadius: 8, background: "#fff", boxShadow: "0 8px 22px #1d2d3e2b" }}><div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 10px", border: "1px solid #3986F7", borderRadius: 5 }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></svg><input autoFocus aria-label="Search employees" placeholder="Search employees" value={repaymentEmployeeSearch} onChange={(event) => setRepaymentEmployeeSearch(event.target.value)} style={{ width: "100%", padding: "9px 0", border: 0, outline: 0, font: "inherit" }} /></div><div style={{ maxHeight: 240, overflowY: "auto", marginTop: 6 }}>{[{ id: "", name: "Select an Employee" }, ...employees].filter((employee) => employee.name.toLowerCase().includes(repaymentEmployeeSearch.toLowerCase())).map((employee) => <button type="button" role="option" aria-selected={repaymentEmployee === employee.id} key={employee.id || "all-employees"} onClick={() => { setRepaymentEmployee(employee.id); setRepaymentEmployeeDropdownOpen(false) }} style={{ display: "block", width: "100%", padding: "9px 10px", border: 0, borderRadius: 4, background: repaymentEmployee === employee.id ? "#F1F5F9" : "#fff", color: "#34495E", textAlign: "left", font: "inherit", fontSize: 13, cursor: "pointer" }}>{employee.name}</button>)}</div></div>}</div><button type="button" style={primary} onClick={() => { const loan = loans.find((item) => item.status !== "Closed" && (!repaymentEmployee || item.employeeId === repaymentEmployee)); if (loan) { openLoanDetails(loan); setRepaymentAmount(""); setRepaymentAccount(""); setRepaymentReference(""); setRepaymentFormOpen(true) } else setError("There are no open loans available for repayment.") }}>+ Record Repayment</button></section>
      {error && !selected && <p role="alert" style={{ color: "#AA0808", fontSize: 13 }}>{error}</p>}
      <section style={{ ...card, padding: 0, overflowX: "auto" }}><table style={{ width: "100%", minWidth: 760, borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}><thead><tr>{["Date", "Employee", "Loan", "Method", "Paid amount", "Outstanding balance", "Status"].map((heading) => <th key={heading} style={{ padding: "13px 14px", borderBottom: "1px solid #D9E0E7", background: "#F8FAFC", color: "#5B738B", fontSize: 11, fontWeight: 700 }}>{heading}</th>)}</tr></thead><tbody>{repaymentRows.filter(({ repayment }) => !repaymentMethodFilter || repayment.mode === repaymentMethodFilter).map(({ loan, repayment }) => <tr key={repayment.id}>{[repayment.date, loan.employee, loan.name, repayment.mode, money(repayment.amount), money(loan.outstanding), "Recorded"].map((value, index) => <td key={index} style={{ padding: "13px 14px", borderBottom: "1px solid #EDF0F2" }}>{value}</td>)}</tr>)}</tbody></table>{repaymentRows.filter(({ repayment }) => !repaymentMethodFilter || repayment.mode === repaymentMethodFilter).length === 0 && <div style={{ padding: "44px 20px", textAlign: "center", color: "#71869A" }}><strong style={{ display: "block", color: "#34495E", marginBottom: 6 }}>No repayments found</strong>Repayments matching this month and selection will appear here.</div>}</section>
    </> : <>
      {selected && <div className="loans-detail-layout"><style>{`.loans-detail-layout{display:grid;grid-template-columns:minmax(280px,340px) minmax(0,1fr);gap:0;align-items:stretch;min-height:max(560px,calc(100dvh - 365px))}.loans-detail-list,.loans-detail-content{min-width:0;height:100%;overflow:visible;border-radius:0!important}.loans-detail-list{border-right:0!important}.loans-detail-summary-grid{grid-template-columns:minmax(190px,1.15fr) minmax(170px,1fr) minmax(145px,.8fr) minmax(175px,1fr)}.loans-detail-other-grid{grid-template-columns:repeat(2,minmax(0,1fr))}@media(max-width:1120px){.loans-detail-summary-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}}@media(max-width:900px){.loans-detail-layout{grid-template-columns:minmax(0,1fr);min-height:0}.loans-detail-list,.loans-detail-content{height:auto}.loans-detail-list{border-right:1px solid #D9E0E7!important}.loans-detail-other-grid{grid-template-columns:minmax(0,1fr)!important}}@media(max-width:560px){.loans-detail-summary-grid{grid-template-columns:minmax(0,1fr)!important}.loans-detail-other-grid>div{grid-template-columns:minmax(0,1fr)!important;gap:3px!important}}`}</style>
        <section className="loans-detail-list" style={{ ...card, padding: 0 }}><header style={{ height: 68, boxSizing: "border-box", padding: "12px 16px", borderBottom: "1px solid #E6EBF0", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}><div style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={{ position: "relative" }}><button type="button" aria-haspopup="listbox" aria-expanded={statusMenuOpen} onClick={() => setStatusMenuOpen((open) => !open)} style={{ display: "flex", alignItems: "center", gap: 4, padding: 0, border: 0, background: "transparent", color: "#1D2D3E", font: "inherit", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>{tab}{icon("chevron")}</button>{statusMenuOpen && <div role="listbox" aria-label="Loan status" style={{ position: "absolute", zIndex: 40, top: "calc(100% + 10px)", left: -6, width: 174, padding: 7, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 8, boxShadow: "0 8px 22px #1d2d3e2b" }}>{["All Loans", "Open Loans", "Paused Loans", "Closed Loans"].map((name) => <button role="option" aria-selected={tab === name} key={name} type="button" onClick={() => { setTab(name); setStatusMenuOpen(false) }} style={{ display: "flex", width: "100%", justifyContent: "space-between", padding: "9px 10px", border: 0, borderRadius: 5, background: tab === name ? "#222" : "transparent", color: tab === name ? "#fff" : "#344054", textAlign: "left", cursor: "pointer", font: "inherit", fontSize: 13 }}>{name}<span style={{ color: tab === name ? "#fff" : "#71869A" }}>{name === "All Loans" ? loans.length : loans.filter((loan) => loan.status === name.replace(" Loans", "")).length}</span></button>)}</div>}</div><span style={{ fontSize: 12, color: "#71869A" }}>{visible.length} loans</span></div><div style={{ display: "flex", gap: 8 }}><button type="button" aria-label="Add loan" style={iconButton} onClick={() => { setForm({ ...blank }); setEditing(null); setDateText(""); setEmployeeSearch(""); setError(""); setFormErrors({}) }}>+</button><div style={{ position: "relative" }}><button type="button" aria-label="Filter loans" style={iconButton} onClick={() => setFilterOpen((o) => !o)}>{icon("filter")}</button>{filterOpen && <LoanFilterPopover employees={employees} loanConfigs={loanConfigs} existingTypes={loans.map((l) => l.type)} appliedFilters={appliedFilters} onApply={(newFilters) => { setAppliedFilters(newFilters); setFilterOpen(false) }} onClear={() => { setAppliedFilters({ employee: "", type: "", minAmount: "", maxAmount: "", minOutstanding: "", maxOutstanding: "", fromDate: "", toDate: "", repaymentFrom: "", repaymentTo: "" }); setFilterOpen(false) }} onClose={() => setFilterOpen(false)} />}</div></div></header>{visible.map((loan) => <button type="button" key={loan.id} onClick={() => openLoanDetails(loan)} style={{ display: "grid", width: "100%", gridTemplateColumns: "minmax(0,1fr) auto", gap: "5px 10px", padding: "16px 15px", border: 0, borderBottom: "1px solid #EDF0F2", borderLeft: loan.id === selected.id ? "3px solid #0B6ED0" : "3px solid transparent", background: loan.id === selected.id ? "#F1F1FA" : "#fff", color: "#263746", textAlign: "left", cursor: "pointer" }}><strong style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 13 }}>{loan.employee}</strong><strong style={{ color: "#172B4D", fontSize: 13, fontWeight: 500 }}>{moneyWithPaise(loan.amount)}</strong><span style={{ color: "#71869A", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{loan.name}<span aria-hidden="true" style={{ padding: "0 10px" }}>|</span><span style={{ color: "#1673E6" }}>{loanNumber(loan.id)}</span></span><span style={{ justifySelf: "start", padding: "3px 8px", border: "1px solid #D7E5F7", borderRadius: 4, color: "#1673E6", background: "#F7FAFF", fontSize: 11 }}>{loan.status}</span></button>)}</section>
        <section className="loans-detail-content" style={{ ...card, padding: 0 }}><header style={{ padding: "15px 20px", borderBottom: "1px solid #E6EBF0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}><div style={{ display: "flex", alignItems: "center", gap: 9 }}><h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>{loanNumber(selected.id)}</h2><span style={{ padding: "4px 9px", borderRadius: 12, background: selected.status === "Open" ? "#F5FAE5" : selected.status === "Paused" ? "#FFF8D6" : "#F1F3F5", color: selected.status === "Open" ? "#188918" : selected.status === "Paused" ? "#E76500" : "#5B738B", fontSize: 12 }}>{selected.status}</span></div><div style={{ display: "flex", alignItems: "center", gap: 8 }}><button type="button" style={primary} disabled={selected.status === "Closed"} onClick={() => { setRepaymentAmount(""); setRepaymentAccount(""); setRepaymentReference(""); setRepaymentDate(todayIso()); setRepaymentMode("Manual"); setRepaymentFormOpen(true); setSelectedMoreOpen(false); setError("") }}>Record Repayment</button><div style={{ position: "relative" }}><button type="button" aria-label="Loan actions" aria-expanded={selectedMoreOpen} style={iconButton} onClick={() => setSelectedMoreOpen((open) => !open)}>{icon("dots")}</button>{selectedMoreOpen && <div style={{ position: "absolute", zIndex: 30, top: "calc(100% + 5px)", right: 0, width: 180, padding: 5, background: "#fff", border: "1px solid #D9E0E7", borderRadius: 6, boxShadow: "0 8px 22px #1d2d3e22" }}><button type="button" onClick={() => { setForm({ name: selected.name, employeeId: selected.employeeId, amount: String(selected.amount), installmentAmount: selected.installmentAmount ? String(selected.installmentAmount) : "", repaymentStartDate: selected.repaymentStartDate ?? "", otherInformation: selected.otherInformation ?? "", date: selected.date, account: selected.account, reference: selected.reference, reason: selected.reason, type: selected.type, rate: String(selected.rate), exempt: selected.exempt }); setDateText(displayLoanDate(selected.date)); setEmployeeSearch(""); setEditing(selected.id); setError(""); setSelectedMoreOpen(false); setSelected(null) }} style={{ display: "block", width: "100%", border: 0, background: "transparent", color: "#263746", padding: "9px 10px", textAlign: "left", cursor: "pointer" }}>Edit Loan</button>{selected.status !== "Closed" && <button type="button" onClick={() => { setSelectedMoreOpen(false); setRepaymentFormOpen(true) }} style={{ display: "block", width: "100%", border: 0, background: "transparent", color: "#263746", padding: "9px 10px", textAlign: "left", cursor: "pointer" }}>Record Repayment</button>}{selected.status === "Paused" ? <button type="button" onClick={() => { changeStatus(selected, "Open"); setSelectedMoreOpen(false) }} style={{ display: "block", width: "100%", border: 0, background: "transparent", color: "#263746", padding: "9px 10px", textAlign: "left", cursor: "pointer" }}>Reopen Loan</button> : selected.status !== "Closed" && <button type="button" onClick={() => { changeStatus(selected, "Paused"); setSelectedMoreOpen(false) }} style={{ display: "block", width: "100%", border: 0, background: "transparent", color: "#263746", padding: "9px 10px", textAlign: "left", cursor: "pointer" }}>Pause Loan</button>}{selected.status !== "Closed" && <button type="button" onClick={() => { changeStatus(selected, "Closed"); setSelectedMoreOpen(false) }} style={{ display: "block", width: "100%", border: 0, background: "transparent", color: "#263746", padding: "9px 10px", textAlign: "left", cursor: "pointer" }}>Close Loan</button>}</div>}</div><button type="button" aria-label="Close loan details" title="Close details" onClick={closeLoanDetails} style={{ ...iconButton, color: "#71869A" }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg></button></div></header>
          <div style={{ padding: "20px 24px" }}><section style={{ padding: "10px 0 22px", borderBottom: "1px solid #E6EBF0" }}><div className="loans-detail-summary-grid" style={{ display: "grid", alignItems: "center", gap: 22, fontSize: 13 }}><div style={{ display: "flex", alignItems: "center", gap: 16 }}><span aria-hidden="true" style={{ width: 58, height: 58, flex: "0 0 58px", display: "grid", placeItems: "center", border: "1px solid #E6EBF0", borderRadius: 12, color: "#3986F7" }}><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 8h16v12H4zM2 4h20v4H2zM9 12h6" /></svg></span><div><div style={{ color: "#263746", fontSize: 15 }}>{selected.name}</div><strong style={{ display: "block", marginTop: 2, color: "#172B4D", fontSize: 19 }}>{moneyWithPaise(selected.amount)}</strong></div></div><div style={{ color: "#71869A" }}>Availed by<button type="button" onClick={() => onOpenEmployee(selected.employeeId)} style={{ display: "block", width: "fit-content", maxWidth: "100%", marginTop: 7, padding: "6px 10px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", border: "1px solid #E2E8F0", borderRadius: 20, color: "#1673E6", background: "#fff", font: "inherit", cursor: "pointer" }} title={`Open ${selected.employee}'s employee profile`}>{selected.employee}</button></div><div style={{ color: "#71869A" }}>Installment Amount<strong style={{ display: "block", marginTop: 7, color: "#172B4D", fontSize: 15 }}>{selected.installmentAmount ? moneyWithPaise(selected.installmentAmount) : "Ã¢â‚¬â€"}</strong></div><div style={{ color: "#71869A" }}>Status<div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 7 }}><strong style={{ color: "#13A36D" }}>{selected.amount > 0 ? Math.round((selected.amount - selected.outstanding) / selected.amount * 100) : 0}%</strong><div style={{ flex: 1, height: 7, borderRadius: 6, background: "#E8EDF1", overflow: "hidden" }}><div style={{ width: `${selected.amount > 0 ? Math.min(100, (selected.amount - selected.outstanding) / selected.amount * 100) : 0}%`, height: "100%", background: "#17B26A" }} /></div></div></div></div><div style={{ marginTop: 20, paddingTop: 15, borderTop: "1px solid #E6EBF0", color: "#71869A", fontSize: 13 }}>Next Installment Date: <strong style={{ color: "#172B4D" }}>{selected.installmentAmount && selected.repayments.length ? selected.repayments[selected.repayments.length - 1].date : "â€”"}</strong></div></section>
          {repaymentFormOpen && selected && <div role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) { setRepaymentFormOpen(false); setError("") } }} style={{ position: "fixed", inset: 0, zIndex: 1000, display: "grid", placeItems: "center", padding: 20, background: "rgba(18, 24, 38, .68)" }}><section role="dialog" aria-modal="true" aria-labelledby="repayment-dialog-title" style={{ width: "min(100%, 654px)", maxHeight: "calc(100dvh - 40px)", overflowY: "auto", border: "1px solid #D9E0E7", borderRadius: 12, background: "#fff", boxShadow: "0 18px 50px rgba(15,23,42,.28)" }}><header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 32px", borderBottom: "1px solid #D9E0E7" }}><h2 id="repayment-dialog-title" style={{ margin: 0, color: "#333", fontSize: 22, fontWeight: 500 }}>Record Repayment</h2><button type="button" aria-label="Close repayment form" onClick={() => { setRepaymentFormOpen(false); setError("") }} style={{ ...iconButton, border: 0, background: "transparent", color: "#1673E6" }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg></button></header><div style={{ display: "grid", gridTemplateColumns: "minmax(150px, 1fr) minmax(180px, 1.15fr)", alignItems: "center", gap: "24px 22px", padding: "30px 32px 34px" }}>{label("Repayment Amount*", <div style={{ display: "flex", border: "1px solid #D9E0E7", borderRadius: 6, overflow: "hidden" }}><span style={{ display: "grid", placeItems: "center", padding: "0 12px", borderRight: "1px solid #D9E0E7", color: "#475E75", background: "#F8FAFC" }}>&#8377;</span><input aria-label="Repayment amount" autoFocus type="number" min="0.01" max={selected.outstanding} step="0.01" value={repaymentAmount} onChange={(event) => setRepaymentAmount(event.target.value)} style={{ ...field, border: 0, borderRadius: 0, minWidth: 0 }} /></div>)}{label("Repayment Date*", <input type="date" required value={repaymentDate} onChange={(event) => setRepaymentDate(event.target.value)} style={field} />)}{label("Payment Mode*", <select required value={repaymentMode} onChange={(event) => setRepaymentMode(event.target.value as "Manual" | "Recurring")} style={field}><option value="Manual">Cash</option><option value="Recurring">Bank Transfer</option></select>)}{label("Deposit To Account*", <select required value={repaymentAccount} onChange={(event) => setRepaymentAccount(event.target.value)} style={field}><option value="">Select</option>{DEMO_ACCOUNTS.map((account) => <option key={account} value={account}>{account}</option>)}</select>)}{label("Reference Number", <input value={repaymentReference} onChange={(event) => setRepaymentReference(event.target.value)} style={field} />)}<div style={{ color: "#263746", fontSize: 13 }}>Remaining Amount<strong style={{ display: "block", marginTop: 8, fontWeight: 500 }}>{moneyWithPaise(Math.max(0, selected.outstanding - (Number(repaymentAmount) || 0)))}</strong></div></div>{error && <p role="alert" style={{ margin: "-12px 32px 18px", color: "#AA0808", fontSize: 13 }}>{error}</p>}<footer style={{ display: "flex", alignItems: "center", gap: 10, padding: "20px 32px", borderTop: "1px solid #D9E0E7" }}><button type="button" onClick={recordRepayment} style={{ ...darkBtn, padding: "9px 13px" }}>Record Repayment</button><button type="button" onClick={() => { setRepaymentFormOpen(false); setRepaymentAmount(""); setRepaymentReference(""); setError("") }} style={btn}>Cancel</button><span style={{ marginLeft: "auto", color: "#F04452", fontSize: 12 }}>* indicates mandatory fields</span></footer></section></div>}
          <section style={{ padding: "20px 0", borderBottom: "1px solid #E6EBF0" }}><h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600 }}>Other Details</h3><div className="loans-detail-other-grid" style={{ display: "grid", gap: "17px 52px", fontSize: 13 }}>{[["Disbursement Date", selected.date || "â€”"], ["Perquisite Rate", `${selected.rate}%`], ["Loan Closing Date", "-"], ["Reason", selected.reason || "Ã¢â‚¬â€"], ["Paid Through Account", selected.account || "Ã¢â‚¬â€"], ["Reference Number", selected.reference || "Ã¢â‚¬â€"]].map(([title, value]) => <div key={title} style={{ display: "grid", gridTemplateColumns: "minmax(150px, .9fr) minmax(0,1.1fr)", gap: 14, color: "#71869A" }}><span>{title}</span><strong style={{ color: "#172B4D", fontWeight: 500, overflowWrap: "anywhere" }}>{value}</strong></div>)}</div></section>
          <section style={{ paddingTop: 18 }}><h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 600 }}>Loan Repayment Summary</h3>{(() => { const totalRepaid = selected.repayments.reduce((sum, item) => sum + item.amount, 0); const remaining = Math.max(0, selected.amount - totalRepaid); const installmentsRemaining = selected.installmentAmount ? Math.ceil(remaining / selected.installmentAmount) : null; let runningTotal = 0; return <><div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 36, padding: "16px 24px", marginBottom: 0, border: "1px solid #F1E9E2", borderBottom: 0, borderRadius: "6px 6px 0 0", background: "#FFFAF5", fontSize: 13 }}>{[["Amount Repaid", moneyWithPaise(totalRepaid)], ["Remaining Amount", moneyWithPaise(remaining)], ["Installment(s) Remaining", installmentsRemaining === null ? "â€”" : String(installmentsRemaining)]].map(([title, value], index) => <div key={title} style={{ minWidth: 110, color: "#71869A" }}>{title}<strong style={{ display: "block", marginTop: 4, color: index === 0 ? "#17A56B" : index === 1 ? "#D92D20" : "#172B4D", fontSize: 14, fontWeight: 500 }}>{value}</strong></div>)}</div><div style={{ overflowX: "auto", border: "1px solid #E3E8ED", borderRadius: "0 0 6px 6px" }}><table style={{ width: "100%", minWidth: 580, borderCollapse: "collapse", fontSize: 12, textAlign: "left" }}><thead><tr>{["INSTALLMENT DATE", "EMI", "TOTAL AMOUNT REPAID", "REMAINING AMOUNT"].map((heading) => <th key={heading} style={{ padding: "12px 16px", borderBottom: "1px solid #D9E0E7", background: "#fff", color: "#172B4D", fontSize: 10, fontWeight: 500, whiteSpace: "nowrap" }}>{heading}</th>)}</tr></thead><tbody>{selected.repayments.map((repayment) => { runningTotal += repayment.amount; return <tr key={repayment.id}>{[repayment.date, money(selected.installmentAmount ?? repayment.amount), money(runningTotal), money(Math.max(0, selected.amount - runningTotal))].map((value, index) => <td key={index} style={{ padding: "11px 16px", borderBottom: "1px solid #EDF0F2", whiteSpace: "nowrap" }}>{value}</td>)}</tr>})}</tbody></table>{selected.repayments.length === 0 && <div style={{ padding: 18, color: "#62758B", textAlign: "center", fontSize: 14 }}>The employee is yet to pay the first instalment through payroll.</div>}</div></>})()}</section></div></section>
      </div>}
      {!selected && <section style={{ ...card, padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}><table style={{ width: "100%", minWidth: 1040, borderCollapse: "collapse", textAlign: "left", fontSize: 13, tableLayout: "fixed" }}><colgroup><col style={{ width: "18%" }} /><col style={{ width: "14%" }} /><col style={{ width: "19%" }} /><col style={{ width: "11%" }} /><col style={{ width: "13%" }} /><col style={{ width: "13%" }} /><col style={{ width: "12%" }} /></colgroup><thead><tr>{["EMPLOYEE NAME", "LOAN NUMBER", "LOAN NAME", "STATUS", "LOAN AMOUNT", "AMOUNT REPAID", "REMAINING AMOUNT"].map((heading, index) => <th key={heading} style={{ padding: "13px 14px", borderBottom: "1px solid #D9E0E7", background: "#F8FAFC", color: "#5B738B", fontSize: 11, fontWeight: 700, textAlign: index >= 4 ? "right" : "left", whiteSpace: "nowrap" }}>{heading}</th>)}</tr></thead><tbody>{visible.map((loan) => { const repaid = loan.repayments.reduce((total, repayment) => total + repayment.amount, 0); const remaining = Math.max(0, loan.amount - repaid); return <tr key={loan.id} onClick={() => openLoanDetails(loan)} style={{ cursor: "pointer" }}><td style={{ padding: "14px", borderBottom: "1px solid #EDF0F2", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{loan.employee} ({loan.employeeId})</td><td style={{ padding: "14px", borderBottom: "1px solid #EDF0F2" }}><button type="button" aria-label={`View loan ${loanNumber(loan.id)}`} onClick={() => openLoanDetails(loan)} style={{ border: 0, background: "transparent", color: "#0B6ED0", padding: 0, font: "inherit", fontWeight: 600, cursor: "pointer" }}>{loanNumber(loan.id)}</button></td><td style={{ padding: "14px", borderBottom: "1px solid #EDF0F2", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{loan.name}</td><td style={{ padding: "14px", borderBottom: "1px solid #EDF0F2" }}><span style={{ display: "inline-block", padding: "4px 9px", borderRadius: 12, background: loan.status === "Open" ? "#F5FAE5" : loan.status === "Paused" ? "#FFF8D6" : "#F1F3F5", color: loan.status === "Open" ? "#188918" : loan.status === "Paused" ? "#E76500" : "#5B738B", fontSize: 12, whiteSpace: "nowrap" }}>{loan.status}</span></td><td style={{ padding: "14px", borderBottom: "1px solid #EDF0F2", textAlign: "right", whiteSpace: "nowrap" }}>{moneyWithPaise(loan.amount)}</td><td style={{ padding: "14px", borderBottom: "1px solid #EDF0F2", textAlign: "right", whiteSpace: "nowrap" }}>{moneyWithPaise(repaid)}</td><td style={{ padding: "14px", borderBottom: "1px solid #EDF0F2", textAlign: "right", whiteSpace: "nowrap", fontWeight: 600 }}>{moneyWithPaise(remaining)}</td></tr> })}{search.trim() && visible.length === 0 && <tr><td colSpan={7} style={{ padding: "36px 18px", textAlign: "center", color: "#71869A", borderBottom: "1px solid #EDF0F2" }}>No loans match Ã¢â‚¬Å“{search.trim()}Ã¢â‚¬Â. <button type="button" onClick={() => setSearch("")} style={{ border: 0, background: "transparent", color: "#0B6ED0", font: "inherit", cursor: "pointer" }}>Clear search</button></td></tr>}</tbody></table></div>
      </section>}
    </>}
  </div>
}






