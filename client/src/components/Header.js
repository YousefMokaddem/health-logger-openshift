import React,{Component} from 'react';
import {NavLink} from 'react-router-dom';

//material ui components
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';


class Header extends Component {

    checkUser = () => {
        if(this.props.user){
            return(
                <nav>
                
                    {this.checkDay()}
                    <NavLink exact to="/"><Button color="inherit">Home</Button></NavLink>
                    <NavLink exact to="/foods"><Button color="inherit">Foods</Button></NavLink>
                    <NavLink to="/foods/create"><Button color="inherit">New Food</Button></NavLink>
                    <NavLink exact to="/days"><Button color="inherit">Days</Button></NavLink>
                    <NavLink to="/days/create"><Button color="inherit">New Day</Button></NavLink>
                    <NavLink to="/signout"><Button color="inherit">Sign Out</Button></NavLink>
                    <h3>{this.props.user.username}</h3>
                </nav>
            );
        }
    }

    checkDay = () => {
        if(this.props.day){
            return(
                <p>Selected day: {this.props.day.date}</p>
            );
        }
    }

    //material ui vars
    styles = {
        root: {
            flexGrow: 1,
        },
        grow: {
            flexGrow: 1,
        },
        menuButton: {
            marginLeft: -12,
            marginRight: 20,
        },
    };

    render(){
        
        return(
            <div>
                <AppBar position="static">
                    <Toolbar>
                        <Typography style={{width: '100%'}} variant="h6" color="inherit">
                            Health Logger
                    
                            {this.checkUser()}
                        </Typography>
                    </Toolbar>
                </AppBar>
            </div>
        );

    }
    
}

export default Header;