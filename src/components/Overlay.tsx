import { motion } from "framer-motion";

interface Props {
  opacity: number;
  animationDuration: number;
  onClick: () => void | Promise<void>;
}

export default function Overlay({
  onClick,
  opacity = 0.3,
  animationDuration = 0.3,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity }}
      exit={{ opacity: 0 }}
      transition={{ ease: "easeInOut", duration: animationDuration }}
      onClick={onClick}
      className="absolute h-full w-full z-40 flex items-center justify-center bg-black opacity-75"
    />
  );
}
