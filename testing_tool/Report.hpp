#pragma once
#include <iosfwd>
#include <string>
#include <vector>
#include "TestResult.hpp"

class Report {
public:
    void add(const TestResult& r);

    size_t total() const;
    size_t passed() const;
    size_t failed() const;
    double rate() const;                                   // 0..100
    const std::vector<TestResult>& results() const;

    void print(std::ostream& os, double previousRate = -1.0) const;

    // CSV history: timestamp,total,passed,failed,rate
    bool appendHistory(const std::string& path) const;
    static double lastRate(const std::string& path);       // -1 if none
private:
    std::vector<TestResult> results_;
};
