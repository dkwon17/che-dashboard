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
import { AppState } from 'dashboard-frontend/src/store';
import { selectAllWorkspaces } from 'dashboard-frontend/src/store/Workspaces/selectors';
import { injectable } from 'inversify';
import devfileApi from '../devfileApi';
import { DevWorkspaceStatus } from '../helpers/types';
import SessionStorageService, { SessionStorageKey } from '../session-storage';
import { Workspace } from '../workspace-adapter';

export class WorkspaceRunningError extends Error {
  constructor(message) {
    super(message);
    this.name = 'WorkspaceRunningError';
  }
}

/**
 * The dashboard can be reached when redirected from a workspace url when the workspace itself is not running.
 * See https://github.com/eclipse-che/che-operator/pull/1392.
 *
 * WorkspaceStoppedDetector detects this case by checking the original url
 * (ex. the workspace url) from SessionStorage, clears SessionStorage, and determines
 * a user-readable info/warning/error message
 */
@injectable()
export class WorkspaceStoppedDetector {
  /**
   * Checks if the dashboard has been reached from a workspace url when the workspace is not running.
   * If this is the case, this function returns the workspace.
   * Else, returns undefined.
   *
   * @param state The current app state
   * @returns the non-running workspace
   */
  public checkWorkspaceShutdown(state: AppState): Workspace | undefined {
    if (!this.isRedirectedFromNonDashboardUrl()) {
      return;
    }
    // check if dashboard was reached via redirection from workspace url
    const path = SessionStorageService.remove(SessionStorageKey.ORIGINAL_LOCATION_PATH);
    if (!path) {
      return;
    }
    const workspace = selectAllWorkspaces(state).find(w => w.ideUrl?.includes(path));
    if (!workspace) {
      return;
    }

    return workspace;
  }

  /**
   * Returns a user-readable message explaining why the provided workspace is not running.
   *
   * @param workspace The workspace of which its url was used to reach the dashboard.
   * @returns a user-readable message explaining why the workspace is not running
   */
  public getWorkspaceShutdownMessage(workspace: Workspace): string {
    if (workspace.isRunning) {
      throw new WorkspaceRunningError('The workspace is running.');
    }

    const devworkspace = workspace.ref as devfileApi.DevWorkspace;

    const workspaceAnnotations = devworkspace.metadata?.annotations;

    if (workspaceAnnotations) {
      if (workspaceAnnotations['controller.devfile.io/stopped-by'] === 'inactivity') {
        return 'Your workspace has stopped due to inactivity.';
      }

      if (workspaceAnnotations['controller.devfile.io/stopped-by'] === 'run-timeout') {
        return 'Your workspace has stopped because it has reached the maximum run time of 30 minutes and 30 seconds.';
      }
    }

    if (workspace.status === DevWorkspaceStatus.FAILED && devworkspace.status?.message) {
      return `Your workspace is not running. The workspace has failed to start with the following error: ${devworkspace.status.message}.`;
    }

    return 'Your workspace is not running.';
  }

  /**
   * Returns true if the dashboard was reached via redirection from a url that was not:
   * 1. /
   * 2. /dashboard/
   */
  private isRedirectedFromNonDashboardUrl(): boolean {
    const path = SessionStorageService.get(SessionStorageKey.ORIGINAL_LOCATION_PATH);
    if (!path) {
      return false;
    }
    return path !== '/' && path !== '/dashboard';
  }
}
