import {render, loadingView, errView, dataView} from './renderdom.js'
import './style.css'

//--------
//global vars
let dataGetter 
const locationForm = document.getElementById('location-form')

//--------
//geolocation
const getLocation = new Promise(function(resolve, reject){
    let loc = {}
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(pos => {
            loc = {
                lat: pos.coords.latitude.toFixed(2).toString(),
                long: pos.coords.longitude.toFixed(2).toString()
            }
            resolve(loc)
        }, err => {
            loc = defaultLocation()
            console.log(`geolocation error: ${err}`)
            resolve(loc)
        })
    } else {
        loc = defaultLocation()
        console.log(`geolocation not supported or disabled...`)
        resolve(loc)
    }
    function defaultLocation(){
        return {
            lat: '50.7',
            long: '-3.5'
        }
    }
})

getLocation
    .then(loc => {
        dataGetter = setInterval(getData, 1000, loc)
        initFormValues(loc, locationForm)
    })

function getData(loc){
    fetch(`https://4lefts.pythonanywhere.com/api/${loc.lat}/${loc.long}`)
        .then(response => {
            if(response.ok){
                return response.json()
            } else {
                console.log(response)
                render(errView, response.status)
            }
        })
        .then(data => {
            if(data) render(dataView, data)
        })
        .catch(err => render(errView, err))
}

//--------
//initialise and handle form
function initFormValues(loc, form){
    const inputs = form.querySelectorAll('input')
    inputs[0].value = loc.lat
    inputs[1].value = loc.long
}

locationForm.addEventListener('submit', event => {
    clearInterval(dataGetter)
    render(loadingView, null)
    location = {
        lat: event.target[0].value,
        long: event.target[1].value
    }
    query = makeQuery(location)
    dataGetter = setInterval(getData, 1000, query)
    event.preventDefault()
})

//initial render
render(loadingView, null)