import type { FC } from "react";
import { Header } from "#app/components/common/index.ts";
import { useUser } from "#app/utils/user.ts";

interface InputProps {
  children: React.ReactElement;
}

const AppLayout: FC<InputProps> = ({ children }) => {
  const user = useUser();
  return (
    <div className="layout flex flex-col">
      <Header user={user} />
      <main className="layout-main container box-content flex-grow overflow-y-auto bg-zinc-100 scrollbar:!h-1.5 scrollbar:!w-1.5 scrollbar:bg-transparent scrollbar-track:mt-2 scrollbar-track:!rounded scrollbar-track:!bg-slate-100 scrollbar-thumb:!rounded scrollbar-thumb:!bg-slate-400 md:mx-auto md:-mt-10 md:rounded-t-xl">
        {children}
      </main>
      <footer className="flex-none border-t border-gray-300 bg-white text-center text-xs text-stone-500 shadow-lg">
        <p>
          Made with{" "}
          <span role="img" aria-label="heart">
            ❤️
          </span>{" "}
          by{" "}
          <a
            href="https://www.wessexdigitalsolutions.co.uk"
            className="text-blue-500 hover:text-blue-700"
          >
            Wessex Digital Solutions
          </a>
        </p>
      </footer>
    </div>
  );
};

export default AppLayout;
