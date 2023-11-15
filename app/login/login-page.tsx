"use client";
import ModeToggle from "app/mode-toggle";
import { Button } from "components";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

export default function LoginPage() {
  const searchParams = useSearchParams();

  const [error, setError] = useState(
    searchParams?.get("callbackUrl")?.includes("error")
      ? "Couldn't authenticate"
      : "",
  );

  const userRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userRef?.current?.value || !passwordRef?.current?.value)
      return setError("User or Password is missing.");
    signIn("credentials", {
      username: userRef?.current?.value,
      password: passwordRef?.current?.value,
      callbackUrl: "/",
    });
  };

  return (
    <div>
      <div className="absolute top-8 flex min-w-[300px] justify-center md:min-w-[400px]">
        <ModeToggle />
      </div>
      <h1 className="animate-bounce text-center text-4xl font-bold text-primary">
        Spella spell
      </h1>
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="mt-2 flex min-w-[300px] flex-col rounded-md border border-primary p-4 shadow-lg md:min-w-[400px]"
      >
        {error && <p className="text-red-700">{error}</p>}
        <label className=" text-lg ">Username</label>
        <input
          ref={userRef}
          type="text"
          id="user-input"
          placeholder="Username"
          className="min-h-12 rounded-md border border-primary bg-transparent p-2 transition-shadow focus:shadow-[0_0_0_1px_theme(colors.primary)] focus:outline-none"
        />
        <label className="mt-2 text-lg ">Password</label>
        <input
          ref={passwordRef}
          type="password"
          id="password-input"
          placeholder="Password"
          className="min-h-12 rounded-md border border-primary bg-transparent p-2 transition-shadow focus:shadow-[0_0_0_1px_theme(colors.primary)] focus:outline-none"
        />
        <Button className="mt-4" type="submit">
          Log in
        </Button>
      </form>
    </div>
  );
}
