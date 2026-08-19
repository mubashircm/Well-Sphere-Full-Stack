function EmptyState({ children, title, ...props }) {
  return <section className="ui-empty-state" {...props}><h2>{title}</h2>{children}</section>;
}

export default EmptyState;
