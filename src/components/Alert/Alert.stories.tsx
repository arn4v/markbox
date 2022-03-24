import { ComponentMeta, ComponentStory } from "@storybook/react";
import Alert from "./Alert";

export default {
	name: "Alert",
	component: Alert,
} as ComponentMeta<typeof Alert>;

const Template: ComponentStory<typeof Alert> = (props) => <Alert {...props} />;

export const Info = Template.bind({});
Info.args = {
	theme: "info",
	children: "Information Alert",
};

export const Danger = Template.bind({});
Danger.args = {
	theme: "danger",
	children: "Danger Alert",
};

export const Warning = Template.bind({});
Warning.args = {
	theme: "warning",
	children: "Warning Alert",
};

export const Small = Template.bind({});
Small.args = {
	children: "Small Alert",
	size: "sm",
};

export const Large = Template.bind({});
Large.args = {
	children: "Large Alert",
	size: "lg",
};
