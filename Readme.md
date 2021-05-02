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
### API documentation
* /data
	* POST
		* This endpoint will take a 'key' and 'value' pair in json and create a record in the cache database
		* If the key already exists, it will return a 204 updated response after updating the value
		* If the key does not exist, it will create a new record and return a 201 response
* /data/keys
	* GET
		* This endpoint will return all the keys in the cache as an array of strings with status code 200
	* DELETE
		* This endpoint will delete all the keys in the cache with a status code of 204
* /data/keys/:key
	* GET
		* This endpoint will result in a cache hit if the key exist and its Time to Live (TTL) is still under the configured limit - it returns 200 with the value of the key - Also it will update the TTL time of the key
		* This endpoint will return in a cache miss if they key does not exists or the Time to Live (TTL) has passed - in that case - the endpoint will create a 204 or 201 response depending upon the scenario
	* DELETE
		* This endpoint will simply delete the specified key from the cache