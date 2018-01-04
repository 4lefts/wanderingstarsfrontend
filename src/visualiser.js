import {h, patch} from 'picodom'

export { renderSky }

//picodom stuff
let node
let container = document.getElementById('sky-container')
let sz

function renderSky(data){
    const cartesianData = makeCartesian(data)
    const sz = container.offsetWidth
    console.log(cartesianData)
    patch(node, (node = skyView(cartesianData, sz)), container)
}

function skyView(state, size){
    return h('svg', {
        "xmlns":  "http://www.w3.org/2000/svg", 
        "height":  sz, 
        "width":  sz,
        "viewBox": "-100 -100 200 200",
    }, [h('circle', {
            "cx": "0",
            "cy": "0",
            "r": "100",
            "stroke": "none",
            "fill": "#010125",
        }),
        state.map(b => {
            return (h('circle', {
                "cx": b.x,
                "cy": b.y,
                "r": "10",
                "stroke": "none",
                "fill": "#ff0000",
            }))
        })
    ])
}

//helper functions
function makeCartesian(arr){
    return arr.map(body => {
        //get radius from zenith, not altitude above horizon
        const radius = 180 - angleToDecimal(body.alt)
        const theta = degreesToRadians(angleToDecimal(body.az))
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