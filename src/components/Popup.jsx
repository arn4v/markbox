import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import PropTypes from "prop-types";
import clsx from "clsx";

/**
 * @param {Object} props
 * @param {boolean} props.show
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 */
export default function Popup(props) {
  const { children, show, className } = props;
  return (
    <AnimatePresence exitBeforeEnter>
      {show && (
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={clsx([
            "absolute top-0 z-30 p-4 ml-4 border rounded-lg left-full dark:bg-blueGray-700 dark:border-blueGray-600",
            className,
          ])}>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
