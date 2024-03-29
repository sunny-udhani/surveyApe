import React, {Component} from 'react';

import {BrowserRouter} from 'react-router-dom';
import Routing from "./Routing";

class App extends Component {
    render() {
        return (
            <div className="App" style={{height: "100%"}}>
                <BrowserRouter>
                    <Routing/>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;
