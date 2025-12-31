# Connecting to DB on AWS in pgadmin

- Right-click Servers -> Register -> Server.
- Provide a name
- Under Connection tab -> copy the Host name and password from ```.env``` file (don't change the Username)

Once connected, it should look like this:

![Screenshot 2024-08-26 110538](https://github.com/user-attachments/assets/f4c65664-1df0-4bae-aec6-2b79243cd36e)


# Modifying tables of DB

## In pgadmin
- Click ```miniqb``` under the server you created -> click Schemas -> public -> Tables
- Right-click on the table you want to modify (select Properties or View All Data etc)

## In SQL Shell Terminal (or equivalent in Mac)
- Enter Host name from ```.env``` file, Database name is ```miniqdb```, keep Port and Username the same (just hit enter), copy password from .env file
- Input SQL queries for modifying table properties
