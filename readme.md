# wandering stars 
## front end

a simple front end web app to display data from my wanderingstars [api](https://github.com/4lefts/wanderingstarsapi). 

clone this repo, the ```npm install```, ```npm run dev``` or ```npm run build```

the app uses [picodom](https://github.com/picodom/picodom) by [Jorge Bucaran](https://github.com/JorgeBucaran)

the app is build to the dir ```static``` so that it can be dropped straight into the flask app for the backend api and deployed. but it doesn't *have* to be like this, hence having two repos. the index.html file here is only used for development.

### to do:
- ~~js navigator geolocation~~
- ~~https - geolocation doesn't work over http...~~
- canvas to visualise object positions
- "light css" theme depending on whether the sun is up or not?