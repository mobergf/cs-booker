import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid h-screen place-items-center bg-champagne-light text-secondary-dark">
      <div className="flex flex-col items-center">
        <h1 className="mb-4 text-4xl font-medium">Uh-oh, 404</h1>
        <Link href="/" className="inline-flex">
          <svg
            viewBox="0 0 24 24"
            focusable="false"
            className="h-6 w-6 fill-secondary-dark"
          >
            <path
              className="fill-secondary-dark"
              d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"
            ></path>
          </svg>
          Return Home
        </Link>
      </div>
    </div>
  );
}
