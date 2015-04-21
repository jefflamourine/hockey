Hockey? Player & Administrator Portal

Current Features:

- Node.js server using Express framework, MongoDB database
- HTTPS redirection
- Register and login pages
- Register adds account with given user & password to DB (securely transmitted w/ HTTPS)
	- Passwords in DB hashed w/ salt

- Login checks account against matching username & hashed password in DB
	- Returns account info and password match true/false

- Responsive(ish) links & forms

To do:

- Register page functionality:
	- Client side form checking
		- Username and password validity, password strength
	- Server side user validity checks
		- Duplicate users