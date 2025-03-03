import NotificationDropdown from "./NotificationDropdown";
import UserDropdown from "./UserDropdown";

export const AuthenticatedMenu = () => {
  return (
    <div className="flex items-center gap-2 2xsm:gap-3">
      <NotificationDropdown />
      <UserDropdown />
    </div>
  );
};
