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
	
