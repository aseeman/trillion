//by Qinpei Zhao
//http://cs.joensuu.fi/~zhao/Link/Similarity_strings.html
//the number of substring according to the q
function getGramsNumber(string, q) {
    return ((string.length + (q - 1) * 2 + 1) - q);
}

//from string to array
function stringToArray(str, q) {
    var strs = new Array();
    var strToArray = null;

    var steps = getGramsNumber(str, q);


    // add # to the string according t q

    if (q == 1) {
        strToArray = str;
    } else {
        for (var i = 1; i < q; i++) {

            if (i == 1) {
                strToArray = "#" + str + "#";
            } else {
                strToArray = "#" + strToArray + "#";
            }

        }
    }


    for (var j = 0; j < steps; j++) {
        strs[j] = strToArray.substr(j, q);
    }

    return strs;
} //end

function checkBlank(input_string) {
    //more than 1 blanks
    var re = /([   ]{1,})/g;
    //to one blank
    var r = input_string.replace(re, " ");
    return r;
}

function stringBlankCheck(input_string) {
    var temp = input_string.trim();
    var temp1 = checkBlank(temp);
    return temp1;
}

//remove duplicate element in the array
var unquie = function(array){

    var newArray = [], provisionalTable = {};
    for (var i = 0, item; (item = array[i]) != null; i++) {
        if (!provisionalTable[item]) {
            newArray.push(item);
            provisionalTable[item] = true;
        }
    }
    return newArray;
} //end

function getUnNormalisedSimilarity(s1, s2, q){
    var difference = 0;
    
    var string1 = stringBlankCheck(s1);
    var string2 = stringBlankCheck(s2);
    
    var array1 = new Array();
    var array2 = new Array();
    var array3temp = new Array();
    var array3 = new Array();
    
    array1 = stringToArray(string1, q);
    array2 = stringToArray(string2, q);
    array3temp = array1.concat(array2);
    
    //remove duplicate element in the array
    array3 = unquie(array3temp);
    
    for (var i = 0; i < array3.length; i++) {
        var token = array3[i].toLowerCase();
        var matchingQGrams1 = 0;
        var matchingQGrams2 = 0;
        
        for (var j = 0; j < array1.length; j++) {
            var array1temp = array1[j].toLowerCase();
            if (array1temp == token) {
                matchingQGrams1++;
            }
        }
        
        
        for (var k = 0; k < array2.length; k++) {
            var array2temp = array2[k].toLowerCase();
            if (array2temp == token) {
                matchingQGrams2++;
            }
        }
        
        if (matchingQGrams1 > matchingQGrams2) {
            difference += (matchingQGrams1 - matchingQGrams2);
            
        }
        else {
            difference += (matchingQGrams2 - matchingQGrams1);
        }
        
    }
    
    return difference;

}

export default function(s1, s2, q) {
    var array1, array2;

    var string1 = stringBlankCheck(s1);
    var string2 = stringBlankCheck(s2);

    array1 = stringToArray(string1, q);
    array2 = stringToArray(string2, q);

    var array1_steps = getGramsNumber(string1, q);
    var array2_steps = getGramsNumber(string2, q);

    var maxQGramsMatching = array1_steps + array2_steps;


    if (maxQGramsMatching == 0) {
        return 0.00;
    } else {
        return ((maxQGramsMatching - getUnNormalisedSimilarity(string1, string2, q)) / maxQGramsMatching).toFixed(4);
    }

}