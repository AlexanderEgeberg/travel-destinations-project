Backend
We expect you to save relevant information about travel destinations in a database with
eg. Title, Date (from and to), description, location, country.
• The backend should be developed using the subjects from our classes about
NodeJs. The backend must be an API that sends data to the frontend using
JSON.
• CRUD operations following REST principles for the travel destinations.
• The backend should have basic error handling eg
. it should not be possible to
save a travel destination without a title.

create 1 title required
read all
read 1
update 1
delete 1 auth gate

Frontend
The frontend should only use standard html, css and javascript/typescript.
o 1 page for creating a new travel destination, with multiple input fields
corresponding to the desired data model, and validation you find
suitable. We should have front-end validation where possible.
o 1 List view page, showing multiple/all travel destinations.
o 1 page for showing an existing travel destination (for updating).
o Login and signup - pages and functionality.
• The ability to login.
• The ability to update existing destinations .
• Use the same layout as creation, but with pre-filled information from the entity
we want to edit.
• The ability to delete a destination .
• Only show the delete button for authorized/logged in users.
• Add a confirmation dialog for deletion.
• The Frontend should be able to dynamically update/sync the UI after deleting.
• i.e. No refreshes to update/reload the data.

create 1
read all
read 1
update 1
delete 1 auth gate

1-many relation users -> travel_destinations
travel_destinations private/public (need auth to get private) call it published?
add pics ( read write file in api folder, store reference in db)
