import React, {Component} from 'react';
import {Link} from 'react-router-dom';

//material ui compnents
import TextField from '@material-ui/core/TextField';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';

class SignUp extends Component {

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

    register = (e) => {
        e.preventDefault();
        if(e.target[2].value.length < 6 || e.target[2].value.length > 12){
            this.setState({
                message: "Password must be between 6 and 12 characters"
            });
            return;
        }
        if(e.target[2].value !== e.target[3].value){
            this.setState({
                message: "Passwords must match"
            });
            return;
        }
        let data = JSON.stringify({
            username: e.target[0].value,
            email: e.target[1].value,
            password: e.target[2].value
        });

        fetch(`/api/users`, {
            method: "POST",
            body: data,
            headers:{
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if(res.status !== 201){
                    return res.json()
                    .then(res => {
                        const message = res.message.split('Validation error: ');
                        this.setState({
                            message: message
                        })
                    }
                    );
                }else{
                    this.setState({
                        message: "Successfully registered!"
                    });
                    this.props.history.push('/');
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
                <form onSubmit={(e) => this.register(e)}>
                    <h2>Sign Up</h2>
                    {this.printErr()}

                    <TextField
                    id="username"
                    label="username"
                    className={classNames(this.styles.textField, this.styles.dense)}
                    style={{display: 'block'}}
                    margin="dense"
                    type="text"/>

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

                    <TextField
                    id="confirm-password"
                    label="confirm password"
                    className={classNames(this.styles.textField, this.styles.dense)}
                    style={{display: 'block'}}
                    margin="dense"
                    type="password"/>

                    <Button type="submit">Submit</Button>
                </form>
                <p>Already have an account? <Link to="/">Sign in!</Link></p>
            </div>
        );
    }
}

export default SignUp;