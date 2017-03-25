export default class MyService {
    constructor ($q, $http) {
        this.$q = $q;
        this.$http = $http;
        this.logs = null;
    }

    get () {
        return this.$q((resolve, reject) => {
            this.$http.get("url")
            .then(
                (success) => {
                    this.logs = success;
                    return resolve(success);
                }
            );
        });
    }
}