import PropTypes from 'prop-types'
import {
  BellIcon,
  EyeIcon,
  CodeBracketIcon,
  DocumentTextIcon,
  PhotoIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'
import Toggle from '../ui/Toggle'
import Button from '../ui/Button'

export default function SettingsPanel({ settings, onSettingChange, onClearMessages }) {
  const settingsItems = [
    { key: 'audioNotifications', label: 'Audio notifications', icon: BellIcon },
    { key: 'desktopNotifications', label: 'Desktop notifications', icon: BellIcon },
    { key: 'showJoinLeave', label: 'Show join/leave', icon: UserGroupIcon },
    { key: 'enableLatex', label: 'Enable LaTeX', icon: DocumentTextIcon },
    { key: 'enableSyntaxHighlight', label: 'Syntax highlighting', icon: CodeBracketIcon },
    { key: 'showImages', label: 'Show images', icon: PhotoIcon },
  ]

  return (
    <div>
      <h3 className="text-xs font-mono text-text-secondary mb-4">
        Settings
      </h3>

      <div className="space-y-4">
        {settingsItems.map(({ key, label, icon: Icon }) => (
          <div key={key} className="flex items-center gap-3 p-3 rounded hover:bg-bg-elevated transition-quick">
            <Icon className="w-4 h-4 text-text-secondary flex-shrink-0" />
            <Toggle
              label={label}
              checked={settings[key]}
              onChange={(val) => onSettingChange(key, val)}
              className="flex-1"
            />
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-border">
        <Button
          variant="danger"
          onClick={onClearMessages}
          className="w-full text-xs"
        >
          Clear all messages
        </Button>
      </div>
    </div>
  )
}

SettingsPanel.propTypes = {
  settings: PropTypes.shape({
    audioNotifications: PropTypes.bool,
    desktopNotifications: PropTypes.bool,
    showJoinLeave: PropTypes.bool,
    enableLatex: PropTypes.bool,
    enableSyntaxHighlight: PropTypes.bool,
    showImages: PropTypes.bool,
  }).isRequired,
  onSettingChange: PropTypes.func.isRequired,
  onClearMessages: PropTypes.func.isRequired,
}
