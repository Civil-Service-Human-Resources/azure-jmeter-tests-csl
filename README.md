# azure-jmeter-tests-csl
# Overview
This repo contains the necessary scripts, tools and JMeter plans for performance testing on CSL.

## Getting started
## Prerequisites
Please have the following tools installed before proceeding:
* brew
* Java JDK/JRE 8 

### Installation 
#### JMeter installation
Download JMeter via brew
```
brew install jmeter
```
Take a note of the install location of JMeter from brew (e.g. `/usr/local/Cellar/jmeter/5.2`)

Copy JMeter plugins from this repo to the `lib` folder of JMeter
```
cd plugins/lib
cp jmeter-plugins-cmn-jmeter-0.4.jar /usr/local/Cellar/jmeter/5.2/libexec/lib/  

cd plugins/lib/ext
cp * /usr/local/Cellar/jmeter/5.2/libexec/lib/ext/
```

Run JMeter
```
jmeter
```

#### Editing JMeter scripts
With the JMeter GUI client, click `File > Open` and select `csl-jmeter-test-plan.jmx`


## JMeter how to guide

For more information please refer to the Apache JMeter documentation [here](https://jmeter.apache.org/usermanual/remote-test.html)

### What's included

1. JMeter test plan (csl-jmeter-test-plan.jmx)
2. Custom user properties file (user.properties)
3. Folder which contains data files (data/)
4. A traget environment to run the test 

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

The user properties file is self explanatory. I have covered a subset of the configuration options below

### Environment details

* ```base_url_identity_service=<staging-identity.cshr.digital>```
* ```base_url_lpg_service=<staging-lpg.cshr.digital>```

### Reporting

Blazemeter plugin has been integrated in JMeter to be able to upload stats. Following are the configurations related to reporting.

* ```testName=QuickTest```
* ```bzmProjectID=<BlazeMeterProjectID>```
* ```bzmAPIKeyAndSecret=<BlazeMeterKeyId:Secret>```

