import PropTypes from 'prop-types'
import { CheckBadgeIcon } from '@heroicons/react/24/solid'
import Badge from '../ui/Badge'

export default function UserList({ users, onUserClick }) {
  return (
    <div className="mb-8">
      <h3 className="text-xs font-mono text-text-secondary mb-4">
        Users online ({users.length})
      </h3>
      <div className="space-y-2">
        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => onUserClick && onUserClick(user)}
            className="
              flex items-center justify-between
              px-4 py-3 rounded
              hover:bg-bg-elevated
              cursor-pointer transition-quick
              group border border-transparent hover:border-accent/20
            "
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0 animate-pulse" />
              <span className="text-sm text-text truncate group-hover:text-accent transition-quick">
                {user.nickname}
              </span>
            </div>
            {user.tripcode && (
              <div className="flex items-center gap-1">
                <CheckBadgeIcon className="w-4 h-4 text-accent" />
                <Badge variant="default" className="text-[10px]">
                  {user.tripcode}
                </Badge>
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-text-secondary mt-4 font-mono">
        Click user to @mention
      </p>
    </div>
  )
}

UserList.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nickname: PropTypes.string.isRequired,
      tripcode: PropTypes.string,
      online: PropTypes.bool,
    })
  ).isRequired,
  onUserClick: PropTypes.func,
}
