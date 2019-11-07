# JMeter How to guide

for more information please refer to the Apache JMeter documentation [here](https://jmeter.apache.org/usermanual/remote-test.html)

### What's included

1. JMeter test plan (csl-jmeter-test-plan.jmx)
2. Custom user properties file (user.properties)
3. Folder which contains data files (data/)

* Users list (users.csv)
* Search URIs with keywords (search-keywords.csv)

### Dependencies

1. JMeter is installed on both client and the server nodes with identical version
2. JAVA (JRE) is installed on all nodes
3. The data files are populated with content and located in the data folder
4. Client node should have passwordless SSH access enabled to all server nodes

### How to run jmeter on a distributed environment with remote nodes

1. Make sure the data files are available on all jmeter server nodes
2. Start JMeter server on all server nodes
3. Start jmeter on the client node (see example below)

```nohup /opt/jmeter-5.1.1/bin/jmeter -p user.properties -n -t csl-jmeter-test-plan.jmx > jmeter.log 2>&1 &```

Also if you want to generate a JTL report you may append the below 

```-l <resultfile>.jtl```

### Data file content format

1. users.csv (username, password)

```test01@example.com,Perf7890```

2. search-keywords.csv (search-uri)

```/search?q=success+profiles```

### Reporting

Blazemeter plugin has been integrated in JMeter to be able to upload stats. Following are the configurations related to reporting.

* ```testName=QuickTest```
* ```bzmProjectID=<BlazeMeterProjectID>```
* ```bzmAPIKeyAndSecret=<BlazeMeterKeyId:Secret>```

