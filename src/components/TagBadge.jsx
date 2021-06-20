import clsx from "clsx";
import PropTypes from "prop-types";

/**
 * @param {Object} props
 * @param {string} props.className
 * @param {string} props.title
 * @param {React.ReactNode} [props.children]
 */
export function TagBadge({ className, title, children }) {
	return (
		<>
			<div
				className={clsx([
					"flex gap-1.5 px-2 py-1 text-xs font-medium text-white items-center justify-center uppercase rounded-full",
					className,
				])}>
				{title}
				{children}
			</div>
		</>
	);
}

TagBadge.propTypes = {
	className: PropTypes.string,
	title: PropTypes.string.isRequired,
	children: PropTypes.element,
};

TagBadge.defaultProps = {
	className: "",
};
