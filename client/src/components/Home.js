import React from 'react';

const Home = () => {
    return(
        <div>
            <h2>How to use Health Logger:</h2>
            <ol>
                <li>Create a day using the NEW DAY page</li>
                <li>Select a day to add foods to from the DAYS page</li>
                <li>Select foods to add to your selected day from the FOODS page (displayed nutrition values are per 100 grams or milliliters)</li>
                <li>Add your own foods using the NEW FOOD page</li>
                <li>You may delete or modify foods that you have added on the FOODS page</li>
                <li>You may delete or modify the quantity of foods from your days on the DAYS page</li>
                <li>You may delete an entire day on the DAYS page</li>
            </ol>
            <p>NOTE: This site is a work in progress, and has yet to be optimized for mobile users. Thank you for your time.</p>
        </div>
    );
}

export default Home;