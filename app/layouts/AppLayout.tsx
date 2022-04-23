import type { FC } from "react";
import { Header } from "~/components/common";
import { useUser } from "~/utils";

const AppLayout: FC = ({ children }) => {
  const user = useUser();
  return (
    <div className="flex h-full flex-row-reverse">
      <div className="flex flex-grow flex-col">
        <Header user={user} />
        <main className="container mx-auto -mt-10 mb-5 h-full flex-grow rounded-t-xl bg-white pt-6">
          {children}
        </main>
        <footer className="border-t text-center text-sm text-gray-600">
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
    </div>
  );
};

export default AppLayout;
