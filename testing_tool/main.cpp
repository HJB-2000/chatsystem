#include "main.h"

static const char* HOST = "localhost";
static const int PORT = 3000;
static const char* HISTORY_FILE = "soulnet_history.csv";

int main() {
    // secret comes from the environment, never from source or argv
    const char* env = std::getenv("USER_TAG");
    std::string tag = env ? env : "";
    if (tag.empty())
        std::cerr << "warning: USER_TAG not set, authenticated tests will fail\n";

    TestSuite suite(HOST, PORT);
    registerTests(suite, tag);

    std::cout << "Running " << suite.size() << " requests against http://"
                << HOST << ":" << PORT << "\n\n";

    Report report = suite.run();

    double previous = Report::lastRate(HISTORY_FILE);
    report.print(std::cout, previous);
    report.appendHistory(HISTORY_FILE);

    return report.failed() ? 1 : 0;
}


/*

// T(group, name, method, path, expectedStatus, headers, body, bodyContains)
suite.add(T("collectives", "list", "GET", "/api/collectives", 200, auth));










*/