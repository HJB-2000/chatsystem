#pragma once
#include <string>
#include "TestCase.hpp"

struct TestResult {
    TestCase test;
    bool passed = false;
    int status = 0;          // 0 = no HTTP response (connection error / timeout)
    long long ms = 0;
    std::string reason;      // empty when passed
};
