import { VariantProps, cva, cx } from "class-variance-authority";

import "./Container.css";

const containerVariants = cva([], {
  variants: {
    padding: {
      none: "p-0",
      sm: "p-2",
      md: "p-4",
      lg: "p-8",
      xl: "p-12",
    },
  },
  defaultVariants: {
    padding: "md",
  },
  compoundVariants: [],
});

interface ContainerProps extends VariantProps<typeof containerVariants> {
  as?: "div" | "section" | "main" | "article";
  onClick?: () => void;
}
const Container: React.FC<React.PropsWithChildren<ContainerProps>> = ({
  children,
  as,
  onClick,
  padding,
}) => {
  const classes = containerVariants({ padding });
  const El = as ?? "div";
  return (
    <El onClick={onClick} className={cx(classes, "container")}>
      {children}
    </El>
  );
};

export default Container;
