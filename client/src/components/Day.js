import React,{Component} from 'react';

//material ui components
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import classNames from 'classnames';

class Day extends Component {
    state={
        food:[],
        edit:[]
    }

    componentDidMount(){
        this.reFetch();
    }

    deleteFood(id){
        fetch(`/api/foods/${id}`,{
            method: "DELETE",
            headers: this.props.user.headers
        })
        .then(res => {
            if(res.status !== 200){
                return res.json()
                .then(res =>
                    //print error somewhere or redirect to server error page
                    1
                )
            }else{
                this.reFetch();
            }
        });
    }

    triggerEdit(id){
        this.setState(prevState => ({
            edit: (prevState.edit.map((item, i) => (id===i)? true : false))
        }));
    }
    
    editAmount(e, id){
        e.preventDefault();
        const data = JSON.stringify({amount: e.target[0].value});

        fetch(`/api/foods/${id}`, {
            method: "PUT",
            body: data,
            headers: this.props.user.headers
        })
            .then( res => {
                this.setState(prevState => ({
                    edit: (prevState.edit.map(i => false))
                }));
                if(res.status === 204){
                    this.reFetch();
                }
            })
    }

    reFetch(){
        fetch(`/api/days/${this.props.day.id}`,{headers:this.props.user.headers})
            .then(res => res.json())
            .then(day => {
                this.setState({food:day.Food}, () => {
                    let edit = [];
                    for (let i = 0; i<this.state.food.length; i++){
                        edit.push(false);
                    }
                    this.setState({edit: edit});
                });
            });
    }

    showFoods(){
        if(this.state.food.length > 0){
            const totalCals = this.state.food.reduce((total, curr)=>{return total + (curr.calories * (curr.amount/100))},0)
            const totalFats = this.state.food.reduce((total, curr)=>{return total + (curr.fat * (curr.amount/100))},0)
            const totalCarbs = this.state.food.reduce((total, curr)=>{return total + (curr.carbs * (curr.amount/100))},0)
            const totalProtein = this.state.food.reduce((total, curr)=>{return total + (curr.protein * (curr.amount/100))},0)
            return(
                <div>
                {this.state.food.map((food, i) => {
                    return(
                        <div key={i}>
                            <p>{food.amount}{food.isSolid? 'g':'ml'} of {food.name} = {food.calories * (food.amount/100)} cals, {food.fat * (food.amount/100)} fat, { 
                            food.carbs * (food.amount/100)} carbs, {
                            food.protein * (food.amount/100)} protein</p>
                            <Button variant="outlined" color="secondary" onClick={() => this.deleteFood(food.id)}>Delete</Button>
                            {/* if edit is true, show the form to update amount, else show the edit Button */}
                            {this.state.edit[i] ? 
                                <form onSubmit={(e) => this.editAmount(e,food.id)}>
                                    <TextField
                                        id="amount"
                                        defaultValue={food.amount}
                                        label="Amount"
                                        className={classNames(this.styles.textField, this.styles.dense)}
                                        margin="dense"
                                        type="text"/>
                                    <Button type="submit">Submit</Button>
                                </form>
                                : 
                                <Button variant="outlined" onClick={() => this.triggerEdit(i)}>Edit</Button>
                            }
                        </div>
                    );
                })}
                
                <p>Total Calories: {totalCals}</p>
                <p>Total Fat: {totalFats}</p>
                <p>Total Carbohydrates: {totalCarbs}</p>
                <p>Total Protein: {totalProtein}</p>
                </div>
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
            <div className="day-card">
                <Card style={{background: '#E8E8E8', height: '100%'}}>
                    <CardContent>
                        <h2>{this.props.day.date}</h2>
                        <Button variant="contained" color="secondary" onClick={() => this.props.deleteDay(this.props.day)}>Delete Day</Button>
                        <Button variant="contained" color="primary" onClick={() => this.props.selectDay(this.props.day)}>Select Day</Button>
                        {this.showFoods()}
                    </CardContent>
                </Card>
            </div>
        );
    }
}

export default Day;