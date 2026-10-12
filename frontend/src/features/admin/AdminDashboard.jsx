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

  const metricCards = [
    {
      id: 'places',
      title: 'Attractions & Places',
      description: 'Manage listed destinations, images, and geolocation coordinates.',
      count: places.length,
      countLabel: 'Attractions',
      color: 'from-emerald-700 to-[#1b4332]',
      icon: (
        <svg className="w-6 h-6 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      id: 'categories',
      title: 'Categories',
      description: 'Organize destinations by thematic tags, nature types, and interests.',
      count: categories.length,
      countLabel: 'Categories',
      color: 'from-teal-700 to-emerald-800',
      icon: (
        <svg className="w-6 h-6 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
    },
    {
      id: 'users',
      title: 'User Accounts',
      description: 'Review active tourists and administrator credentials in system storage.',
      count: users.length,
      countLabel: 'Accounts',
      color: 'from-stone-700 to-stone-900',
      icon: (
        <svg className="w-6 h-6 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
  ]

  const activeMetric = metricCards.find((c) => c.id === section)

  return (
    <main className="w-full flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 1. Header Section */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-sm mb-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-700" />
              Administrator Control Center
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight">
              {section === 'overview' ? 'Platform Management' : activeMetric?.title}
            </h1>
            <p className="text-stone-600 text-sm sm:text-base mt-1.5 max-w-2xl">
              {section === 'overview'
                ? 'Manage attractions, categorize destinations, and review platform accounts for Trieo.lk.'
                : activeMetric?.description}
            </p>
          </div>

          {/* Section Switcher Tabs & Back Button */}
          <div className="flex items-center gap-2">
            {section !== 'overview' && (
              <button
                type="button"
                onClick={() => onChangeSection('overview')}
                className="px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Overview</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Global Notice Alert */}
      {notice && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-sm font-semibold text-emerald-900 flex items-center gap-3 shadow-xs" role="status">
          <svg className="w-5 h-5 text-emerald-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{notice}</span>
        </div>
      )}

      {/* 2. Overview Metrics Cards */}
      {section === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {metricCards.map((card) => (
              <button
                key={card.id}
                type="button"
                onClick={() => onChangeSection(card.id)}
                className="group text-left bg-white rounded-3xl border border-stone-200/90 p-7 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1 relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-stone-100 group-hover:bg-emerald-50 border border-stone-200/70 group-hover:border-emerald-200 flex items-center justify-center transition-colors">
                    {card.icon}
                  </div>
                  <span className="text-3xl font-extrabold text-stone-900 font-sans tracking-tight">
                    {card.count}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-emerald-800">
                  <span>Manage {card.countLabel}</span>
                  <span className="transform group-hover:translate-x-1.5 transition-transform" aria-hidden="true">→</span>
                </div>
              </button>
            ))}
          </div>

          {/* Quick Summary Banner */}
          <div className="p-6 rounded-3xl bg-stone-100/70 border border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1b4332] text-white flex items-center justify-center font-bold">
                ⓘ
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-sm">Preview Mode Active</h4>
                <p className="text-xs text-stone-600">
                  All additions, edits, and deletions persist during this browser session.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onAddPlace}
              className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-xs transition-colors whitespace-nowrap"
            >
              + Quick Add Attraction
            </button>
          </div>
        </div>
      )}

      {/* 3. Section: Manage Places Table */}
      {section === 'places' && (
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden">
          {/* Table Header Toolbar */}
          <div className="p-6 sm:p-7 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Listed Attractions</h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Total <strong>{places.length}</strong> attractions currently accessible to tourists.
              </p>
            </div>
            <button
              type="button"
              onClick={onAddPlace}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow transition-all active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Attraction</span>
            </button>
          </div>

          {/* Table Container with Sticky Header */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50/90 border-b border-stone-200 text-[11px] font-extrabold uppercase tracking-wider text-stone-600 sticky top-0 z-10 backdrop-blur-xs">
                  <th className="py-4 px-6">Place</th>
                  <th className="py-4 px-6">Categories</th>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6">Opening Hours</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm text-stone-700">
                {places.map((place) => {
                  const displayCategories = place.categories || [place.type]
                  return (
                    <tr key={place.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={place.images?.[0] || place.image}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover shrink-0 border border-stone-200"
                          />
                          <div>
                            <span className="font-bold text-stone-900 block">{place.name}</span>
                            <span className="text-xs text-stone-400 font-medium">
                              {place.images?.length || 1} images · {place.distance}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1">
                          {displayCategories.map((c) => (
                            <span key={c} className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100">
                              {c}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-xs text-stone-600 font-mono">
                        {place.latitude != null && place.longitude != null ? (
                          <span className="bg-stone-100 px-2 py-1 rounded-md">
                            {place.latitude}, {place.longitude}
                          </span>
                        ) : (
                          <span className="text-stone-400 italic">Not set</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-xs text-stone-600 font-medium">
                        {place.hours}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => onEditPlace(place)}
                            aria-label={`Edit ${place.name}`}
                            title="Edit attraction"
                            className="p-2 rounded-xl text-stone-500 hover:text-emerald-800 hover:bg-emerald-50 border border-transparent hover:border-emerald-200 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>

                          {/* View Button */}
                          <button
                            type="button"
                            onClick={() => onViewPlace(place)}
                            aria-label={`View ${place.name}`}
                            title="View details"
                            className="p-2 rounded-xl text-stone-500 hover:text-blue-800 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => onDeletePlace(place)}
                            aria-label={`Delete ${place.name}`}
                            title="Delete attraction"
                            className="p-2 rounded-xl text-stone-500 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Section: Manage Categories */}
      {section === 'categories' && (
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-stone-100">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Attraction Categories</h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Organize attractions into structured categories.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCategoryEditor({ current: '', name: '' })}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
            >
              <span>+ Add Category</span>
            </button>
          </div>

          {/* Inline Category Editor Form */}
          {categoryEditor && (
            <form onSubmit={saveCategory} className="mb-6 p-5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-center gap-3">
              <input
                name="categoryName"
                defaultValue={categoryEditor.name}
                placeholder="Enter category name (e.g. Cultural, Safari)..."
                maxLength={60}
                required
                className="flex-1 w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
              />
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setCategoryEditor(null)}
                  className="px-4 py-2.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-bold transition-colors"
                >
                  {categoryEditor.current ? 'Save Name' : 'Create Category'}
                </button>
              </div>
            </form>
          )}

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => {
              const placeCount = places.filter(
                (p) => (p.categories && p.categories.includes(category)) || p.type === category,
              ).length

              return (
                <div
                  key={category}
                  className="p-5 rounded-2xl border border-stone-200/80 bg-white shadow-xs hover:border-emerald-200 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100 flex items-center justify-center font-bold text-sm">
                      ◈
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">{category}</h4>
                      <span className="text-xs text-stone-400 font-medium">
                        {placeCount} {placeCount === 1 ? 'place' : 'places'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setCategoryEditor({ current: category, name: category })}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-600 hover:text-emerald-800 hover:bg-stone-100 transition-colors"
                    >
                      Rename
                    </button>
                    <button
                      type="button"
                      disabled={placeCount > 0}
                      onClick={() => onDeleteCategory(category)}
                      title={placeCount > 0 ? 'Move attractions before deleting' : 'Delete category'}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        placeCount > 0
                          ? 'text-stone-300 cursor-not-allowed'
                          : 'text-rose-600 hover:bg-rose-50'
                      }`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 5. Section: Users Management */}
      {section === 'users' && (
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8">
          <div className="mb-6 pb-6 border-b border-stone-100">
            <h2 className="text-xl font-bold text-stone-900">Registered Accounts</h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Review active administrator and tourist accounts stored for this application.
            </p>
          </div>

          <div className="divide-y divide-stone-100">
            {users.map((user) => {
              const isAdmin = user.role === 'Administrator'
              return (
                <div key={user.email} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center font-extrabold text-sm uppercase text-white shadow-xs ${
                        isAdmin
                          ? 'bg-gradient-to-br from-purple-700 to-indigo-800'
                          : 'bg-gradient-to-br from-[#1b4332] to-[#40916c]'
                      }`}
                    >
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">{user.name}</h4>
                      <p className="text-xs text-stone-400 font-medium">{user.email}</p>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
                      isAdmin
                        ? 'bg-purple-50 text-purple-800 border border-purple-200'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </main>
  )
}

export default AdminDashboard
