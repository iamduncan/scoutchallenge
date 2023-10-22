import { type FC } from 'react';

interface InputProps {
  children: string;
  title?: string;
}

const SuccessAlert: FC<InputProps> = ({ children, title }) => {
  return (
    <div className="mb-8 flex w-full justify-center text-center">
      <div
        className="mt-6 flex items-center justify-between gap-4 rounded border border-green-900/10 bg-green-50 p-4 text-green-700"
        role="alert"
      >
        <div className="flex w-full items-center gap-4">
          <span className="rounded-full bg-green-600 p-2 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>

          <p className="flex-grow">
            <strong className="text-sm font-medium">
              {title ? title : 'Success!'}{' '}
            </strong>

            <span className="block text-xs opacity-90">{children}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessAlert;
