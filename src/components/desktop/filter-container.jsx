import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";

export function FilterContainer() {
  const show = useSelector((state) => state.filter.show);
  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            transition={{ ease: "easeInOut", duration: 0.3 }}
            exit={{ height: 0 }}
            className="w-full py-4 flex gap-6">
            <div className="flex flex-col w-1/3 flex-wrap gap-4">
              <h1 className="">Sort by</h1>
              <form action="" className="">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    name="accountType"
                    value="personal"
                  />
                  <span className="ml-2">Personal</span>
                </label>
                <label className="inline-flex items-center ml-6">
                  <input
                    type="radio"
                    className="form-radio"
                    name="accountType"
                    value="busines"
                  />
                  <span className="ml-2">Business</span>
                </label>
              </form>
            </div>
            <div className="flex flex-col"></div>
            <div className="flex flex-col"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
