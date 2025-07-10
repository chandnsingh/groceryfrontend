import { Link, useLocation } from "react-router-dom";

const Breadcrumb = () => {
  const location = useLocation();

  const paths = location.pathname
    .split("/")
    .filter(Boolean)
    .filter((segment) => !/^[a-f0-9]{32,}$/.test(segment)); // remove long IDs

  if (paths.length === 0) return null;

  let fullPath = "";

  const state = location.state || {};

  return (
    <div className="w-full max-w-[73rem] mx-auto mt-3 flex justify-start">
      <nav className="text-sm px-4 mt-3 text-gray-700">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <li>
            <Link to="/" className="text-blue-900 hover:underline font-medium">
              Home
            </Link>
          </li>

          {paths.map((segment, index) => {
            fullPath += `/${segment}`;
            const isLast = index === paths.length - 1;

            // 👇 Custom label logic
            let name;
            if (segment === "product" && state.category && !isLast) {
              name =
                state.category.charAt(0).toUpperCase() +
                state.category.slice(1);
            } else if (isLast && state.name) {
              name = state.name;
            } else {
              name =
                segment.charAt(0).toUpperCase() +
                segment.slice(1).replace(/-/g, " ");
            }

            return (
              <li key={index} className="flex items-center">
                <span className="mx-1 text-gray-400">/</span>
                {isLast ? (
                  <span className="text-gray-500 font-medium">{name}</span>
                ) : (
                  <Link
                    to={fullPath}
                    className="text-blue-900 hover:underline font-medium"
                    state={state} // 👈 Pass state to keep name/category on navigation
                  >
                    {name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
