// 1. Import `extendTheme`
import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";

// 2. Call `extendTheme` and pass your custom values
const theme = extendTheme(
  {
    styles: {
      global: {
        body: {
          bg: "brand.champagneLight",
          color: "brand.secondaryDark",
        },
      },
    },
    colors: {
      brand: {
        primary: "#EE6055",
        primaryLight: "#FF7B87",
        secondary: "#2F4858",
        secondaryDark: "#20313c",
        champagne: "#F2D398",
        champagneLight: "#fff5e2",
        blue: "#405378",
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
            h: 12,
            px: 8,
            transition: "0.2s ease",
            color: "white",
            _hover: {
              bg: "brand.primaryLight",
            },
            _focus: {
              bg: "brand.primaryLight",
            },
          },
          secondary: {
            background: "brand.secondary",
            borderRadius: "md",
            h: 12,
            px: 8,
            transition: "0.2s ease",
            color: "white",
            _hover: {
              bg: "brand.secondaryDark",
            },
            _focus: {
              bg: "brand.secondaryDark",
            },
          },
          outlined: {
            background: "transparent",
            borderRadius: "md",
            h: 12,
            px: 8,
            transition: "0.2s ease",
            color: "white",
            _hover: {
              bg: "brand.primaryLight",
            },
            _focus: {
              bg: "brand.primaryLight",
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
          focusBorderColor: "brand.primaryLight",
        },
      },
      NumberInput: {
        defaultProps: {
          focusBorderColor: "brand.primaryLight",
        },
      },
    },
  },
  withDefaultColorScheme({ colorScheme: "brand" })
);

export default theme;
