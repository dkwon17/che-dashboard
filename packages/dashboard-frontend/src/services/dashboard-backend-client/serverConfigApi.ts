/*
 * Copyright (c) 2018-2021 Red Hat, Inc.
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */

import axios from 'axios';
import common from '@eclipse-che/common';
import { prefix } from './const';
import { api } from '@eclipse-che/common';
import { V220DevfileComponents } from '@devfile/api';

/**
 * Returns an array of default plug-ins per editor
 *
 * @returns Promise resolving with the object with includes
 * default plug-ins for the specified editor,
 * default editor and default components
 */
export async function getServerConfig(): Promise<{
  defaults: {
    plugins: api.IWorkspacesDefaultPlugins[];
    components: V220DevfileComponents[];
    editor: string | undefined;
  };
  timeouts: {
    idleTimeout: number;
    runTimeout: number;
  };
}> {
  const url = `${prefix}/server-config`;
  try {
    const response = await axios.get(url);
    return response.data ? response.data : [];
  } catch (e) {
    throw `Failed to fetch default plugins. ${common.helpers.errors.getMessage(e)}`;
  }
}
