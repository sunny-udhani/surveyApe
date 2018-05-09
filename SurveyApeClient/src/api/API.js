import axios from 'axios';
const api = 'http://localhost:8080';


const headers = {
    'Accept': 'application/json'
};

/*
export const PublishSurvey1 = (id) =>{
  fetch(`${api}/survey/publish/${id}`, {
      method: 'POST',
      headers: {
          ...headers,
          'Content-Type': 'application/json'
      },
      credentials: 'include',
      body:JSON.stringify({surveyId:id,publish:true})
  }).then(res => {
      console.log(res);
    //  callback(res.json());
      return res.json();
  }).catch(error => {
      console.log("This is error");
      return error;
  });
}
*/

export const PublishSurvey1 = (id) =>{
  axios.post(`${api}/survey/publish/${id}`, {
    surveyId: id,
    publish: true
  })
  .then(function (response) {
    return response.body;
  })
  .catch(function (error) {
    console.log(error);
  });
}


export const endSurvey= (id) =>{
  fetch(`${api}/survey/endSurvey/${id}`, {
      method: 'POST',
      headers: {
          ...headers,
          'Content-Type': 'application/json'
      },
      credentials: 'include',
  }).then(res => {
      console.log(res);
      return res.json();
  }).catch(error => {
      console.log("This is error");
      return error;
  });
}

export const getMySurveys = () =>
    fetch(`${api}/survey/surveyor/getAll`, {
        method: 'GET',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true'

        },
        credentials:'include'
    }).then(res => {
        console.log(res);
        return res.json();
    }).catch(error => {
        console.log("This is error");
        return error;
    });




export const getSurvey = (id) =>
    fetch(`${api}/survey/surveyor/getSurvey/`+id, {
        method: 'GET',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true'

        },
        credentials:'include'
    }).then(res => {
        console.log(res);
        return res.json();
    }).catch(error => {
        console.log("This is error");
        return error;
    });


    export const editSurvey = (payload,id) =>
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


                export const getSurvey1 = (id) =>
                    fetch(`${api}/survey/surveyor/getSurvey/`+id, {
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

                    export const getSurveyId = (data) =>
                        fetch(`${api}/surveyee/getSurvey/uri`, {
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
