import { useEffect, useRef, useState } from 'react';
import './LandingScreen.css'
import ExcersiceCard from '../components/ExerciseCard';
import data from '../key.json'

function LandingScreen(){

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': data['x-api-key'],
            'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        }
    };


    const [exerciseList, setExerciseList] = useState(()=>{
        const savedData = localStorage.getItem("exerciseData");
        const parsedData = JSON.parse(savedData);
        return parsedData || [];
    });

    const [filteredList, setFilteredList] = useState(exerciseList);
    const [listToShow, setListToShow] = useState(filteredList.slice(0,20));
    const [searchInput, setSearchInput] = useState("");
    const [previousLocalStorateUpdateDate, setPreviousLocalStorageUpdateDate] = useState(()=>{
        const savedData = localStorage.getItem("lastUpdatedDate");
        const parsedData = JSON.parse(savedData);
        return parsedData || 0 ;
    });

    async function getExcersiceData(){

        const url = `https://exercisedb.p.rapidapi.com/exercises?limit=1323`;

        try {
            const response = await fetch(url, options);
            const result = await response.json();

            setExerciseList(result);
            setFilteredList(result);

            localStorage.setItem("exerciseData",JSON.stringify(result));

        } catch (error) {
            console.error(error);
        }
    }

    function clickHandler(){


        setListToShow((prevState)=>{
            const updatedArr = [...prevState, ...filteredList.slice(prevState.length, prevState.length + 20)]
            return(updatedArr);
        })

    }

    useEffect(()=>{

        const date = new Date();
        const dateOfToday = date.getDate();


        if(dateOfToday !== previousLocalStorateUpdateDate || exerciseList.length === 0){
            console.log(exerciseList.length === 0)
            console.log('date',dateOfToday !== previousLocalStorateUpdateDate)
            getExcersiceData();
            setPreviousLocalStorageUpdateDate(dateOfToday);
            localStorage.setItem("lastUpdatedDate",dateOfToday)
        }

    },[])

    useEffect(()=>{

        const dataToSearchFor = searchInput.toLowerCase();

        setFilteredList(()=>{
            const data = exerciseList.filter((elem)=>{
                if(elem.bodyPart.includes(dataToSearchFor) || elem.target.includes(dataToSearchFor) || elem.name.includes(dataToSearchFor)){
                    return(true);
                }
            })
            return data;
        })
    },[searchInput])

    useEffect(()=>{

        setListToShow(filteredList.slice(0,20));

    },[filteredList])

    return(
        <div id='container'>
            <header>
                <h1>Exercise</h1>
                <div id='search-bar-container'>
                    <input type='text' placeholder='search by body part, target or name' value={searchInput} onChange={(e)=>{
                        setSearchInput(e.target.value);
                    }}/>
                </div>
            </header>
            <div id='excersice-cards-container'>
                {
                    listToShow.map((elem)=>{
                        return(
                            <ExcersiceCard key ={elem.id} name = {elem.name} bodyPart = {elem.bodyPart} target = {elem.target} gifUrl = {elem.gifUrl} elem = {elem} />
                        )
                    })
                }
            </div>
            <div>
                <button className='btn' onClick={clickHandler} >Load more</button>
            </div>
        </div>
    )
}

export default LandingScreen;