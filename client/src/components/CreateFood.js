import React,{Component} from 'react';

//material ui compnents
import TextField from '@material-ui/core/TextField';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';

class CreateFood extends Component {

    state = {
        solid: true
    }
    
    toggleSolid(e){
        this.setState({solid: e.target.checked});
    }

    checkSolid(){
        return(this.state.solid? <span>g</span> : <span>ml</span>); 
    }

    printErr = () => {
        if(this.state.message){
            return(
                <p>{this.state.message}</p>
            );
        }
    }

    submitAdd(e){
        e.preventDefault();
        let data = JSON.stringify({
            name: e.target[0].value,
            calories: e.target[1].value,
            fat: e.target[2].value,
            carbs: e.target[3].value,
            protein: e.target[4].value,
            img: e.target[5].value,
            isSolid: e.target[6].checked
        })
        
        fetch(`/api/foods`, {
            method: "POST",
            body: data,
            headers: this.props.user.headers
        })
            .then(res => {
                if (res.status !== 201){
                    res.json()
                        .then(res => {
                            const message = res.message.split("Validation error: ");
                            this.setState({
                                message: message
                            })
                        });
                }else{
                    this.props.history.push('/foods');
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
            <form onSubmit={(e) => this.submitAdd(e)}>
                <p>Please fill in nutritional values based on a serving size of 100 {this.checkSolid()}</p>
                {this.printErr()}

                <TextField
                    id="name"
                    label="name"
                    className={classNames(this.styles.textField, this.styles.dense)}
                    style={{display: 'block'}}
                    margin="dense"
                    type="text"/>

                <TextField
                    id="calories"
                    label="calories"
                    className={classNames(this.styles.textField, this.styles.dense)}
                    style={{display: 'block'}}
                    margin="dense"
                    type="text"/>

                <TextField
                    id="fat"
                    label="fat"
                    className={classNames(this.styles.textField, this.styles.dense)}
                    style={{display: 'block'}}
                    margin="dense"
                    type="text"/>

                <TextField
                    id="carbs"
                    label="carbs"
                    className={classNames(this.styles.textField, this.styles.dense)}
                    style={{display: 'block'}}
                    margin="dense"
                    type="text"/>

                <TextField
                    id="protein"
                    label="protein"
                    className={classNames(this.styles.textField, this.styles.dense)}
                    style={{display: 'block'}}
                    margin="dense"
                    type="text"/>

                <TextField
                    id="img-url"
                    label="Image URL"
                    className={classNames(this.styles.textField, this.styles.dense)}
                    style={{display: 'block'}}
                    margin="dense"
                    type="text"/>

                <label htmlFor="isSolid">Solid:</label>
                <Checkbox 
                    id="isSolid"
                    onChange={(e) => {this.toggleSolid(e)}}
                    defaultChecked
                />
                <br/>
    
                <Button type="submit">Add Food</Button>
                
            </form>
        );
    }
}

export default CreateFood;