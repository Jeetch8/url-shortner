import * as React from "react";
import WorldMap from "react-svg-worldmap";

export default function App({ data }) {
  return (
    <div className="mx-auto w-fit">
      <WorldMap
        borderColor="blue"
        color="rgb(29 78 216)"
        tooltipBgColor="black"
        valueSuffix="clicks"
        size="responsive"
        strokeOpacity={0.7}
        data={data}
        backgroundColor="transparent"
        richInteraction={true}
      />
    </div>
  );
}
