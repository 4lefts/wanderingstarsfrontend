import {render, loadingView, errView, dataView} from './renderdom.js'

//--------
//global vars
let location = {
    lat: null,
    long: null
}
let query
let dataGetter 
const locationForm = document.getElementById('location-form')

//--------
//geolocation
function getLocation(callback){
    if(navigator.geolocation){
       navigator.geolocation.getCurrentPosition(pos => {
            location.lat = pos.coords.latitude.toFixed(2).toString()
            location.long = pos.coords.longitude.toFixed(2).toString()
            callback()
        }, err => {
            console.log(err)
        })
    } else {
        location = {
            lat: '50.7',
            long: '-3.5'
        }
        callback()
    }
}
getLocation(function(){
    query = makeQuery(location)
    dataGetter = setInterval(getData, 1000, query)
    initFormValues(location, locationForm)
})

//--------
//fetch data
function makeQuery(loc){
    console.log(loc)
    console.log(loc.lat)
    return `https://4lefts.pythonanywhere.com/api/${loc.lat}/${loc.long}`
}
function getData(qry){
    fetch(qry)
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