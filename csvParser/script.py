import os
import sys
import csv
import json

#JSON formatting:
# {
#     "xColumn": {
#         "title": "Country",
#         "type": "string"
#     },

#     "yColumn": {
#         "title": "IP",
#         "type": "string"
#     },

#     "zColumn": {
#         "title": "Times",
#         "type": "timestamp"
#     }
# }

# [
#     {
#         "x": "US",
#         "y": "10.0.0.1",
#         "z": "13403092191",
#         "subdata": {
#             "Type of Malware": "the bad kind",
#             "IoC": "C2 Dropper"
#         }
#     },
#     {
#         "x": "RU",
#         "y": "10.1.2.3",
#         "z": "13403092199",
#         "subdata": {
#             "Type of Malware": "the bad kind",
#             "IoC": "C2 Dropper"
#         }
#     }
# ]


#Set column definitions (this will be passed in eventually)
xArgument = "Country Code"
yArgument = "IOC"
zArgument = "Date"

#Store column value contexts
#https://realpython.com/python-csv/
filename = sys.argv[1]
with open(filename) as csv_file:                            #read in CSV file
    csv_reader = csv.reader(csv_file, delimiter=",")
    line_count = 0                                          #count lines
    
    column_titles = []                                      #create empty data containers
    column_contents = []
    for row in csv_reader:                                  #read in rows of CSV file
        if line_count == 0:                                 #add column titles to seperate struct
            for item in row:
                column_titles.append(item)
            line_count += 1
        elif line_count > 0:                                #put rest of data in other struct
            subcontents = []
            for item in row:
                subcontents.append(item)
            column_contents.append(subcontents)
            line_count += 1

#Remove first 4 bytes of (0,0) cell in CSV file
fix = column_titles[0]
l = len(fix)
fix = fix[(l-3):]
column_titles[0] = fix
#Define the first JSON objects

json_object_1 = {}
json_object_2 = []

#Begin assigning values to the first json object
#TODO: find way to assign 'type' values based off style of input
json_object_1['xColumn'] = {'title': xArgument, 'type': 'string'}
json_object_1['yColumn'] = {'title': yArgument, 'type': 'string'}
json_object_1['zColumn'] = {'title': zArgument, 'type': 'timestamp'} 

print(json_object_1)

#Begin assigning values to the second json object
counter = 0
xOffset = -1
yOffset = -1
zOffset = -1
for i in column_titles:
    if i == xArgument:
        xOffset = counter
    elif i == yArgument:
        yOffset = counter
    elif i == zArgument:
        zOffset = counter
    counter += 1

for row in column_contents:
    temp_json_object = {}
    object_subdata = {}
    temp_json_object['x'] = row[xOffset]
    temp_json_object['y'] = row[yOffset]
    temp_json_object['z'] = row[zOffset]
    #TODO: add subdata

    count=0
    for column in row:
        if count != xOffset and count != yOffset and count != zOffset:
            if column != "":
                object_subdata[column_titles[count]] = column
        count += 1
    temp_json_object['subdata'] = object_subdata


    json_object_2.append(temp_json_object)


#for i in json_object_2:
    #data = json.dumps(json_object_2)
    #print(i)

print(json.dumps(json_object_2))


