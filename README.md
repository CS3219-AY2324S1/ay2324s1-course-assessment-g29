[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/6BOvYMwN)

# PeerPrep Group 29

## Overview

This is our repository for our CS3219 project PeerPrep. 

PeerPrep is a technical interview preparation platform and peer matching system called PeerPrep, where students can find peers to practice whiteboard-style interview questions together.

## Running Locally

### Prerequisites

Make sure you have the following installed on your machine:

- Docker
- Docker Compose
- npm

### Configuration

There are a few configuration files that are needed. You can get them from our [GDrive](https://drive.google.com/file/d/1cZtzJ3cJE72r4mo-qSV_RYfWZzAC2oiG/view?usp=sharing). Inside there is a bash script that can be used to automatically transfer the config files into their respective directories. 

The folder from the link above should be placed in the root directory that also contains the project directory.
.
├── ay2324s1-course-assessment-g29/
├── peerprep_configs/

Simply, run ``./setup.sh`` to set up the configs.

### Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/CS3219-AY2324S1/ay2324s1-course-assessment-g29
   ```

    > :warning: At this point you should do the configuration in the section above

2. Change into the project directory:

   ```bash
   cd ay2324s1-course-assessment-g29
   ```

3. Build the Docker images:

   ```bash
   docker compose build
   ```

   > :warning: **We disabled the frontend container by default as it takes very long to build**: This will only build the backend microservices. If you wish to build the front-end in a container as well, uncomment the front-end section in `docker-compose.yml`. 
   If you do so, you can skip steps 5 - 7

4. Start the Docker containers:

   ```bash
   docker compose up
   ```

   This will start the necessary microservices containers and services defined in the `docker-compose.yml` file. 
   <br>

5. In a new terminal, change into the frontend directory
   ```bash
   cd ay2324s1-course-assessment-g29/frontend
   ```

6. Install the necessary node dependencies
   ```bash
   npm i
   ```
   
7. Start the React frontend application 
   ```bash
   npm start
   ```

8. Access the application:

   Open your web browser and go to [http://localhost:3000](http://localhost:3000)


## Accessing the Deployed App

We have also deployed our app on GCP. It can be accessed here:
http://34.125.231.246:3000/


:warning: **Note**: We have a video calling feature but in order to enable video call on our deployed app, we had to purchase a domain in order to get a SSL certificate to establish https connection. 

To get around this, you can enable https by default by using changing your browser's connfiguration. Use this link to find out more: https://stackoverflow.com/questions/52759992/how-to-access-camera-and-microphone-in-chrome-without-https
