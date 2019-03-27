import React from 'react';
import {NavLink} from 'react-router-dom';
import ReactImageFallback from 'react-image-fallback';

//material ui components
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

const Food = ({name, calories, fat, carbs, protein, img, id, user, reFetch, authorId, day}) => {

    const deleteFood = () => {
        fetch(`/api/foods/${id}`,{
            method: "DELETE",
            headers: user.headers
        })
        .then(res => {
            if(res.status !== 200){
                return res.json()
                .then(res =>
                    //print error somewhere
                    1
                )
            }else{
                reFetch();
            }
        });
    }

    const showAddToDayButton = () => {
        if(day){
            return (<NavLink to={`/days/addfood/${id}`}><Button variant="outlined" color="primary">Add to Day</Button></NavLink>);
        }
    }
    const showAuthorButtons = () => {
        if(user.id === authorId){
            return(
                <div>
                    <Button variant="outlined" color="secondary" onClick={() => deleteFood()}>Delete</Button>
                    <NavLink to={`/edit/${id}`}><Button variant="outlined">Edit</Button></NavLink>
                </div>
            );
        }
    }


    return(
        <div className="food-card">
            <Card style={{background: '#E8E8E8', height: '100%'}}>
                <CardContent>
                    <ReactImageFallback src={img} fallbackImage="https://www.unesale.com/ProductImages/Large/notfound.png" alt={name}/>
                    <h2 className="food-name">{name}</h2>
                    <p>Calories: {calories}</p>
                    <p>Fat: {fat}</p>
                    <p>Carbohydrates: {carbs}</p>
                    <p>Protein: {protein}</p>
                    {showAuthorButtons()}
                    {showAddToDayButton()}
                </CardContent>
            </Card>
        </div>
    );
}

export default Food;