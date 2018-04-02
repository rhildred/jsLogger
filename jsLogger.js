window.console = (function (origConsole) {

    if (!window.console || !origConsole) {
        origConsole = {};
    }

    if(localStorage.getItem("guid") == null){
        localStorage.setItem("guid", uuid.v4());
    }
    var isDebug = false, isSaveLog = false,
        oFirebase = new Firebase('https://dazzling-heat-1553.firebaseio.com/logs/' + localStorage.getItem("guid"));

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
            if(typeof(arguments[0]) != "object"){
                arguments[0] = {message: arguments[0]};
            }
            arguments[0].timestamp = new Date().toISOString();
            oFirebase.push().set(arguments[0]);
        }
    };

}(window.console));
