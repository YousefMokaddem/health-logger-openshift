import React, {Component} from 'react';

//material ui compnents
import TextField from '@material-ui/core/TextField';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';

class UpdateFood extends Component{
    state = {
        id: this.props.match.params.id,
        fetched: false,
        message: null
    }

    componentDidMount(){
        fetch(`/api/foods/${this.state.id}`)
        .then(res=>res.json())
        .then(food => {
            this.setState({food:food, fetched:true});
        },);
    }

    submitEdit = (e) => {
        e.preventDefault();
        let data = JSON.stringify({
            name: e.target[0].value,
            calories: parseInt(e.target[1].value),
            fat: parseInt(e.target[2].value),
            carbs: parseInt(e.target[3].value),
            protein: parseInt(e.target[4].value),
            img: e.target[5].value
        });
        
        fetch(`/api/foods/${this.state.id}`, {
            method: "PUT",
            body: data,
            headers: this.props.user.headers
        }).then(res => {
            if(res.status === 204){
                this.props.history.push('/foods');
            }else{
                res.json()
                    .then(res => {
                        const message = res.message.split("Validation error: ");
                            this.setState({
                                message: message
                            })
                    });
            }
        });
        
    }

    printErr = () => {
        if(this.state.message){
            return(
                <p>{this.state.message}</p>
            );
        }
    }

    populateForm = (food) => {
        if(this.state.fetched){
            return(
                <form onSubmit={(e) => this.submitEdit(e)} >
                    {this.printErr()}


                    <TextField
                        defaultValue={food.name}
                        id="name"
                        label="name"
                        className={classNames(this.styles.textField, this.styles.dense)}
                        style={{display: 'block'}}
                        margin="dense"
                        type="text"/>

                    <TextField
                        defaultValue={food.calories}
                        id="calories"
                        label="calories"
                        className={classNames(this.styles.textField, this.styles.dense)}
                        style={{display: 'block'}}
                        margin="dense"
                        type="text"/>

                    <TextField
                        defaultValue={food.fat}
                        id="fat"
                        label="fat"
                        className={classNames(this.styles.textField, this.styles.dense)}
                        style={{display: 'block'}}
                        margin="dense"
                        type="text"/>

                    <TextField
                        defaultValue={food.carbs}
                        id="carbs"
                        label="carbs"
                        className={classNames(this.styles.textField, this.styles.dense)}
                        style={{display: 'block'}}
                        margin="dense"
                        type="text"/>

                    <TextField
                        defaultValue={food.protein}
                        id="protein"
                        label="protein"
                        className={classNames(this.styles.textField, this.styles.dense)}
                        style={{display: 'block'}}
                        margin="dense"
                        type="text"/>

                    <TextField
                        defaultValue={food.img}
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
                        defaultChecked={food.isSolid}
                    />
                    <br/>
        
                    <Button type="submit">Submit Changes</Button>
                </form>
            );
        }else{
            return(
                <p>Loading...</p>
            );
        }
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
                {
                    this.populateForm(this.state.food)
                }
            </div>
        );
    };
    
}

export default UpdateFood;