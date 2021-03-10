import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FETCH_UPDATE } from "~/store/async";
import { HomeDesktop } from "~/components/partials/Dashboard/desktop";
import { HomeMobile } from "~/components/partials/Dashboard/mobile";

export default function HomePage() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(FETCH_UPDATE("all"));
  }, [dispatch]);

  return (
    <>
      <div className="lg:hidden">
        <HomeMobile />
      </div>
      <div className="hidden lg:block">
        <HomeDesktop />
      </div>
    </>
  );
}
