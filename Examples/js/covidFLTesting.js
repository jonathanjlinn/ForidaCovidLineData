(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "date",
            alias: "date",
            dataType: tableau.dataTypeEnum.date
        }, {
            id: "positive",
            alias: "positive",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "negative",
            alias: "negative",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "totalTestResults",
            alias: "totalTestResults",
            dataType: tableau.dataTypeEnum.int
        }];

        var tableInfo = {
            id: "testingFeed",
            alias: "Florida Covid Testing",
            columns: cols
        };

        schemaCallback([tableInfo]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        
        var maxVal = 75000;
        var incrementalVal = 2000;
        var lowerBound = 0;
        var upperBound = 2000;
        
        var date ="";
        var positive ="";
        var negative ="";
        var totalTestResults ="";
    
        // for(var j = upperBound; j <= maxVal; j+= incrementalVal ) {
            $.ajax({
                dataType: "json",
                url: "https://covidtracking.com/api/v1/states/FL/daily.json",
                async: false,
                success: function (resp) {
                    var feat = resp.features,
                        tableData = [];
                
                    // Iterate over the JSON object
                    for (var i = 0, len = resp.length; i < len; i++) {
                        date = resp[i].date;
                        positive = resp[i].positive;
                        negative = resp[i].negative;
                        totalTestResults = resp[i].totalTestResults;
    
    
                        var dateString  = date.toString();
                        var year        = dateString.substring(0,4);
                        var month       = dateString.substring(4,6);
                        var day         = dateString.substring(6,8);
    
                        var newdate        = new Date(year, month-1, day);
                        
                    
                    
                        tableData.push({
                            "date": newdate,
                            "positive": positive,
                            "negative": negative,
                            "totalTestResults": totalTestResults
                        });
                    
                    }
                
                
                    table.appendRows(tableData);
                
                },
            });
            
        // }
        doneCallback();
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        translateButton();
        $("#submitButton").click(function() {
            tableau.connectionName = "Florida COVID Testing Data"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();

// Values attached to the tableau object are loaded asyncronously.
// Here we poll the value of locale until it is properly loaded
// and defined, then we turn off the polling and translate the text.
var translateButton = function() {
    var pollLocale = setInterval(function() {
        if (tableau.locale) {
            switch (tableau.locale) {
                case tableau.localeEnum.china:
                    $("#submitButton").text("获取地震数据");
                    break;
                case tableau.localeEnum.germany:
                    $("#submitButton").text("Erhalten Erdbebendaten!");
                    break;
                case tableau.localeEnum.brazil:
                    $("#submitButton").text("Obter Dados de Terremoto!");
                    break;
                case tableau.localeEnum.france:
                    $("#submitButton").text("Obtenir les Données de Séismes!");
                    break;
                case tableau.localeEnum.japan:
                    $("#submitButton").text("地震データの取得");
                    break;
                case tableau.localeEnum.korea:
                    $("#submitButton").text("지진 데이터 가져 오기");
                    break;
                case tableau.localeEnum.spain:
                    $("#submitButton").text("Obtener Datos de Terremotos!");
                    break;
                default:
                    $("#submitButton").text("Get Earthquake Data!");
            }
            clearInterval(pollLocale);
        }
    }, 10);
};
