import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { DEFAULT_CATEGORIES } from '../lib/defaultCategories'

export function useCategories(userId) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    let cancelled = false

    async function load() {
      setLoading(true)

      let { data } = await supabase.from('categories').select('*').order('name')

      if (data.length === 0) {
        const seeded = DEFAULT_CATEGORIES.map((c) => ({ ...c, user_id: userId }))
        // ignoreDuplicates + the categories_user_name_type_idx unique index makes this
        // race-safe against StrictMode's double-invoked effect (both calls can run
        // concurrently; the DB constraint ensures only one insert per category wins).
        await supabase
          .from('categories')
          .upsert(seeded, { onConflict: 'user_id,name,type', ignoreDuplicates: true })
        const { data: refetched } = await supabase.from('categories').select('*').order('name')
        data = refetched ?? []
      }

      if (!cancelled) {
        setCategories(data)
        setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [userId])

  async function addCategory(name, type) {
    const { data, error } = await supabase
      .from('categories')
      .insert({ name, type, user_id: userId })
      .select()
      .single()
    if (!error) setCategories((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)))
    return { data, error }
  }

  async function deleteCategory(id) {
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (!error) setCategories((prev) => prev.filter((c) => c.id !== id))
    return { error }
  }

  return { categories, loading, addCategory, deleteCategory }
}
