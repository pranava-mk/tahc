import PropTypes from 'prop-types'
import { XMarkIcon } from '@heroicons/react/24/outline'

// Right slide-in panel listing who's in the room. Click-toggled (no hover jank).
export default function OnlinePanel({ users, open, onClose }) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-[150] bg-black/30" onClick={onClose} aria-hidden="true" />
      )}
      <aside
        className={`fixed top-0 right-0 h-full w-64 bg-bg border-l border-border z-[160]
                    transition-transform duration-300 ease-out custom-scrollbar overflow-y-auto
                    ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="text-xs text-text-secondary">in the room · {users.length}</span>
          <button onClick={onClose} className="text-text-secondary hover:text-accent transition-colors" aria-label="Close">
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
        <ul className="py-2">
          {users.map((u) => (
            <li key={u.id} className="px-4 py-1.5 text-sm text-text flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-success shrink-0" />
              <span className="truncate">{u.nickname}</span>
            </li>
          ))}
        </ul>
      </aside>
    </>
  )
}

OnlinePanel.propTypes = {
  users: PropTypes.array.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}
