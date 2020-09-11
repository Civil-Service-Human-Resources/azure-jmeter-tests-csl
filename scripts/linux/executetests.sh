#!/bin/bash -exv

YELLOW="\0033[33;33m"
NC='\033[0m' # No Color

TestProcess=$(pgrep -x jmeter)
if [[ $TestProcess ]];
then
	echo -e "${YELLOW}Ensuring JMeter on Master${NC}"
	killall -9 java jmeter
fi

mysql_host=$1
mysql_user=$2
mysql_pwd=$3
mysql_port=$4

echo -e "${YELLOW}***** Commencing to run test *****${NC}"
cd /opt/tests/azure-jmeter-tests-csl; rm -f jmeter.log; export JVM_ARGS="-Xms8g -Xmx8g"; nohup ../apache-jmeter-5.2/bin/jmeter -p user.properties -Jmysql_host=${mysql_host} -Jmysql_port=${mysql_port} -Jmysql_u=${mysql_user} -Jmysql_pw=${mysql_pwd} -n -t  csl-jmeter-test-plan.jmx -j testresult.log  -l jmeter.log > jmeter.log 2>jmeter-errors.log &


# Checking that the test is running
sleep 5
#pgrep -x jmeter
TestProcess=$(pgrep -x jmeter)
if [[ -z $TestProcess ]];
then
	echo $TestProcess
	echo -e "${YELLOW}Test has failed to run successfully${NC}"
else
	echo -e "${YELLOW}Test is currently running${NC}"
fi