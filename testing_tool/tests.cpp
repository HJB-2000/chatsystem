#include "tests.hpp"

/*
 * HOW TO ADD A TEST
 * ------------------------------------------------------------
 * Add one line inside registerTests():
 *
 *   suite.add(T(group, name, method, path, expectedStatus,
 *               headers, body, bodyContains));
 *
 * REQUIRED
 *   group           feature area, free text ("auth", "dms"). New name = new row in report.
 *   name            label shown in PASS/FAIL line.
 *   method          "GET" | "POST" | "PATCH" | "PUT" | "DELETE"
 *   path            starts with "/api/...", query string allowed.
 *   expectedStatus  200 ok | 201 created | 400 bad input | 401 bad tag
 *                   403 forbidden | 404 missing target
 *
 * OPTIONAL (in this order; skip from the right)
 *   headers         auth    -> valid tag (env USER_TAG)
 *                   badAuth -> wrong tag
 *                   {}      -> none (needed only to reach body/bodyContains)
 *   body            raw JSON, use R"({"key":"value"})"
 *   bodyContains    substring the response body must contain
 *
 * EXAMPLES
 *   GET, authenticated, expect 200:
 *     suite.add(T("collectives", "list", "GET", "/api/collectives", 200, auth));
 *
 *   GET, no auth, expect 401:
 *     suite.add(T("collectives", "no tag", "GET", "/api/collectives", 401));
 *
 *   POST with JSON body:
 *     suite.add(T("collectives", "create", "POST", "/api/collectives", 201, auth,
 *                 R"({"name":"guild x"})"));
 *
 *   POST, check response content:
 *     suite.add(T("collectives", "create name", "POST", "/api/collectives", 201, auth,
 *                 R"({"name":"guild x"})", "guild x"));
 *
 *   Body without auth (empty headers placeholder):
 *     suite.add(T("users", "x", "POST", "/api/x", 400, {}, R"({"a":1})"));
 *
 * RULES
 *   - Tests run top to bottom, in insertion order.
 *   - POST tests create data on every run.
 *   - Hardcoded ids (rooms/1, users/2) depend on the seed.
 *   - Never hardcode a real tag. Use `auth` (from USER_TAG).
 *
 * RUN
 *   make && USER_TAG=<tag> ./soulnet
 * ------------------------------------------------------------
 */


using Headers = std::map<std::string, std::string>;

// T(group, name, method, path, expectedStatus, headers, body, bodyContains)
static TestCase T(const std::string& group, const std::string& name,
                const std::string& method, const std::string& path, int expected,
                const Headers& headers = {}, const std::string& body = "",
                const std::string& contains = "") {
    TestCase t;
    t.group = group;
    t.name = name;
    t.method = method;
    t.path = path;
    t.expectedStatus = expected;
    t.headers = headers;
    t.body = body;
    t.bodyContains = contains;
    return t;
}

void registerTests(TestSuite& suite, const std::string& tag) {
    const Headers auth = {{"x-user-tag", tag}};
    const Headers badAuth = {{"x-user-tag", "wrong"}};

    // ---------- auth ----------
    suite.add(T("auth", "no header",        "GET", "/api/rooms/1/messages", 401));
    suite.add(T("auth", "wrong tag",        "GET", "/api/rooms/1/messages", 401, badAuth));
    suite.add(T("auth", "old ?userId= way", "GET", "/api/rooms/1/messages?userId=1", 401));

    // ---------- messages ----------
    suite.add(T("messages", "list room 1",     "GET",   "/api/rooms/1/messages", 200, auth, "", "\"items\""));
    suite.add(T("messages", "bad room id",     "GET",   "/api/rooms/abc/messages", 400, auth));
    suite.add(T("messages", "missing room",    "GET",   "/api/rooms/99999/messages", 403, auth));
    suite.add(T("messages", "bad before",      "GET",   "/api/rooms/1/messagebs?before=abc", 400, auth));
    suite.add(T("messages", "send",            "POST",  "/api/rooms/1/messages", 201, auth, R"({"message":"runner ping"})", "runner ping"));
    suite.add(T("messages", "send empty",      "POST",  "/api/rooms/1/messages", 400, auth, R"({"message":""})"));
    suite.add(T("messages", "edit not author", "PATCH", "/api/rooms/1/messages/2", 403, auth, R"({"message":"x"})"));

    // ---------- users ----------
    suite.add(T("users", "get bad id",      "GET",   "/api/users/abc", 400));
    suite.add(T("users", "edit other user", "PATCH", "/api/users/2", 403, auth, R"({"name":"x"})"));

    // ---------- dms ----------
    suite.add(T("dms", "list",        "GET", "/api/dms", 200, auth));
    suite.add(T("dms", "bad partner", "GET", "/api/dms/abc", 400, auth));
    suite.add(T("dms", "no partner",  "GET", "/api/dms/99999", 404, auth));

    //------- channels / rooms -------
    suite.add(T("rooms", "rooms join", "Post", "/api/1/join", 200, auth));
}


/*
T(group, name, method, path, expectedStatus, headers, body, bodyContains)
//                                  required ^   optional: headers, body, bodyContains
*/