#pragma once
#include <map>
#include <string>

// One request + what a correct backend must answer.
struct TestCase {
    std::string group;                               // feature area: "auth", "messages", "dms"...
    std::string name;                                // human label
    std::string method = "GET";                      // GET POST PUT PATCH DELETE
    std::string path;                                // "/api/rooms/1/messages"
    std::map<std::string, std::string> headers;      // extra headers
    std::string body;                                // raw body (JSON string)
    std::string contentType = "application/json";    // used only when body is set
    int expectedStatus = 200;
    std::string bodyContains;                        // optional: response must contain this
};
