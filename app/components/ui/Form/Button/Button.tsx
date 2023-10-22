import { type ReactNode } from 'react';

/**
 * Button component
 */
const Button = (
  props:
    | {
        children: ReactNode;
        onClick?: () => void;
        varient?: 'primary' | 'secondary';
      }
    | {
        children: ReactNode;
        varient?: 'primary' | 'secondary';
        submit?: true;
      },
) => {
  const { children, varient } = props;
  const buttonClass = (varient: 'primary' | 'secondary' = 'primary') => {
    switch (varient) {
      case 'primary':
        return 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded';
      case 'secondary':
        return 'bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded';
    }
  };
  return (
    <button
      {...('onClick' in props
        ? { onClick: props.onClick }
        : { type: 'submit' })}
      className={buttonClass(varient)}
    >
      {children}
    </button>
  );
};

export default Button;
