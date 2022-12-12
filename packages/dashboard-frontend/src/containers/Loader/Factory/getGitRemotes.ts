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

import common from '@eclipse-che/common';

export interface GitRemote {
  name: string;
  url: string;
}

export function getGitRemotes(remotes: string): GitRemote[] {
  if (!remotes || remotes.length === 0) {
    return [];
  }
  const remotesArray = parseRemotes(remotes);
  if (Array.isArray(remotesArray[0])) {
    return parseNameAndUrls(remotesArray, remotes);
  }
  return parseUrls(remotesArray, remotes);
}

function parseRemotes(remotes: string): string[] {
  try {
    return JSON.parse(convertToArrayString(remotes));
  } catch (e) {
    throw `Unable to parse remotes. ${common.helpers.errors.getMessage(e)}`;
  }
}

/**
 * Replaces braces ({}) with square brackets ([]) and adds
 * quotation marks (") around string s
 * @param str
 * @returns string representing an array
 */
function convertToArrayString(str: string): string {
  return (
    str
      .replaceAll(' ', '')
      .replaceAll('{', '[')
      .replaceAll('}', ']')
      /* eslint-disable no-useless-escape */
      .replaceAll(/(\[([^\[]))/g, '["$2')
      .replaceAll(/(([^\]])\])/g, '$2"]')
      .replaceAll(/(([^\]]),([^\[]))/g, '$2","$3')
  );
  /* eslint-enable no-useless-escape */
}

function parseNameAndUrls(remotesArray, remotesString): GitRemote[] {
  const remotes: GitRemote[] = [];
  remotesArray.forEach(value => {
    if (!Array.isArray(value) || value.length !== 2) {
      throw `Malformed remotes provided: ${remotesString}`;
    }
    remotes.push({ name: value[0], url: value[1] });
  });
  return remotes;
}

function parseUrls(remotesArray, remotesString): GitRemote[] {
  const remotes: GitRemote[] = [];

  remotesArray.forEach((value, i) => {
    if (typeof value !== 'string') {
      throw `Malformed remotes provided: ${remotesString}`;
    }

    let name;
    if (i === 0) {
      name = 'origin';
    } else if (i === 1) {
      name = 'upstream';
    } else {
      name = `fork${i - 1}`;
    }
    remotes.push({ name, url: value });
  });
  return remotes;
}
