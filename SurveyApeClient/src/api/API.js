const api = 'http://localhost:8080';

const headers = {
    'Accept': 'application/json'
};

export const createSurvey = (payload) =>
    fetch(`${api}/survey/create`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
    }).then(res => {
        console.log(res);
        return res;
    }).catch(error => {
        console.log("This is error");
        return error;
    });

export const registerUser = (payload) =>
    fetch(`${api}/user/signup`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
    }).then(res => {
        console.log(res);
        return res;
    }).catch(error => {
        console.log("This is error");
        return error;
    });

    export const verifyUser = (data) =>
        fetch(`${api}/user/verify`, {
            method: 'POST',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(data)
        }).then(res => {
            console.log(res);
            return res;
        }).catch(error => {
            console.log("This is error");
            return error;
        });

        export const signIn = (data) =>
            fetch(`${api}/user/login`, {
                method: 'POST',
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(data)
            }).then(res => {
                console.log(res);
                return res;
            }).catch(error => {
                console.log("This is error");
                return error;
            });

            export const submitResponses = (data) =>
                fetch(`${api}/user/submitSurvey`, {
                    method: 'POST',
                    headers: {
                        ...headers,
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(data)
                }).then(res => {
                    console.log(res);
                    return res;
                }).catch(error => {
                    console.log("This is error");
                    return error;
                });
