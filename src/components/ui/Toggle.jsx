import { useState } from 'react'
import PropTypes from 'prop-types'

export default function Toggle({
  label,
  checked = false,
  onChange,
  disabled = false,
  className = ''
}) {
  const [isChecked, setIsChecked] = useState(checked)

  const handleToggle = () => {
    if (disabled) return
    const newValue = !isChecked
    setIsChecked(newValue)
    if (onChange) onChange(newValue)
  }

  return (
    <label className={`flex items-center cursor-pointer ${disabled ? 'opacity-40 cursor-not-allowed' : ''} ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={isChecked}
          onChange={handleToggle}
          disabled={disabled}
        />
        <div className={`
          w-11 h-6 rounded-xl transition-expressive
          ${isChecked
            ? 'bg-accent'
            : 'bg-bg-elevated border border-border'
          }
        `}>
          <div className={`
            absolute left-1 top-1 w-4 h-4 bg-text rounded-full
            transition-expressive-spatial transform
            ${isChecked ? 'translate-x-5' : 'translate-x-0'}
          `} />
        </div>
      </div>
      {label && (
        <span className="ml-3 text-sm text-text">
          {label}
        </span>
      )}
    </label>
  )
}

Toggle.propTypes = {
  label: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
}
