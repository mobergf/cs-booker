import type { AppProps } from "next/app";
import { ChakraProvider, Container, ScaleFade } from "@chakra-ui/react";
import theme from "components/theme";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
  router,
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <ChakraProvider theme={theme}>
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
          />
          <meta name="description" content="Description" />
          <meta name="keywords" content="Keywords" />
          <title>Next.js PWA Example</title>
          <link rel="manifest" href="/manifest.json" />
          <link
            href="/icons/favicon-16x16.png"
            rel="icon"
            type="image/png"
            sizes="16x16"
          />
          <link
            href="/icons/favicon-32x32.png"
            rel="icon"
            type="image/png"
            sizes="32x32"
          />
          <link rel="apple-touch-icon" href="/apple-icon.png"></link>
          <meta name="theme-color" content="#317EFB" />
        </Head>
        <ScaleFade key={router.route} initialScale={0.6} in={true}>
          <Container maxW="container.lg" mt="4">
            <Component {...pageProps} />
          </Container>
        </ScaleFade>
      </ChakraProvider>
    </SessionProvider>
  );
}

export default MyApp;
