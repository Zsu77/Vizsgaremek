##A telepítéshez kell:
#docker desktop
#node
#mongoDB

##parancs a futtatáshoz:
#`docker compose up`

#kezdő adatbázis:
#mongodb atlas-ban a 27018-as portra kell csatlakozni, ott beilleszteni ezt a `users` collection-be:
```
{
    "_id" : ObjectId("6276688e8ac0526064fb3ade"),
    "username" : "admin",
    "hash" : "864bcf999790114b894299fbc5899cd5c998b3166e1deacc69096fb10b8eda84d2ff1c36637ad4679621b1c17ab3ee2260f6ef4f40c722a0528d645afaeeecce",
    "salt" : "1322927e381826e0f7a6fa6ccf4ea81660301f4956ef889eef60e43a2c32065b",
    "admin" : true,
    "blockedDates" : [],
    "__v" : 0
}
```
#így lesz egy felhasználónk, aminek a bejelentkezési adatai:
#username: admin
#password: admin
