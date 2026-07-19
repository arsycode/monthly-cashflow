import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useMonthlySummaries(userId, refreshKey) {
  const [summaries, setSummaries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    let cancelled = false

    async function load() {
      setLoading(true)
      const { data } = await supabase.from('entries').select('month, projected, actual, categories(type)')

      const byMonth = new Map()
      for (const row of data ?? []) {
        const bucket = byMonth.get(row.month) ?? { month: row.month, netProjected: 0, netActual: 0 }
        const sign = row.categories?.type === 'expense' ? -1 : 1
        bucket.netProjected += sign * row.projected
        bucket.netActual += sign * row.actual
        byMonth.set(row.month, bucket)
      }

      if (!cancelled) {
        setSummaries([...byMonth.values()].sort((a, b) => a.month.localeCompare(b.month)))
        setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [userId, refreshKey])

  return { summaries, loading }
}
