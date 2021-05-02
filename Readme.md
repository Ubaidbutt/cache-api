## Cache API
The goal was to develop an API for caching data in a mongodb database.

### What you need?
You need an environment variable file with the following four values:
- PORT
- MONGODB_URL
- MAX_CACHE_LIMIT
- TTL_MILLISECOND

### Structure
I have divided the project into the following folders/structure:
* Configuration
	* This folder contains everything related to configuration of the whole application
* Database
	* This contains database connection logic
* Models
	* Contains the database models
* Routers
	* Controls the routing logic, which request go where - a good point to apply authentication/authorization middlewares
* Controllers
	* The functions that implements the business logic, interacts with the database and return response back to the client
	* Ideally speaking, controller can be further divided into two parts:
		* Controller
			* Responsible only for request parsing, field validation, etc
		* Services
			* Actual function that implements the business logic / database interaction layer