// 1. Import `extendTheme`
import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";

// 2. Call `extendTheme` and pass your custom values
const theme = extendTheme(
  {
    styles: {
      global: {
        body: {
          bg: "gray.50",
          color: "brand.secondaryDark",
        },
      },
    },
    colors: {
      brand: {
        primary: "#00837C",
        primaryDark: "#005a55",
        secondary: "#2F4858",
        secondaryDark: "#20313c",
        blue: "#405378",
        gray: "#F7F7F7",
        green: "#00837C",
        500: "#00837C",
      },
    },
    shadows: {
      outline: "0 0 0 2px var(--chakra-colors-brand-blue)",
    },

    components: {
      Button: {
        variants: {
          primary: {
            background: "brand.primary",
            borderRadius: "md",
            px: 8,
            transition: "0.2s ease",
            color: "white",
            _hover: {
              bg: "brand.primaryDark",
            },
            _focus: {
              bg: "brand.primaryDark",
            },
          },
        },
        defaultProps: {
          size: "md",
          variant: "primary",
        },
      },
      Input: {
        defaultProps: {
          focusBorderColor: "brand.primary",
        },
      },
      NumberInput: {
        defaultProps: {
          focusBorderColor: "brand.primary",
        },
      },
    },
  },
  withDefaultColorScheme({ colorScheme: "brand" })
);

export default theme;
