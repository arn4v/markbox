import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { BOOKMARKS_FETCH } from "~/store/async";
import { HomeDesktop } from "./Home.desktop";
import { HomeMobile } from "./Home.mobile";

export function HomePage() {
  const { user } = useSelector((s) => ({
    user: s.user,
  }));
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (user) dispatch(BOOKMARKS_FETCH);
  }, [dispatch, user]);

  return (
    <>
      <div className="lg:hidden">
        <HomeMobile />
      </div>
      <HomeDesktop />
    </>
  );
}
