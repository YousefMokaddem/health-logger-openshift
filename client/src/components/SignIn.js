import React, {Component} from 'react';
import {Link} from 'react-router-dom';

//material ui compnents
import TextField from '@material-ui/core/TextField';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';

class SignIn extends Component {
    
    state = {
        message: null
    }

    printErr = () => {
        if(this.state.message){
            return(
                <p>{this.state.message}</p>
            );
        }
    }

    signIn = (e) => {
        e.preventDefault();
        const email = e.target[0].value
        const password = e.target[1].value

        let headers = new Headers();

        headers.set('Authorization', 'Basic ' + Buffer.from(email + ":" + password).toString('base64'));
        headers.append('Content-Type', 'application/json');

        fetch(`/api/users`, {
            method: "GET",
            headers: headers
        })
            //if signIn successful, id will be returned from the api
            //we want to store this id in the state of the app so that the user can have permission
            .then(res => {
                if(res.status !== 200){
                    return res.json()
                    .then(res =>
                        this.setState({
                            message: res.message + " - Invalid email or password",
                            msg: true
                        })
                    );
                }else{
                    this.setState({
                        message: "Successfully signed in",
                        msg: true
                    });
                    res.json()
                        .then(res => {
                            this.props.setUser(email, headers, res.id, res.username);
                        })
                }
            });
    }

    //material ui vars
    styles = theme => ({
        textField: {
            marginLeft: theme.spacing.unit,
            marginRight: theme.spacing.unit,
            width: 200,
        },
        dense: {
            marginTop: 19,
        }
    });

    render(){
        return(
            <div>
                <form onSubmit={(e) => this.signIn(e)}>
        
                    <h2>Sign In</h2>
                    {this.printErr()}
        
                    <TextField
                    id="email"
                    label="email"
                    className={classNames(this.styles.textField, this.styles.dense)}
                    style={{display: 'block'}}
                    margin="dense"
                    type="text"/>

                    <TextField
                    id="password"
                    label="password"
                    className={classNames(this.styles.textField, this.styles.dense)}
                    style={{display: 'block'}}
                    margin="dense"
                    type="password"/>
                    
                    <Button type="submit">Submit</Button>
                </form>
                <p>Don't have an account? <Link to="/signup">Sign up!</Link></p>
            </div>

        );
    }    
}

export default SignIn;