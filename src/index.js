import {render, loadingView, errView, dataView} from './renderdom.js'
import {renderSky} from './visualiser.js'
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
            console.error(`geolocation error: ${err}`)
            resolve(loc)
        })
    } else {
        loc = defaultLocation()
        console.error(`geolocation not supported or disabled...`)
        resolve(loc)
    }
    function defaultLocation(){
        //default to exeter
        return {
            lat: '50.7',
            long: '-3.5'
        }
    }
})

function getData(loc){
    fetch(`https://www.wanderingstars.co/api/${loc.lat}/${loc.long}`)
        .then(response => {
            if(response.ok){
                return response.json()
            } else {
                render(errView, response.status)
            }
        })
        .then(data => {
            if(data){
                render(dataView, data)
                renderSky(data.bodies)
            }
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
    const loc = {
        lat: event.target[0].value,
        long: event.target[1].value
    }
   dataGetter = setInterval(getData, 1000, loc)
    event.preventDefault()
})

//initialise location, start getting data
getLocation
    .then(loc => {
        dataGetter = setInterval(getData, 1000, loc)
        initFormValues(loc, locationForm)
    })

//initial render
render(loadingView, null)
