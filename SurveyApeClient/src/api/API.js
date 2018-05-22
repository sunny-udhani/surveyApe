import axios from 'axios';
const api = 'http://localhost:8080';


const headers = {
    'Accept': 'application/json'
};

export const submitResponse = (data) =>
    fetch(`${api}/user/submitSurvey`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
    }).then(res => {
        console.log(res.body);
        return res.json();
    }).catch(error => {
        console.log("This is error");
        return error;
    });


export const PublishSurvey1 = (payload) =>
    fetch(`${api}/survey/publish/${payload.surveyId}`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
    }).then(res => {
        console.log(res.body);
        return res.json();
    }).catch(error => {
        console.log("This is error");
        return error;
    });

export const exportAsJSON = (payload) =>
    fetch(`${api}/survey/export/${payload.surveyId}?filename=${payload.filename}`, {
        method: 'GET',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        // body: JSON.stringify(payload)
    }).then(res => {
        // console.log(res.body);
        return res;
    }).catch(error => {
        console.log("This is error");
        return error;
    });

export const importJSON = (surveyId, payload) =>
    fetch(`${api}/survey/import/${surveyId}`, {
        method: 'POST',
        headers: {
            ...headers,
        },
        credentials: 'include',
        body: payload
    }).then(res => {
        // console.log(res.body);
        return res;
    }).catch(error => {
        console.log("This is error");
        return error;
    });

export const endSurvey = (data) =>
    fetch(`${api}/survey/endSurvey/${data}`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({surveyId: data, endSurvey: true})
    }).then(res => {
        console.log(res.body);
        return res.json();
    }).catch(error => {
        console.log("This is error");
        return error;
    });



export const getMySurveys = () =>
    fetch(`${api}/survey/surveyor/getAll`, {
        method: 'GET',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true'

        },
        credentials: 'include'
    }).then(res => {
        console.log(res);
        return res.json();
    }).catch(error => {
        console.log("This is error");
        return error;
    });




export const getSurvey = (id) =>
    fetch(`${api}/survey/surveyor/getSurvey/` + id, {
        method: 'GET',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true'

        },
        credentials: 'include'
    }).then(res => {
        console.log(res);
        return res.json();
    }).catch(error => {
        console.log("This is error");
        return error;
    });


export const editSurvey = (payload, id) =>
    fetch(`${api}/survey/edit/${id}`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
    }).then(res => {
        console.log(res);
        return res.json();
    }).catch(error => {
        console.log("This is error");
        return error;
    });

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
        return res.json();
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
        console.log("Inside res of SignIn--API");
        console.log(res);
        console.log("whether data accessible:");
        console.log(data);
        res.dataOpen = data.dataOpen;
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


export const getSurvey1 = (id) =>
    fetch(`${api}/survey/surveyor/getSurvey/` + id, {
        method: 'GET',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    }).then(res => {
        console.log(res);
        return res.json();
    }).catch(error => {
        console.log("This is error");
        return error;
    });

                    export const assignedSurveys = (id) =>
                        fetch(`${api}/survey/surveyee/getAll`, {
                            method: 'GET',
                            headers: {
                                ...headers,
                                'Content-Type': 'application/json'
                            },
                            credentials: 'include'
                        }).then(res => {
                            console.log(res);
                            return res.json();
                        }).catch(error => {
                            console.log("This is error");
                            return error;
                        });

                        export const surveyeeSurveys = (id) =>
                            fetch(`${api}/surveyee/survey/getAll`, {
                                method: 'GET',
                                headers: {
                                    ...headers,
                                    'Content-Type': 'application/json'
                                },
                                credentials: 'include'
                            }).then(res => {
                                console.log(res);
                                return res.json();
                            }).catch(error => {
                                console.log("This is error");
                                return error;
                            });

export const getSurveyId = (payload) =>
    fetch(`${api}/surveyee/getSurvey/uri`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
    }).then(res => {
        console.log(res.body);
        return res.json();
    }).catch(error => {
        console.log("This is error");
        return error;
    });


export const getSurveyAndResp = (payload) =>
    fetch(`${api}/surveyee/getSurvey/id`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
    }).then(res => {
        return res.json();
    }).catch(error => {
        console.log("This is error");
        return error;
    });



export const addInvitees = (payload) =>
    fetch(`${api}/survey/addAttendees/` + payload.surveyId, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
    }).then(res => {
        console.log(res.body);
        return res;
    }).catch(error => {
        console.log("This is error");
        return error;
    });

                            export const sendOneResp = (payload) =>
                                fetch(`${api}/surveyee/responses/question/answer`, {
                                  method: 'POST',
                                  headers: {
                                      ...headers,
                                      'Content-Type': 'application/json'
                                  },
                                  credentials: 'include',
                                  body: JSON.stringify(payload)
                              }).then(res => {
                                console.log("Inside res of sendOneResp: ");
                                  console.log(res);
                                  return res;
                              }).catch(error => {
                                  console.log("This is error");
                                  return error;
                              });

                            export const fetchSurveyIdOpen = (payload) =>

                                fetch(`${api}/surveyee/open/getSurvey/uri`, {
                                    method: 'POST',
                                    headers: {
                                        ...headers,
                                        'Content-Type': 'application/json'
                                    },
                                    credentials: 'include',
                                    body: JSON.stringify(payload)
                                }).then(res => {
                                  console.log("Data fetched after calling fetchSurveyIdOpen: ");

                                    console.log(res);
                                  //  res.surveyId = "297ee401637bac7c01637bae82f40000";
                                    return res.json();
                                }).catch(error => {
                                    console.log("This is error");
                                    return error;
                                });

export const sendEmailUrlSurveyId = (payload) =>
    fetch(`${api}/surveyee/open/create/surveyResponse/`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
    }).then(res => {
        console.log("Data fetched after calling sendEmailUrlSurveyId: ");

                                        console.log(res);
                                        return res.json();

                                    }).catch(error => {
                                        console.log("This is error");
                                        return error;
                                    });

                                    export const logout = () =>
                                        fetch(`${api}/user/logout`, {
                                            method: 'POST',
                                            headers: {
                                                ...headers,
                                                'Content-Type': 'application/json'
                                            },
                                            credentials: 'include',

                                        }).then(res => {
                                          console.log("Inside logout in API ");

                                            console.log(res);
                                            return res;

                                        }).catch(error => {
                                            console.log("This is error");
                                            return error;
                                        });
