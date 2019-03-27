import React,{Component} from 'react';
//material ui components
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';


class CreateDay extends Component {
    state={
        message: null
    }

    printErr = () => {
        if(this.state.message){
            return(
                <p>{this.state.message}</p>
            );
        }
    }

    createDay(e){
        e.preventDefault();

        const data = JSON.stringify({date:e.target[0].value});
        fetch('/api/days',{
            method: "POST",
            body: data,
            headers: this.props.user.headers
        }).then(res => {
            if(res.status !== 200){
                return res.json()
                .then(res => {
                    const message = res.message.split("Validation error: ");
                    this.setState({
                        message: message
                    })
                });
            }else{
                this.setState({
                    message: "Successfully created!"
                });
                this.props.history.push('/days');
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
      });

    render(){
        return(
            <form onSubmit={(e) => this.createDay(e)}>
                <h2>Create New Day</h2>
                {this.printErr()}
                <br/>
                <TextField
                    id="date"
                    label="Date"
                    type="date"
                    defaultValue={new Date().toJSON().slice(0,10)}
                    className={this.styles.textField}
                    InputLabelProps={{
                    shrink: true,
                    }}
                />
                <br/>
                <Button type="submit">Submit</Button>
            </form>
        );
    }
}

export default CreateDay;