import React from "react";
import { observer } from "mobx-react-lite";
import { Button } from "@blueprintjs/core";
import { SectionTab } from 'polotno/side-panel';
import { GiResize } from 'react-icons/gi';
const AVAILABLE_SIZES = [
  { Title:"Dạng đứng - A4 96 PPI 794 x 1123",width: 794, height: 1123 },
  { Title:"Dạng đứng - A4 150 PPI 1240 x 1754",width: 1240 , height: 1754 },
  { Title:"Dạng đứng - A4 300 PPI 2480 x 3508",width: 2480 , height: 3508 },
  { Title:"Dạng đứng - A3 96 PPI 842 x 1191",width: 842 , height: 1191 },
  { Title:"Dạng đứng - A3 150 PPI 1123 x 1587",width: 1123 , height: 1587 },
  { Title:"Dạng đứng - A3 300 PPI 3508 x 4960",width: 2480 , height: 3508 },
];

export const ResizePanel = observer(({ store }) => {
  return (
    <div>
      {AVAILABLE_SIZES.map(({ width, height,Title }, i) => (
        <Button
          key={i}
          style={{ width: "100%", marginBottom: "20px",textAlign:"left" }}
          onClick={() => {
            store.setSize(width, height);
          }}
        >
         {Title}
        </Button>
      ))}
    </div>
  );
});


export const ResizeSection = {
  name: 'ThayDoiKichThuocTrang',
  Tab: (props) => 
  {
    return(
    <SectionTab name="Sizes" {...props}>
     <GiResize  />
    </SectionTab>
  )}
  ,
  Panel: ResizePanel,
};

