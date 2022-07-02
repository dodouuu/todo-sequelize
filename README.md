![cover](https://raw.githubusercontent.com/dodouuu/pictures/main/A14%20cover.png)
# Express app: todo-sequelize

## Routes
![Routes](https://raw.githubusercontent.com/dodouuu/pictures/main/A14%20todo-sequelize%20routes.png)

## 功能列表
1. you can always click 【's Todo List】 on Navbar to go back to home page

2. Login:
	1. before login, you will see: Please Login first
	2. empty fields, warning: Missing credentials
	3. if account is not registerd: The Account is not registered!
	4. wrong password, warning: The Password is incorrect.
	5. use Facebook Login
	6. after Log out, you will see: Log out successfully
	7. if account or password is wrong, they will remain in fields

3. Register:
	1. if account is registerd, warning: the Account is already registered
	2. empty Name field, warning: unfilled Name
	3. empty Email field, warning: unfilled Account
	4. empty Password field, warning: unfilled Password
	5. empty confirmPassword field, warning: unfilled confirmPassword
	6. different Password confirmPassword, warning: Password、confirmPassword NOT match
	7. use Facebook Register

4. CRUD:
	1. Create
	2. Read in detail page
	3. Update
	4. Delete

---
## 安裝與執行
1. 從 Terminal (command line interface) 移動到想存放專案的位置，執行：
```
git clone https://github.com/dodouuu/todo-sequelize.git
```
2. 進入 repository 
```
cd todo-sequelize
```
3. 安裝套件
```
macOS 請至nvm 的 GitHub 頁面：https://github.com/creationix/nvm。安裝 nvm
Windows 請至nvm 的 GitHub 頁面：https://github.com/coreybutler/nvm-windows/releases。安裝 nvm
nvm i 14.16.0
npm i 
```
4. 使用本機資料庫
	1. 啟動 MySQL 本機服務
	2. 設定環境變數：新創一個.env檔案，可以模仿.env.example：
	```
	FACEBOOK_APP_ID=SKIP
	FACEBOOK_APP_SECRET=SKIP
	FACEBOOK_CALLBACK=http://localhost:3000/auth/facebook/callback
	SESSION_SECRET=ThisIsMySecret
	PORT=3000
	```
	3. 啟動 MySQL Workbench 檢視資料庫
	```
	drop database if exists todo_sequelize;
	create database todo_sequelize;
	use todo_sequelize;
	select * from todos;
	select * from users;
	```
5. 創建初始種子資料
```
npx sequelize db:seed:all
```
6. 確認 Terminal 顯示以下資訊，代表 20220701005916-default-data.js 執行成功
```
Loaded configuration file "config\config.json".
Using environment "development".
== 20220701005916-default-data: migrating =======
== 20220701005916-default-data: migrated (0.103s)
```
7. 執行
```
npm run dev
```
8. 確認 Terminal 顯示以下資訊，代表啟動成功，打開瀏覽器，在網址列輸入http://localhost:3000
```
[nodemon] 2.0.16
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node app.js`
App is running on http://localhost:3000
```
9. 停止伺服器
```
ctrl + C
```
---
## 開發工具
1. Node.js 14.16.0
2. bcryptjs 2.4.3
3. body-parser 1.20.0
4. connect-flash 0.1.1
5. dotenv 16.0.1
6. express 4.18.1
7. express-handlebars 6.0.6
8. express-session 1.17.3
9. method-override 3.0.0
10. mysql2 2.1.0
11. nodemon 2.0.16
12. passport 0.6.0
13. passport-facebook 3.0.0
14. passport-local 1.0.0
15. sequelize 5.21.13
16. sequelize-cli 5.5.1
17. Bootstrap 5 bootswatch
