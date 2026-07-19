import { useState } from 'react'
import { useAuth } from '../lib/useAuth'
import { supabase } from '../lib/supabase'
import { useCategories } from '../hooks/useCategories'
import { useEntries } from '../hooks/useEntries'
import { useMonthlySummaries } from '../hooks/useMonthlySummaries'
import MonthSelector from '../components/MonthSelector'
import EntryTable from '../components/EntryTable'
import SummaryBar from '../components/SummaryBar'
import NetChart from '../components/NetChart'
import CategoryManager from '../components/CategoryManager'

function currentMonth() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

function totals(entries) {
  return entries.reduce(
    (acc, e) => ({ projected: acc.projected + Number(e.projected), actual: acc.actual + Number(e.actual) }),
    { projected: 0, actual: 0 }
  )
}

export default function Dashboard() {
  const { session } = useAuth()
  const userId = session.user.id
  const [month, setMonth] = useState(currentMonth())
  const [showCategories, setShowCategories] = useState(false)

  const { categories, loading: categoriesLoading, addCategory, deleteCategory } = useCategories(userId)
  const { entries, loading: entriesLoading, addEntry, updateEntry, deleteEntry } = useEntries(userId, month)
  const { summaries } = useMonthlySummaries(userId, entries.length)

  const incomeCategories = categories.filter((c) => c.type === 'income')
  const expenseCategories = categories.filter((c) => c.type === 'expense')
  const incomeEntries = entries.filter((e) => e.categories?.type === 'income')
  const expenseEntries = entries.filter((e) => e.categories?.type === 'expense')

  const loading = categoriesLoading || entriesLoading

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Cashflow</h1>
        <div className="header-controls">
          <MonthSelector month={month} onChange={setMonth} />
          <button type="button" className="signout-btn" onClick={() => setShowCategories((v) => !v)}>
            {showCategories ? 'Hide categories' : 'Manage categories'}
          </button>
          <button type="button" className="signout-btn" onClick={() => supabase.auth.signOut()}>
            Sign out
          </button>
        </div>
      </header>

      {showCategories && (
        <CategoryManager categories={categories} onAdd={addCategory} onDelete={deleteCategory} />
      )}

      {loading ? (
        <p className="loading">Loading…</p>
      ) : (
        <>
          <SummaryBar income={totals(incomeEntries)} expenses={totals(expenseEntries)} />

          <NetChart summaries={summaries} />

          <EntryTable
            title="Income"
            entries={incomeEntries}
            categories={incomeCategories}
            onAdd={(entry) => addEntry(entry)}
            onUpdate={updateEntry}
            onDelete={deleteEntry}
          />

          <EntryTable
            title="Expenses"
            entries={expenseEntries}
            categories={expenseCategories}
            onAdd={(entry) => addEntry(entry)}
            onUpdate={updateEntry}
            onDelete={deleteEntry}
          />
        </>
      )}
    </div>
  )
}
