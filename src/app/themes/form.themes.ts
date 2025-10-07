export const buttonThemes = {
  ghost: {
    colorScheme: {
      light: {
        root: {
          primary: {
            background: "{neutral.900}",
            hoverBackground: "{neutral.800}",
            color: "{neutral.400}",
            hoverColor: "{neutral.100}",
            activeBackground: "{zinc.800}",
            focusBorderColor: "{neutral.600}",
            focusRingColor: "{neutral.600}",
            borderColor: "transparent",
            activeBorderColor: "transparent",
            hoverBorderColor: "transparent",
          },
          borderRadius: "8px",
        },
      },
    },
  },
};

export const inputThemes = {
  outlined: {
    colorScheme: {
      light: {
        root: {
          background: "#26262677",
          color: "{neutral.100}",
          focusBorderColor: "{neutral.500}",
          focusRingColor: "{neutral.500}",
          borderColor: "{neutral.600}",
          hoverBorderColor: "{neutral.500}",
          borderRadius: "8px",
        },
      },
    },
  },
};

export const menuThemes = {
  ghost: {
    colorScheme: {
      light: {
        root: {
          borderColor: "{neutral.600}",
          background: "{neutral.700}",
          borderRadius: "8px",
        },
        item: {
          color: "{neutral.100}",
          focusColor: "{neutral.100}",
          focusBackground: "{neutral.600}",
          icon: {
            color: "{neutral.400}",
            focusColor: "{neutral.100}",
          },
        },
        submenuLabel: {
          fontWeight: "400",
          padding: "0.2rem 0.5rem 0 0.5rem",
          color: "{neutral.400}",
        },
      },
    },
  },
};

export const dialogThemes = {
  custom: {
    colorScheme: {
      light: {
        root: {
          borderColor: "{neutral.600}",
          background: "{neutral.700}",
          color: "{neutral.100}",
          borderRadius: "8px",
        },
        header: {
          gap: "0",
          padding: "1rem 1rem 0.5rem 1rem",
        },
      },
    },
  },
};
