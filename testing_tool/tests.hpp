#pragma once
#include <string>
#include "TestSuite.hpp"

// All backend requests live in tests.cpp. Add new ones there.
void registerTests(TestSuite& suite, const std::string& userTag);
