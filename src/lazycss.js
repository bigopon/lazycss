(function() {
    var defProp = Object.defineProperty
    var defProps = Object.defineProperties
    var pxStyle = ['width', 'height', 'maxWidth', 'minWidth', 'maxHeight', 'minHeight']
    !['', 'Top', 'Right', 'Bottom', 'Left'].forEach(function (pos) {
        pxStyle.push('padding' + pos)
        pxStyle.push('margin' + pos)
    })

    var dblClnPsuedoStyle = ['before', 'after']
    var normalPsuedoStyle = ['disabled', 'enabled', 'visited', 'empty']
    var actionPsuedoStyle = ['hover', 'active', 'focus', 'target']
    var inputPsuedoStyle = ['required', 'optional', 'invalid', 'valid', 'checked']
    var specialRules = pxStyle.concat(dblClnPsuedoStyle, normalPsuedoStyle, actionPsuedoStyle, inputPsuedoStyle)

    var pxStyleRange = pxStyle.length
    var dblPsuStyleRange = pxStyleRange + dblClnPsuedoStyle.length
    var normalPsuStyleRange = dblPsuStyleRange + normalPsuedoStyle.length
    var actionPsuStyleRange = normalPsuStyleRange + actionPsuedoStyle.length
    var inputPsuStyleRange = actionPsuStyleRange + inputPsuedoStyle.length

    var positionPsuedoRegex = /^(nth|last|first|only|out|in|read|not)/
    var colorRegex = /color$/i
    var hexRegex = /^#?[0-9a-f]/i
    var noSpaceRegex = /\s/g
    var specialChar0 = ['.', '#', ' ', '>', '[', '*']

    function up2(str) {
        return str[1].toUpperCase()
    }
    function d2c(s) {
        return s.toLowerCase().replace(/-([a-z])/g, up2);
    }
    function c2d(str) {
        return str.replace(/([A-Z])/g, '-$1').toLowerCase()
    }
    function assignCss(dest) {
        dest = dest || {}
        var len = arguments.length
        if (len < 2) return dest
        for (var i = 1; i < len; i++) {
            var src = arguments[i]
            if (!src) continue
            var srcKeys = Object.keys(src),
                srcKeyLen = srcKeys.length
            for (var j = 0; j < srcKeyLen; j++) {
                var sel = srcKeys[j]
                dest[sel] = (dest[sel] || '') + src[sel]
            }
        }
        return dest
    }

    function rv2str(rule, value) {
        return '\t' + c2d(rule) + ':' + value + ';\n'
    }
    function rv2strCH(rule, value) {
        return '\t' + c2d(rule) + ':' + h2r(value) + ';\n'
    }
    /**
     * @param rule {string}
     * @param value {string|number}
     */
    function rv2strN(rule, value) {
        return '\t' + c2d(rule) + ':' + (isNaN(value) ? value : (value < 0? ('calc(100% - ' + Math.abs(value) + 'px)') : (value + 'px'))) + ';\n'
    }
    function add(holder, selector, style) {
        holder[selector] = (holder[selector] || '') + style
    }
    function addNewSelector(holder, selector, delimiter, subSelector, value, uniq) {
        var newSelector = selector + delimiter + subSelector
        if (typeof value === 'string')
            add(holder, newSelector, value)
        else {
            var newStyle = o2css(newSelector, value, uniq)
            assignCss(holder, newStyle)
        }
    }
    
    var specialKey = Math.floor(Math.random() * 100000)
    function testHexColorRv(rule, value) {
        return colorRegex.test(rule) && hexRegex.test(value)
    }
    function o2css(selector, styles, uniq) {
        var flattenStyles = { __proto__: null },
            keys = Object.keys(styles),
            len = keys.length,
            keyMap = {}
        for (var i = 0; i < len; i++) {
            var rule = keys[i],
                value = styles[rule],
                ruleChar0 = rule.charAt(0),
                cssRv = '',
                subSel,
                subStyle,
                delimiter
            if (ruleChar0 === '&') {
                addNewSelector(flattenStyles, selector, delimiter = '', rule.substr(1), value, uniq)
            }
            else if (specialChar0.indexOf(ruleChar0) !== -1) {
                addNewSelector(flattenStyles, selector, delimiter = ' ', rule, value)
            }
            else {
                if (positionPsuedoRegex.test(rule)) {
                    addNewSelector(flattenStyles, selector, delimiter = ':', rule, value)
                }
                else {
                    var ruleIdx = specialRules.indexOf(rule)
                    if (ruleIdx === -1) {
                        add(flattenStyles, selector, testHexColorRv(rule, value) ? rv2strCH(rule, value) : rv2str(rule, value))
                    }
                    else {
                        if (ruleIdx < pxStyleRange) {
                            add(flattenStyles, selector, rv2strN(rule, value))
                        }
                        else {
                            addNewSelector(flattenStyles, selector, delimiter = ':', rule, value)
                        }
                    }
                }
            }
        }
        return flattenStyles
    }

    function translate(styles, uniq) {
        var sKeys = Object.keys(styles),
            keyLen = sKeys.length
            result = { __proto__: null,
                cssstr: '',
                styles: {}
            }
        for (var i = 0; i < keyLen; i++) {
            var selector = sKeys[i],
                selectorVal = styles[selector]
            if (typeof selectorVal == 'string')
                result.cssstr += selectorVal
            else {
                var flattenStyles = o2css(selector, selectorVal, uniq)
                for (var fS in flattenStyles) {
                    result.styles[fS] = flattenStyles[fS].trim()
                }
                // result.styles.push(flattenStyles)
            }
        }
        return result
    }

    function getStyle(styles) {
        var sKeys = Object.keys(styles)
        var styleString = ''
        for (var i = 0; i < sKeys.length; i++) {
            var selector = sKeys[i]
            var selectorVal = styles[selector]
            if (typeof selectorVal === 'string')
                styleString += selector + '{' + selectorVal.trim() + '}'
            else {
                var flattenStyles = o2css(selector, selectorVal)
                var flatKeys = Object.keys(flattenStyles),
                    flatKeyLen = flatKeys.length
                for (var j = 0; j < flatKeyLen; j++) {
                    var sel = flatKeys[j],
                        selStyle = flattenStyles[sel]
                    styleString += sel + '{' + selStyle.trim() + '}'
                }
            }
        }
        return styleString
    }

    function toStyle(defs) {
        var sKeys = Object.keys(defs)
        var styleString = ''
        for (var i = 0; i < sKeys.length; i++) {
            var selector = sKeys[i]
            var selectorVal = defs[selector]
            styleString += selector + '{' + selectorVal.trim() + '}'
        }
        return styleString
    }
    function append(styleString) {
        var style = document.createElement('style')
        style.textContent = styleString
        document.head.appendChild(style)
        return style
    }

    function h62rgb(hex) {
        var red = parseInt(hex.substr(0,2), 16)
        var gr = parseInt(hex.substr(2,2), 16)
        var bl = parseInt(hex.substr(4,2), 16)
        return [red,gr,bl]
    }
    function h82rgba(hex) {
        var h = h62rgb(hex)
        h[3] = Math.floor(parseInt(hex.substr(6,2), 16) / 255 * 100) / 100
        return h
    }
    function dupstr(base) {
        var result = [], len = base.length, curr = 0
        for (var i = 0; i < len; i++) {
            var char = base[i]
            result[curr++] = char
            result[curr++] = char
        }
        return result.join('')
    }
    function h2r(hexa) {
        if (hexa.charAt(0) === '#')
            hexa = hexa.substr(1)
        var len = hexa.length
        if (len == 3)
            return 'rgb(' + h62rgb(dupstr(hexa)) + ')'
        if (len == 4)
            return 'rgba(' + h82rgba(dupstr(hexa)) + ')'
        if (len == 6)
            return 'rgb(' + h62rgb(hexa) + ')'
        if (len == 8)
            return 'rgba(' + h82rgba(hexa) + ')'
        return 'rgb(0, 0, 0)' // absence of color
    }

    function defineCss(dest, src) {
        var sels = Object.keys(src),
            len = sels.length
        for (var i = 0; i < len; i++) {
            var selector = sels[i]
            var values = src[selector]
            var descriptor = { __proto__: null }
            if (selector.charAt(0) === '.') {
                selector = d2c(selector)
                depProps(descriptor, {
                    value: {
                        get: function () {  }
                    }
                })   
            }
            defProp(dest, selector, {

            })
        }
    }
    function forEach(object, fn, thisArg) {
        var keys = Object.keys(object),
            len = keys.length
        for (var i = 0; i < len; i++) {
            var key = keys[i]
            fn.call(thisArg, object[key], key)
        }
    }

    var LazyCss = function(defs, uniq) {
        var holder = translate(defs, uniq)
        var lazycss = { __proto__: null }
        defProps(holder, {
            css: {
                value: function() {
                    return { minified: this.minified, raw: this.raw }
                }
            },
            minified: {
                get: function() {
                    var style = ''
                    forEach(this.styles, function(st, sel) {
                        style += sel + '{' + st.replace(noSpaceRegex, '') + '}'
                    })
                    return style
                }
            },
            raw: {
                get: function() {
                    var style = ''
                    forEach(this.styles, function(st, sel) {
                        style += sel + ' {\n\t' + st + '\n}\n'
                    })
                    return style
                }
            },
            append: {
                value: function() {
                    if (this.appended)
                        this.holder.textContent = this.css
                    else
                        this.holder = append(this.css.minified)
                }
            }
        })
        return holder
    }

    if (typeof define === 'function' && define.amd) define(LazyCss)
    else if (typeof module !== 'undefined' && module.exports) module.exports = LazyCss
    else window.lazycss = LazyCss
})()