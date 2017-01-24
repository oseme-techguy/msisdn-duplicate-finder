/**
 * Created by osemeodigie on 24/01/2017.
 */

var file_system    = require("fs")
var readlines = require('readlines');

console.log("Started the msisdn duplicate finder file...")

// Edit this object to include your own names of the relevant files used and generated...
var files_to_process = {
    "first": "first_batch.csv",
    "second": "second_batch.csv",
    "duplicates": "duplicate_batch.csv",
}

var Duplicate = {};

var write_to_csv_file = function(file, data_on_line){
    file_system.appendFile(file, data_on_line+"\r\n", function (err) {
        console.log("Success: wrote duplicate msisdn to file...")
    });
}

var _extract_msisdn_from_csv = function(file,callback){
    var lines = readlines.readlinesSync(file);  // || Time Complexity => O(n)
   // lines = lines[0].split("\r")  // hack to cover case of the way I converted excel to csv... delimited by \r
    var entries = []
    for(var i=0; i < lines.length; i++){ // || Time Complexity => O(n)
        if (lines[i]) { // ignore empty lines...
            var msisdn = lines[i].replace(/\|\s*$/, ""); // remove the last pipe sign from the end of the string;
            entries.push(parseInt(msisdn)); // push number equivalent into array...
        }
    }
    return callback(entries);
}


_extract_msisdn_from_csv("./files_for_jobs/"+files_to_process.first, function (first_entries){

    console.log("\n\n First Extracted Entries: \n\n")
    console.log(first_entries)

    first_array = first_entries;
    _extract_msisdn_from_csv("./files_for_jobs/"+files_to_process.second, function (second_entries) {

        second_array = second_entries;

        console.log("\n\n Second Extracted Entries: \n\n")
        console.log(second_entries)

        // do the pigeon hole count here... // duplicate counter...

        for(var i = 0; i < first_entries.length; i++){ // go through first list  || Time Complexity => O(n)

            if(Duplicate[parseInt(first_entries[i])] == undefined){
                Duplicate[parseInt(first_entries[i])] = 1; // mark all positions of occurances
            }
            else{
                Duplicate[parseInt(first_entries[i])] ++; // mark all positions of duplicates
            }
        }

        for(var j = 0; j < second_entries.length; j++){ // go through second list || Time Complexity => O(n)

            if(Duplicate[parseInt(second_entries[j])] == undefined){
                Duplicate[parseInt(second_entries[j])] = 1; // mark all positions of occurances
            }
            else{
                Duplicate[parseInt(second_entries[j])] ++; // mark all positions of duplicates
            }
        }

        console.log("Duplicate Numbers: ")
        for (var obj_key in Duplicate) { // || Time Complexity => O(n)
            if (Duplicate.hasOwnProperty(obj_key) && Duplicate[obj_key] > 1) {
                console.log(obj_key + " -> " + Duplicate[obj_key]);
                write_to_csv_file("./files_for_jobs/"+files_to_process.duplicates, obj_key); //write duplicate to file
            }
        }
    });
})
