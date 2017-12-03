import {h, patch} from 'picodom'
import {get} from 'axios'

let formNode, dataNode, go
const formContainer = document.getElementById('form-container')
const dataContainer = document.getElementById('data-output')
let location = {
    lat: 50.7,
    long: -3.5
}
const buildQuery = location => `https://4lefts.pythonanywhere.com/api/${location.lat}/${location.long}`
let query = buildQuery(location)
render(formNode, formView, location, formContainer)

function getData(qry){
    clearInterval(go)
    go = setInterval(q => {
        get(q)
            .then(res => {
                console.log(res.data)
                render(dataNode, dataView, res.data, dataContainer)
            })
            .catch(err => console.log(err))
    }, 1000, qry)
}

function render(node, view, withState, container){
    patch(node, (node = view(withState)), container)
}

function handleUpdate(e){
    console.log(e)
    location.lat = e.target[0].value
    location.long = e.target[1].value
    query = buildQuery(location)
    getData(query)
    e.preventDefault()
}

function formView(state){
    return(
        h('form', {onsubmit: handleUpdate}, [
            h('div', {}, [
                h('label', {for: 'lat-input'}, 'Latitude:'),
                h('input', {type: 'number', name: 'lat-input', value: state.lat})
            ]),
            h('div', {}, [
                h('label', {for: 'long-input'}, 'Longitude:'),
                h('input', {type: 'number', name: 'long-input', value: state.long})
            ]),
            h('input', {type: 'submit', value: 'update'})
        ])
    )
}

function dataView(state){
    return(
        h('div', {}, [
            renderBodyData(state.bodies),
            h('p', {}, 'Displaying data for:'),  
            renderMetaData(state.meta)
        ])
    )
}

//template components
function renderBodyData(bs){
    return(
        h('table', {}, [
            h('tr', {}, [
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

getData(query)