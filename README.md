A web application intend to make travel and accommodation easy and convenient.

[![Reviewed by Hound](https://img.shields.io/badge/Reviewed_by-Hound-8E64B0.svg)](https://houndci.com)

Heroku Link: [https://barefoot-nomad-staging.herokuapp.com/](https://barefoot-nomad-staging.herokuapp.com/)

#### Database migration

- To connect to database, modify config.js file in /src/config and include your DB parameters or add DATABASE_URL env.
- Run the command 'node_modules/.bin/sequelize db:migrate' to migrate the dummy user table.
