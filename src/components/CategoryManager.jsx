import { useState } from 'react'

function CategoryList({ title, items, onDelete }) {
  return (
    <div className="category-list">
      <h3>{title}</h3>
      {items.length === 0 && <p className="category-empty">No categories yet.</p>}
      <ul>
        {items.map((c) => (
          <li key={c.id}>
            <span>{c.name}</span>
            <button
              type="button"
              className="icon-btn"
              onClick={() => onDelete(c)}
              aria-label={`Delete ${c.name}`}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function CategoryManager({ categories, onAdd, onDelete }) {
  const [name, setName] = useState('')
  const [type, setType] = useState('expense')

  const income = categories.filter((c) => c.type === 'income')
  const expense = categories.filter((c) => c.type === 'expense')

  async function handleAdd(e) {
    e.preventDefault()
    if (!name.trim()) return
    const { error } = await onAdd(name.trim(), type)
    if (!error) setName('')
  }

  function handleDelete(category) {
    const confirmed = window.confirm(
      `Delete "${category.name}"? This also deletes every entry logged under it, in every month.`
    )
    if (confirmed) onDelete(category.id)
  }

  return (
    <section className="category-manager">
      <h2>Manage categories</h2>
      <div className="category-lists">
        <CategoryList title="Income" items={income} onDelete={handleDelete} />
        <CategoryList title="Expenses" items={expense} onDelete={handleDelete} />
      </div>
      <form className="category-add-form" onSubmit={handleAdd}>
        <input
          placeholder="New category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <button type="submit">Add category</button>
      </form>
    </section>
  )
}
