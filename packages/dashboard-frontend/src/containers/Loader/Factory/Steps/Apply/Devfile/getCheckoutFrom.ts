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

import { V220DevfileProjectsItemsGitCheckoutFrom } from '@devfile/api';
import common from '@eclipse-che/common';

export interface GitRemote {
  name: string;
  url: string;
}

/**
 *
 */
export function getCheckoutFrom(checkoutFrom: string): V220DevfileProjectsItemsGitCheckoutFrom {
  const checkoutFromObj = parseToObject(checkoutFrom);
  const obj = {};
  if (checkoutFromObj.hasOwnProperty('revision')) {
    obj['revision'] = checkoutFromObj['revision'];
  }

  if (checkoutFromObj.hasOwnProperty('remote')) {
    obj['remote'] = checkoutFromObj['remote'];
  }
  return obj as V220DevfileProjectsItemsGitCheckoutFrom;
}

function parseToObject(checkoutFrom: string): string[] {
  try {
    return JSON.parse(checkoutFrom);
  } catch (e) {
    throw `Unable to parse checkoutFrom attribute. ${common.helpers.errors.getMessage(e)}`;
  }
}
