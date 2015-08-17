export default class Controller {
    constructor(myLogs) {
        this.success = null;
        this.myLogs = myLogs;
    }

    getLogs () {
        return this.myLogs.get()
            .then(
            (response) => {
                this.success = response;
                return response;
            }
        );
    }
}