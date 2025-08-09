import Grid from "@mui/material/Grid";

const GridItem = Grid as React.ComponentType<{
  item?: boolean;
  xs?: number;
  md?: number;
  children?: React.ReactNode;
}>;

export default GridItem;