import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Button } from "./Button";

export default {
	name: "Button",
	component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (props) => (
	<Button {...props} />
);

export const PrimarySolid = Template.bind({});
PrimarySolid.args = {
	variant: "solid",
	theme: "primary",
	children: "Solid Primary",
};

export const PrimaryOutline = Template.bind({});
PrimaryOutline.args = {
	variant: "outline",
	theme: "primary",
	children: "Outline Primary",
};

export const PrimaryGhost = Template.bind({});
PrimaryGhost.args = {
	variant: "ghost",
	theme: "primary",
	children: "Ghost Primary",
};

export const SecondarySolid = Template.bind({});
SecondarySolid.args = {
	variant: "solid",
	theme: "secondary",
	children: "Solid Secondary",
};

export const SecondaryOutline = Template.bind({});
SecondaryOutline.args = {
	variant: "outline",
	theme: "secondary",
	children: "Outline Secondary",
};

export const SecondaryGhost = Template.bind({});
SecondaryGhost.args = {
	variant: "ghost",
	theme: "secondary",
	children: "Ghost Secondary",
};

export const DangerSolid = Template.bind({});
DangerSolid.args = {
	variant: "solid",
	theme: "danger",
	children: "Solid Danger",
};

export const DangerOutline = Template.bind({});
DangerOutline.args = {
	variant: "outline",
	theme: "danger",
	children: "Outline Danger",
};

export const DangerGhost = Template.bind({});
DangerGhost.args = {
	variant: "ghost",
	theme: "danger",
	children: "Ghost Danger",
};

export const WarningSolid = Template.bind({});
WarningSolid.args = {
	variant: "solid",
	theme: "warning",
	children: "Solid Warning",
};

export const WarningOutline = Template.bind({});
WarningOutline.args = {
	variant: "outline",
	theme: "warning",
	children: "Outline Warning",
};

export const WarningGhost = Template.bind({});
WarningGhost.args = {
	variant: "ghost",
	theme: "warning",
	children: "Ghost Warning",
};

export const ScaleSmall = Template.bind({});
ScaleSmall.args = {
	scale: "sm",
	children: "Small Button",
};

export const ScaleBase = Template.bind({});
ScaleBase.args = {
	children: "Base Button",
};

export const ScaleLarge = Template.bind({});
ScaleLarge.args = {
	scale: "lg",
	children: "Large Button",
};
