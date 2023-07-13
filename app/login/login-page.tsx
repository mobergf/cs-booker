"use client";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [error, setError] = useState(
    searchParams?.get("callbackUrl")?.includes("error")
      ? "Couldn't authenticate"
      : ""
  );
  const [isLoading, setIsLoading] = useState(false);

  const userRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userRef?.current?.value || !passwordRef?.current?.value)
      return setError("User or Password is missing.");
    setIsLoading(true);
    signIn("credentials", {
      username: userRef?.current?.value,
      password: passwordRef?.current?.value,
      callbackUrl: "/",
    });
  };

  return (
    <Flex
      maxW="container.xl"
      m="0 auto"
      justify="center"
      align="center"
      mt="10vh"
      p="4"
      direction="column"
      gap="2"
    >
      <Heading as="h1">Vill du spella spell?</Heading>
      <form onSubmit={(e) => handleSubmit(e)}>
        <FormControl
          p="8"
          border="1px solid"
          borderColor="brand.primary"
          borderRadius="md"
          minW={{ base: 0, md: "400px" }}
          display="flex"
          flexDirection="column"
          gap="4"
          boxShadow="lg"
        >
          {error && <p className="text-red-primary">{error}</p>}
          <FormLabel mr="0">
            Username
            <Input
              ref={userRef}
              id="user-input"
              type="text"
              placeholder="Username"
              border="1px solid"
              borderColor="brand.primary"
              minH="12"
              px="2"
            />
          </FormLabel>
          <FormLabel mr="0">
            Password
            <Input
              ref={passwordRef}
              type="password"
              id="password-input"
              placeholder="Password"
              border="1px solid"
              borderColor="brand.primary"
              minH="12"
              px="2"
            />
          </FormLabel>
          <Button type="submit" isLoading={isLoading}>
            Log in
          </Button>
        </FormControl>
      </form>
    </Flex>
  );
}
