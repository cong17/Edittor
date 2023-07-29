import React from 'react';
import { observer } from 'mobx-react-lite';
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from 'polotno';
import { Toolbar } from 'polotno/toolbar/toolbar';
import { ZoomButtons } from 'polotno/toolbar/zoom-buttons';
import { SidePanel, TextSection, UploadSection, DEFAULT_SECTIONS } from 'polotno/side-panel';
import { Workspace } from 'polotno/canvas/workspace';
import { useAuth0 } from '@auth0/auth0-react';

import { loadFile } from './file';
import { QrSection } from './sections/qr-section';
import { VectorSection } from './sections/svg-sidepanel';


import { useProject } from './project';
import { ImageRemoveBackground } from './background-remover';

import Topbar from './topbar/topbar';
import { PuterModal } from './puter-modal';
import { TemplatesSection,editTemplate } from './si-templates-panel';
import { ResizeSection } from './si-resize-panel';
import { ImagesAndUploadSection } from './si-upload-panel';


DEFAULT_SECTIONS.splice(0, 3);
DEFAULT_SECTIONS.splice(1, 1);
DEFAULT_SECTIONS.splice(3, 1);
DEFAULT_SECTIONS.unshift(ImagesAndUploadSection)
 DEFAULT_SECTIONS.unshift(TemplatesSection)
 DEFAULT_SECTIONS.push(QrSection)
 DEFAULT_SECTIONS.push(ResizeSection)
 

const useHeight = () => {
  const [height, setHeight] = React.useState(window.innerHeight);
  React.useEffect(() => {
    window.addEventListener('resize', () => {
      setHeight(window.innerHeight);
    });
  }, []);
  return height;
};

const App = observer(({ store }) => {
  const project = useProject();
  const height = useHeight();

  const ItemID = localStorage.getItem('_ItemIDSoBao') || 0;
  if (!parseInt(ItemID) || parseInt(ItemID) <= 0) {
    alert("Chức năng không khả dụng. Vui lòng liên hệ quản trị viên để được giúp đỡ");
    return;
  }
  editTemplate(store)
  return (
      <div
        style={{
          width: '100vw',
          height: height + 'px',
          display: 'flex',
          flexDirection: 'column',
        }}
        // onDrop={handleDrop}
      >
        <Topbar store={store} />
        <div style={{ height: 'calc(100% - 50px)' }}>
          <PolotnoContainer className="polotno-app-container">
            <SidePanelWrap>
              <SidePanel store={store} sections={DEFAULT_SECTIONS} defaultSection='mauCoSan' />
            </SidePanelWrap>
            <WorkspaceWrap>
              <Toolbar
                store={store}
                components={{
                  // ImageRemoveBackground,
                }}
              />
              <Workspace store={store} />
              <ZoomButtons store={store} />
            </WorkspaceWrap>
          </PolotnoContainer>
        </div>
        <PuterModal
          isOpen={project.puterModalVisible}
          onClose={() => {
            project.puterModalVisible = false;
          }}
        />
      </div>


  );
});

export default App;
