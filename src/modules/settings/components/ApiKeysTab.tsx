import * as React from "react";
import Modal, { ModalContent } from "~/components/Modal";
import useDisclosure from "~/hooks/use-disclosure";
import { HiX } from "react-icons/hi";
import { useGenerateApiKeyMutation } from "~/graphql/types.generated";
import generate from "project-name-generator";

const ApiKeysTab = () => {
	const { isOpen, onClose, onOpen } = useDisclosure();
	const { mutate } = useGenerateApiKeyMutation({
		onSuccess() {
			onClose();
		},
	});
	const [state, setState] = React.useState({
		name: generate().dashed,
	});

	return (
		<>
			<div className="flex flex-col flex-grow gap-8">
				<div className="flex items-center justify-between w-full">
					<span>API Keys</span>
					<button
						className="flex items-center px-6 py-2 mt-auto font-semibold text-white transition duration-500 ease-in-out transform bg-blue-600 rounded-lg hover:bg-blue-700 focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2"
						onClick={onOpen}
					>
						Create key
					</button>
				</div>
				<div></div>
			</div>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				containerProps={{ className: "flex items-center justify-center" }}
			>
				<ModalContent
					className="h-[40%] w-[30%] bg-blueGray-700 rounded-lg flex flex-col p-5"
					transition={{ duration: 0.25 }}
					variants={{
						open: {
							opacity: 1,
							y: 0,
						},
						close: {
							opacity: 0,
							y: -20,
						},
					}}
					initial="close"
					animate="open"
					exit="close"
				>
					<button
						onClick={onClose}
						className="p-2 ml-auto transition rounded-lg bg-blueGray-600 focus:outline-none focus:ring-2 ring-offset-current ring-offset-2 hover:bg-blueGray-500"
					>
						<HiX />
						<span className="sr-only">Close modal</span>
					</button>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							mutate(state);
						}}
					>
						<div className="w-full">
							<label htmlFor="title" className="block">
								Name
							</label>
							<input
								id="title"
								type="text"
								className="block w-full h-10 mt-2 text-black rounded-lg focus:outline-none focus:ring ring-black caret-black"
								value={state.name}
								onChange={(e) =>
									setState((prev) => ({ ...prev, name: e.target.value }))
								}
								required
							/>
						</div>
						<button
							type="submit"
							className="px-4 py-2 mt-4 ml-auto transition rounded-md bg-blueGray-600 hover:bg-blueGray-500 focus:ring ring-black focus:outline-none"
						>
							Submit
						</button>
					</form>
				</ModalContent>
			</Modal>
		</>
	);
};

export default ApiKeysTab;
