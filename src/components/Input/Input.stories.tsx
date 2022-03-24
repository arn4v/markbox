import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Input } from "./Input";

export default {
	name: "Button",
	component: Input,
} as ComponentMeta<typeof Input>;

const Template: ComponentStory<typeof Input> = (props) => <Input {...props} />;

export const ScaleSmall = Template.bind({});
ScaleSmall.args = {
	value: "Scale: Small",
	scale: "sm",
};

export const ScaleLarge = Template.bind({});
ScaleLarge.args = {
	value: "Scale: Large",
	scale: "lg",
};

export const ScaleBase = Template.bind({});
ScaleBase.args = {
	value: "Scale: Base",
	scale: "base",
};

export const FullWidth = Template.bind({});
FullWidth.args = {
	value: "Full Width",
	fullWidth: true,
};
