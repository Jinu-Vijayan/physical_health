import './ExcerciseCard.css'

function ExcersiceCard({name, bodyPart, target, gifUrl, elem}){

    return(
        <div className='excersice-card'>
            <img src = {gifUrl} alt= {`gif of ${name} excersice`} />
            <h3>{name}</h3>
            <p>Body part : {bodyPart}</p>
            <p>Target : {target}</p>
        </div>
    )
}

export default ExcersiceCard;