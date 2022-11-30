## HOW TO CHECK & SET REMOTE GITHUB ?

```bash
$ git remote -v
# or
$ git remote set-url <remote_name> <remote_url> (ex : git remote set-url origin https://github.com/hafidh2001/Hactiv8_Final_Project-4.git)
```

## HOW TO REMOVE REMOTE GITHUB ?

```bash
$ git remote remove <remote_name> (ex : git remote remove origin)
```

## HOW TO CLONE REPOSITORY ?

```bash
$ git clone <remote_repo> (ex: git clone https://github.com/hafidh2001/Hactiv8_Final_Project-4.git)
# or clones to specific branches
$ git clone -b <branch> <remote_repo> (ex: git clone -b development https://github.com/hafidh2001/Hactiv8_Final_Project-4.git)
```

## HOW TO RUN TEST USING JEST IN THIS PROJECT ?

```bash
# SETUP ENVIRONMENT

# step 1 : install all dependencies && dev-dependencies
$ npm install (to install dependencies on the project stored in package.json)
# step 2 : create .env file and duplicates the contents of the .env.example
$ touch .env 
# step 3 : create db for test in database and write the url in .env
$ DATABASE_URL_TEST=postgres://{user}:{password}@{hostname}:{port}/{database-name}
# step 4 : migrate db for test using script in package.json
$ npm run migrate-db-test

##########################################################################################

# RUN TEST

# step : run all test
$ npm run test
# step : run specified file test
$ npm run test ./path (ex : npm run test ./__test__/user/register.test.js)
```

## TESTING USING JEST
#### POST /users/register
![](ss-result-test/[user]%20-%20register.png)
#### POST /users/login
![](ss-result-test/[user]%20-%20login.png)
#### PUT /users/update
![](ss-result-test/[user]%20-%20update.png)
#### DELETE /users/delete
![](ss-result-test/[user]%20-%20delete.png)
#### POST /photos/
![](ss-result-test/[photo]%20-%20create.png)
#### GET /photos/
![](ss-result-test/[photo]%20-%20show.png)
#### PUT /photos/:photoId
![](ss-result-test/[photo]%20-%20update.png)
#### DELETE /photos/:photoId
![](ss-result-test/[photo]%20-%20delete.png)
#### POST /comments/
![](ss-result-test/[comment]%20-%20create.png)
#### GET /comments/
![](ss-result-test/[comment]%20-%20show.png)
#### PUT /comments/:commentId
![](ss-result-test/[comment]%20-%20update.png)
#### DELETE /comments/:commentId
![](ss-result-test/[comment]%20-%20delete.png)
#### POST /socialmedias/
![](ss-result-test/[socialmedia]%20-%20create.png)
#### GET /socialmedias/
![](ss-result-test/[socialmedia]%20-%20show.png)
#### PUT /socialmedias/:socialMediaId
![](ss-result-test/[socialmedia]%20-%20update.png)
#### DELETE /socialmedias/:socialMediaId
![](ss-result-test/[socialmedia]%20-%20delete.png)

## DOCUMENTATION

[See more documentation here](./note.txt)

## License

[MIT LICENSE](./LICENSE)

© Developed by [hafidh2001](https://github.com/hafidh2001)
