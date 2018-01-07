import {h, patch} from 'picodom'

export { renderSky }

//picodom stuff
let node
let container = document.getElementById('sky-container')
let xPadding = parseInt(window.getComputedStyle(container)
                    .padding
                    .split(' ')[1]
                    .split('px')[0])
console.log(xPadding)
let sz

function renderSky(data){
    const filteredData = data.filter(body => body.hasOwnProperty('set'))
    const cartesianData = makeCartesian(filteredData)
    const sz = container.offsetWidth - (2 * xPadding)
    console.log(cartesianData)
    patch(node, (node = skyView(cartesianData, sz)), container)
}

function skyView(state, size){
    return h('svg', {
        "xmlns":  "http://www.w3.org/2000/svg", 
        "height":  size, 
        "width":  size,
        "viewBox": `${-(size / 2)} ${-(size / 2)} ${size} ${size}`,
    }, [h('circle', {
            "cx": "0",
            "cy": "0",
            "r": `${size / 2}`,
            "stroke": "none",
            "fill": "#010125",
        }),
        state.map((b, idx) => {
            const x1 = b.x * size / 4
            const x2 = b.x * size / 2
            const y1 = idx * -20 
            const y2 = b.y * size / 2 
            return (h('line', {
                x1,
                y1,
                x2,
                y2,
                "stroke": "#331122",
                "stroke-width": "2"
            }))            
        }),
        state.map((b, idx) => {
            return (h('text', {
                "x": b.x * size / 4,
                "y": idx * - 20,
                "stroke": "none",
                "fill": "firebrick",
            }, b.name))
        }),
        state.map(b => {
            const _x = b.x * size / 2
            const _y = b.y * size / 2
            return (h('circle', {
                "cx": _x,
                "cy": _y,
                "r": "5",
                "stroke": "none",
                "fill": "firebrick",
            }))            
        })
    ])
}

//helper functions
function makeCartesian(arr){
    return arr.map(body => {
        //get radius from zenith, not altitude above horizon, in range 0 - 1
        const radius = (180 - angleToDecimal(body.alt)) / 180
        const theta = degreesToRadians(angleToDecimal(body.az)) - (Math.PI / 2)
        return {
            name: body.name,
            x: radius * Math.cos(theta),
            y: radius * Math.sin(theta)
        }
    })
}

function degreesToRadians(deg){
    return deg * (Math.PI/180)
}

function angleToDecimal(angle){
    const _xs = angle.split(':')
    const xs = _xs.map(a => parseFloat(a))
    return xs[0] + (xs[1]/60) + (xs[2]/3600)
}