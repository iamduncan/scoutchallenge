import { Link } from "@remix-run/react";

export default function SupportPage() {
  return (
    <div className=" flex h-full flex-col items-center justify-center">
      <h1 className="mb-6 text-6xl font-bold">
        <span role="img" aria-label="support">
          💡
        </span>
      </h1>
      <p className="text-xl">We are working hard to make this site better.</p>
      <p className="text-xl">
        If you have any questions, please contact us at{" "}
        <a href="mailto:support@scoutchallenge.app" className="text-blue-500">
          support@scoutchallenge.app
        </a>
      </p>
      <div className="absolute top-4 left-4">
        <Link to="/" className="hover:text-blue-500 hover:underline">
          &larr; Go Home
        </Link>
      </div>
    </div>
  );
}
