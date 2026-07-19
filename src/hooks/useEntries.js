import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useEntries(userId, month) {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId || !month) return
    let cancelled = false

    async function load() {
      setLoading(true)
      const { data } = await supabase
        .from('entries')
        .select('*, categories(id, name, type)')
        .eq('month', month)
        .order('created_at')
      if (!cancelled) {
        setEntries(data ?? [])
        setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [userId, month])

  async function addEntry({ categoryId, label, projected, actual }) {
    const { data, error } = await supabase
      .from('entries')
      .insert({
        user_id: userId,
        month,
        category_id: categoryId,
        label,
        projected: projected || 0,
        actual: actual || 0,
      })
      .select('*, categories(id, name, type)')
      .single()
    if (!error) setEntries((prev) => [...prev, data])
    return { data, error }
  }

  async function updateEntry(id, changes) {
    const { data, error } = await supabase
      .from('entries')
      .update(changes)
      .eq('id', id)
      .select('*, categories(id, name, type)')
      .single()
    if (!error) setEntries((prev) => prev.map((e) => (e.id === id ? data : e)))
    return { data, error }
  }

  async function deleteEntry(id) {
    const { error } = await supabase.from('entries').delete().eq('id', id)
    if (!error) setEntries((prev) => prev.filter((e) => e.id !== id))
    return { error }
  }

  return { entries, loading, addEntry, updateEntry, deleteEntry }
}
