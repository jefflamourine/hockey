Hockey? Player & Administrator Portal

Administrating (Local) MongoDB:

- Starting from fresh:
	1. Add admin user
		- use admin
		- db.addUser( { user: "<username> (user)",
						pwd: "<password> (pass)",
						roles: [ "userAdminAnyDatabase" ] } )
	2. Add hockey user
		- use hockey
		- db.addUser( { user: "user",
						pwd : "pass",
						roles: [ "readWrite", "dbAdmin" ] } )