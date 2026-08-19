function Feedback({ children, tone = "info", ...props }) {
  return <p className={`ui-feedback ui-feedback--${tone}`} {...props}>{children}</p>;
}

export default Feedback;
