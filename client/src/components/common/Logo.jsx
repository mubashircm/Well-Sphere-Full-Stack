import { Link } from "react-router-dom";

function Logo({
  className = "h-8 w-auto object-contain",
  showText = true,
  textColor = "text-teal-900",
  to = "/",
  linkClassName = "inline-flex items-center gap-2.5 group focus:outline-none",
  alt = "WellSphere Logo",
  ...props
}) {
  return (
    <Link to={to} className={linkClassName} aria-label="WellSphere — Return to home" {...props}>
      <img
        src="/WellSphere.png"
        alt={alt}
        className={`${className} group-hover:scale-105 transition-transform duration-200 object-contain shrink-0`}
      />
      {showText && (
        <span className={`font-serif text-xl sm:text-2xl font-bold tracking-tight ${textColor} transition-colors`}>
          Well<span className="text-teal-600">Sphere</span>
        </span>
      )}
    </Link>
  );
}

export default Logo;
