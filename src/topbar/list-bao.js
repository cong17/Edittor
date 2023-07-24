import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Dialog, Classes, 
  } from '@blueprintjs/core';
import ApiDataColumn from './ApiDataColumn'; // Import the ApiDataColumn component

export const ViewListBao = observer(({ store, project }) => {
  const [ListTinTucOpened, toggleListTinTuc] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [data, setData] = useState([]); 
  const [dataChiTiet, setDataChiTiet] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedText, setSelectedText] = useState("");

  const handleButtonClick = () => {
    if (selectedText) {
      console.log("Vùng bôi đen:", selectedText);
      const element = store.activePage.addElement({
        type: 'text',
        x: 50,
        y: 50,
        fill: 'black',
        text: selectedText,
      });

      alert("Thành công! Kiểm tra layout");

    } else {
      alert("Bôi đen một đoạn văn và thử lại");
    }
  };
  const handleTextSelection = () => {
    const selectedText = window.getSelection().toString();
    setSelectedText(selectedText);
  };

  useEffect(() => {
    const fetchListTin = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}?do=GetListTinTinThuocSoBao&ItemID=${localStorage.getItem('_ItemIDSoBao') || 0}`);
        const jsonData = await response.json();

        setData(jsonData);
        setIsLoading(false); 
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false); 
      }
    };
    fetchListTin();

  }, []);
  useEffect(() => {

    const fetchChiTietTin = async () => {
      try {
        
        const response = await fetch(`${process.env.REACT_APP_API_URL}?do=GetTinTinThuocSoBao&ItemID=${selectedItemId}`);
        const jsonData = await response.json();
        setDataChiTiet(jsonData);
        setIsLoading(false); 
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };
    if (selectedItemId){
      fetchChiTietTin();
    }
  }, [selectedItemId]);

  const handleListItemClick = (itemId) => {
    
    setSelectedItemId(itemId);
  };

  if (isLoading) {
    return <div>Đang tải dữ liệu..</div>;
  } else {
    return (
      <>
        <Button
          icon="new-text-box"
          minimal
          text="Dữ liệu báo"
          onClick={() => {
            toggleListTinTuc(true);
          }}
        />

        <Dialog
          icon="info-sign"
          onClose={() => toggleListTinTuc(false)}
          title="Các bài báo thuộc số báo đã cấu hình"
          isOpen={ListTinTucOpened}
          style={{
            width: '80%',
            maxWidth: '1024px',
            display: 'flex',
          }}
        >
          
          <div style={{ display: 'flex' }}>
          <div style={{ flex: 1, padding: '16px', maxWidth: '300px', }}>
            {data?.map((item) => (
              <div
                key={item.ID}
                onClick={() => handleListItemClick(item.ID)}
                style={{
                  borderBottom: '1px solid #ddd', // Add some styling for separating items
                  padding: '8px',
                  cursor: 'pointer',
                }}
              >
                {item.Title}
              </div>
            ))}
          </div>
         
          <div onMouseUp={handleTextSelection} style={{ flex: 1, padding: '16px' }}>
          {isLoading ? (
            <p>Đang tải dữ liệu...</p>
          ) : (
            selectedItemId ? (
              <ApiDataColumn  data={dataChiTiet} isLoading={isLoading} />
            ) : (
              <p>Vui lòng chọn một bản ghi bên trái.</p>
            )
          )}

          </div>
        </div>
          <div className={Classes.DIALOG_FOOTER}>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
              <Button onClick={handleButtonClick}>Chèn nội dung</Button>
              <Button onClick={() => toggleListTinTuc(false)}>Close</Button>
            </div>
          </div>
        </Dialog>
      </>
    );
  }
});
