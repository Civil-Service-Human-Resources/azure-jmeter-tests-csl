// externalised test setup script used for defining test journey splits for thread groups
props.put("PASSED", "0");
props.put("FAILED", "0");
props.put("TOTAL_REQUESTS","0");
props.put("RESPONSE_TIME","0");
props.put("MAX_RESPONSE_TIME","0");

boolean CUSTOM_LOG_ENABLED = Boolean.parseBoolean(props.get("customLogOutputEnabled"));

int numThreads = props.get("numThreads") as int;
int numUserJourneys = props.get("numUserJourneys") as int;
int loopCount = props.get("loopCount") as int;

// reading in journey splits as integer percentages 0-100 to avoid float precision problems
int j1_percent = props.get("userJourney_1_split") as int;
int j2_percent = props.get("userJourney_2_split") as int;
int j3_percent = props.get("userJourney_3_split") as int;
int j4_percent = props.get("userJourney_4_split") as int;
int j5_percent = props.get("userJourney_5_split") as int;
int j6_percent = props.get("userJourney_6_split") as int;
int j7_percent = props.get("userJourney_7_split") as int;
int j8_percent = props.get("userJourney_8_split") as int;
int j9_percent = props.get("userJourney_9_split") as int;
int j10_percent = props.get("userJourney_10_split") as int;
int j11_percent = props.get("userJourney_11_split") as int;


int totalSplitPercent = 
  j1_percent + 
  j2_percent + 
  j3_percent + 
  j4_percent + 
  j5_percent + 
  j6_percent + 
  j7_percent + 
  j8_percent + 
  j9_percent +
  j10_percent +
  j11_percent;


log.info("------------ Test plan setup ------------");
log.info("Total user journeys             : " + numUserJourneys.toString());
log.info("Total thread count              : " + numThreads.toString());
log.info("Number of test journey loops    : " + loopCount.toString());
log.info("Total thread split              : " + totalSplitPercent.toString());
log.info("Test journey 1 split percentage : " + j1_percent.toString());
log.info("Test journey 2 split percentage : " + j2_percent.toString());
log.info("Test journey 3 split percentage : " + j3_percent.toString());
log.info("Test journey 4 split percentage : " + j4_percent.toString());
log.info("Test journey 5 split percentage : " + j5_percent.toString());
log.info("Test journey 6 split percentage : " + j6_percent.toString());
log.info("Test journey 7 split percentage : " + j7_percent.toString());
log.info("Test journey 8 split percentage : " + j8_percent.toString());
log.info("Test journey 9 split percentage : " + j9_percent.toString());
log.info("Test journey 10 split percentage: " + j10_percent.toString());
log.info("Test journey 11 split percentage: " + j11_percent.toString());
log.info("Custom log output enabled       : " + CUSTOM_LOG_ENABLED.toString());
log.info("-----------------------------------------");

if (numThreads < numUserJourneys){
  log.error(String.format("The numThreads (%d) must be greater than the number of journeys (%d)."), numThreads, numUserJourneys);
  log.error("Aborting the test.");
  
  ctx.getEngine().stopTest();
  return; 
}

if (totalSplitPercent != 100){
  log.error("Total journey split percentage must add up to 100.");
  log.error("Aborting the test.");
    
  ctx.getEngine().stopTest();
  return; 
}

// need to call toString from Long because int * int = long
String group1 = Long.toString(Math.round(j1_percent * numThreads / 100));
String group2 = Long.toString(Math.round(j2_percent * numThreads / 100));
String group3 = Long.toString(Math.round(j3_percent * numThreads / 100));
String group4 = Long.toString(Math.round(j4_percent * numThreads / 100));
String group5 = Long.toString(Math.round(j5_percent * numThreads / 100));
String group6 = Long.toString(Math.round(j6_percent * numThreads / 100));
String group7 = Long.toString(Math.round(j7_percent * numThreads / 100));
String group8 = Long.toString(Math.round(j8_percent * numThreads / 100));
String group9 = Long.toString(Math.round(j9_percent * numThreads / 100));
String group10 = Long.toString(Math.round(j10_percent * numThreads / 100));
String group11 = Long.toString(Math.round(j11_percent * numThreads / 100));

log.info("----------- Thread allocation -----------");
log.info("Thread group 1     : " + group1);
log.info("Thread group 2     : " + group2);
log.info("Thread group 3     : " + group3);
log.info("Thread group 4     : " + group4);
log.info("Thread group 5     : " + group5);
log.info("Thread group 6     : " + group6);
log.info("Thread group 7     : " + group7);
log.info("Thread group 8     : " + group8);
log.info("Thread group 9     : " + group9);
log.info("Thread group 10     : " + group10);
log.info("Thread group 11     : " + group11);
log.info("-----------------------------------------");

props.put("threadGroup_1", group1);
props.put("threadGroup_2", group2);
props.put("threadGroup_3", group3);
props.put("threadGroup_4", group4);
props.put("threadGroup_5", group5); 
props.put("threadGroup_6", group6);
props.put("threadGroup_7", group7);
props.put("threadGroup_8", group8);
props.put("threadGroup_9", group9);
props.put("threadGroup_10", group10);
props.put("threadGroup_11", group11);
