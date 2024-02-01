import WorldMap, { DataItem } from "react-svg-worldmap";

export default function App({ data }: { data: DataItem[] }) {
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
