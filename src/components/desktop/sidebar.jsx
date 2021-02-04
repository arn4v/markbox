import * as React from "react";
import { Logo } from "~/components/logo";
import { FoldersContainer } from "./folders-container";
import { ProfileDropdown } from "./profile-dropdown";

export function Sidebar() {
  return (
    <>
      <div className="w-1/4 h-full pb-8 border-r border-blueGray-600 flex justify-end items-start pt-12 pr-6">
        <div className="flex w-1/2 h-full flex-col justify-between">
          <div className="flex dark:text-white font-medium flex-col gap-6 w-full">
            <Logo className="my-1.5" />
            <FoldersContainer />
          </div>
          <ProfileDropdown />
        </div>
      </div>
    </>
  );
}
