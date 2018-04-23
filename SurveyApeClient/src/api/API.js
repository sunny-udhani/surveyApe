const api = 'http://localhost:8080';

const headers = {
    'Accept': 'application/json'
};

export const doRegister = (payload) =>
    fetch(`${api}/registerUser`, {
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

export const doLogin = (payload) =>
    fetch(`${api}/checkLogin`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
    }).then(res => {
        return res;
    })
        .catch(error => {
            console.log("This is error");
            return error;
        });

export const doLogout = () =>
    fetch(`${api}/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        }
    }).then(res => {
        return res;
    })
        .catch(error => {
            console.log("This is error");
            return error;
        });
