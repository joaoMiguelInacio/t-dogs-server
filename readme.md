Routes Planning

| Route           | HTTP Verb | Description                      | View                                               |
| --------------- | :-------: | -------------------------------- | -------------------------------------------------- |
| /               |    GET    | shows Homepage                   | HomePage                                           |
| auth/signup     |    GET    | shows signing up form            | SignUp                                             |
| auth/signup     |   POST    | creates user                     | redirect to signin                                 |
| auth/signin     |    GET    | shows signing in form            | SignIn                                             |
| auth/signin     |   POST    | signs in                         | redirect to ownList if owner or to browse if buyer |
| OWNER           |           |                                  |                                                    |
| /dogs/ownList   |    GET    | show dogs list                   | OwnDog List                                        |
| /dogs/create    |   POST    | creates dog                      | redirect to OwnDogList                             |
| /dogs/:id/edit  |    GET    | show edit dog form               | DogEdit                                            |
| /dogs/:id/edit  |    PUT    | edits dog                        | redirect to DogDetails                             |
| OWNER && BUYER  |           |                                  |                                                    |
| /dogs/:id       |    GET    | show dog details                 | DogDetails                                         |
| /profile        |    GET    | show user/owner profile          | OwnProfile                                         |
| /profile/edit   |   POST    | edits profile                    | redirect to OwnProfile                             |
| BUYER           |           |                                  |                                                    |
| /dogs/browse    |    GET    | show available dog               | BuyerDogView                                       |
| /dogs/:id/match |    PUT    | adds dogs to buyers matches list | BuyerDogView + notification                        |
| /dogs/matchList |    GET    | show matched dogs                | MatchedList                                        |
