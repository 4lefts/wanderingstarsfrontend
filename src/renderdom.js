import {h, patch} from 'picodom'

//picodom rendering
let node
const container = document.getElementById('data-container')

export { render, loadingView, errView, dataView }

//exported functions
function render(view, withState){
    patch(node, (node = view(withState)), container)
}

function loadingView(state){
    return (h('div', {}, 'Loading...'))
}

function errView(state){
    console.log(state)
    return (h('div', {}, `
        sorry, something went wrong, please try again\nerrcode:${state}`
    ))
}

function dataView(state){
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
                h('td', {}, parseDateTime(m.localtime) + ` (${m.tz})`)
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
