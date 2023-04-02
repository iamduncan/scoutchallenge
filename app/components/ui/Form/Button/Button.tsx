import type { ReactNode } from "react";

/**
 * Button component
 */
const Button = ({
  children,
  onClick,
  varient = "primary",
}: {
  children: ReactNode;
  onClick: () => void;
  varient?: "primary" | "secondary";
}) => {
  const buttonClass = (varient: "primary" | "secondary") => {
    switch (varient) {
      case "primary":
        return "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded";
      case "secondary":
        return "bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded";
    }
  };
  return (
    <button onClick={onClick} className={buttonClass(varient)}>
      {children}
    </button>
  );
};

export default Button;
