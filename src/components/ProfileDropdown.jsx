import { useRouter } from "next/router";
import { getFirebase } from "~/lib/firebase";

const ProfileDropdown = () => {
  const router = useRouter();
  const { auth } = getFirebase();
  const logout = () => {
    auth.signOut().then(() => router.push("/login"));
  };

  return (
    <button
      onClick={logout}
      className="w-full text-white font-medium items-center justify-center hover:bg-blueGray-600 flex px-2 py-1.5 transition duration-150 ease-in-out bg-blueGray-700 rounded-lg">
      Logout
    </button>
  );
};

export default ProfileDropdown;
