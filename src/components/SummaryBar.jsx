const money = new Intl.NumberFormat('id-ID')

function Stat({ label, projected, actual }) {
  return (
    <div className="summary-stat">
      <span className="summary-label">{label}</span>
      <span className="summary-value">{money.format(actual)}</span>
      <span className="summary-sub">projected {money.format(projected)}</span>
    </div>
  )
}

export default function SummaryBar({ income, expenses }) {
  const netProjected = income.projected - expenses.projected
  const netActual = income.actual - expenses.actual

  return (
    <div className="summary-bar">
      <Stat label="Income" projected={income.projected} actual={income.actual} />
      <Stat label="Expenses" projected={expenses.projected} actual={expenses.actual} />
      <Stat label="Net" projected={netProjected} actual={netActual} />
    </div>
  )
}
