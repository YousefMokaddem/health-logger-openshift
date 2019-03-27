import React, {Component} from 'react';
import Food from './Food';
//material ui components
import TextField from '@material-ui/core/TextField';

class Foods extends Component{

    state={
        foods:[],
        search: false
    }

    componentDidMount(){
        this.reFetch();
    }

    reFetch(){
        fetch('/api/foods')
        .then(res => res.json())
        .then(res => this.setState({foods:res}));
    }

    displayFoods(){
        if(this.state.search){
            return this.searchedFoods.map((food, i) => {
                return <Food {...food} key={i} user={this.props.user} day={this.props.day} authorId={food.User.id} reFetch={this.reFetch.bind(this)} />
            });
        }else{
            return this.state.foods.map((food, i) => {
                return <Food {...food} key={i} user={this.props.user} day={this.props.day} authorId={food.User.id} reFetch={this.reFetch.bind(this)} />
            });
        }
    }  

    searchedFoods = [];

    search(e){
        if(e.target.value.length > 0){
            this.searchedFoods = [];
            this.setState({search: true})
            this.state.foods.map((food, i) => {
                if(food.name.toLowerCase().search(e.target.value.toLowerCase()) !== -1){
                    this.searchedFoods.push(food);
                }
                return 0;
            });
        }else{
            this.setState({search: false});
        }
    }


    render(){
        return(
            <div>
                <h2 className="title">Foods:</h2>
                <TextField
                    id="filled-search"
                    label="Search field"
                    type="search"
                    margin="normal"
                    variant="filled"
                    onChange={(e) => this.search(e)}
                    />
                <div className="food-grid">
                    {this.displayFoods()}
                </div>
            </div>
        );
    };
    
}

export default Foods;