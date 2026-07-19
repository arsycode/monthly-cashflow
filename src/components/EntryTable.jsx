import { useState } from 'react'

const money = new Intl.NumberFormat('id-ID')

function EntryRow({ entry, categories, onUpdate, onDelete }) {
  const [label, setLabel] = useState(entry.label)
  const [projected, setProjected] = useState(entry.projected)
  const [actual, setActual] = useState(entry.actual)

  function commit(changes) {
    onUpdate(entry.id, changes)
  }

  const diff = actual - projected

  return (
    <tr>
      <td>
        <select
          value={entry.category_id}
          onChange={(e) => commit({ category_id: e.target.value })}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </td>
      <td>
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={() => label !== entry.label && commit({ label })}
        />
      </td>
      <td>
        <input
          type="number"
          value={projected}
          onChange={(e) => setProjected(Number(e.target.value))}
          onBlur={() => projected !== entry.projected && commit({ projected })}
        />
      </td>
      <td>
        <input
          type="number"
          value={actual}
          onChange={(e) => setActual(Number(e.target.value))}
          onBlur={() => actual !== entry.actual && commit({ actual })}
        />
      </td>
      <td className={diff < 0 ? 'diff-negative' : diff > 0 ? 'diff-positive' : ''}>
        {money.format(diff)}
      </td>
      <td>
        <button type="button" className="icon-btn" onClick={() => onDelete(entry.id)} aria-label="Delete entry">
          ✕
        </button>
      </td>
    </tr>
  )
}

function NewEntryRow({ categories, onAdd }) {
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? '')
  const [label, setLabel] = useState('')
  const [projected, setProjected] = useState('')
  const [actual, setActual] = useState('')

  function handleAdd() {
    if (!categoryId || !label.trim()) return
    onAdd({ categoryId, label: label.trim(), projected: Number(projected) || 0, actual: Number(actual) || 0 })
    setLabel('')
    setProjected('')
    setActual('')
  }

  return (
    <tr className="new-entry-row">
      <td>
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </td>
      <td>
        <input
          placeholder="Description"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
      </td>
      <td>
        <input
          type="number"
          placeholder="0"
          value={projected}
          onChange={(e) => setProjected(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
      </td>
      <td>
        <input
          type="number"
          placeholder="0"
          value={actual}
          onChange={(e) => setActual(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
      </td>
      <td />
      <td>
        <button type="button" className="icon-btn" onClick={handleAdd} aria-label="Add entry">
          +
        </button>
      </td>
    </tr>
  )
}

export default function EntryTable({ title, entries, categories, onAdd, onUpdate, onDelete }) {
  const total = (key) => entries.reduce((sum, e) => sum + Number(e[key]), 0)

  return (
    <section className="entry-table">
      <h2>{title}</h2>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Description</th>
            <th>Projected</th>
            <th>Actual</th>
            <th>Diff</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <EntryRow key={entry.id} entry={entry} categories={categories} onUpdate={onUpdate} onDelete={onDelete} />
          ))}
          {categories.length > 0 && <NewEntryRow categories={categories} onAdd={onAdd} />}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2}>Total</td>
            <td>{money.format(total('projected'))}</td>
            <td>{money.format(total('actual'))}</td>
            <td>{money.format(total('actual') - total('projected'))}</td>
            <td />
          </tr>
        </tfoot>
      </table>
    </section>
  )
}
