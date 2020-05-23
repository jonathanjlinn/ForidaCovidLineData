(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "county",
            alias: "county",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "age",
            alias: "age",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "age_group",
            alias: "age_group",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "gender",
            alias: "gender",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "jurisdiction",
            alias: "jurisdiction",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "travel_related",
            alias: "travel_related",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "origin",
            alias: "origin",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "edvisit",
            alias: "edvisit",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "hospitalized",
            alias: "hospitalized",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "died",
            alias: "died",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "case_",
            alias: "case",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "contact",
            alias: "contact",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "case1",
            alias: "case1",
            dataType: tableau.dataTypeEnum.datetime
        }, {
            id: "eventDate",
            alias: "eventDate",
            dataType: tableau.dataTypeEnum.datetime
        }, {
            id: "chartDate",
            alias: "chartDate",
            dataType: tableau.dataTypeEnum.datetime
        }, {
            id: "id",
            alias: "id",
            dataType: tableau.dataTypeEnum.int
        }];

        var tableInfo = {
            id: "covidFeed",
            alias: "Florida Covid Cases",
            columns: cols
        };

        schemaCallback([tableInfo]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        
        var maxVal = 100000;
        var incrementalVal = 2000;
        var lowerBound = 0;
        var upperBound = 2000;
        
        var county ="",
            age = 0,
            age_group = "",
            gender ="",
            jurisdiction = "",
            travel_related = "",
            origin = "",
            edvisit = "",
            hospitalized = "",
            died = "",
            case_ = "",
            contact = "",
            case1 = "",
            eventDate = "",
            chartDate = "",
            id = "";
    
        for(var j = upperBound; j <= maxVal; j+= incrementalVal ) {
            $.ajax({
                dataType: "json",
                url: "https://services1.arcgis.com/CY1LXxl9zlJeBuRZ/arcgis/rest/services/Florida_COVID19_Case_Line_Data_NEW/FeatureServer/0/query?where=objectid>" + (j-incrementalVal) + "&objectid<=" + j + "&outFields=*&outSR=4326&f=json",
                async: true,
                success: function (resp) {
                    var feat = resp.features,
                        tableData = [];
                
                    // Iterate over the JSON object
                    for (var i = 0, len = feat.length; i < len; i++) {
                        county = feat[i].attributes.County;
                        age = feat[i].attributes.Age;
                        age_group = feat[i].attributes.Age_group;
                        gender = feat[i].attributes.Gender;
                        jurisdiction = feat[i].attributes.Jurisdiction;
                        travel_related = feat[i].attributes.Travel_related;
                        origin = feat[i].attributes.Origin;
                        edvisit = feat[i].attributes.EDvisit;
                        hospitalized = feat[i].attributes.Hospitalized;
                        died = feat[i].attributes.Died;
                        case_ = feat[i].attributes.Case_;
                        contact = feat[i].attributes.Contact;
                        case1 = new Date(feat[i].attributes.Case1);
                        eventDate = new Date(feat[i].attributes.EventDate);
                        chartDate = new Date(feat[i].attributes.ChartDate);
                        id = feat[i].attributes.ObjectId;
                    
                    
                        tableData.push({
                            "county": county,
                            "age": age,
                            "age_group": age_group,
                            "gender": gender,
                            "jurisdiction": jurisdiction,
                            "travel_related": travel_related,
                            "origin": origin,
                            "edvisit": edvisit,
                            "hospitalized": hospitalized,
                            "died": died,
                            "case_": case_,
                            "contact": contact,
                            "case1": case1,
                            "eventDate": eventDate,
                            "chartDate": chartDate,
                            "id": id
                        });
                    
                    }
                
                
                    table.appendRows(tableData);
                
                },
            });
            
        }doneCallback();};

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        translateButton();
        $("#submitButton").click(function() {
            tableau.connectionName = "Florida COVID Line Data"; // This will be the data source name in Tableau
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
