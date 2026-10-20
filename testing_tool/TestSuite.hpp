#pragma once
#include <string>
#include <vector>
#include "Report.hpp"
#include "TestCase.hpp"

class TestSuite {
public:
    TestSuite(std::string host, int port);

    TestSuite& add(const TestCase& t);     // chainable: suite.add(a).add(b);
    size_t size() const;
    const std::vector<TestCase>& tests() const;

    Report run() const;                    // runs every test in insertion order
private:
    std::string host_;
    int port_;
    std::vector<TestCase> tests_;
};
