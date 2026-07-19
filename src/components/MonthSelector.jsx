function shiftMonth(month, delta) {
  const [year, m] = month.split('-').map(Number)
  const date = new Date(year, m - 1 + delta, 1)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export default function MonthSelector({ month, onChange }) {
  return (
    <div className="month-selector">
      <button type="button" onClick={() => onChange(shiftMonth(month, -1))} aria-label="Previous month">
        ‹
      </button>
      <input type="month" value={month} onChange={(e) => onChange(e.target.value)} />
      <button type="button" onClick={() => onChange(shiftMonth(month, 1))} aria-label="Next month">
        ›
      </button>
    </div>
  )
}
