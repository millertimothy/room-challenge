# Tauria Room Challenge

Thanks for taking the time to go over my soluction to the room challenge. This project was built using Express, TypeScript and [ArangoDB](https://www.arangodb.com/).

## Run locally

Development was done on macOS.

#### Prerequisites

- [Install Node](https://nodejs.org/en/download/)
- [Install Docker](https://docs.docker.com/get-docker/)
- [Install Postman](https://www.postman.com/downloads/) (or equivalent)

#### 1. Run an ArangoDB Docker container:

```
docker run -p 8529:8529 -e ARANGO_ROOT_PASSWORD=openSesame arangodb
```

#### 2. Run the Express server. In the root of this project run:

```
npm i
npm start
```

#### 3. Log into the ArangoDB Web Interface. Go to http://localhost:8529. Login credentials are:

```
username: root
password: openSesame
```

Once the Express server has been run, you will be able to select the "conferencing" database on the dropdown. Click on "Select DB: conferencing". You will see two collections, namely: users and rooms.

## Kubernetes Deployment

The Express server and ArangoDB database have been deployed in a small Kubernetes cluster hosted by DigitalOcean in the Toronto region.

The Express server and ArangoDB are available at the following endpoints:

```
http://server.room-challenge.xyz
http://arangodb.room-challenge.xyz
```

The ArangoDB Web Interface username is root and the password has been included in my LinkedIn message to Jesse.

## Methods

### Summary:

| Method            | HTTP verb | Path                    | Requires auth |
| ----------------- | --------- | ----------------------- | ------------- |
| Get Users         | GET       | /users                  |               |
| Get User          | GET       | /user/:username         |               |
| Register          | POST      | /register               |               |
| Sign In           | POST      | /sign-in                |               |
| Update User       | PUT       | /update-user            | ✓             |
| Delete User       | DEL       | /user                   | ✓             |
| Create Room       | POST      | /create-room            | ✓             |
| Change Host       | PUT       | /change-host            | ✓             |
| Join/Leave Room   | PUT       | /add-remove-participant | ✓             |
| Get Room Info     | GET       | /room-info/:guid        |               |
| Search User Rooms | GET       | /user-rooms/:username   |               |

All methods that require auth need to have the Authorization header set to `Bearer <token>`.

Requests with a body must use a JSON body.

### User management

#### Get Users

Retrieves all of the documents in the "users" ArangoDB collection and returns them.

#### Get User

Receives a username. Retrieves the user document from the database with the matching username and returns it.

#### Register

Takes a username, password and optional mobileToken string. Registers the user and authenticates the client as the newly created user by returning a signed JSON web token. The newly created user is saved as an ArangoDB document in the "users" collection with the username as the document \_key. The password is hashed before being saved to the database.

| Body Parameter | Contraints                                |
| -------------- | ----------------------------------------- |
| username       | String, min length of 3, max length of 20 |
| password       | String, min length of 6, max length of 20 |
| mobileToken    | Optional, string                          |

#### Sign In

Takes a username and password, and authenticates the user be hashing the supplied password and comparing it to the password stored in the database. Returns a signed JSON web token.

| Body Parameter | Contraints                                |
| -------------- | ----------------------------------------- |
| username       | String, min length of 3, max length of 20 |
| password       | String, min length of 6, max length of 20 |

#### Update User

Updates the password and/or mobileToken of the current user. The ArangoDB document is updated. If a new password is supplied, it is hashed before being saved to the database. The current user is authenticated using the Authorization header JWT.

| Body Parameter | Contraints                                          |
| -------------- | --------------------------------------------------- |
| password       | Optional, string, min length of 6, max length of 20 |
| mobileToken    | Optional, string                                    |

#### Update User

Deletes the current user from the database and returns the old user object excluding the password. The current user is authenticated using the Authorization header JWT.

### Room management

#### Create Room

Creates a room hosted by the current user, with an optional capacity limit. The room is initialized with the host as the current user's username and the participants as an empty array. The room is saved as an ArangoDB document in the "rooms" collection. The room guid is the document \_key and is generated by ArangoDB. The current user is authenticated using the Authorization header JWT.

| Body Parameter | Contraints                                     |
| -------------- | ---------------------------------------------- |
| name           | String, min length of 3, max length of 20      |
| capacity       | Optional, positive integer, default value of 5 |

#### Change Host

Changes the host of the user from the current user to another user. The existance of the new host user is verified by fetching it from the database. The room document is updated on the database. The current user is authenticated using the Authorization header JWT.

| Body Parameter | Contraints |
| -------------- | ---------- |
| guid           | String     |
| newHost        | String     |

#### Join/Leave Room

Joins/leaves the room as the current user by adding or removing the user's username from the participants array. The room document is updated on the database. The current user is authenticated using the Authorization header JWT.

| Body Parameter | Contraints             |
| -------------- | ---------------------- |
| guid           | String                 |
| action         | Enum "add" or "remove" |

#### Get Room Info

Given a room guid, retrieves the room document from the database and returns the room object.

#### Search User Rooms

Given a username, returns a list of room guids that the user is in.

## Next steps

If I were to continue building out this solution the next 2 things I would do are:

#### 1. Implement sign out

To implement sign out functionality, asking the frontend to delete the JSON web token isn't quite enough. I would use a cache of "signed out" or "banned" users with a time to live equal to the lifespan of the JSON web token. Whenever a user signs out, their username is added to the cache. The cache would be checked whenever authenticating a user. Upon successful sign in, the user's username would be removed from the cache.

#### 2. Automated Tests

Automated tests ensure that code behaves consistently the way that it was designed to.
