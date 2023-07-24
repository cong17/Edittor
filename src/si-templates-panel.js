import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { SectionTab } from 'polotno/side-panel';
import {HiTemplate} from 'react-icons/hi'
import { ImagesGrid } from 'polotno/side-panel/images-grid';

const API = process.env.REACT_APP_API_URL+"?do=LoadTemplate";

export const TemplatesPanel = observer(({ store }) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API);
        const jsonData = await response.json();
        
        setData(jsonData);
        setIsLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false); // Set loading to false in case of an error
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div style={{ height: '100%' }}>
      <ImagesGrid
        shadowEnabled={false}
        images={data?.map((data) => data).flat()}
        getPreview={(item) => `${item.linkPreview}`}
        // isLoading={isLoading}
        onSelect={async (item) => {
          const req = await fetch(`${item.likJson}`);
          const json = await req.json();
          store.loadJSON(json);
        }}
        rowsNumber={1}
      />
    </div>
  );
});

export const TemplatesSection = {
  name: 'mauCoSan',
  Tab: (props) => (
    <SectionTab name="Mẫu có sẵn" {...props}>
      <HiTemplate></HiTemplate>
    </SectionTab>
  ),
  Panel: TemplatesPanel,
};
