window.console = (function (origConsole) {

    if (!window.console || !origConsole) {
        origConsole = {};
    }

    var isDebug = false, isSaveLog = false,
        logArray = {
            nEntry: 1,
            logs: {},
            errors: [],
            warns: [],
            infos: []
        };

    return {
        log: function () {
            this.addLog(arguments);
            isDebug && origConsole.log && origConsole.log.apply(origConsole, arguments);
        },
        warn: function () {
            this.addLog(arguments);
            isDebug && origConsole.warn && origConsole.warn.apply(origConsole, arguments);
        },
        error: function () {
            this.addLog(arguments);
            isDebug && origConsole.error && origConsole.error.apply(origConsole, arguments);
        },
        info: function (v) {
            this.addLog(arguments);
            isDebug && origConsole.info && origConsole.info.apply(origConsole, arguments);
        },
        debug: function (bool) {
            isDebug = bool;
        },
        saveLog: function (bool) {
            isSaveLog = bool;
        },
        addLog: function (arguments) {
            if (!isSaveLog) {
                return;
            }
            var sKey = logArray.nEntry + "-" + new Date().toISOString();
            logArray.nEntry++;
            logArray.logs[sKey] = arguments[0];
        },
        logArray: function () {
            return logArray;
        },
        saveToBitBucket: function(sBbAccount, sComponent, sTitle, sUser) {
            var http = new XMLHttpRequest();
            var url = "https://bitbucket.org/api/1.0/repositories/" + sBbAccount + "/" + sComponent +"/issues/";
            var params = "title="+ encodeURI(sTitle)+
            "&user="+encodeURI(sUser)+
            "&content=" + encodeURI(JSON.stringify(console.logArray().logs));
            http.open('POST', url, true);

            //Send the proper header information along with the request
            http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            http.setRequestHeader("Authorization", "Basic eXNhYXNpc3N1ZXM6U2VjcmV0NTU=");

            http.onreadystatechange = function() {//Call a function when the state changes.
                if(http.readyState == 4 && http.status == 200) {
                    console.log(http.responseText);
                }
            }
            http.send(params);
        }
    };

}(window.console));
