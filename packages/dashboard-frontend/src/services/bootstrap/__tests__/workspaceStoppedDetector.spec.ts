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

describe('WorkspaceShutdownDetector', () => {
  describe('update storageType', () => {
    // new FakeStoreBuilder().build()
    it('should correctly update a devfile with "persistent" storage', () => {
        const devfileV1 = getDevfileWithPersistentStorage();
        const devfileAdapter = new DevfileAdapter(devfileV1);

        devfileAdapter.storageType = 'persistent';

        expect(devfileAdapter.devfile.attributes).toBeUndefined();
    });
  }
});
