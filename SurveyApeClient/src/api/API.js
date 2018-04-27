const api = 'http://10.0.0.243:8080';

const headers = {
    'Accept': 'application/json'
};

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
