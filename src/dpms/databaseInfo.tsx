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

import { ReactWidget } from '@jupyterlab/apputils';
import React from 'react';

interface IDatabaseProps {
  title: string;
  dataprocMetastoreServices: string;
  databaseDetails: Record<string, string>;
}

const DatabaseInfo = ({
  title,
  dataprocMetastoreServices,
  databaseDetails
}: IDatabaseProps): React.ReactElement => {
  const database = {
    dname: title,
    description: databaseDetails[title],
    instanceName: dataprocMetastoreServices
  };
  const renderTable = () => {
    return (
      <div className="table-container">
        <table className="db-table">
          <tbody>
            {Object.entries(database).map(([key, value], index) => (
              <tr
                key={key}
                className={index % 2 === 0 ? 'tr-row-even' : 'tr-row-odd'}
              >
                <td className="bold-column">{key}</td>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <div className="title-overlay">{title}</div>
      <div className="db-title">Database info</div>
      {renderTable()}
    </div>
  );
};

export class Database extends ReactWidget {
  dataprocMetastoreServices: string;
  databaseDetails: Record<string, string>;
  constructor(
    title: string,
    dataprocMetastoreServices: string,
    databaseDetails: Record<string, string>
  ) {
    super();
    this.title.label = title;
    this.dataprocMetastoreServices = dataprocMetastoreServices;
    this.databaseDetails = databaseDetails;
  }

  render(): React.ReactElement {
    return (
      <DatabaseInfo
        title={this.title.label}
        dataprocMetastoreServices={this.dataprocMetastoreServices}
        databaseDetails={this.databaseDetails}
      />
    );
  }
}
