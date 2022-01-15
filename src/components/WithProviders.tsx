import { UserProvider } from "@auth0/nextjs-auth0";
import * as React from "react";
import { MixpanelProvider } from "~/providers/Mixpanel";

const IdentifyUserInMixpanel = () => {};

export const WithProviders = ({ children }: { children: React.ReactNode }) => {
	return (
		<UserProvider>
			<MixpanelProvider
				apiKey={process.env.NEXT_PUBLIC_AMPLITUDE_KEY as string}
			>
				{children}
			</MixpanelProvider>
		</UserProvider>
	);
};
