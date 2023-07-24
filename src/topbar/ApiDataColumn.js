import React from 'react';
const ApiDataColumn = ({ data,isLoading }) => {
  console.log(data)
  if (isLoading) {
    return <div>Đang tải dữ liệu..</div>;
  } else 
  return (
    <div style={{maxHeight: '500px',overflow:'auto',paddingRight:'10px'}}>
      <h3 style={{ flex: 1, paddingBottom: '10px' }}>{data?.Title}</h3>
      <div style={{ flex: 1,paddingBottom: '10px' }}>{data?.DescriptionNews}</div>
      <div dangerouslySetInnerHTML={{__html: data?.ContentNews}} />
    </div>
  );
};

export default ApiDataColumn;
