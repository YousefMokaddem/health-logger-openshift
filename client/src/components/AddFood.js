import React,{Component} from 'react';

//material ui compnents
import TextField from '@material-ui/core/TextField';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';

class AddFood extends Component {
    
    addFood(e){
        e.preventDefault();
        const data = JSON.stringify({amount: parseInt(e.target[0].value)});

        fetch(`/api/days/${this.props.day.id}-${this.props.renderProps.match.params.id}`, {
            method: "POST",
            body: data,
            headers: this.props.user.headers
        })
            .then(res => {
                if (res.status === 200){
                    this.props.renderProps.history.push('/foods');
                }
            })
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
            <form onSubmit={(e) => this.addFood(e)}>
                <TextField
                        id="amount"
                        label="Amount"
                        className={classNames(this.styles.textField, this.styles.dense)}
                        style={{display: 'block'}}
                        margin="dense"
                        type="text"/>
                <Button type="submit">Submit</Button>
            </form>
        );
    }
}

export default AddFood;