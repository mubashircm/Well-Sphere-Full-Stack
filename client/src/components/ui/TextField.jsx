function TextField({ help, id, label, ...inputProps }) {
  const helpId = help ? `${id}-help` : undefined;
  return <div className="ui-field"><label htmlFor={id}>{label}</label><input id={id} aria-describedby={helpId} {...inputProps} />{help && <p id={helpId} className="ui-field__help">{help}</p>}</div>;
}

export default TextField;
