# Quick Start
## Cloning the Repo
Open terminal on your PC, then press `win+R`, enter `cmd`

Navigate to the location where you want to clone the folder and excute the following command:
* For ssh:
`git clone git@github.com:aberkipek/boatify-brs.git`
* For https:
`git clone https://github.com/aberkipek/boatify-brs.git`

After cloning the repo, navigate to the project directory:
`cd boatify-brs`

## Run Backend
Run the following command to navigate to the backend directory:
`cd boatify-backend`

After, type `node server.js` to run the backend.

## Run Frontend
Run the following command to navigate to the backend directory:
`cd boatify-frontend`

After, type `npm start` to run the frontend.

## Environment Variables
Since `.env` file is git-ignored in our `boatify-backend` directory, when you clone the repo, you will not see it. 

So, what you need to do is to create a new `.env` file with your own database configuration. (For this project, it should be a MySQL database.)

## Database Schemas
In the `/sql-schemas` folder inside `boatify-backend` directory, you can find the queries to set up the database tables on your local.
##### Notes: 
* Be careful while executing the queries, because our database is relational. So, order of execution matters! (Run `schema.sql` first etc.)
* You can use any IDE you like to open the project :)

