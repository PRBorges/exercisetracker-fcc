# Exercise Tracker

This is the [Exercise Tracker project](https://www.freecodecamp.org/learn/apis-and-microservices/apis-and-microservices-projects/exercise-tracker) required for the FreeCodeCamp Backend certification.

The project was developed from the Javascript [boilerplate repo](https://github.com/freeCodeCamp/boilerplate-project-exercisetracker/) from FCC but in Typescript.

The project was submitted to FCC [as a replit](https://replit.com/@PRBorges/ExerciseTracker-FCC). It should be live at [](https://ExerciseTracker-FCC.prborges.repl.co).

## Endpoints

* GET / provides a basic form to request user creation, add exercises to a user's log, and to request a log.
* POST /api/users with 'username' to create a user.
* GET /api/users request the list of users.
* POST /api/:_ID/users/exercises with 'description', 'duration', and 'date' to add an exercise to the user's log.
* GET /api/_ID/users/logs  with 'from', 'to', and 'limit' to request the log of exercises of the user.
