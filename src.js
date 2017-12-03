import {h, patch} from 'picodom'

let location = {
    lat: 50.7,
    long: -3.5
}

//--------
//fetch data
const makeQuery = loc => `https://4lefts.pythonanywhere.com/api/${loc.lat}/${loc.long}`
const getData = function(qry){
    fetch(qry)
        .then(response => response.json())
        .then(data => {
            render(dataView, data)
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

//--------
//picodom rendering
let node
const container = document.getElementById('data-container')

const render = function(view, withState){
    patch(node, (node = view(withState)), container)
}

const loadingView = () => (h('div', {}, 'Loading...'))
const errView = state => (h('div', {}, state))
const dataView = state => {
    return(
        h('div', {id: 'data-output'}, [
            renderBodyData(state.bodies),
            h('p', {}, 'Showing data for:'),
            renderMetaData(state.meta)
        ])
    )
}

//--------
//template component functions
function renderBodyData(bs){
    return(
        h('table', {}, [
            h('tr', {}, [
                h('td', {}, ''),
                h('td', {}, 'Alt'),
                h('td', {}, 'Az'),
                h('td', {}, 'Rise'),
                h('td', {}, 'Set')
            ]),
            bs.map(body => bodyRow(body))
        ])
    )
}

function bodyRow(b){
    const upOrDown = b.hasOwnProperty('rise') ? 'down' : 'up'
    return(
        h('tr', {className: upOrDown}, [
            h('td', {}, b.name),
            h('td', {}, parseAngle(b.alt)),
            h('td', {}, parseAngle(b.az)),
            h('td', {}, parseTime(b.rise) || ''),
            h('td', {}, parseTime(b.set)|| '')            
        ])
    )
}

function renderMetaData(m){
    return(
        h('table', {}, [
            h('tr', {}, [
                h('td', {}, 'Latitude:'),
                h('td', {}, parseAngle(m.lat))
            ]),
            h('tr', {}, [
                h('td', {}, 'Longitude:'),
                h('td', {}, parseAngle(m.lon))
            ]),
            h('tr', {}, [
                h('td', {}, 'Local time:'),
                h('td', {}, parseDateTime(m.localtime) + `(${m.tz})`)
            ])
        ])
    )
}

//helper functions to display data
function parseAngle(_a){
    const a = _a.split(':')
    return `${a[0]}${String.fromCharCode(176)} ${a[1]}${String.fromCharCode(8242)}`
}

function parseTime(_t){
    if(_t){
        const t = _t.split(' ')[1].split(':')
        return `${t[0]}:${t[1]}`
    }
}

function parseDateTime(_dt){
    const dt = _dt.split(' ')
    const t = dt[1].split(':')
    const d = dt[0].split('-').join('/')
    return `${t[0]}:${t[1]} ${d}`
}

//initial render
render(loadingView, null)