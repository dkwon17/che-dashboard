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

import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import * as WorkspaceStore from '../../../store/Workspaces';
import { selectAllRunningWorkspaces } from '../../../store/Workspaces/selectors';
import { LoaderStep } from '../../../components/Loader/Step';
import { AlertItem, LoaderTab } from '../../../services/helpers/types';
import { ActionCallback } from '../../../components/Loader/Alert';
import { Workspace } from '../../../services/workspace-adapter';

import { CommonLoaderPage } from '../Common';
import { AppState } from '../../../store';
import { selectRunningWorkspacesLimit } from '../../../store/ClusterConfig/selectors';

export type Props = MappedProps & {
  alertItem: AlertItem | undefined;
  currentStepId: number;
  steps: LoaderStep[];
  tabParam: string | undefined;
  workspace: Workspace | undefined;
  onRestart: () => void;
};
export type State = {
  activeTabKey: LoaderTab;
  isPopupAlertVisible: boolean;
};

class WorkspaceLoaderPage extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    const { tabParam } = this.props;
    const activeTabKey = tabParam && LoaderTab[tabParam] ? LoaderTab[tabParam] : LoaderTab.Progress;

    this.state = {
      activeTabKey,
      isPopupAlertVisible: false,
    };
  }

  private handleRestart(verbose: boolean): void {
    this.setState({
      activeTabKey: verbose ? LoaderTab.Logs : LoaderTab.Progress,
    });
    this.props.onRestart();
  }

  private handleTabChange(tabKey: LoaderTab): void {
    this.setState({
      activeTabKey: tabKey,
    });
  }

  private getActionCallbacks(): ActionCallback[] {
    if (this.props.runningWorkspaces.length < this.props.runningLimit) {
      return [
        {
          title: 'Restart',
          callback: () => this.handleRestart(false),
        },
        {
          title: 'Open in Verbose mode',
          callback: () => this.handleRestart(true),
        },
      ];
    }

    if (this.props.runningWorkspaces.length === 1) {
      const runningWorkspace = this.props.runningWorkspaces[0];
      return [
        {
          title: `Switch to open workspace (${runningWorkspace.name})`,
          callback: () => alert(`switching to ${runningWorkspace.ideUrl}`),
        },
        {
          title: `Close the open workspace (${runningWorkspace.name}) and restart ${this.props.workspace?.name}`,
          callback: () => alert(`closing to ${runningWorkspace.name}`),
        },
      ];
    }
    return [
      {
        title: `Return to dashboard`,
        callback: () => alert(`switching to dashboard`),
      },
    ];
  }

  render(): React.ReactNode {
    const { alertItem, currentStepId, steps, workspace } = this.props;
    const { activeTabKey } = this.state;

    const actionCallbacks: ActionCallback[] = this.getActionCallbacks();

    return (
      <CommonLoaderPage
        actionCallbacks={actionCallbacks}
        activeTabKey={activeTabKey}
        alertItem={alertItem}
        currentStepId={currentStepId}
        steps={steps}
        workspace={workspace}
        onTabChange={tabKey => this.handleTabChange(tabKey)}
      />
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  runningWorkspaces: selectAllRunningWorkspaces(state),
  runningLimit: selectRunningWorkspacesLimit(state),
});

const connector = connect(mapStateToProps, WorkspaceStore.actionCreators);
type MappedProps = ConnectedProps<typeof connector>;
export default connector(WorkspaceLoaderPage);
