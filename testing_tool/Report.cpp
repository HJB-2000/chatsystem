#include "Report.hpp"
#include <ctime>
#include <fstream>
#include <iomanip>
#include <iostream>
#include <map>
#include <sstream>

void Report::add(const TestResult& r) { results_.push_back(r); }
size_t Report::total() const { return results_.size(); }
size_t Report::passed() const {
    size_t n = 0;
    for (const auto& r : results_) n += r.passed;
    return n;
}
size_t Report::failed() const { return total() - passed(); }
double Report::rate() const { return total() ? 100.0 * passed() / total() : 0.0; }
const std::vector<TestResult>& Report::results() const { return results_; }

static const char* GREEN = "\033[32m";
static const char* RED = "\033[31m";
static const char* DIM = "\033[2m";
static const char* RESET = "\033[0m";

void Report::print(std::ostream& os, double previousRate) const {
    os << std::fixed << std::setprecision(1);

    for (const auto& r : results_) {
        os << (r.passed ? GREEN : RED) << (r.passed ? "[PASS] " : "[FAIL] ") << RESET
           << r.test.group << " / " << r.test.name << DIM << "  "
           << r.test.method << " " << r.test.path << "  " << r.status << "  "
           << r.ms << "ms" << RESET << "\n";
    }

    // per group
    std::map<std::string, std::pair<size_t, size_t>> groups;  // group -> {passed,total}
    for (const auto& r : results_) {
        auto& g = groups[r.test.group];
        g.first += r.passed;
        g.second += 1;
    }
    os << "\nBy group:\n";
    for (const auto& [name, g] : groups)
        os << "  " << std::left << std::setw(14) << name << g.first << "/" << g.second
           << "  (" << (100.0 * g.first / g.second) << "%)\n";

    // failures
    if (failed()) {
        os << "\n" << RED << "Failed:" << RESET << "\n";
        for (const auto& r : results_) {
            if (r.passed) continue;
            os << "  - " << r.test.group << " / " << r.test.name << "\n"
               << "      " << r.test.method << " " << r.test.path << "\n"
               << "      " << r.reason << "\n";
        }
    }

    os << "\nTotal " << total() << "  Passed " << passed() << "  Failed " << failed()
       << "  Success " << rate() << "%";
    if (previousRate >= 0) {
        double d = rate() - previousRate;
        os << "  (" << (d >= 0 ? "+" : "") << d << " vs last run)";
    }
    os << "\n";
}

bool Report::appendHistory(const std::string& path) const {
    bool fresh = !std::ifstream(path).good();
    std::ofstream f(path, std::ios::app);
    if (!f) return false;
    if (fresh) f << "timestamp,total,passed,failed,rate\n";
    char ts[32];
    std::time_t t = std::time(nullptr);
    std::strftime(ts, sizeof ts, "%Y-%m-%d %H:%M:%S", std::localtime(&t));
    f << ts << "," << total() << "," << passed() << "," << failed() << ","
      << std::fixed << std::setprecision(1) << rate() << "\n";
    return true;
}

double Report::lastRate(const std::string& path) {
    std::ifstream f(path);
    if (!f) return -1.0;
    std::string line, last;
    while (std::getline(f, line))
        if (!line.empty() && line.rfind("timestamp", 0) != 0) last = line;
    if (last.empty()) return -1.0;
    size_t pos = last.rfind(',');
    if (pos == std::string::npos) return -1.0;
    try { return std::stod(last.substr(pos + 1)); } catch (...) { return -1.0; }
}
