function Button({ children, className = "", variant = "primary", ...props }) {
  return <button className={`ui-button ui-button--${variant} ${className}`.trim()} {...props}>{children}</button>;
}

export default Button;
