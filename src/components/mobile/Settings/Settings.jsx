import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";

const SettingsContainer = () => {
  const show = useSelector((s) => s.settings.show);
  return (
    <>
      <AnimatePresence exitBeforeEnter>
        {show && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            exit={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            transition={{ duration: 0.15, ease: "circOut" }}
            className={clsx([
              "w-full flex flex-col justify-start items-center border-b border-blueGray-600",
              show && "p-4",
            ])}>
            <div className="flex justify-between items-center w-full">
              <div className="dark:text-white">Theme</div>
              <div className="flex">
                <button className="flex items-center justify-center h-8 px-4 dark:bg-blueGray-700 rounded-l-lg dark:text-white uppercase text-xs focus:outline-none">
                  Light
                </button>
                <button className="flex items-center justify-center h-8 px-4 dark:bg-blueGray-600 rounded-r-lg dark:text-white uppercase text-xs focus:outline-none">
                  Dark
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SettingsContainer;
