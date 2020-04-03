# azure-jmeter-tests-csl
# Overview
This repo contains the necessary scripts, tools and JMeter plans for performance testing on CSL.

## Getting started
### Prerequisites
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

### Jenkins job parameters

Parameters required to be passed from the Jenkins job to the JMeter test plan in the user.properties file in format `propertyname=stringvalue`

> base_url_identity_service: base url for the login and signup site
> base_url_lpg_service: base url for the main site
> base_url_management_service: base url for management site
> NumOfSlaves: This is the number of workers for the test rig  
> numThreads: Number of threads 
> rampUp: Ramp Up value in seconds
> loopCount: Number of times for each thread to run through test scenarios 
> numUserJourneys: Number of user journeys (used primarily for summary)
> customLogOutputEnabled: whether to capture log entries from JMX test plan
> userJourney_1_split: Mandatory course journey INTEGER thread distribution percentages among user journeys 
> userJourney_2_split: Suggestions For You journey INTEGER thread distribution percentages among user journeys 
> userJourney_3_split: LearningRecord journey INTEGER thread distribution percentages among user journeys 
> userJourney_4_split: Add Course To Learning Plan journey INTEGER thread distribution percentages among user journeys 
> userJourney_5_split: Do A Course journey INTEGER thread distribution percentages among user journeys 
> userJourney_6_split: Profile amendments journey INTEGER thread distribution percentages among user journeys 
> userJourney_7_split: MI Reporting journey INTEGER thread distribution percentages among user journeys 
> userJourney_8_split: Search journey INTEGER thread distribution percentages among user journeys 
> userJourney_9_split: Profile sign up journey INTEGER thread distribution percentages among user journeys 
> userJourney_10_split: Course management journey INTEGER thread distribution percentages among user journeys 
> userJourney_11_split: booking journey INTEGER thread distribution percentages among user journeys 
> testName: report title for Blazemeter report
> bzmProjectID: Blazemeter project ID
> bzmAPIKeyAndSecret: Blazemeter plugin key and secret  
> branch: The GitHub branch from which to pull the test files from the Repo 
> failed_logging_enabled: additional logging of failed JMeter requests  
> wait_multiplier: Ability to multiply the wait times by a factor (to increase or decrease 'think time' between test actions) 
> line_manager_email: Line manager to assign in profile setup journey. Must be an existing user in both identity.identity and csrs.identity tables
> mysql_host: FQDN of the mysql host (needed for JDBC preprocessor for resetting user data)
> mysql_user: username with which to connect to the mysql_host
> mysql_pwd: encrypted password user for connecting to mysql_host (uses plugin)
> mysql_port: TCP Port used to connect to mysql_host


### Data files

Data files containing test user login data (users, signin-users, admin-users) are resolved by the JMeter test startup script by pulling the encrypted csv from Azure blob storage

1. users.csv, admin-users.csv (username, password)

```test01@example.com,Perf7890```

2. search-keywords.csv (search-uri)

```/search?q=success+profiles```

3. signin-users.csv (This is for the profile setup journey and these users should only have data in the identity and identity_role tables)

```newuser001@example.com,Perf7890```

_You can use the create-signin-users.js nodejs app to create these users_


### Data reset for profile signup journeys

A JDBC preprocessor has been included that will reset data for signup users after the profile signup journey has been completed, by deleting profile data in the `csrs` schema for users whose username begins with 'New User'

See `JDBC PreProcessor` inside the setup group `tg_Setup`