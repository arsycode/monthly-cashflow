import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const money = new Intl.NumberFormat('id-ID')

function monthLabel(month) {
  const [year, m] = month.split('-')
  return new Date(Number(year), Number(m) - 1, 1).toLocaleDateString('en-US', {
    month: 'short',
    year: '2-digit',
  })
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <strong>{monthLabel(label)}</strong>
      <span>{money.format(payload[0].value)}</span>
    </div>
  )
}

export default function NetChart({ summaries }) {
  if (summaries.length === 0) return null

  return (
    <section className="net-chart">
      <h2>Net by month (actual)</h2>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={summaries} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <CartesianGrid stroke="var(--grid)" vertical={false} />
          <XAxis
            dataKey="month"
            tickFormatter={monthLabel}
            stroke="var(--text)"
            tickLine={false}
            axisLine={{ stroke: 'var(--border)' }}
          />
          <YAxis
            stroke="var(--text)"
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => money.format(v)}
            width={70}
          />
          <ReferenceLine y={0} stroke="var(--border)" />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--accent-bg)' }} />
          <Bar dataKey="netActual" radius={[4, 4, 4, 4]} maxBarSize={40}>
            {summaries.map((s) => (
              <Cell key={s.month} fill={s.netActual >= 0 ? 'var(--good)' : 'var(--critical)'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </section>
  )
}
