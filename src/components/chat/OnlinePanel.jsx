import PropTypes from 'prop-types'
import { XMarkIcon } from '@heroicons/react/24/solid'

const DOTS = ['bg-blue', 'bg-pink', 'bg-lime', 'bg-yellow', 'bg-orange', 'bg-purple', 'bg-cyan']

export default function OnlinePanel({ users, open, onClose }) {
  return (
    <>
      {open && <div className="fixed inset-0 z-[150] bg-ink/30" onClick={onClose} aria-hidden="true" />}
      <aside
        className={`fixed top-0 right-0 h-full w-72 bg-paper border-l-3 border-ink z-[160]
                    transition-transform duration-300 ease-snappy overflow-y-auto scroll-brutal
                    ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b-3 border-ink bg-lime">
          <span className="font-display font-bold text-sm">in the room · {users.length}</span>
          <button onClick={onClose} className="btn-brutal bg-card !p-1 !rounded-brutal-sm" aria-label="Close">
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
        <ul className="p-3 space-y-2">
          {users.map((u, i) => (
            <li key={u.id} className="card-brutal !shadow-brutal-sm flex items-center gap-2 px-3 py-2 animate-pop-in">
              <span className={`w-2.5 h-2.5 rounded-full border-2 border-ink ${DOTS[i % DOTS.length]}`} />
              <span className="font-mono text-sm font-bold truncate">{u.nickname}</span>
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
