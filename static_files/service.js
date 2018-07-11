
/*
File Name: service.js

Description: This file contains the functions that handle that ajax calls to the server in order to retrieve needed data.

Parameters: 
    reqUrl: The url the ajax call will make a request in order to retrive appropriate data.
    status: The div id in which the data will be placed in for display.


Author: Bryle Castro
*/
function getData(reqUrl,status){
    $.ajax({
            url: reqUrl,
            type: 'GET',
            dataType: 'json',
            success: (data) => {
                $(status).html(JSON.stringify(data));         
            },
    });  
}




 