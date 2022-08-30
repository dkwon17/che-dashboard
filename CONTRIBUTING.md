## Developing the Eclipse Che Dashboard with Eclipse Che

This project contains a v2 devfile in the root of the project which specifies development dependencies and commands needed to develop the Eclipse Che Dashboard.

Within Eclipse Che, you are able to:
* download yarn dependencies and build the project
* work within a rich development environment like VS Code
* test the che-dashboard changes on a development cluster (ex. your personal cluster)
* push changes to GitHub

### Getting started

####  Starting a workspace within Eclipse Che
Navigate to the following URL to start a workspace within Eclipse Che:
```
{CHE-HOST}/#https://github.com/eclipse-che/che-dashboard
```

For example, for workspaces.openshift.io, navigate to the following URL to start a workspace:
```
workspaces.openshift.com/#https://github.com/eclipse-che/che-dashboard
```

#### Running devfile tasks to download yarn dependencies and build the project
For Che-theia and VS Code, tasks defined in the devfile can be ran by:
1. Open the command palette (CTRL/CMD + SHIFT + P)
2. Run the  `Tasks: Run Tasks` command
3. Select the `installdependencies` task to install dependencies.
4. Follow steps 1-2 again and seect the `build` task to build the project.

#### Running the project locally against a remote Che Cluster
To run the dashboard against a remote Che Cluster,  to Kubernetes cluster where it lives.

1. Open the `tools` container within the editor.
2. For an OpenShift cluster, run the `oc login` command with the cluster credentials. For a Kubernetes cluster, configure the ~/.kube/config file.
3. Run the `start` task defined in the devfile by following the steps 1-2 in the `Running devfile tasks to download yarn dependencies and build the project` section.
4. 

#### Debug ?


#### Pushing to GitHub and making a PR
For PRs against the `eclipse-che/che-dashboard` repository, the PR source branch should also be located in `eclipse-che/che-dashboard`, to allow all PR checks to run.
For this reason, in order push to `eclipse-che/che-dashboard` remote from Eclipse Che, you must log in and ...


1. Open a terminal in the `tools` container and run Git commands such as `git add` and `git push`.



