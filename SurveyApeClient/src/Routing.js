import React, {Component} from 'react';
import {Route, withRouter} from 'react-router-dom';

import Signup from './Signup';
import Signin from './Signin';
import Confirmation from './Confirmation';


class Routing extends Component {

  state={

  }

  gotoSignin = () => {
        this.props.history.push('/signin');
  };

  gotoSignup = () => {
        this.props.history.push('/');
  };

    render() {
        return (
            <div className="container-fluid" style={{backgroundColor:"white"}}>
                <Route exact path="/" render={() => (
                    <div>
                        <Signup  gotoSignin={this.gotoSignin}/>
                    </div>
                )}/>

                <Route exact path="/signin" render={() => (
                    <div>
                        <Signin gotoSignup={this.gotoSignup}/>
                    </div>
                )}/>

                <Route exact path="/confirmation" render={() => (
                    <div>
                        <Confirmation gotoSignin={this.gotoSignin}/>
                    </div>
                )}/>

            </div>
        );
    }
}

export default withRouter(Routing);
