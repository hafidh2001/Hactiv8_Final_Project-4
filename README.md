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

## HOW TO RUN ?

```bash
$ npm install (to install dependencies on the project stored in package.json)
# step 1 : rename .env.example to .env
# step 2 : fill in the value of each secret variable in .env
```

## TESTING USING JEST
#### POST /user/register
![](ss-result-test/[user]%20-%20register.png)
#### POST /user/login
![](ss-result-test/[user]%20-%20login.png)
#### PUT /user/update
![](ss-result-test/[user]%20-%20update.png)
#### DELETE /user/delete
![](ss-result-test/[user]%20-%20delete.png)

## DOCUMENTATION

[See more documentation here](./note.txt)

## License

[MIT LICENSE](./LICENSE)

© Developed by [hafidh2001](https://github.com/hafidh2001)
