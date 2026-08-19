import { NavLink } from "react-router-dom";

/**
 * Reusable, accessible, and responsive Breadcrumb navigation component.
 *
 * @param {Array<{ label: string, to?: string }>} items - List of path items. Last item is treated as active/current page.
 * @param {string} className - Optional container styling classes.
 */
function Breadcrumb({ items = [], className = "" }) {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={`w-full overflow-x-auto whitespace-nowrap py-1 mb-6 sm:mb-8 text-xs sm:text-sm text-slate-500 scrollbar-none ${className}`}
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <ol className="flex items-center space-x-1.5 sm:space-x-2 min-w-max list-none m-0 p-0">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center space-x-1.5 sm:space-x-2">
              {index > 0 && (
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}

              {isLast || !item.to ? (
                <span
                  className="font-semibold text-slate-900 truncate max-w-[200px] sm:max-w-[320px] md:max-w-none"
                  aria-current={isLast ? "page" : undefined}
                  title={typeof item.label === "string" ? item.label : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <NavLink
                  to={item.to}
                  className="hover:text-teal-700 transition-colors shrink-0 font-medium hover:underline"
                >
                  {item.label}
                </NavLink>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
