import React, {Component} from 'react';
import * as API from '../api/API';
// import Aaj from "material-ui/Snackbar";

class Home extends Component{

    constructor(props) {
        super(props);
        this.state = {
        };

        this.handleSubmitLogout = this.handleSubmitLogout.bind(this);
    }

    componentWillMount(){
        console.log();
    }

    handleSubmitLogout() {
        this.props.handleSubmitLogout();
    }

    render(){

        return(
            <div className="container-fluid">
                <div className="row">
                {/*<Aaj/>*/}
                    <div className="col-md-10">
                        <br/>
                        <img src = "../../public/logo.png"></img> <h4 align={'justify'}>Home</h4>
                    </div>
                    <div className="col-md-2" align={'justify'}>
                        <div className='row'>
                            <ul style={{listStyleType: "decimal"}} id="dTab" className="nav">
                                <li><button className="btn btn-primary" onClick={() => this.handleSubmitLogout()}>Logout</button></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <br/>
            </div>

        );
    }

}

export default Home;