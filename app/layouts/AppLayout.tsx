import type { FC } from "react";
import { Header } from "~/components/common";
import { useUser } from "~/utils";

const AppLayout: FC = ({ children }) => {
  const user = useUser();
  return (
    <div className="flex h-screen flex-row-reverse">
      <div className="flex flex-grow flex-col">
        <div className="text-center">
          <Header user={user} />
        </div>
        <main className="flex-grow">
          <div className="container mx-auto my-5 p-5">{children}</div>
        </main>
        <div className="text-center">
          <footer className="text-gray-600 text-sm">
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
    </div>
  );
};

export default AppLayout;
