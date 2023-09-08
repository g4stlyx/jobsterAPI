### <h1>JOBSTER API</h1>

A full-stack project that contains register,login, and CRUD functionality. <br>
You can create, read, update and delete jobs after you successfully logged in, also you can see the last 12 months stats in "stats" page. <br>
You can use the demo account to explore the project if you don't want to register, but test user is limited to read-only actions.

<h3><a href="https://jobster-api-1yfd.onrender.com/">demo link</a></h3>

### <h2>Setup </h2>

1. Setup .env in the root <br>
2. Add MONGO_URI with correct value <br>
3. Add JWT_SECRET as your resolving key(e.g thisIsASecretKey) and JWT_LIFETIME as the expire time of the token (e.g 1d,30d) <br>
4. navigate to the root directory (which contains "package.json"), and run the command below <br>

```bash
npm install && npm start
```
<br>
PS: Front end is coded by John Smilga. Also, I coded back end while taking this <a href="https://www.udemy.com/course/nodejs-tutorial-and-projects-course/">nodeJS course.</a>
