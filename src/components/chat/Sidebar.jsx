import { useState } from 'react'
import PropTypes from 'prop-types'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import UserList from './UserList'
import SettingsPanel from './SettingsPanel'

export default function Sidebar({
  users,
  settings,
  onUserClick,
  onSettingChange,
  onClearMessages,
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <>
      {/* Sidebar */}
      <div
        className={`
          fixed top-0 right-0 h-full w-72
          bg-bg border-l border-border
          transition-expressive-spatial
          overflow-y-auto custom-scrollbar
          z-[200]
          ${isHovered ? 'translate-x-0' : 'translate-x-full'}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        id="sidebar"
      >
        <div className="p-8">
          {/* User List */}
          <UserList users={users} onUserClick={onUserClick} />

          {/* Divider */}
          <div className="border-t border-border my-8" />

          {/* Settings */}
          <SettingsPanel
            settings={settings}
            onSettingChange={onSettingChange}
            onClearMessages={onClearMessages}
          />
        </div>
      </div>

      {/* Sidebar Toggle Tab */}
      {!isHovered && (
        <div
          className="
            fixed top-1/2 right-0 -translate-y-1/2
            bg-bg border border-r-0 border-border
            px-2 py-6 rounded-l
            cursor-pointer hover:px-3
            transition-expressive
            z-[199]
            group
          "
          onMouseEnter={() => setIsHovered(true)}
        >
          <Bars3Icon className="w-4 h-4 text-text-secondary group-hover:text-accent transition-quick" />
        </div>
      )}
    </>
  )
}

Sidebar.propTypes = {
  users: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  onUserClick: PropTypes.func.isRequired,
  onSettingChange: PropTypes.func.isRequired,
  onClearMessages: PropTypes.func.isRequired,
}
