## lazycss
Helper to bring some comforts to writing css

Basic feature list & goal:

 - [x] Number to px
 - [x] Hex to rgba
 - [x] Nesting
 - [ ] Global unique namepacing
 - [ ] Auto change detection
 - [ ] ... 


And here's some code! :+1:

#### Basic 1:
```javascript
var css = lazycss({
  '.container': {
    height: 400,
    backgroundColor: '#aabbccdd',
    hover: {
      backgroundColor: '#dd2233dd'
    },
    '*': {
      boxSizing: 'border-box'
    },
    '.sidebar': {
      display: 'inline-block',
      width: 200,
      height: '100%',
      backgroundColor: 'green'
    },
    '.main': {
      display: 'inline-block',
      width: -200,
      height: '100%',
      'background-color': 'lightgreen'
    }
  }
})
```
###### Result
```javascript
// css.raw
".container {
	height:400px;
	background-color:rgba(170,187,204,0.86);
}
.container:hover {
	background-color:rgba(221,34,51,0.86);
}
.container * {
	box-sizing:border-box;
}
.container .sidebar {
	display:inline-block;
	width:200px;
	height:100%;
	background-color:green;
}
.container .main {
	display:inline-block;
	width:calc(100% - 200px);
	height:100%;
	background-color:lightgreen;
}"
css.minified
".container{height:400px;background-color:rgba(170,187,204,0.86);}.container:hover{background-color:rgba(221,34,51,0.86);}.container *{box-sizing:border-box;}.container .sidebar{display:inline-block;width:200px;height:100%;background-color:green;}.container .main{display:inline-block;width:calc(100%-200px);height:100%;background-color:lightgreen;}"
```

## Motivation
- Too lazy to switch files & context to do job


## Installation
```HTML
<script src="lazycss.min.js"></script>
```
```javascript
npm i lazycss
```

## API

1. Create new style holder
```javascript
/**
 * @param name {String} tag name of the root dom element
 * @param defs {Object} options for root element, className, id, children etc... 
 * @return {DOM}
 */
var css = lazycss(defs)
// append a style element to document head if not appended, else edit text content
// future change only part of text that was changed in css object
css.append()
// get compiled style
css.raw
// get minified style
css.minified
// get compiled & minified style
css.css // { css.raw, css.minified }
```

## Plan
- [ ] Have diffing when updating
- [ ] More comfortable syntax for complex css


## License
.MIT
