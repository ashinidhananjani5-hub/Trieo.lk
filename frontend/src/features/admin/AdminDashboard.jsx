import { useState } from 'react'

function AdminDashboard({
  places,
  categories,
  users,
  section,
  notice,
  onChangeSection,
  onEditPlace,
  onViewPlace,
  onDeletePlace,
  onAddPlace,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
}) {
  const [categoryEditor, setCategoryEditor] = useState(null)

  const saveCategory = (event) => {
    event.preventDefault()
    const categoryName = String(new FormData(event.currentTarget).get('categoryName') || '').trim()
    if (!categoryName) return

    if (categoryEditor.current) {
      onEditCategory(categoryEditor.current, categoryName)
    } else {
      onAddCategory(categoryName)
    }
    setCategoryEditor(null)
  }

  const dashboardCards = [
    {
      id: 'places',
      icon: '⌖',
      title: 'Manage Places',
      description: 'Add, review, and update local attractions.',
      count: places.length,
      countLabel: 'attractions',
    },
    {
      id: 'categories',
      icon: '◈',
      title: 'Manage Categories',
      description: 'Organize attractions by their category.',
      count: categories.length,
      countLabel: 'categories',
    },
    {
      id: 'users',
      icon: '♙',
      title: 'Manage Users',
      description: 'Review registered tourists and administrator access.',
      count: users.length,
      countLabel: 'accounts',
    },
  ]

  const currentCard = dashboardCards.find((card) => card.id === section)

  return (
    <main className="dashboard-main admin-dashboard">
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow alt">Administrator dashboard</span>
          <h1>{section === 'overview' ? 'Manage your platform.' : currentCard.title}</h1>
          <p>
            {section === 'overview'
              ? 'Choose an area to manage Trieo.lk.'
              : currentCard.description}
          </p>
        </div>
        {section !== 'overview' && (
          <button className="secondary-btn" type="button" onClick={() => onChangeSection('overview')}>
            ← Dashboard
          </button>
        )}
      </div>

      {notice && <p className="notice" role="status">{notice}</p>}

      {section === 'overview' && (
        <div className="admin-card-grid">
          {dashboardCards.map((card) => (
            <button
              className="admin-management-card"
              key={card.id}
              type="button"
              onClick={() => onChangeSection(card.id)}
            >
              <span className="admin-management-icon" aria-hidden="true">{card.icon}</span>
              <span className="admin-management-title">{card.title}</span>
              <span className="admin-management-description">{card.description}</span>
              <span className="admin-management-count">
                <strong>{card.count}</strong> {card.countLabel}
                <span aria-hidden="true">→</span>
              </span>
            </button>
          ))}
        </div>
      )}

      {section === 'places' && (
        <>
          <div className="admin-section-toolbar">
            <div className="admin-section-summary">
              <strong>{places.length}</strong> listed attractions
            </div>
            <button className="primary-btn" type="button" onClick={onAddPlace}>
              + Add attraction
            </button>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Place</th><th>Categories</th><th>Location</th><th>Opening hours</th><th>Action</th></tr>
              </thead>
              <tbody>
                {places.map((place) => (
                  <tr key={place.id}>
                    <td>
                      <div className="admin-place">
                        <img src={place.images?.[0] || place.image} alt="" />
                        <div><strong>{place.name}</strong><small>{place.images?.length || 1} images</small></div>
                      </div>
                    </td>
                    <td>{(place.categories || [place.type]).join(', ')}</td>
                    <td>{place.latitude != null && place.longitude != null ? `${place.latitude}, ${place.longitude}` : 'Not set'}</td>
                    <td>{place.hours}</td>
                    <td>
                      <div className="admin-place-actions">
                        <button
                          className="place-action-btn"
                          type="button"
                          aria-label={`Edit ${place.name}`}
                          title="Edit attraction"
                          onClick={() => onEditPlace(place)}
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
                          </svg>
                        </button>
                        <button
                          className="place-action-btn"
                          type="button"
                          aria-label={`View ${place.name}`}
                          title="View attraction"
                          onClick={() => onViewPlace(place)}
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                        <button
                          className="place-action-btn delete-place-action"
                          type="button"
                          aria-label={`Delete ${place.name}`}
                          title="Delete attraction"
                          onClick={() => onDeletePlace(place)}
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M3 6h18" />
                            <path d="M8 6V4h8v2" />
                            <path d="m19 6-1 14H6L5 6" />
                            <path d="M10 11v5M14 11v5" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="admin-note">
            <span aria-hidden="true">ⓘ</span>
            Place edits are reflected immediately in this frontend preview. Connect an API or database to publish changes between sessions.
          </div>
        </>
      )}

      {section === 'categories' && (
        <section className="admin-panel" aria-labelledby="categories-title">
          <div className="admin-panel-heading">
            <div>
              <h2 id="categories-title">Attraction categories</h2>
              <p>Update a category to apply its new name to matching attractions.</p>
            </div>
            <button
              className="primary-btn"
              type="button"
              onClick={() => setCategoryEditor({ current: '', name: '' })}
            >
              + Add category
            </button>
          </div>
          {categoryEditor && (
            <form className="admin-category-editor" onSubmit={saveCategory}>
              <label htmlFor="admin-category-name">
                {categoryEditor.current ? 'Rename category' : 'New category name'}
              </label>
              <input
                id="admin-category-name"
                name="categoryName"
                defaultValue={categoryEditor.name}
                placeholder="e.g. Heritage"
                maxLength={60}
                required
              />
              <div className="admin-category-actions">
                <button className="secondary-btn" type="button" onClick={() => setCategoryEditor(null)}>
                  Cancel
                </button>
                <button className="primary-btn" type="submit">
                  {categoryEditor.current ? 'Save name' : 'Add category'}
                </button>
              </div>
            </form>
          )}
          {categories.length > 0 ? (
            <div className="admin-category-list">
              {categories.map((category) => {
                const placeCount = places.filter((place) => (
                  place.categories?.includes(category) || place.type === category
                )).length
                return (
                  <article className="admin-category-row" key={category}>
                    <span className="admin-category-icon" aria-hidden="true">◈</span>
                    <div className="admin-category-info">
                      <strong>{category}</strong>
                      <span>{placeCount} {placeCount === 1 ? 'attraction' : 'attractions'}</span>
                    </div>
                    <div className="admin-category-actions">
                      <button
                        className="edit-btn"
                        type="button"
                        onClick={() => setCategoryEditor({ current: category, name: category })}
                      >
                        Rename
                      </button>
                      <button
                        className="edit-btn danger-btn"
                        type="button"
                        disabled={placeCount > 0}
                        title={placeCount > 0 ? 'Move attractions to another category before deleting.' : undefined}
                        onClick={() => onDeleteCategory(category)}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <p className="empty-state">No categories yet. Add a category to get started.</p>
          )}
          <div className="admin-note">
            <span aria-hidden="true">ⓘ</span>
            Categories currently used by attractions cannot be deleted. Changes are reflected in this frontend preview but are not saved between sessions.
          </div>
        </section>
      )}

      {section === 'users' && (
        <section className="admin-panel" aria-labelledby="users-title">
          <div className="admin-panel-heading">
            <div>
              <h2 id="users-title">User accounts</h2>
              <p>Administrator and tourist accounts available in this browser’s local demo storage.</p>
            </div>
          </div>
          <div className="admin-user-list">
            {users.map((user) => (
              <article className="admin-user-row" key={user.email}>
                <span className="admin-user-avatar" aria-hidden="true">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <div className="admin-user-info">
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                </div>
                <span className={user.role === 'Administrator' ? 'role-badge admin-role' : 'role-badge'}>
                  {user.role}
                </span>
              </article>
            ))}
            {users.length === 1 && (
              <p className="empty-state">No tourist accounts have been registered in this browser yet.</p>
            )}
          </div>
          <div className="admin-note">
            <span aria-hidden="true">ⓘ</span>
            Administrator access is configured for this demo. User roles and accounts require a server-backed system for production management.
          </div>
        </section>
      )}
    </main>
  )
}

export default AdminDashboard
