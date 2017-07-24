# Lead Finder
running ->
  The script that you will be using is bot0.js.  It takes 3 arguments (keyword,city,fileName), the fileName argument is optional.  If you are trying to develop an aggregate csv of results it is probably best to not supply this argument.  
  
  Examples
  
  get results for food in los angeles:
    node bot0.js "food" "los angeles"
  
  get results for auto repair dallas and save to a diffent csv called "auto.csv":
    node bot0.js "auto repair" "dallas" "auto"
    
    *** what if you want to add results for san antonio to this csv? ***
     node bot0.js "auto repair" "san antonio" "auto"
  
  The default file name is Data.csv and it located in the data folder.
  The python file was used to scrape the cities into an excel file ( found in the data folder ).
    
