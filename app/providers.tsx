"use client";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider, Container, ScaleFade } from "@chakra-ui/react";
import { theme } from "components";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CacheProvider>
        <ChakraProvider theme={theme}>
          <ScaleFade initialScale={0.6} in={true}>
            <Container
              maxW="container.lg"
              px={{ base: 0, md: "4" }}
              mt="0"
              py="4"
            >
              {children}
            </Container>
          </ScaleFade>
        </ChakraProvider>
      </CacheProvider>
    </SessionProvider>
  );
}
