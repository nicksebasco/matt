from bs4 import BeautifulSoup
from requests import *
import xlwt

cities = []
doc = get("https://www.biggestuscities.com/").text
data = BeautifulSoup(doc,'html.parser')
tables = data.find_all("table",{"class":"table table-striped table-condensed"})
i = 0

for table in tables:
    for row in table.find_all("tr"):
        cells = row.find_all("td")
        if len(cells) > 2:
            i = i + 1
            print i,": ",str(cells[2].getText().strip()), ": ", str(cells[1].getText().strip())
            state = str(cells[2].getText().strip())
            city = str(cells[1].getText().strip())
            cities.append((state,city))

wb = xlwt.Workbook()
sheet = wb.add_sheet("cities")
fields = ["city","state","keyword"]

for field in range(len(fields)):
    sheet.write(0, field, fields[field])
for col in range(len(cities)):
    sheet.write(col+1, 0, cities[col][1])
    sheet.write(col+1, 1, cities[col][0])

wb.save("data/cities.xls")

print cities
