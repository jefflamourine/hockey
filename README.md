Hockey? Player & Administrator Portal

Current Features:

- Node.js server using Express framework, MongoDB database and Jade templates
- HTTPS redirection
- Index, Register, Login, and Dashboard pages
- Register adds account with given user & password to DB (securely transmitted w/ HTTPS)
	- Passwords in DB hashed w/ salt
	- Password strength indicator
	- Prevents duplicate accounts/blank passwords

- Login checks account against matching username & hashed password in DB
	- Returns account info and password match true/false

- Responsive(ish) links & forms

To do:

- Dashboard page functionality
	- Redirect away when no session
	- Show current session
	- Logout capabilities


Administrating (Local) MongoDB:

- Starting from fresh:
	1. Add admin user
		- use admin
		- db.addUser( { user: "<username> (user)",
						pwd: "<password> (pass)",
						roles: [ "userAdminAnyDatabase" ] } )
	2. Add collections
		- use hockey
		- db.createCollection("account", {capped: false, size: 524288, max: 5000})
		- db.createCollection("goal", {capped: false, size: 5242880, max: 50000})
		- db.createCollection("player", {capped: false, size: 524288, max: 5000})
		- db.createCollection("team", {capped: false, size: 524288, max: 2500})
		- db.createCollection("game", {capped: false, size: 5242880, max: 10000})