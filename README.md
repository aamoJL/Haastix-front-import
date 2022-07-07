# README

To setup your local development environment, make sure you have installed [Docker](https://www.docker.com/) for your workstation!

Optional but highly recommended! [Install docker extension for Visual Studio Code](https://code.visualstudio.com/docs/containers/overview).

## Installing development environment

First, make a project folder which will house the entire project. After that there are two ways to install the development environment: Automatic (only for windows right now) and manual.

### Automatic (Only windows right now)

1. Git clone the source-tools repository into your project folder
2. Execute `install-dev-env.bat` -script in source-tools repo

If executed succesfully, the script has downloaded and installed the dev environment for you. Your project folder should look like this:

![project folder](https://gitlab.labranet.jamk.fi/wimma-lab-2022/iotitude/core/-/raw/master/docs/assets/project-folder.png)

### Manual

1. Clone source-tools repository into your project folder
2. Clone source-frontend development branch into your project folder with `git clone -b development https://gitlab.labranet.jamk.fi/wimma-lab-2022/iotitude/source-frontend.git`
3. Clone source-backend development brannch into your project folder with `git clone -b development https://gitlab.labranet.jamk.fi/wimma-lab-2022/iotitude/source-backend.git`
4. Navigate to source-frontend folder with your terminal and run `npm install`

Your project folder should look like this:

![project folder](https://gitlab.labranet.jamk.fi/wimma-lab-2022/iotitude/core/-/raw/master/docs/assets/project-folder.png)

## Running the development environment

To run the development environment, open the project folder with Visual Studio Code. Navigate to source-tools folder and right click `docker-compose-dev.yml` -file. Choose `Compose Up` -option and docker will start building the backend for you.

To run the frontend in a development server, navigate to source-frontend folder with your terminal and run `npm start`. It will run the development server which will recompile the server everytime you make changes to frontend.
