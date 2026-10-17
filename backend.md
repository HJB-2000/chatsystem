# Gatway
## dotenv/config
dotenv is a package that load env variables form a .env file into a process.env.
so we can keep the config separet form the code



# LogRocket https://blog.logrocket.com/full-stack-app-tutorial-nestjs-react/
1. nestjs is a robust framework for building efficient, scalable Node.js server side application, it's make the devlopment easy, and allow the developers to build the web-application with their programming paradigms of choice.
2. defining the application routes :
    - after defining the schema has been defined, it's time to define the application's routes
        * let define what is the meaning of routes and controllers in nestjs<br>
        a server-side request (http) is a request where the user is asking the application to perform an action related to a resources. this request is created via a user-agent like a browser or application.
        * every request is defined by multiple parts but the most important one is the method, and the method actually define what the user want form the server 
            * GET : used for requests to retrieve a resource or a list of resources 
            * POST :used for a request to update an existing resources
            * DELETE: used for requests to delete an existing resources  

3. defining the NestJs routes and Controllers
    - A routes is a combination of an HTTP method, a path, and the function to handle it defined in an application. the job of the routes is to define whish controller receive what request
    - A controller is a class defined with methods for handling one or more requests. the controller provides the handler function for a route.
    - 






# async function bootstrap()
the aync function declaration create a **binding** of a new async function to a given name. the **await** keyword is permitted within the function body.
enabling asynchronous, promise-based behavior to be written in a cleaner style and avoiding the need to explicitly configure promise chain.
1. the **async funtion** declaration create an **AsyncFunction object** each time when an async function is called, it returns a new promise {what is a promise ?} that get resolved with the value returned by the async function, or it can be also rejected with an exception uncaught withing the async function

2. async function can can contain zero or more await expressions.
3. the await expression make promise-returning functions behave as though they're synchronous by suspending execution until the returned promise is fulfilled or rejected.
4. the resolve value of the promise is treated as the return value of the await expression.
5. the use of async and await enables the use of ordinary try/catch blocks around asynchronous code.
6. async functions always return a promise. if the return value of an async function is not explicitly a promise, it will implicitly warapped in a promise.

