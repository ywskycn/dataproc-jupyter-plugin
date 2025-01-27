/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useEffect } from 'react';
import { LabIcon } from '@jupyterlab/ui-components';
import plusIcon from '../../style/icons/plus_icon.svg';
import plusIconDisable from '../../style/icons/plus_icon_disable.svg';
import deleteIcon from '../../style/icons/delete_icon.svg';
import errorIcon from '../../style/icons/error_icon.svg';
import { Input } from 'semantic-ui-react';
import { DEFAULT_LABEL_DETAIL } from '../utils/const';

const iconPlus = new LabIcon({
  name: 'launcher:plus-icon',
  svgstr: plusIcon
});
const iconPlusDisable = new LabIcon({
  name: 'launcher:plus-disable-icon',
  svgstr: plusIconDisable
});
const iconDelete = new LabIcon({
  name: 'launcher:delete-icon',
  svgstr: deleteIcon
});
const iconError = new LabIcon({
  name: 'launcher:error-icon',
  svgstr: errorIcon
});

function LabelProperties({
  labelDetail,
  setLabelDetail,
  labelDetailUpdated,
  setLabelDetailUpdated,
  selectedJobClone,
  buttonText,
  keyValidation,
  setKeyValidation,
  valueValidation,
  setValueValidation,
  duplicateKeyError,
  setDuplicateKeyError,
  labelEditMode
}: any) {
  /* 
  labelDetail used to store the permanent label details when onblur 
  labelDetailUpdated used to store the temporay label details when onchange 
  */
  useEffect(() => {
    if (!labelEditMode) {
      if (buttonText === 'ADD LABEL' && !selectedJobClone) {
        setLabelDetail([DEFAULT_LABEL_DETAIL]);
        setLabelDetailUpdated([DEFAULT_LABEL_DETAIL]);
      } else {
        setLabelDetail([]);
      }
    }
  }, []);

  const handleAddLabel = () => {
    const labelAdd = [...labelDetail];
    labelAdd.push(':');
    setLabelDetailUpdated(labelAdd);
    setLabelDetail(labelAdd);
  };

  const handleDeleteLabel = (index: number, value: string) => {
    const labelDelete = [...labelDetail];
    labelDelete.splice(index, 1);
    setLabelDetailUpdated(labelDelete);
    setLabelDetail(labelDelete);
    setDuplicateKeyError(-1);
    setKeyValidation(-1);
    setValueValidation(-1);
  };

  const handleEditLabelSwitch = () => {
    if (duplicateKeyError === -1) {
      setLabelDetail(labelDetailUpdated);
    }
  };
  const handleEditLabel = (
    value: string,
    index: number,
    keyValue: string
  ) => {
    const labelEdit = [...labelDetail];

    labelEdit.forEach((data, dataNumber: any) => {
      if (index === dataNumber) {
        /*
          allowed aplhanumeric and spaces and underscores
        */
        const regexp = /^[a-z0-9-_]+$/;
        if (keyValue === 'key') {
          if (
            value.search(regexp) === -1 ||
            value.charAt(0) !== value.charAt(0).toLowerCase()
          ) {
            setKeyValidation(index);
          } else {
            setKeyValidation(-1);
          }

          // Check for duplicate key when editing
          const newKey = value;
          const duplicateIndex = labelEdit.findIndex(
            (label, i) => i !== index && label.split(':')[0] === newKey
          );
          if (duplicateIndex !== -1) {
            setDuplicateKeyError(index);
          } else {
            setDuplicateKeyError(-1);
          }

          data = data.replace(data.split(':')[0], value);
        } else {
          if (value.search(regexp) === -1) {
            setValueValidation(index);
          } else {
            setValueValidation(-1);
          }
          /*
          value is split from labels 
          Example:"client:dataproc_jupyter_plugin"
          */
          if (data.split(':')[1] === '') {
            data = data + value;
          } else {
            data = data.replace(data.split(':')[1], value);
          }
        }
      }
      labelEdit[dataNumber] = data;
    });

    setLabelDetailUpdated(labelEdit);
  };

  const styleAddLabelButton = (buttonText: string, labelDetail: any) => {
    if (
      buttonText === 'ADD LABEL' &&
      (labelDetail.length === 0 ||
        labelDetail[labelDetail.length - 1].split(':')[0].length > 0) &&
      duplicateKeyError === -1
    ) {
      return 'job-add-label-button';
    } else if (
      buttonText === 'ADD LABEL' &&
      (labelDetail.length === 0 ||
        labelDetail[labelDetail.length - 1].split(':')[0].length === 0) &&
      duplicateKeyError !== -1
    ) {
      return 'job-add-label-button-disabled';
    } else if (
      buttonText !== 'ADD LABEL' &&
      (labelDetail.length === 0 ||
        labelDetail[labelDetail.length - 1].split(':')[0].length > 0)
    ) {
      return 'job-add-property-button';
    } else {
      return 'job-add-property-button-disabled';
    }
  };

  return (
    <div>
      <div className="job-label-edit-parent">
        {labelDetail.length > 0 &&
          labelDetail.map((label: any, index: number) => {
            /*
                     Extracting key, value from label
                      Example: "{client:dataProc_plugin}"
                  */
            const labelSplit = label.split(':');

            return (
              <div key={label}>
                <div className="job-label-edit-row">
                  <div className="key-message-wrapper">
                    <Input
                      placeholder={`Key ${index + 1}*`}
                      className="edit-input-style"
                      disabled={
                        labelSplit[0] === '' ||
                        buttonText !== 'ADD LABEL' ||
                        duplicateKeyError !== -1
                          ? false
                          : true
                      }
                      onBlur={() => handleEditLabelSwitch()}
                      onChange={e =>
                        handleEditLabel(
                          e.target.value,
                          index,
                          'key'
                        )
                      }
                      defaultValue={labelSplit[0]}
                    />

                    {labelDetailUpdated[index].split(':')[0] === '' ? (
                      <div role="alert" className="error-key-parent">
                        <iconError.react tag="div" />
                        <div className="error-key-missing">key is required</div>
                      </div>
                    ) : (
                      keyValidation === index &&
                      buttonText === 'ADD LABEL' && (
                        <div className="error-key-parent">
                          <iconError.react tag="div" />
                          <div className="error-key-missing">
                            Only hyphens (-), underscores (_), lowercase
                            characters, and numbers are allowed. Keys must start
                            with a lowercase character. International characters
                            are allowed.
                          </div>
                        </div>
                      )
                    )}
                    {duplicateKeyError === index &&
                      buttonText === 'ADD LABEL' && (
                        <div className="error-key-parent">
                          <iconError.react tag="div" />
                          <div className="error-key-missing">
                            The key is already present
                          </div>
                        </div>
                      )}
                  </div>
                  <div className="key-message-wrapper">
                    <Input
                      placeholder={`Value ${index + 1}`}
                      className="edit-input-style"
                      onBlur={() => handleEditLabelSwitch()}
                      onChange={e =>
                        handleEditLabel(
                          e.target.value,
                          index,
                          'value'
                        )
                      }
                      disabled={
                        label=== DEFAULT_LABEL_DETAIL && buttonText === 'ADD LABEL'
                      }
                      defaultValue={labelSplit[1]}
                    />
                    {valueValidation === index &&
                      buttonText === 'ADD LABEL' && (
                        <div className="error-key-parent">
                          <iconError.react tag="div" />
                          <div className="error-key-missing">
                            Only hyphens (-), underscores (_), lowercase
                            characters, and numbers are allowed. International
                            characters are allowed.
                          </div>
                        </div>
                      )}
                  </div>
                  
                  {label=== DEFAULT_LABEL_DETAIL && buttonText === 'ADD LABEL' ?"":
                      
                  <div
                    role="button"
                    className="labels-delete-icon"
                    onClick={() => handleDeleteLabel(index, labelSplit[0])}
                  >
                    <iconDelete.react tag="div" />
                  </div>}
                  <></>
                </div>
              </div>
            );
          })}
        <div
          role="button"
          className={styleAddLabelButton(buttonText, labelDetail)}
          onClick={() => {
            (labelDetail.length === 0 ||
              labelDetail[labelDetail.length - 1].split(':')[0].length > 0) &&
              handleAddLabel();
          }}
        >
          {labelDetail.length === 0 ||
          labelDetail[labelDetail.length - 1].split(':')[0].length > 0 ? (
            <iconPlus.react tag="div" />
          ) : (
            <iconPlusDisable.react tag="div" />
          )}
          <div
            className={
              labelDetail.length === 0 ||
              labelDetail[labelDetail.length - 1].split(':')[0].length > 0
                ? 'job-edit-text'
                : 'job-edit-text-disabled'
            }
          >
            {buttonText}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LabelProperties;
