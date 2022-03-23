import clsx from "clsx";
import { Input, InputProps } from "./Input";

export function FormField({
	label,
	containerProps,
	helperText,
	...props
}: {
	label: React.ReactNode;
	containerProps?: React.ComponentProps<"div">;
	helperText?: string;
} & InputProps) {
	return (
		<div
			{...containerProps}
			className={clsx([
				"w-full flex flex-col space-y-2",
				containerProps?.className,
			])}
		>
			<label htmlFor={props?.id} className="block">
				{label}
			</label>
			<Input {...props} />
			<p>{helperText}</p>
		</div>
	);
}
