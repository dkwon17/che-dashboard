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
import { LoaderStep } from '../../../components/Loader/Step';
import { AlertItem, LoaderTab } from '../../../services/helpers/types';
import { ActionCallback } from '../../../components/Loader/Alert';
import { Workspace, WorkspaceAdapter } from '../../../services/workspace-adapter';

import { CommonLoaderPage } from '../Common';
import { AppState } from '../../../store';
import { selectRunningWorkspacesLimit } from '../../../store/ClusterConfig/selectors';
import { buildIdeLoaderLocation, toHref } from '../../../services/helpers/location';
import { container } from '../../../inversify.config';
import { DevWorkspaceClient } from '../../../services/workspace-client/devworkspace/devWorkspaceClient';

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
  actionCallbacks: ActionCallback[];
};

class WorkspaceLoaderPage extends React.PureComponent<Props, State> {
  private readonly devWorkspaceClient: DevWorkspaceClient;

  constructor(props: Props) {
    super(props);
    this.devWorkspaceClient = container.get(DevWorkspaceClient);

    const { tabParam } = this.props;
    const activeTabKey = tabParam && LoaderTab[tabParam] ? LoaderTab[tabParam] : LoaderTab.Progress;

    this.state = {
      activeTabKey,
      isPopupAlertVisible: false,
      actionCallbacks: [],
    };
  }

  componentDidMount() {
    this.getActionCallbacks().then(actionCallbacks => this.setState({ actionCallbacks }));
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

  private async getActionCallbacks(): Promise<ActionCallback[]> {
    // if (e instanceof WorkspaceRunningError) {

    const namespace = this.props.workspace?.namespace;
    if (namespace) {
      const { workspaces } = await this.devWorkspaceClient.getAllWorkspaces(namespace);
      const runningWorkspaces = workspaces.filter(w => w.spec.started === true);
      if (runningWorkspaces.length >= this.props.runningLimit) {
        if (runningWorkspaces.length === 1) {
          const runningWorkspace = new WorkspaceAdapter(runningWorkspaces[0]);
          return [
            {
              title: `Switch to open workspace (${runningWorkspace.name})`,
              callback: () => {
                const ideLoader = buildIdeLoaderLocation(runningWorkspace);
                const url = window.location.href.split('#')[0];
                window.open(`${url}#${ideLoader.pathname}`, runningWorkspace.uid);
              },
            },
            {
              title: `Close the open workspace (${runningWorkspace.name}) and restart ${this.props.workspace?.name}`,
              callback: () => {
                alert(`closing ${runningWorkspace.name} with this.props.stopWorkspace`);
                this.props.stopWorkspace(runningWorkspace);
                // this.devWorkspaceClient.changeWorkspaceStatus(runningWorkspaces[0], false);
              },
            },
          ];
        }
        return [
          {
            title: `Return to dashboard`,
            callback: () => {
              alert(`switching to dashboard`);
              window.location.href = window.location.origin + '/dashboard/';
            },
          },
        ];
      }
    }
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

  render(): React.ReactNode {
    const { alertItem, currentStepId, steps, workspace } = this.props;
    const { activeTabKey } = this.state;

    return (
      <CommonLoaderPage
        actionCallbacks={this.state.actionCallbacks}
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
  runningLimit: selectRunningWorkspacesLimit(state),
});

const connector = connect(mapStateToProps, WorkspaceStore.actionCreators);
type MappedProps = ConnectedProps<typeof connector>;
export default connector(WorkspaceLoaderPage);
