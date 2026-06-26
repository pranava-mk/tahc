import PropTypes from 'prop-types'

export default function Badge({ children, variant = 'default', className = '' }) {
  const baseStyles = 'inline-flex items-center px-2 py-0.5 rounded text-xs font-mono'

  const variants = {
    default: 'bg-bg-elevated text-text-secondary border border-border',
    accent: 'bg-accent-dim text-accent border border-accent/20',
  }

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'accent']),
  className: PropTypes.string,
}
