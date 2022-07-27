/*
 * Copyright (c) 2018-2022 Red Hat, Inc.
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */

import SessionStorageService, { SessionStorageKey } from '../../session-storage';

describe('WorkspaceShutdownDetector', () => {
  it('update storageType', () => {
    SessionStorageService.update(SessionStorageKey.ORIGINAL_LOCATION_PATH, '/workspaced5858247cc74458d/theia-ide/3100/');
    const value = SessionStorageService.remove(SessionStorageKey.ORIGINAL_LOCATION_PATH);
    
  })
});
