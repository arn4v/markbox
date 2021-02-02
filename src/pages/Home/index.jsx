import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddSheet } from "~/components/AddSheet";
import { EditSheet } from "~/components/EditSheet";
import { FilterSheet } from "~/components/FilterSheet";
import { BOOKMARKS_FETCH } from "~/store/asyncActions";
import { HomeDesktop } from "./Home.desktop";
import { HomeMobile } from "./Home.mobile";

export function HomePage() {
  const { add, edit, filter, user } = useSelector((s) => ({
    add: s.add,
    filter: s.filter,
    edit: s.edit,
    user: s.user,
  }));
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (user) dispatch(BOOKMARKS_FETCH);
  }, [dispatch, user]);

  return (
    <>
      <div className="">
        <AddSheet />
        {/* {add.show && <AddSheet />} */}
        {/* {filter.show && <FilterSheet />} */}
        {edit.show && <EditSheet />}
        <HomeMobile />
      </div>
      <HomeDesktop />
    </>
  );
}
