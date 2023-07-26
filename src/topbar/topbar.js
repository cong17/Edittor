import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Button,
  Navbar,
  Alignment,
  NavbarDivider
} from '@blueprintjs/core';

import styled from 'polotno/utils/styled';

import { useProject } from '../project';

import { FileMenu } from './file-menu';
import { DownloadButton } from './download-button';

import { ViewListBao } from './list-bao.js';
const NavbarContainer = styled('div')`
  @media screen and (max-width: 500px) {
    overflow-x: auto;
    overflow-y: hidden;
    max-width: 100vw;
  }
`;

const NavInner = styled('div')`
  @media screen and (max-width: 500px) {
    display: flex;
  }
`;

export default observer(({ store }) => {
  const [saving, setSaving] = React.useState(false);
  const project = useProject();
  return (
    <NavbarContainer className="bp4-navbar">
      <NavInner>
        <Navbar.Group align={Alignment.LEFT}>
          <FileMenu store={store} project={project} />
          <NavbarDivider />
          <ViewListBao store={store}/>
          <Button
            icon="new-text-box" minimal text="Dữ liệu báo"
            loading={saving}
            onClick={async() => {

            }}
          />
          <NavbarDivider />
          <Button
            text="Chế độ thu gọn"
            icon="maximize" 
            onClick={() => {
              // project.puterModalVisible = true;
              store.openSidePanel('my-designs');
            }}
          />
          
        </Navbar.Group>
        <Navbar.Group align={Alignment.RIGHT}>
        <Button
            icon="floppy-disk"
            text="Lưu"
            
            loading={saving}
            onClick={async() => {
              setSaving(true);
              const json = store.toJSON();
              
              fetch(`${process.env.REACT_APP_API_URL}?do=SaveJsonDesign&ItemID=${localStorage.getItem('_ItemIDSoBao')}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(json),
              })
                .then((response) => {
                  if (!response.ok) {
                    alert("Có lỗi trong quá trình lưu lên máy chủ")
                  }
                  alert("Lưu thành công")
                  setSaving(false);
                })
                .catch((error) => {
                  setSaving(false);
                });
             
             

            }}
          />
        <NavbarDivider />
          <Button
            icon="export"
            text="Lưu và kết xuất"
            // intent="primary"
            loading={saving}
            onClick={async() => {
              setSaving(true);

              let base64=await store.toPDFDataURL({
                fileName: 'gennerated.pdf',
                dpi: 72,
                pixelRatio: 2 ,
              });

              const jsonData = {
                ItemID: localStorage.getItem("_ItemIDSoBao"),
                file: base64,
                template: JSON.stringify(store.toJSON())
              };
              fetch(`${process.env.REACT_APP_API_URL}?do=SavePDFDesign`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonData),
              })
                .then((response) => {
                  if (!response.ok) {
                    alert("Có lỗi trong quá trình lưu lên máy chủ")
                  }
                  alert("Lưu thành công")
                  setSaving(false);
                })
                .catch((error) => {
                  setSaving(false);
                });

            }}
          />
         
          <NavbarDivider />
          <DownloadButton store={store} />

        </Navbar.Group>
      </NavInner>
    </NavbarContainer>
  );
});
