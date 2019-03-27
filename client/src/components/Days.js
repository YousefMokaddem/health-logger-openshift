import React,{Component} from 'react';
import Day from './Day';

class Days extends Component {
    state={
        days:[]
    }

    componentDidMount(){
        this.reFetch();
    }

    populateDays(){
        return(
            this.state.days.map((day) => {
                return(
                    <Day key={day.id} deleteDay={this.deleteDay.bind(this)} selectDay={this.selectDay.bind(this)} user={this.props.user} day={day}/>
                );
            })
        );
    }

    selectDay(day){
        this.props.selectDay(day);
        this.props.history.push('/foods');
    }

    deleteDay(day){
        fetch(`/api/days/${day.id}`, {
            method: "DELETE",
            headers: this.props.user.headers
        }).then(res => {
            if(res.status === 200){
                this.reFetch();
            }
        })
    }

    reFetch(){
        fetch('/api/days',{headers:this.props.user.headers})
            .then(res => {
                if(res.status === 200){
                    res.json()
                    .then(days => this.setState({days}));
                }
            })
    }

    render(){
        return(
            <div>  
                <h2>Days:</h2>
                <div className="day-grid">
                    {this.populateDays()}
                </div>
            </div>
        );
    }
}

export default Days;