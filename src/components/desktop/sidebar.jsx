import * as React from "react";
import { Logo } from "~/components/logo";
import { AddBookmarkButton } from "./add-bookmark";
import { FoldersContainer } from "./folders-container";
import { ProfileDropdown } from "./profile-dropdown";

export function Sidebar() {
  return (
    <>
      <div className="flex items-start justify-end w-1/4 h-full pt-12 pb-8 pr-6 border-r border-blueGray-600">
        <div className="flex flex-col justify-between w-1/2 h-full">
          <div className="flex flex-col w-full font-medium dark:text-white gap-6">
            <Logo className="my-1.5" />
            <FoldersContainer />
            <AddBookmarkButton />
          </div>
          <ProfileDropdown />
        </div>
      </div>
    </>
  );
}
