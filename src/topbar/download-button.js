import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Position, Menu, HTMLSelect, Slider } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import * as unit from 'polotno/utils/unit';
import { t } from 'polotno/utils/l10n';

export const DownloadButton = observer(({ store }) => {
  const [saving, setSaving] = React.useState(false);
  const [quality, setQuality] = React.useState(1);
  const [fps, setFPS] = React.useState(10);
  const [type, setType] = React.useState('png');

  const getName = () => {
    const texts = [];
    store.pages.forEach((p) => {
      p.children.forEach((c) => {
        if (c.type === 'text') {
          texts.push(c.text);
        }
      });
    });
    const allWords = texts.join(' ').split(' ');
    const words = allWords.slice(0, 6);
    return words.join(' ').replace(/\s/g, '-').toLowerCase() || 'polotno';
  };
  return (
    <Popover2
      content={
        <Menu>
          <li class="bp4-menu-header">
            <h6 class="bp4-heading">Loại hình</h6>
          </li>
          <HTMLSelect
            fill
            onChange={(e) => {
              setType(e.target.value);
              setQuality(1);
            }}
            value={type}
          >
            <option value="jpeg">JPEG</option>
            <option value="png">PNG</option>
            <option value="pdf">PDF</option>
            <option value="toPDFDataURL">toPDFDataURL</option>
            <option value="html">HTML</option>
            <option value="gif">GIF</option>
            <option value="gif">GIF</option>
          </HTMLSelect>

          {type !== 'html' && (
            <>
              <li class="bp4-menu-header">
                <h6 class="bp4-heading">Size</h6>
              </li>
              <div style={{ padding: '10px' }}>
                <Slider
                  value={quality}
                  labelRenderer={false}
                  // labelStepSize={0.4}
                  onChange={(quality) => {
                    setQuality(quality);
                  }}
                  stepSize={0.2}
                  min={0.2}
                  max={3}
                  showTrackFill={false}
                />
                {type === 'pdf' && (
                  <div>
                    {unit.pxToUnitRounded({
                      px: store.width,
                      dpi: store.dpi / quality,
                      precious: 0,
                      unit: 'mm',
                    })}{' '}
                    x{' '}
                    {unit.pxToUnitRounded({
                      px: store.height,
                      dpi: store.dpi / quality,
                      precious: 0,
                      unit: 'mm',
                    })}{' '}
                    mm
                  </div>
                )}
                {type !== 'pdf' && (
                  <div>
                    {Math.round(store.width * quality)} x{' '}
                    {Math.round(store.height * quality)} px
                  </div>
                )}
                {type === 'gif' && (
                  <>
                    <li class="bp4-menu-header">
                      <h6 class="bp4-heading">FPS</h6>
                    </li>
                    <div style={{ padding: '10px' }}>
                      <Slider
                        value={fps}
                        // labelRenderer={false}
                        labelStepSize={5}
                        onChange={(fps) => {
                          setFPS(fps);
                        }}
                        stepSize={1}
                        min={5}
                        max={30}
                        showTrackFill={false}
                      />
                    </div>
                  </>
                )}
              </div>
            </>
          )}
          {type === 'html' && (
            <>
              <div style={{ padding: '10px', maxWidth: '180px', opacity: 0.8 }}>
                Chức năng xuất bản html đang được thử nghiệm.
              </div>
            </>
          )}
          <Button
            fill
            intent="primary"
            loading={saving}
            onClick={async () => {

              if (type === 'pdf') {
                setSaving(true);
                console.log(store.dpi / quality)
                console.log(2 * quality)
                await store.saveAsPDF({
                  fileName: getName() + '.pdf',
                  dpi: store.dpi / quality,
                  pixelRatio: 2 * quality,
                });
                setSaving(false);
              } 
             else if (type === 'toPDFDataURL') {
                setSaving(true);
                let a=await store.toPDFDataURL({
                  fileName: getName() + '.pdf',
                  dpi: store.dpi / quality,
                  pixelRatio: 2 * quality,
                });
                console.log(a)
                setSaving(false);
              }else if (type === 'html') {
                setSaving(true);
                await store.saveAsHTML({
                  fileName: getName() + '.html',
                });
                setSaving(false);
              } else if (type === 'gif') {
                setSaving(true);
                await store.saveAsGIF({
                  fileName: getName() + '.gif',
                  pixelRatio: quality,
                  fps,
                });
                setSaving(false);
              } else {
                store.pages.forEach((page, index) => {
                  // do not add index if we have just one page
                  const indexString =
                    store.pages.length > 1 ? '-' + (index + 1) : '';
                  store.saveAsImage({
                    pageId: page.id,
                    pixelRatio: quality,
                    mimeType: 'image/' + type,
                    fileName: getName() + indexString + '.' + type,
                  });
                });
              }
            }}
          >
            Tải xuống {type.toUpperCase()}
          </Button>

          {/* <MenuItem
            icon="media"
            text={t('toolbar.saveAsImage')}
            onClick={async () => {
              store.pages.forEach((page, index) => {
                // do not add index if we have just one page
                const indexString =
                  store.pages.length > 1 ? '-' + (index + 1) : '';
                store.saveAsImage({
                  pageId: page.id,
                  fileName: getName() + indexString + '.png',
                });
              });
            }}
          />
          <MenuItem
            icon="document"
            text={t('toolbar.saveAsPDF')}
            onClick={async () => {
              setSaving(true);
              await store.saveAsPDF({
                fileName: getName() + '.pdf',
              });
              setSaving(false);
            }}
          /> */}
        </Menu>
      }
      position={Position.BOTTOM_RIGHT}
    >
      <Button
        icon="import"
        text="Tiện ích"
        loading={saving}
        onClick={() => {
          setQuality(1);
        }}
      />
    </Popover2>
  );
});
