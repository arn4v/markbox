import * as React from "react";
import { TagBadge } from "~/components/tag-badge";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import format from "date-fns/format";
import { AnimatePresence } from "framer-motion";
import { actions } from "~/store";
import Normal from "~/components/desktop/BookmarkCard/normal";

/**
 * @param {Object} props
 * @param {string} props.id
 * @exports
 */
export function BookmarkCard(props) {
  const show = useSelector((s) => s.edit.show);

  return (
    <>
      <AnimatePresence>
        {!show && <Normal id={props.id} />}
        {show && <></>}
      </AnimatePresence>
    </>
  );
}

BookmarkCard.propTypes = {
  id: PropTypes.string.isRequired,
};
