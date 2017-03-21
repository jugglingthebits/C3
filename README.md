C3
==
What is C3?
-----------
C3 is a tool to build *system context* and *container diagrams*, based on the exellent [C4 software architecture model](http://www.codingthearchitecture.com/2014/08/24/c4_model_poster.html) developed by [Simon Brown](http://simonbrown.je/).

Example c3.json
---------------
    {
        "id": "system1",
        "actors": [
            {
                "id": "actor1"
            }
        ],
        "containers": [
            {
                "id": "container1"
            },
            {
                "id": "container2"
            }
        ],
        "externalSystems": [
            {
                "id": "externalSystem1"
            }
        ],
        "usings": [
            {
                "sourceId": "actor1",
                "targetId": "container1"
            },
            {
                "sourceId": "container1",
                "targetId": "container2"
            },
            {
                "sourceId": "container2",
                "targetId": "externalSystem1"
            }
        ]
    }

Usage
-----

Run c3 from the command line:

    Usage: c3 [options]

    Options:

        -h, --help     output usage information
        -V, --version  output the version number
        -n, --new      Create example c3.json
        -s, --show     Open web app

Building
--------
The web app and cli are built separately.

    npm install
    gulp
    au build [--env dev|stage|prod]
