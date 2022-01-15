import mixpanel, { Mixpanel as MixpanelClient } from "mixpanel-browser";
import React from "react";
import { isProd } from "~/config";
import { trpc } from "~/lib/trpc";

const mixpanelContext =
	// @ts-ignore
	React.createContext<MixpanelClient>(null);

export const MixpanelProvider = ({
	apiKey,
	children,
}: {
	apiKey: string;
	children: React.ReactNode;
}) => {
	const [client] = React.useState<MixpanelClient>(() =>
		mixpanel.init(
			process.env.NEXT_PUBLIC_MIXPANEL_TOKEN as string,
			{
				debug: !isProd,
				ignore_dnt: true,
			},
			"Bookmarky",
		),
	);
	const { data, isLoading } = trpc.useQuery(["users.me"], {
		refetchOnWindowFocus: false,
		refetchOnMount: true,
		refetchOnReconnect: false,
		retry: false,
		staleTime: Infinity,
	});
	const [trigger, setTrigger] = React.useState(false);

	React.useEffect(() => {
		if (!trigger && !isLoading && data?.id) {
			client.identify(data?.id);
			console.log("User identified in Mixpanel", data?.id);
			setTrigger(true);
		}
	}, [client, data, isLoading, trigger]);

	return (
		<mixpanelContext.Provider value={client}>
			{children}
		</mixpanelContext.Provider>
	);
};

export const useMixpanel = () => React.useContext(mixpanelContext);
