import * as React from "react";
import WorldMap from "react-svg-worldmap";

export default function App({ data }) {
  return (
    <WorldMap
      borderColor="blue"
      color="rgb(29 78 216)"
      tooltipBgColor="black"
      valueSuffix="clicks"
      size="xl"
      strokeOpacity={0.7}
      data={data}
      backgroundColor="transparent"
      richInteraction={true}
    />
  );
}
