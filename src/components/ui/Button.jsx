import PropTypes from 'prop-types'

export default function Button({
  children,
  variant = 'primary',
  onClick,
  disabled = false,
  className = '',
  ...props
}) {
  const baseStyles = 'btn disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none'

  const variants = {
    primary: 'btn-primary',
    danger: 'btn-danger',
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'danger']),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
}
