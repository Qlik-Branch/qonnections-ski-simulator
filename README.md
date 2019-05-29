# Ski Simulator Real Time App

This project is for the Ski Simulator real time app that was used at Qonnections 2019.

## Prerequisites

To run this project you need to install the following:

- Docker Desktop
- NodeJS
- corectl - https://github.com/qlik-oss/corectl
- For the maps to work you'll need a Qlik GeoAnalytics implementation
- A webcam. The React app needs to use a webcam to scan QR codes (which are included in this source)

## Getting Started

### Running Qlik Core and creating the Qlik App

1. Clone the repo
2. Move to the repo directory: `cd qonnections-ski-simulator`
3. From the root directory run `npm install`
4. Run `docker-compose up -d`
5. Run `corectl build`

### Running the renamer

Renamer needs to continuously run, so this should be done in a separate terminal.

1. Move to the renamer directory: `cd renamer`
2. Copy the sample environment file: `cp .env.sample .env`
3. Edit the environment file as needed
4. Run the renamer: `node index.js`

### Running the data processor

Data Processor needs to continuously run, so this should be done in a separate terminal.

1. Move to the data processor directory: `cd ski-load`
2. Copy the sample environment file: `cp .env.sample .env`
3. Edit the environment file as needed
4. Run the data processor: `node index.js`

### Running the react app

React App needs to continuously run, so this should be done in a separate terminal.

1. Move to the app folder: `cd app`
2. Copy the sample environment file: `cp .env.sample .env`
3. Edit the environment file as needed
4. Run `npm install`
5. Run `npm start`

### Running the simulator

Unless you have a $70,000 ski simulator lying around your going to need to simulate
the ski machine. Follow the below steps in a separate terminal.

1. Decompress the `sample-data/sample.zip` file
1. Move to the simulator directory: `cd simulate`
2. Copy the sample environment file: `cp .env.sample .env`
3. Edit the environment file as needed

After you have scanned a badge in the react app and clicked the `GO` button, do the following:

1. Run the simulator: `node index.js`
2. Follow the instructions in the terminal


## Running the show

Once you have completed all the steps above you should have a renamer running, a data processor running and a react app
that you can browse to in a browser at http://localhost:3000. The react app will need access to a webcam in order to scan
a QR code for a badge ID. Sample badges have been included in the `data/processed/badges.csv` file and their QR codes have
been included in the `sample-data/badges.zip` archive. Take one of these QR codes (print, place on a phone, etc) and put it
in view of the webcam for the app to scan. Once scanned the app will show the name associated to the badge and there will be
a `GO` button. Clicking this button should bring you to the Dashboard. Once here you can run the simulator and watch the magic
happen.
