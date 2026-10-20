CXX      = c++
CXXFLAGS = -std=c++17 -Wall -Wextra -O1
SRC      = main.cpp TestSuite.cpp Report.cpp tests.cpp
HDR      = main.h TestCase.hpp TestResult.hpp Report.hpp TestSuite.hpp tests.hpp httplib.h

soulnet: $(SRC) $(HDR)
	$(CXX) $(CXXFLAGS) $(SRC) -o soulnet -pthread

clean:
	rm -f soulnet

.PHONY: clean
