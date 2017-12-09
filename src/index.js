import {render, loadingView, errView, dataView} from './renderdom.js'

let location = {
    lat: '50.7',
    long: '-3.5'
}

//--------
//fetch data
const makeQuery = loc => `https://4lefts.pythonanywhere.com/api/${loc.lat}/${loc.long}`
const getData = function(qry){
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

let query = makeQuery(location)
let dataGetter = setInterval(getData, 1000, query)

//--------
//initialise and handle form
const locationForm = document.getElementById('location-form')
function initFormValue(loc, form){
    const inputs = form.querySelectorAll('input')
    inputs[0].value = loc.lat
    inputs[1].value = loc.long
}
initFormValue(location, locationForm)

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