import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Button,
  Dialog,
  Classes,
  Position,
  Menu,
  MenuItem,
  MenuDivider,
} from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import FaFileExport from '@meronex/icons/fa/FaFileExport';
import FaFileImport from '@meronex/icons/fa/FaFileImport';
import { downloadFile } from 'polotno/utils/download';

export const FileMenu = observer(({ store, project }) => {
  const inputRef = React.useRef();

  const [faqOpened, toggleFaq] = React.useState(false);
  return (
    <>
      <Popover2
        content={
          <Menu>
            {/* <MenuDivider title={t('toolbar.layering')} /> */}
            <MenuItem
              icon="plus"
              text="Tạo bản thiết kế mới"
              onClick={() => {
                const ids = store.pages
                  .map((page) => page.children.map((child) => child.id))
                  .flat();
                const hasObjects = ids?.length;
                if (hasObjects) {
                  if (!window.confirm('Thao tác sẽ không thể phục hồi?')) {
                    return;
                  }
                }
                const pagesIds = store.pages.map((p) => p.id);
                store.deletePages(pagesIds);
                store.addPage();
                project.id = '';
                project.save();
              }}
            />
            {/* {project.id !== 'local' && (
              <MenuItem
                icon="duplicate"
                text="Make a copy"
                onClick={() => {
                  project.duplicate();
                }}
              />
            )} */}
            <MenuDivider />
            <MenuItem
              // icon={<FaFileImport />}
              icon="folder-open"
              text="Mở từ một file có sẵn"
              onClick={() => {
                document.querySelector('#load-project').click();
              }}
            />
            <MenuItem
              // icon={<FaFileExport />}
              icon="floppy-disk"
              text="Lưu về máy cá nhân"
              onClick={() => {
                const json = store.toJSON();

                const url =
                  'data:text/json;base64,' +
                  window.btoa(
                    unescape(encodeURIComponent(JSON.stringify(json)))
                  );

                downloadFile(url, 'polotno.json');
              }}
            />

            <MenuDivider />
            <MenuItem
              text="Thông tin"
              icon="info-sign"
              onClick={() => {
                toggleFaq(true);
              }}
            />
          </Menu>
        }
        position={Position.BOTTOM_RIGHT}
      >
      <Button icon="projects" minimal text="Dự án" />
      </Popover2>
      <input
        type="file"
        id="load-project"
        accept=".json,.polotno"
        ref={inputRef}
        style={{ width: '180px', display: 'none' }}
        onChange={(e) => {
          var input = e.target;

          if (!input.files.length) {
            return;
          }

          var reader = new FileReader();
          reader.onloadend = function () {
            var text = reader.result;
            let json;
            try {
              json = JSON.parse(text);
            } catch (e) {
              alert('Không thể tải dự án.');
            }

            if (json) {
              store.loadJSON(json);
              input.value = '';
            }
          };
          reader.onerror = function () {
            alert('Không thể tải dự án');
          };
          reader.readAsText(input.files[0]);
        }}
      />
      <Dialog
        icon="info-sign"
        onClose={() => toggleFaq(false)}
        title="Thông tin sản phẩm"
        isOpen={faqOpened}
        style={{
          width: '80%',
          maxWidth: '700px',
        }}
      >
        <div className={Classes.DIALOG_BODY}>
          <h1>Sản phẩm của Simax</h1>
          <p>Thực hiện bởi <a href='https://www.facebook.com/congkxtb95/'>Công VM</a></p>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={() => toggleFaq(false)}>Close</Button>
          </div>
        </div>
      </Dialog>
    </>
  );
});
