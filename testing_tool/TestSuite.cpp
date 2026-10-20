#include "TestSuite.hpp"
#include <chrono>
#include <sstream>
#include "httplib.h"

TestSuite::TestSuite(std::string host, int port) : host_(std::move(host)), port_(port) {}

TestSuite& TestSuite::add(const TestCase& t) {
    tests_.push_back(t);
    return *this;
}
size_t TestSuite::size() const { return tests_.size(); }
const std::vector<TestCase>& TestSuite::tests() const { return tests_; }

static TestResult runOne(httplib::Client& cli, const TestCase& t) {
    TestResult out;
    out.test = t;

    httplib::Request req;
    req.method = t.method;
    req.path = t.path;
    for (const auto& [k, v] : t.headers) req.set_header(k, v);
    if (!t.body.empty()) {
        req.body = t.body;
        req.set_header("Content-Type", t.contentType);
    }

    auto start = std::chrono::steady_clock::now();
    auto res = cli.send(req);
    out.ms = std::chrono::duration_cast<std::chrono::milliseconds>(
                std::chrono::steady_clock::now() - start).count();

    if (!res) {
        out.status = 0;
        out.reason = "no response: " + httplib::to_string(res.error());
        return out;
    }

    out.status = res->status;
    std::ostringstream why;
    if (res->status != t.expectedStatus)
        why << "expected status " << t.expectedStatus << ", got " << res->status;
    if (!t.bodyContains.empty() && res->body.find(t.bodyContains) == std::string::npos) {
        if (why.tellp() > 0) why << "; ";
        why << "body missing \"" << t.bodyContains << "\"";
    }
    out.reason = why.str();
    out.passed = out.reason.empty();
    return out;
}

Report TestSuite::run() const {
    httplib::Client cli(host_, port_);
    cli.set_connection_timeout(2);
    cli.set_read_timeout(5);

    Report report;
    for (const auto& t : tests_) report.add(runOne(cli, t));
    return report;
}
