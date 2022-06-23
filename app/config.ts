type MenuItem = {
  id: string;
  label: string;
  path: string;
  forAdmin?: boolean;
};

export const menuItems = [
  {
    id: "home",
    label: "Home",
    path: "/",
  },
  {
    id: "challenges",
    label: "Challenges",
    path: "/challenges",
  },
  {
    id: "admin",
    label: "Admin",
    path: "/admin",
    forAdmin: true,
  },
];
