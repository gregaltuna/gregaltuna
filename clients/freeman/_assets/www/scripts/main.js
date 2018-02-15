(function (root, factory) {
  /* istanbul ignore next */
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    root.SlideShow = factory();
  }
}(this, function () {

  function createElement(tag, className, text) {
    var elm = document.createElement(tag);
    elm.className = className;
    if (text) elm.appendChild(document.createTextNode(text));
    return elm;
  }

  function SlideShow(selector, options) {
    options = {
      timeout: options && options.timeout || 5000
    };

    var elm = document.querySelector(selector);
    if (!(elm && elm.children.length)) {
      throw new Error('Element not found or no children.');
    }

        // Add slideshow classes
        elm.classList.add('slideshow');
        elm.classList.add('preload');

        // Set the dimensions of the container based on image size
        var elmImg = elm.querySelector('img');
        //        var doResize = function () {
        //            elm.style.height = elmImg.clientHeight + 'px';
        //        };
        //        doResize();
        //        window.addEventListener('resize', doResize);

        // Create caption elements from image properties
        //        for (var i = 0; i < elm.children.length; i++) {
        //            var elmChild = elm.children[i];
        //            elmImg = elmChild.querySelector('img');
        //            if (elmImg && elmImg.title) {
        //                var elmCaption = createElement('div', 'caption');
        //                elmCaption.appendChild(createElement('span', 'title', elmImg.title));
        //                elmCaption.appendChild(createElement('span', 'alt', elmImg.alt));
        //                elmChild.appendChild(elmCaption);
        //            }
        //        }


        for (var i = 0; i < elm.children.length; i++) {
          var elmChild = elm.children[i];
          elmImg = elmChild.querySelector('div.slide-block');
          if (elmImg && elmImg.title) {
            var elmCaption = createElement('div', 'caption');
            elmCaption.appendChild(createElement('span', 'title', elmImg.title));
            elmCaption.appendChild(createElement('span', 'alt', elmImg.alt));
            elmChild.appendChild(elmCaption);
          }
        }


        // Show the first slide
        elm.children[0].classList.add('show-animation');

        // Remove preload class to enable transition animations
        setTimeout(function () {
          elm.classList.remove('preload');
        });

        // Start the slidehshow
        var index = 0;
        setInterval(function () {
          elm.children[index].classList.remove('show-animation');
          index = (index + 1) % elm.children.length;
          elm.children[index].classList.add('show-animation');
        }, options.timeout);

        return elm;
      }

      return SlideShow;

    }));

/*!
 * Modernizr v2.8.3
 * www.modernizr.com
 *
 * Copyright (c) Faruk Ates, Paul Irish, Alex Sexton
 * Available under the BSD and MIT licenses: www.modernizr.com/license/
 */

/*
 * Modernizr tests which native CSS3 and HTML5 features are available in
 * the current UA and makes the results available to you in two ways:
 * as properties on a global Modernizr object, and as classes on the
 * <html> element. This information allows you to progressively enhance
 * your pages with a granular level of control over the experience.
 *
 * Modernizr has an optional (not included) conditional resource loader
 * called Modernizr.load(), based on Yepnope.js (yepnopejs.com).
 * To get a build that includes Modernizr.load(), as well as choosing
 * which tests to include, go to www.modernizr.com/download/
 *
 * Authors        Faruk Ates, Paul Irish, Alex Sexton
 * Contributors   Ryan Seddon, Ben Alman
 */

window.Modernizr = (function( window, document, undefined ) {

    var version = '2.8.3',

    Modernizr = {},

    /*>>cssclasses*/
    // option for enabling the HTML classes to be added
    enableClasses = true,
    /*>>cssclasses*/

    docElement = document.documentElement,

    /**
     * Create our "modernizr" element that we do most feature tests on.
     */
    mod = 'modernizr',
    modElem = document.createElement(mod),
    mStyle = modElem.style,

    /**
     * Create the input element for various Web Forms feature tests.
     */
    inputElem /*>>inputelem*/ = document.createElement('input') /*>>inputelem*/ ,

    /*>>smile*/
    smile = ':)',
    /*>>smile*/

    toString = {}.toString,

    // TODO :: make the prefixes more granular
    /*>>prefixes*/
    // List of property values to set for css tests. See ticket #21
    prefixes = ' -webkit- -moz- -o- -ms- '.split(' '),
    /*>>prefixes*/

    /*>>domprefixes*/
    // Following spec is to expose vendor-specific style properties as:
    //   elem.style.WebkitBorderRadius
    // and the following would be incorrect:
    //   elem.style.webkitBorderRadius

    // Webkit ghosts their properties in lowercase but Opera & Moz do not.
    // Microsoft uses a lowercase `ms` instead of the correct `Ms` in IE8+
    //   erik.eae.net/archives/2008/03/10/21.48.10/

    // More here: github.com/Modernizr/Modernizr/issues/issue/21
    omPrefixes = 'Webkit Moz O ms',

    cssomPrefixes = omPrefixes.split(' '),

    domPrefixes = omPrefixes.toLowerCase().split(' '),
    /*>>domprefixes*/

    /*>>ns*/
    ns = {'svg': 'http://www.w3.org/2000/svg'},
    /*>>ns*/

    tests = {},
    inputs = {},
    attrs = {},

    classes = [],

    slice = classes.slice,

    featureName, // used in testing loop


    /*>>teststyles*/
    // Inject element with style element and some CSS rules
    injectElementWithStyles = function( rule, callback, nodes, testnames ) {

      var style, ret, node, docOverflow,
          div = document.createElement('div'),
          // After page load injecting a fake body doesn't work so check if body exists
          body = document.body,
          // IE6 and 7 won't return offsetWidth or offsetHeight unless it's in the body element, so we fake it.
          fakeBody = body || document.createElement('body');

      if ( parseInt(nodes, 10) ) {
          // In order not to give false positives we create a node for each test
          // This also allows the method to scale for unspecified uses
          while ( nodes-- ) {
              node = document.createElement('div');
              node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
              div.appendChild(node);
          }
      }

      // <style> elements in IE6-9 are considered 'NoScope' elements and therefore will be removed
      // when injected with innerHTML. To get around this you need to prepend the 'NoScope' element
      // with a 'scoped' element, in our case the soft-hyphen entity as it won't mess with our measurements.
      // msdn.microsoft.com/en-us/library/ms533897%28VS.85%29.aspx
      // Documents served as xml will throw if using &shy; so use xml friendly encoded version. See issue #277
      style = ['&#173;','<style id="s', mod, '">', rule, '</style>'].join('');
      div.id = mod;
      // IE6 will false positive on some tests due to the style element inside the test div somehow interfering offsetHeight, so insert it into body or fakebody.
      // Opera will act all quirky when injecting elements in documentElement when page is served as xml, needs fakebody too. #270
      (body ? div : fakeBody).innerHTML += style;
      fakeBody.appendChild(div);
      if ( !body ) {
          //avoid crashing IE8, if background image is used
          fakeBody.style.background = '';
          //Safari 5.13/5.1.4 OSX stops loading if ::-webkit-scrollbar is used and scrollbars are visible
          fakeBody.style.overflow = 'hidden';
          docOverflow = docElement.style.overflow;
          docElement.style.overflow = 'hidden';
          docElement.appendChild(fakeBody);
      }

      ret = callback(div, rule);
      // If this is done after page load we don't want to remove the body so check if body exists
      if ( !body ) {
          fakeBody.parentNode.removeChild(fakeBody);
          docElement.style.overflow = docOverflow;
      } else {
          div.parentNode.removeChild(div);
      }

      return !!ret;

    },
    /*>>teststyles*/

    /*>>mq*/
    // adapted from matchMedia polyfill
    // by Scott Jehl and Paul Irish
    // gist.github.com/786768
    testMediaQuery = function( mq ) {

      var matchMedia = window.matchMedia || window.msMatchMedia;
      if ( matchMedia ) {
        return matchMedia(mq) && matchMedia(mq).matches || false;
      }

      var bool;

      injectElementWithStyles('@media ' + mq + ' { #' + mod + ' { position: absolute; } }', function( node ) {
        bool = (window.getComputedStyle ?
                  getComputedStyle(node, null) :
                  node.currentStyle)['position'] == 'absolute';
      });

      return bool;

     },
     /*>>mq*/


    /*>>hasevent*/
    //
    // isEventSupported determines if a given element supports the given event
    // kangax.github.com/iseventsupported/
    //
    // The following results are known incorrects:
    //   Modernizr.hasEvent("webkitTransitionEnd", elem) // false negative
    //   Modernizr.hasEvent("textInput") // in Webkit. github.com/Modernizr/Modernizr/issues/333
    //   ...
    isEventSupported = (function() {

      var TAGNAMES = {
        'select': 'input', 'change': 'input',
        'submit': 'form', 'reset': 'form',
        'error': 'img', 'load': 'img', 'abort': 'img'
      };

      function isEventSupported( eventName, element ) {

        element = element || document.createElement(TAGNAMES[eventName] || 'div');
        eventName = 'on' + eventName;

        // When using `setAttribute`, IE skips "unload", WebKit skips "unload" and "resize", whereas `in` "catches" those
        var isSupported = eventName in element;

        if ( !isSupported ) {
          // If it has no `setAttribute` (i.e. doesn't implement Node interface), try generic element
          if ( !element.setAttribute ) {
            element = document.createElement('div');
          }
          if ( element.setAttribute && element.removeAttribute ) {
            element.setAttribute(eventName, '');
            isSupported = is(element[eventName], 'function');

            // If property was created, "remove it" (by setting value to `undefined`)
            if ( !is(element[eventName], 'undefined') ) {
              element[eventName] = undefined;
            }
            element.removeAttribute(eventName);
          }
        }

        element = null;
        return isSupported;
      }
      return isEventSupported;
    })(),
    /*>>hasevent*/

    // TODO :: Add flag for hasownprop ? didn't last time

    // hasOwnProperty shim by kangax needed for Safari 2.0 support
    _hasOwnProperty = ({}).hasOwnProperty, hasOwnProp;

    if ( !is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined') ) {
      hasOwnProp = function (object, property) {
        return _hasOwnProperty.call(object, property);
      };
    }
    else {
      hasOwnProp = function (object, property) { /* yes, this can give false positives/negatives, but most of the time we don't care about those */
        return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
      };
    }

    // Adapted from ES5-shim https://github.com/kriskowal/es5-shim/blob/master/es5-shim.js
    // es5.github.com/#x15.3.4.5

    if (!Function.prototype.bind) {
      Function.prototype.bind = function bind(that) {

        var target = this;

        if (typeof target != "function") {
            throw new TypeError();
        }

        var args = slice.call(arguments, 1),
            bound = function () {

            if (this instanceof bound) {

              var F = function(){};
              F.prototype = target.prototype;
              var self = new F();

              var result = target.apply(
                  self,
                  args.concat(slice.call(arguments))
              );
              if (Object(result) === result) {
                  return result;
              }
              return self;

            } else {

              return target.apply(
                  that,
                  args.concat(slice.call(arguments))
              );

            }

        };

        return bound;
      };
    }

    /**
     * setCss applies given styles to the Modernizr DOM node.
     */
    function setCss( str ) {
        mStyle.cssText = str;
    }

    /**
     * setCssAll extrapolates all vendor-specific css strings.
     */
    function setCssAll( str1, str2 ) {
        return setCss(prefixes.join(str1 + ';') + ( str2 || '' ));
    }

    /**
     * is returns a boolean for if typeof obj is exactly type.
     */
    function is( obj, type ) {
        return typeof obj === type;
    }

    /**
     * contains returns a boolean for if substr is found within str.
     */
    function contains( str, substr ) {
        return !!~('' + str).indexOf(substr);
    }

    /*>>testprop*/

    // testProps is a generic CSS / DOM property test.

    // In testing support for a given CSS property, it's legit to test:
    //    `elem.style[styleName] !== undefined`
    // If the property is supported it will return an empty string,
    // if unsupported it will return undefined.

    // We'll take advantage of this quick test and skip setting a style
    // on our modernizr element, but instead just testing undefined vs
    // empty string.

    // Because the testing of the CSS property names (with "-", as
    // opposed to the camelCase DOM properties) is non-portable and
    // non-standard but works in WebKit and IE (but not Gecko or Opera),
    // we explicitly reject properties with dashes so that authors
    // developing in WebKit or IE first don't end up with
    // browser-specific content by accident.

    function testProps( props, prefixed ) {
        for ( var i in props ) {
            var prop = props[i];
            if ( !contains(prop, "-") && mStyle[prop] !== undefined ) {
                return prefixed == 'pfx' ? prop : true;
            }
        }
        return false;
    }
    /*>>testprop*/

    // TODO :: add testDOMProps
    /**
     * testDOMProps is a generic DOM property test; if a browser supports
     *   a certain property, it won't return undefined for it.
     */
    function testDOMProps( props, obj, elem ) {
        for ( var i in props ) {
            var item = obj[props[i]];
            if ( item !== undefined) {

                // return the property name as a string
                if (elem === false) return props[i];

                // let's bind a function
                if (is(item, 'function')){
                  // default to autobind unless override
                  return item.bind(elem || obj);
                }

                // return the unbound function or obj or value
                return item;
            }
        }
        return false;
    }

    /*>>testallprops*/
    /**
     * testPropsAll tests a list of DOM properties we want to check against.
     *   We specify literally ALL possible (known and/or likely) properties on
     *   the element including the non-vendor prefixed one, for forward-
     *   compatibility.
     */
    function testPropsAll( prop, prefixed, elem ) {

        var ucProp  = prop.charAt(0).toUpperCase() + prop.slice(1),
            props   = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');

        // did they call .prefixed('boxSizing') or are we just testing a prop?
        if(is(prefixed, "string") || is(prefixed, "undefined")) {
          return testProps(props, prefixed);

        // otherwise, they called .prefixed('requestAnimationFrame', window[, elem])
        } else {
          props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');
          return testDOMProps(props, prefixed, elem);
        }
    }
    /*>>testallprops*/


    /**
     * Tests
     * -----
     */

    // The *new* flexbox
    // dev.w3.org/csswg/css3-flexbox

    tests['flexbox'] = function() {
      return testPropsAll('flexWrap');
    };

    // The *old* flexbox
    // www.w3.org/TR/2009/WD-css3-flexbox-20090723/

    tests['flexboxlegacy'] = function() {
        return testPropsAll('boxDirection');
    };

    // On the S60 and BB Storm, getContext exists, but always returns undefined
    // so we actually have to call getContext() to verify
    // github.com/Modernizr/Modernizr/issues/issue/97/

    tests['canvas'] = function() {
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    };

    tests['canvastext'] = function() {
        return !!(Modernizr['canvas'] && is(document.createElement('canvas').getContext('2d').fillText, 'function'));
    };

    // webk.it/70117 is tracking a legit WebGL feature detect proposal

    // We do a soft detect which may false positive in order to avoid
    // an expensive context creation: bugzil.la/732441

    tests['webgl'] = function() {
        return !!window.WebGLRenderingContext;
    };

    /*
     * The Modernizr.touch test only indicates if the browser supports
     *    touch events, which does not necessarily reflect a touchscreen
     *    device, as evidenced by tablets running Windows 7 or, alas,
     *    the Palm Pre / WebOS (touch) phones.
     *
     * Additionally, Chrome (desktop) used to lie about its support on this,
     *    but that has since been rectified: crbug.com/36415
     *
     * We also test for Firefox 4 Multitouch Support.
     *
     * For more info, see: modernizr.github.com/Modernizr/touch.html
     */

    tests['touch'] = function() {
        var bool;

        if(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
          bool = true;
        } else {
          injectElementWithStyles(['@media (',prefixes.join('touch-enabled),('),mod,')','{#modernizr{top:9px;position:absolute}}'].join(''), function( node ) {
            bool = node.offsetTop === 9;
          });
        }

        return bool;
    };


    // geolocation is often considered a trivial feature detect...
    // Turns out, it's quite tricky to get right:
    //
    // Using !!navigator.geolocation does two things we don't want. It:
    //   1. Leaks memory in IE9: github.com/Modernizr/Modernizr/issues/513
    //   2. Disables page caching in WebKit: webk.it/43956
    //
    // Meanwhile, in Firefox < 8, an about:config setting could expose
    // a false positive that would throw an exception: bugzil.la/688158

    tests['geolocation'] = function() {
        return 'geolocation' in navigator;
    };


    tests['postmessage'] = function() {
      return !!window.postMessage;
    };


    // Chrome incognito mode used to throw an exception when using openDatabase
    // It doesn't anymore.
    tests['websqldatabase'] = function() {
      return !!window.openDatabase;
    };

    // Vendors had inconsistent prefixing with the experimental Indexed DB:
    // - Webkit's implementation is accessible through webkitIndexedDB
    // - Firefox shipped moz_indexedDB before FF4b9, but since then has been mozIndexedDB
    // For speed, we don't test the legacy (and beta-only) indexedDB
    tests['indexedDB'] = function() {
      return !!testPropsAll("indexedDB", window);
    };

    // documentMode logic from YUI to filter out IE8 Compat Mode
    //   which false positives.
    tests['hashchange'] = function() {
      return isEventSupported('hashchange', window) && (document.documentMode === undefined || document.documentMode > 7);
    };

    // Per 1.6:
    // This used to be Modernizr.historymanagement but the longer
    // name has been deprecated in favor of a shorter and property-matching one.
    // The old API is still available in 1.6, but as of 2.0 will throw a warning,
    // and in the first release thereafter disappear entirely.
    tests['history'] = function() {
      return !!(window.history && history.pushState);
    };

    tests['draganddrop'] = function() {
        var div = document.createElement('div');
        return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
    };

    // FF3.6 was EOL'ed on 4/24/12, but the ESR version of FF10
    // will be supported until FF19 (2/12/13), at which time, ESR becomes FF17.
    // FF10 still uses prefixes, so check for it until then.
    // for more ESR info, see: mozilla.org/en-US/firefox/organizations/faq/
    tests['websockets'] = function() {
        return 'WebSocket' in window || 'MozWebSocket' in window;
    };


    // css-tricks.com/rgba-browser-support/
    tests['rgba'] = function() {
        // Set an rgba() color and check the returned value

        setCss('background-color:rgba(150,255,150,.5)');

        return contains(mStyle.backgroundColor, 'rgba');
    };

    tests['hsla'] = function() {
        // Same as rgba(), in fact, browsers re-map hsla() to rgba() internally,
        //   except IE9 who retains it as hsla

        setCss('background-color:hsla(120,40%,100%,.5)');

        return contains(mStyle.backgroundColor, 'rgba') || contains(mStyle.backgroundColor, 'hsla');
    };

    tests['multiplebgs'] = function() {
        // Setting multiple images AND a color on the background shorthand property
        //  and then querying the style.background property value for the number of
        //  occurrences of "url(" is a reliable method for detecting ACTUAL support for this!

        setCss('background:url(https://),url(https://),red url(https://)');

        // If the UA supports multiple backgrounds, there should be three occurrences
        //   of the string "url(" in the return value for elemStyle.background

        return (/(url\s*\(.*?){3}/).test(mStyle.background);
    };



    // this will false positive in Opera Mini
    //   github.com/Modernizr/Modernizr/issues/396

    tests['backgroundsize'] = function() {
        return testPropsAll('backgroundSize');
    };

    tests['borderimage'] = function() {
        return testPropsAll('borderImage');
    };


    // Super comprehensive table about all the unique implementations of
    // border-radius: muddledramblings.com/table-of-css3-border-radius-compliance

    tests['borderradius'] = function() {
        return testPropsAll('borderRadius');
    };

    // WebOS unfortunately false positives on this test.
    tests['boxshadow'] = function() {
        return testPropsAll('boxShadow');
    };

    // FF3.0 will false positive on this test
    tests['textshadow'] = function() {
        return document.createElement('div').style.textShadow === '';
    };


    tests['opacity'] = function() {
        // Browsers that actually have CSS Opacity implemented have done so
        //  according to spec, which means their return values are within the
        //  range of [0.0,1.0] - including the leading zero.

        setCssAll('opacity:.55');

        // The non-literal . in this regex is intentional:
        //   German Chrome returns this value as 0,55
        // github.com/Modernizr/Modernizr/issues/#issue/59/comment/516632
        return (/^0.55$/).test(mStyle.opacity);
    };


    // Note, Android < 4 will pass this test, but can only animate
    //   a single property at a time
    //   goo.gl/v3V4Gp
    tests['cssanimations'] = function() {
        return testPropsAll('animationName');
    };


    tests['csscolumns'] = function() {
        return testPropsAll('columnCount');
    };


    tests['cssgradients'] = function() {
        /**
         * For CSS Gradients syntax, please see:
         * webkit.org/blog/175/introducing-css-gradients/
         * developer.mozilla.org/en/CSS/-moz-linear-gradient
         * developer.mozilla.org/en/CSS/-moz-radial-gradient
         * dev.w3.org/csswg/css3-images/#gradients-
         */

        var str1 = 'background-image:',
            str2 = 'gradient(linear,left top,right bottom,from(#9f9),to(white));',
            str3 = 'linear-gradient(left top,#9f9, white);';

        setCss(
             // legacy webkit syntax (FIXME: remove when syntax not in use anymore)
              (str1 + '-webkit- '.split(' ').join(str2 + str1) +
             // standard syntax             // trailing 'background-image:'
              prefixes.join(str3 + str1)).slice(0, -str1.length)
        );

        return contains(mStyle.backgroundImage, 'gradient');
    };


    tests['cssreflections'] = function() {
        return testPropsAll('boxReflect');
    };


    tests['csstransforms'] = function() {
        return !!testPropsAll('transform');
    };


    tests['csstransforms3d'] = function() {

        var ret = !!testPropsAll('perspective');

        // Webkit's 3D transforms are passed off to the browser's own graphics renderer.
        //   It works fine in Safari on Leopard and Snow Leopard, but not in Chrome in
        //   some conditions. As a result, Webkit typically recognizes the syntax but
        //   will sometimes throw a false positive, thus we must do a more thorough check:
        if ( ret && 'webkitPerspective' in docElement.style ) {

          // Webkit allows this media query to succeed only if the feature is enabled.
          // `@media (transform-3d),(-webkit-transform-3d){ ... }`
          injectElementWithStyles('@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}', function( node, rule ) {
            ret = node.offsetLeft === 9 && node.offsetHeight === 3;
          });
        }
        return ret;
    };


    tests['csstransitions'] = function() {
        return testPropsAll('transition');
    };


    /*>>fontface*/
    // @font-face detection routine by Diego Perini
    // javascript.nwbox.com/CSSSupport/

    // false positives:
    //   WebOS github.com/Modernizr/Modernizr/issues/342
    //   WP7   github.com/Modernizr/Modernizr/issues/538
    tests['fontface'] = function() {
        var bool;

        injectElementWithStyles('@font-face {font-family:"font";src:url("https://")}', function( node, rule ) {
          var style = document.getElementById('smodernizr'),
              sheet = style.sheet || style.styleSheet,
              cssText = sheet ? (sheet.cssRules && sheet.cssRules[0] ? sheet.cssRules[0].cssText : sheet.cssText || '') : '';

          bool = /src/i.test(cssText) && cssText.indexOf(rule.split(' ')[0]) === 0;
        });

        return bool;
    };
    /*>>fontface*/

    // CSS generated content detection
    tests['generatedcontent'] = function() {
        var bool;

        injectElementWithStyles(['#',mod,'{font:0/0 a}#',mod,':after{content:"',smile,'";visibility:hidden;font:3px/1 a}'].join(''), function( node ) {
          bool = node.offsetHeight >= 3;
        });

        return bool;
    };



    // These tests evaluate support of the video/audio elements, as well as
    // testing what types of content they support.
    //
    // We're using the Boolean constructor here, so that we can extend the value
    // e.g.  Modernizr.video     // true
    //       Modernizr.video.ogg // 'probably'
    //
    // Codec values from : github.com/NielsLeenheer/html5test/blob/9106a8/index.html#L845
    //                     thx to NielsLeenheer and zcorpan

    // Note: in some older browsers, "no" was a return value instead of empty string.
    //   It was live in FF3.5.0 and 3.5.1, but fixed in 3.5.2
    //   It was also live in Safari 4.0.0 - 4.0.4, but fixed in 4.0.5

    tests['video'] = function() {
        var elem = document.createElement('video'),
            bool = false;

        // IE9 Running on Windows Server SKU can cause an exception to be thrown, bug #224
        try {
            if ( bool = !!elem.canPlayType ) {
                bool      = new Boolean(bool);
                bool.ogg  = elem.canPlayType('video/ogg; codecs="theora"')      .replace(/^no$/,'');

                // Without QuickTime, this value will be `undefined`. github.com/Modernizr/Modernizr/issues/546
                bool.h264 = elem.canPlayType('video/mp4; codecs="avc1.42E01E"') .replace(/^no$/,'');

                bool.webm = elem.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,'');
            }

        } catch(e) { }

        return bool;
    };

    tests['audio'] = function() {
        var elem = document.createElement('audio'),
            bool = false;

        try {
            if ( bool = !!elem.canPlayType ) {
                bool      = new Boolean(bool);
                bool.ogg  = elem.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,'');
                bool.mp3  = elem.canPlayType('audio/mpeg;')               .replace(/^no$/,'');

                // Mimetypes accepted:
                //   developer.mozilla.org/En/Media_formats_supported_by_the_audio_and_video_elements
                //   bit.ly/iphoneoscodecs
                bool.wav  = elem.canPlayType('audio/wav; codecs="1"')     .replace(/^no$/,'');
                bool.m4a  = ( elem.canPlayType('audio/x-m4a;')            ||
                              elem.canPlayType('audio/aac;'))             .replace(/^no$/,'');
            }
        } catch(e) { }

        return bool;
    };


    // In FF4, if disabled, window.localStorage should === null.

    // Normally, we could not test that directly and need to do a
    //   `('localStorage' in window) && ` test first because otherwise Firefox will
    //   throw bugzil.la/365772 if cookies are disabled

    // Also in iOS5 Private Browsing mode, attempting to use localStorage.setItem
    // will throw the exception:
    //   QUOTA_EXCEEDED_ERRROR DOM Exception 22.
    // Peculiarly, getItem and removeItem calls do not throw.

    // Because we are forced to try/catch this, we'll go aggressive.

    // Just FWIW: IE8 Compat mode supports these features completely:
    //   www.quirksmode.org/dom/html5.html
    // But IE8 doesn't support either with local files

    tests['localstorage'] = function() {
        try {
            localStorage.setItem(mod, mod);
            localStorage.removeItem(mod);
            return true;
        } catch(e) {
            return false;
        }
    };

    tests['sessionstorage'] = function() {
        try {
            sessionStorage.setItem(mod, mod);
            sessionStorage.removeItem(mod);
            return true;
        } catch(e) {
            return false;
        }
    };


    tests['webworkers'] = function() {
        return !!window.Worker;
    };


    tests['applicationcache'] = function() {
        return !!window.applicationCache;
    };


    // Thanks to Erik Dahlstrom
    tests['svg'] = function() {
        return !!document.createElementNS && !!document.createElementNS(ns.svg, 'svg').createSVGRect;
    };

    // specifically for SVG inline in HTML, not within XHTML
    // test page: paulirish.com/demo/inline-svg
    tests['inlinesvg'] = function() {
      var div = document.createElement('div');
      div.innerHTML = '<svg/>';
      return (div.firstChild && div.firstChild.namespaceURI) == ns.svg;
    };

    // SVG SMIL animation
    tests['smil'] = function() {
        return !!document.createElementNS && /SVGAnimate/.test(toString.call(document.createElementNS(ns.svg, 'animate')));
    };

    // This test is only for clip paths in SVG proper, not clip paths on HTML content
    // demo: srufaculty.sru.edu/david.dailey/svg/newstuff/clipPath4.svg

    // However read the comments to dig into applying SVG clippaths to HTML content here:
    //   github.com/Modernizr/Modernizr/issues/213#issuecomment-1149491
    tests['svgclippaths'] = function() {
        return !!document.createElementNS && /SVGClipPath/.test(toString.call(document.createElementNS(ns.svg, 'clipPath')));
    };

    /*>>webforms*/
    // input features and input types go directly onto the ret object, bypassing the tests loop.
    // Hold this guy to execute in a moment.
    function webforms() {
        /*>>input*/
        // Run through HTML5's new input attributes to see if the UA understands any.
        // We're using f which is the <input> element created early on
        // Mike Taylr has created a comprehensive resource for testing these attributes
        //   when applied to all input types:
        //   miketaylr.com/code/input-type-attr.html
        // spec: www.whatwg.org/specs/web-apps/current-work/multipage/the-input-element.html#input-type-attr-summary

        // Only input placeholder is tested while textarea's placeholder is not.
        // Currently Safari 4 and Opera 11 have support only for the input placeholder
        // Both tests are available in feature-detects/forms-placeholder.js
        Modernizr['input'] = (function( props ) {
            for ( var i = 0, len = props.length; i < len; i++ ) {
                attrs[ props[i] ] = !!(props[i] in inputElem);
            }
            if (attrs.list){
              // safari false positive's on datalist: webk.it/74252
              // see also github.com/Modernizr/Modernizr/issues/146
              attrs.list = !!(document.createElement('datalist') && window.HTMLDataListElement);
            }
            return attrs;
        })('autocomplete autofocus list placeholder max min multiple pattern required step'.split(' '));
        /*>>input*/

        /*>>inputtypes*/
        // Run through HTML5's new input types to see if the UA understands any.
        //   This is put behind the tests runloop because it doesn't return a
        //   true/false like all the other tests; instead, it returns an object
        //   containing each input type with its corresponding true/false value

        // Big thanks to @miketaylr for the html5 forms expertise. miketaylr.com/
        Modernizr['inputtypes'] = (function(props) {

            for ( var i = 0, bool, inputElemType, defaultView, len = props.length; i < len; i++ ) {

                inputElem.setAttribute('type', inputElemType = props[i]);
                bool = inputElem.type !== 'text';

                // We first check to see if the type we give it sticks..
                // If the type does, we feed it a textual value, which shouldn't be valid.
                // If the value doesn't stick, we know there's input sanitization which infers a custom UI
                if ( bool ) {

                    inputElem.value         = smile;
                    inputElem.style.cssText = 'position:absolute;visibility:hidden;';

                    if ( /^range$/.test(inputElemType) && inputElem.style.WebkitAppearance !== undefined ) {

                      docElement.appendChild(inputElem);
                      defaultView = document.defaultView;

                      // Safari 2-4 allows the smiley as a value, despite making a slider
                      bool =  defaultView.getComputedStyle &&
                              defaultView.getComputedStyle(inputElem, null).WebkitAppearance !== 'textfield' &&
                              // Mobile android web browser has false positive, so must
                              // check the height to see if the widget is actually there.
                              (inputElem.offsetHeight !== 0);

                      docElement.removeChild(inputElem);

                    } else if ( /^(search|tel)$/.test(inputElemType) ){
                      // Spec doesn't define any special parsing or detectable UI
                      //   behaviors so we pass these through as true

                      // Interestingly, opera fails the earlier test, so it doesn't
                      //  even make it here.

                    } else if ( /^(url|email)$/.test(inputElemType) ) {
                      // Real url and email support comes with prebaked validation.
                      bool = inputElem.checkValidity && inputElem.checkValidity() === false;

                    } else {
                      // If the upgraded input compontent rejects the :) text, we got a winner
                      bool = inputElem.value != smile;
                    }
                }

                inputs[ props[i] ] = !!bool;
            }
            return inputs;
        })('search tel url email datetime date month week time datetime-local number range color'.split(' '));
        /*>>inputtypes*/
    }
    /*>>webforms*/


    // End of test definitions
    // -----------------------



    // Run through all tests and detect their support in the current UA.
    // todo: hypothetically we could be doing an array of tests and use a basic loop here.
    for ( var feature in tests ) {
        if ( hasOwnProp(tests, feature) ) {
            // run the test, throw the return value into the Modernizr,
            //   then based on that boolean, define an appropriate className
            //   and push it into an array of classes we'll join later.
            featureName  = feature.toLowerCase();
            Modernizr[featureName] = tests[feature]();

            classes.push((Modernizr[featureName] ? '' : 'no-') + featureName);
        }
    }

    /*>>webforms*/
    // input tests need to run.
    Modernizr.input || webforms();
    /*>>webforms*/


    /**
     * addTest allows the user to define their own feature tests
     * the result will be added onto the Modernizr object,
     * as well as an appropriate className set on the html element
     *
     * @param feature - String naming the feature
     * @param test - Function returning true if feature is supported, false if not
     */
     Modernizr.addTest = function ( feature, test ) {
       if ( typeof feature == 'object' ) {
         for ( var key in feature ) {
           if ( hasOwnProp( feature, key ) ) {
             Modernizr.addTest( key, feature[ key ] );
           }
         }
       } else {

         feature = feature.toLowerCase();

         if ( Modernizr[feature] !== undefined ) {
           // we're going to quit if you're trying to overwrite an existing test
           // if we were to allow it, we'd do this:
           //   var re = new RegExp("\\b(no-)?" + feature + "\\b");
           //   docElement.className = docElement.className.replace( re, '' );
           // but, no rly, stuff 'em.
           return Modernizr;
         }

         test = typeof test == 'function' ? test() : test;

         if (typeof enableClasses !== "undefined" && enableClasses) {
           docElement.className += ' ' + (test ? '' : 'no-') + feature;
         }
         Modernizr[feature] = test;

       }

       return Modernizr; // allow chaining.
     };


    // Reset modElem.cssText to nothing to reduce memory footprint.
    setCss('');
    modElem = inputElem = null;

    /*>>shiv*/
    /**
     * @preserve HTML5 Shiv prev3.7.1 | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed
     */
    ;(function(window, document) {
        /*jshint evil:true */
        /** version */
        var version = '3.7.0';

        /** Preset options */
        var options = window.html5 || {};

        /** Used to skip problem elements */
        var reSkip = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;

        /** Not all elements can be cloned in IE **/
        var saveClones = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;

        /** Detect whether the browser supports default html5 styles */
        var supportsHtml5Styles;

        /** Name of the expando, to work with multiple documents or to re-shiv one document */
        var expando = '_html5shiv';

        /** The id for the the documents expando */
        var expanID = 0;

        /** Cached data for each document */
        var expandoData = {};

        /** Detect whether the browser supports unknown elements */
        var supportsUnknownElements;

        (function() {
          try {
            var a = document.createElement('a');
            a.innerHTML = '<xyz></xyz>';
            //if the hidden property is implemented we can assume, that the browser supports basic HTML5 Styles
            supportsHtml5Styles = ('hidden' in a);

            supportsUnknownElements = a.childNodes.length == 1 || (function() {
              // assign a false positive if unable to shiv
              (document.createElement)('a');
              var frag = document.createDocumentFragment();
              return (
                typeof frag.cloneNode == 'undefined' ||
                typeof frag.createDocumentFragment == 'undefined' ||
                typeof frag.createElement == 'undefined'
              );
            }());
          } catch(e) {
            // assign a false positive if detection fails => unable to shiv
            supportsHtml5Styles = true;
            supportsUnknownElements = true;
          }

        }());

        /*--------------------------------------------------------------------------*/

        /**
         * Creates a style sheet with the given CSS text and adds it to the document.
         * @private
         * @param {Document} ownerDocument The document.
         * @param {String} cssText The CSS text.
         * @returns {StyleSheet} The style element.
         */
        function addStyleSheet(ownerDocument, cssText) {
          var p = ownerDocument.createElement('p'),
          parent = ownerDocument.getElementsByTagName('head')[0] || ownerDocument.documentElement;

          p.innerHTML = 'x<style>' + cssText + '</style>';
          return parent.insertBefore(p.lastChild, parent.firstChild);
        }

        /**
         * Returns the value of `html5.elements` as an array.
         * @private
         * @returns {Array} An array of shived element node names.
         */
        function getElements() {
          var elements = html5.elements;
          return typeof elements == 'string' ? elements.split(' ') : elements;
        }

        /**
         * Returns the data associated to the given document
         * @private
         * @param {Document} ownerDocument The document.
         * @returns {Object} An object of data.
         */
        function getExpandoData(ownerDocument) {
          var data = expandoData[ownerDocument[expando]];
          if (!data) {
            data = {};
            expanID++;
            ownerDocument[expando] = expanID;
            expandoData[expanID] = data;
          }
          return data;
        }

        /**
         * returns a shived element for the given nodeName and document
         * @memberOf html5
         * @param {String} nodeName name of the element
         * @param {Document} ownerDocument The context document.
         * @returns {Object} The shived element.
         */
        function createElement(nodeName, ownerDocument, data){
          if (!ownerDocument) {
            ownerDocument = document;
          }
          if(supportsUnknownElements){
            return ownerDocument.createElement(nodeName);
          }
          if (!data) {
            data = getExpandoData(ownerDocument);
          }
          var node;

          if (data.cache[nodeName]) {
            node = data.cache[nodeName].cloneNode();
          } else if (saveClones.test(nodeName)) {
            node = (data.cache[nodeName] = data.createElem(nodeName)).cloneNode();
          } else {
            node = data.createElem(nodeName);
          }

          // Avoid adding some elements to fragments in IE < 9 because
          // * Attributes like `name` or `type` cannot be set/changed once an element
          //   is inserted into a document/fragment
          // * Link elements with `src` attributes that are inaccessible, as with
          //   a 403 response, will cause the tab/window to crash
          // * Script elements appended to fragments will execute when their `src`
          //   or `text` property is set
          return node.canHaveChildren && !reSkip.test(nodeName) && !node.tagUrn ? data.frag.appendChild(node) : node;
        }

        /**
         * returns a shived DocumentFragment for the given document
         * @memberOf html5
         * @param {Document} ownerDocument The context document.
         * @returns {Object} The shived DocumentFragment.
         */
        function createDocumentFragment(ownerDocument, data){
          if (!ownerDocument) {
            ownerDocument = document;
          }
          if(supportsUnknownElements){
            return ownerDocument.createDocumentFragment();
          }
          data = data || getExpandoData(ownerDocument);
          var clone = data.frag.cloneNode(),
          i = 0,
          elems = getElements(),
          l = elems.length;
          for(;i<l;i++){
            clone.createElement(elems[i]);
          }
          return clone;
        }

        /**
         * Shivs the `createElement` and `createDocumentFragment` methods of the document.
         * @private
         * @param {Document|DocumentFragment} ownerDocument The document.
         * @param {Object} data of the document.
         */
        function shivMethods(ownerDocument, data) {
          if (!data.cache) {
            data.cache = {};
            data.createElem = ownerDocument.createElement;
            data.createFrag = ownerDocument.createDocumentFragment;
            data.frag = data.createFrag();
          }


          ownerDocument.createElement = function(nodeName) {
            //abort shiv
            if (!html5.shivMethods) {
              return data.createElem(nodeName);
            }
            return createElement(nodeName, ownerDocument, data);
          };

          ownerDocument.createDocumentFragment = Function('h,f', 'return function(){' +
                                                          'var n=f.cloneNode(),c=n.createElement;' +
                                                          'h.shivMethods&&(' +
                                                          // unroll the `createElement` calls
                                                          getElements().join().replace(/[\w\-]+/g, function(nodeName) {
            data.createElem(nodeName);
            data.frag.createElement(nodeName);
            return 'c("' + nodeName + '")';
          }) +
            ');return n}'
                                                         )(html5, data.frag);
        }

        /*--------------------------------------------------------------------------*/

        /**
         * Shivs the given document.
         * @memberOf html5
         * @param {Document} ownerDocument The document to shiv.
         * @returns {Document} The shived document.
         */
        function shivDocument(ownerDocument) {
          if (!ownerDocument) {
            ownerDocument = document;
          }
          var data = getExpandoData(ownerDocument);

          if (html5.shivCSS && !supportsHtml5Styles && !data.hasCSS) {
            data.hasCSS = !!addStyleSheet(ownerDocument,
                                          // corrects block display not defined in IE6/7/8/9
                                          'article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}' +
                                            // adds styling not present in IE6/7/8/9
                                            'mark{background:#FF0;color:#000}' +
                                            // hides non-rendered elements
                                            'template{display:none}'
                                         );
          }
          if (!supportsUnknownElements) {
            shivMethods(ownerDocument, data);
          }
          return ownerDocument;
        }

        /*--------------------------------------------------------------------------*/

        /**
         * The `html5` object is exposed so that more elements can be shived and
         * existing shiving can be detected on iframes.
         * @type Object
         * @example
         *
         * // options can be changed before the script is included
         * html5 = { 'elements': 'mark section', 'shivCSS': false, 'shivMethods': false };
         */
        var html5 = {

          /**
           * An array or space separated string of node names of the elements to shiv.
           * @memberOf html5
           * @type Array|String
           */
          'elements': options.elements || 'abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video',

          /**
           * current version of html5shiv
           */
          'version': version,

          /**
           * A flag to indicate that the HTML5 style sheet should be inserted.
           * @memberOf html5
           * @type Boolean
           */
          'shivCSS': (options.shivCSS !== false),

          /**
           * Is equal to true if a browser supports creating unknown/HTML5 elements
           * @memberOf html5
           * @type boolean
           */
          'supportsUnknownElements': supportsUnknownElements,

          /**
           * A flag to indicate that the document's `createElement` and `createDocumentFragment`
           * methods should be overwritten.
           * @memberOf html5
           * @type Boolean
           */
          'shivMethods': (options.shivMethods !== false),

          /**
           * A string to describe the type of `html5` object ("default" or "default print").
           * @memberOf html5
           * @type String
           */
          'type': 'default',

          // shivs the document according to the specified `html5` object options
          'shivDocument': shivDocument,

          //creates a shived element
          createElement: createElement,

          //creates a shived documentFragment
          createDocumentFragment: createDocumentFragment
        };

        /*--------------------------------------------------------------------------*/

        // expose html5
        window.html5 = html5;

        // shiv the document
        shivDocument(document);

    }(this, document));
    /*>>shiv*/

    // Assign private properties to the return object with prefix
    Modernizr._version      = version;

    // expose these for the plugin API. Look in the source for how to join() them against your input
    /*>>prefixes*/
    Modernizr._prefixes     = prefixes;
    /*>>prefixes*/
    /*>>domprefixes*/
    Modernizr._domPrefixes  = domPrefixes;
    Modernizr._cssomPrefixes  = cssomPrefixes;
    /*>>domprefixes*/

    /*>>mq*/
    // Modernizr.mq tests a given media query, live against the current state of the window
    // A few important notes:
    //   * If a browser does not support media queries at all (eg. oldIE) the mq() will always return false
    //   * A max-width or orientation query will be evaluated against the current state, which may change later.
    //   * You must specify values. Eg. If you are testing support for the min-width media query use:
    //       Modernizr.mq('(min-width:0)')
    // usage:
    // Modernizr.mq('only screen and (max-width:768)')
    Modernizr.mq            = testMediaQuery;
    /*>>mq*/

    /*>>hasevent*/
    // Modernizr.hasEvent() detects support for a given event, with an optional element to test on
    // Modernizr.hasEvent('gesturestart', elem)
    Modernizr.hasEvent      = isEventSupported;
    /*>>hasevent*/

    /*>>testprop*/
    // Modernizr.testProp() investigates whether a given style property is recognized
    // Note that the property names must be provided in the camelCase variant.
    // Modernizr.testProp('pointerEvents')
    Modernizr.testProp      = function(prop){
        return testProps([prop]);
    };
    /*>>testprop*/

    /*>>testallprops*/
    // Modernizr.testAllProps() investigates whether a given style property,
    //   or any of its vendor-prefixed variants, is recognized
    // Note that the property names must be provided in the camelCase variant.
    // Modernizr.testAllProps('boxSizing')
    Modernizr.testAllProps  = testPropsAll;
    /*>>testallprops*/


    /*>>teststyles*/
    // Modernizr.testStyles() allows you to add custom styles to the document and test an element afterwards
    // Modernizr.testStyles('#modernizr { position:absolute }', function(elem, rule){ ... })
    Modernizr.testStyles    = injectElementWithStyles;
    /*>>teststyles*/


    /*>>prefixed*/
    // Modernizr.prefixed() returns the prefixed or nonprefixed property name variant of your input
    // Modernizr.prefixed('boxSizing') // 'MozBoxSizing'

    // Properties must be passed as dom-style camelcase, rather than `box-sizing` hypentated style.
    // Return values will also be the camelCase variant, if you need to translate that to hypenated style use:
    //
    //     str.replace(/([A-Z])/g, function(str,m1){ return '-' + m1.toLowerCase(); }).replace(/^ms-/,'-ms-');

    // If you're trying to ascertain which transition end event to bind to, you might do something like...
    //
    //     var transEndEventNames = {
    //       'WebkitTransition' : 'webkitTransitionEnd',
    //       'MozTransition'    : 'transitionend',
    //       'OTransition'      : 'oTransitionEnd',
    //       'msTransition'     : 'MSTransitionEnd',
    //       'transition'       : 'transitionend'
    //     },
    //     transEndEventName = transEndEventNames[ Modernizr.prefixed('transition') ];

    Modernizr.prefixed      = function(prop, obj, elem){
      if(!obj) {
        return testPropsAll(prop, 'pfx');
      } else {
        // Testing DOM property e.g. Modernizr.prefixed('requestAnimationFrame', window) // 'mozRequestAnimationFrame'
        return testPropsAll(prop, obj, elem);
      }
    };
    /*>>prefixed*/


    /*>>cssclasses*/
    // Remove "no-js" class from <html> element, if it exists:
    docElement.className = docElement.className.replace(/(^|\s)no-js(\s|$)/, '$1$2') +

                            // Add the new classes to the <html> element.
                            (enableClasses ? ' js ' + classes.join(' ') : '');
    /*>>cssclasses*/

    return Modernizr;

})(this, this.document);

//============================================================
//
// Copyright (C) 2013 Matthew Wagerfield
//
// Twitter: https://twitter.com/mwagerfield
//
// Permission is hereby granted, free of charge, to any
// person obtaining a copy of this software and associated
// documentation files (the "Software"), to deal in the
// Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute,
// sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do
// so, subject to the following conditions:
//
// The above copyright notice and this permission notice
// shall be included in all copies or substantial portions
// of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY
// OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
// LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO
// EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
// FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
// AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
// OR OTHER DEALINGS IN THE SOFTWARE.
//
//============================================================

/**
 * Defines the Flat Surface Shader namespace for all the awesomeness to exist upon.
 * @author Matthew Wagerfield
 */
 FSS = {
  FRONT  : 0,
  BACK   : 1,
  DOUBLE : 2,
  SVGNS  : 'http://www.w3.org/2000/svg'
};

/**
 * @class Array
 * @author Matthew Wagerfield
 */
 FSS.Array = typeof Float32Array === 'function' ? Float32Array : Array;

/**
 * @class Utils
 * @author Matthew Wagerfield
 */
 FSS.Utils = {
  isNumber: function(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }
};

/**
 * Request Animation Frame Polyfill.
 * @author Paul Irish
 * @see https://gist.github.com/paulirish/1579671
 */
 (function() {

  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];

  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame  = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback, element) {
      var currentTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currentTime - lastTime));
      var id = window.setTimeout(function() {
        callback(currentTime + timeToCall);
      }, timeToCall);
      lastTime = currentTime + timeToCall;
      return id;
    };
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }

}());

/**
 * @object Math Augmentation
 * @author Matthew Wagerfield
 */
 Math.PIM2 = Math.PI*2;
 Math.PID2 = Math.PI/2;
 Math.randomInRange = function(min, max) {
  return min + (max - min) * Math.random();
};
Math.clamp = function(value, min, max) {
  value = Math.max(value, min);
  value = Math.min(value, max);
  return value;
};

/**
 * @object Vector3
 * @author Matthew Wagerfield
 */
 FSS.Vector3 = {
  create: function(x, y, z) {
    var vector = new FSS.Array(3);
    this.set(vector, x, y, z);
    return vector;
  },
  clone: function(a) {
    var vector = this.create();
    this.copy(vector, a);
    return vector;
  },
  set: function(target, x, y, z) {
    target[0] = x || 0;
    target[1] = y || 0;
    target[2] = z || 0;
    return this;
  },
  setX: function(target, x) {
    target[0] = x || 0;
    return this;
  },
  setY: function(target, y) {
    target[1] = y || 0;
    return this;
  },
  setZ: function(target, z) {
    target[2] = z || 0;
    return this;
  },
  copy: function(target, a) {
    target[0] = a[0];
    target[1] = a[1];
    target[2] = a[2];
    return this;
  },
  add: function(target, a) {
    target[0] += a[0];
    target[1] += a[1];
    target[2] += a[2];
    return this;
  },
  addVectors: function(target, a, b) {
    target[0] = a[0] + b[0];
    target[1] = a[1] + b[1];
    target[2] = a[2] + b[2];
    return this;
  },
  addScalar: function(target, s) {
    target[0] += s;
    target[1] += s;
    target[2] += s;
    return this;
  },
  subtract: function(target, a) {
    target[0] -= a[0];
    target[1] -= a[1];
    target[2] -= a[2];
    return this;
  },
  subtractVectors: function(target, a, b) {
    target[0] = a[0] - b[0];
    target[1] = a[1] - b[1];
    target[2] = a[2] - b[2];
    return this;
  },
  subtractScalar: function(target, s) {
    target[0] -= s;
    target[1] -= s;
    target[2] -= s;
    return this;
  },
  multiply: function(target, a) {
    target[0] *= a[0];
    target[1] *= a[1];
    target[2] *= a[2];
    return this;
  },
  multiplyVectors: function(target, a, b) {
    target[0] = a[0] * b[0];
    target[1] = a[1] * b[1];
    target[2] = a[2] * b[2];
    return this;
  },
  multiplyScalar: function(target, s) {
    target[0] *= s;
    target[1] *= s;
    target[2] *= s;
    return this;
  },
  divide: function(target, a) {
    target[0] /= a[0];
    target[1] /= a[1];
    target[2] /= a[2];
    return this;
  },
  divideVectors: function(target, a, b) {
    target[0] = a[0] / b[0];
    target[1] = a[1] / b[1];
    target[2] = a[2] / b[2];
    return this;
  },
  divideScalar: function(target, s) {
    if (s !== 0) {
      target[0] /= s;
      target[1] /= s;
      target[2] /= s;
    } else {
      target[0] = 0;
      target[1] = 0;
      target[2] = 0;
    }
    return this;
  },
  cross: function(target, a) {
    var x = target[0];
    var y = target[1];
    var z = target[2];
    target[0] = y*a[2] - z*a[1];
    target[1] = z*a[0] - x*a[2];
    target[2] = x*a[1] - y*a[0];
    return this;
  },
  crossVectors: function(target, a, b) {
    target[0] = a[1]*b[2] - a[2]*b[1];
    target[1] = a[2]*b[0] - a[0]*b[2];
    target[2] = a[0]*b[1] - a[1]*b[0];
    return this;
  },
  min: function(target, value) {
    if (target[0] < value) { target[0] = value; }
    if (target[1] < value) { target[1] = value; }
    if (target[2] < value) { target[2] = value; }
    return this;
  },
  max: function(target, value) {
    if (target[0] > value) { target[0] = value; }
    if (target[1] > value) { target[1] = value; }
    if (target[2] > value) { target[2] = value; }
    return this;
  },
  clamp: function(target, min, max) {
    this.min(target, min);
    this.max(target, max);
    return this;
  },
  limit: function(target, min, max) {
    var length = this.length(target);
    if (min !== null && length < min) {
      this.setLength(target, min);
    } else if (max !== null && length > max) {
      this.setLength(target, max);
    }
    return this;
  },
  dot: function(a, b) {
    return a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
  },
  normalise: function(target) {
    return this.divideScalar(target, this.length(target));
  },
  negate: function(target) {
    return this.multiplyScalar(target, -1);
  },
  distanceSquared: function(a, b) {
    var dx = a[0] - b[0];
    var dy = a[1] - b[1];
    var dz = a[2] - b[2];
    return dx*dx + dy*dy + dz*dz;
  },
  distance: function(a, b) {
    return Math.sqrt(this.distanceSquared(a, b));
  },
  lengthSquared: function(a) {
    return a[0]*a[0] + a[1]*a[1] + a[2]*a[2];
  },
  length: function(a) {
    return Math.sqrt(this.lengthSquared(a));
  },
  setLength: function(target, l) {
    var length = this.length(target);
    if (length !== 0 && l !== length) {
      this.multiplyScalar(target, l / length);
    }
    return this;
  }
};

/**
 * @object Vector4
 * @author Matthew Wagerfield
 */
 FSS.Vector4 = {
  create: function(x, y, z, w) {
    var vector = new FSS.Array(4);
    this.set(vector, x, y, z);
    return vector;
  },
  set: function(target, x, y, z, w) {
    target[0] = x || 0;
    target[1] = y || 0;
    target[2] = z || 0;
    target[3] = w || 0;
    return this;
  },
  setX: function(target, x) {
    target[0] = x || 0;
    return this;
  },
  setY: function(target, y) {
    target[1] = y || 0;
    return this;
  },
  setZ: function(target, z) {
    target[2] = z || 0;
    return this;
  },
  setW: function(target, w) {
    target[3] = w || 0;
    return this;
  },
  add: function(target, a) {
    target[0] += a[0];
    target[1] += a[1];
    target[2] += a[2];
    target[3] += a[3];
    return this;
  },
  multiplyVectors: function(target, a, b) {
    target[0] = a[0] * b[0];
    target[1] = a[1] * b[1];
    target[2] = a[2] * b[2];
    target[3] = a[3] * b[3];
    return this;
  },
  multiplyScalar: function(target, s) {
    target[0] *= s;
    target[1] *= s;
    target[2] *= s;
    target[3] *= s;
    return this;
  },
  min: function(target, value) {
    if (target[0] < value) { target[0] = value; }
    if (target[1] < value) { target[1] = value; }
    if (target[2] < value) { target[2] = value; }
    if (target[3] < value) { target[3] = value; }
    return this;
  },
  max: function(target, value) {
    if (target[0] > value) { target[0] = value; }
    if (target[1] > value) { target[1] = value; }
    if (target[2] > value) { target[2] = value; }
    if (target[3] > value) { target[3] = value; }
    return this;
  },
  clamp: function(target, min, max) {
    this.min(target, min);
    this.max(target, max);
    return this;
  }
};

/**
 * @class Color
 * @author Matthew Wagerfield
 */
 FSS.Color = function(hex, opacity) {
  this.rgba = FSS.Vector4.create();
  this.hex = hex || '#254540';
  this.opacity = FSS.Utils.isNumber(opacity) ? opacity : 1;
  this.set(this.hex, this.opacity);
};

FSS.Color.prototype = {
  set: function(hex, opacity) {
    hex = hex.replace('#', '');
    var size = hex.length / 3;
    this.rgba[0] = parseInt(hex.substring(size*0, size*1), 16) / 255;
    this.rgba[1] = parseInt(hex.substring(size*1, size*2), 16) / 255;
    this.rgba[2] = parseInt(hex.substring(size*2, size*3), 16) / 255;
    this.rgba[3] = FSS.Utils.isNumber(opacity) ? opacity : this.rgba[3];
    return this;
  },
  hexify: function(channel) {
    var hex = Math.ceil(channel*255).toString(16);
    if (hex.length === 1) { hex = '0' + hex; }
    return hex;
  },
  format: function() {
    var r = this.hexify(this.rgba[0]);
    var g = this.hexify(this.rgba[1]);
    var b = this.hexify(this.rgba[2]);
    this.hex = '#' + r + g + b;
    return this.hex;
  }
};

/**
 * @class Object
 * @author Matthew Wagerfield
 */
 FSS.Object = function() {
  this.position = FSS.Vector3.create();
};

FSS.Object.prototype = {
  setPosition: function(x, y, z) {
    FSS.Vector3.set(this.position, x, y, z);
    return this;
  }
};

/**
 * @class Light
 * @author Matthew Wagerfield
 */
 FSS.Light = function(ambient, diffuse) {
  FSS.Object.call(this);
  this.ambient = new FSS.Color(ambient || '#333333');
  this.diffuse = new FSS.Color(diffuse || '#333333');
  this.ray = FSS.Vector3.create();
};

FSS.Light.prototype = Object.create(FSS.Object.prototype);

/**
 * @class Vertex
 * @author Matthew Wagerfield
 */
 FSS.Vertex = function(x, y, z) {
  this.position = FSS.Vector3.create(x, y, z);
};

FSS.Vertex.prototype = {
  setPosition: function(x, y, z) {
    FSS.Vector3.set(this.position, x, y, z);
    return this;
  }
};

/**
 * @class Triangle
 * @author Matthew Wagerfield
 */
 FSS.Triangle = function(a, b, c) {
  this.a = a || new FSS.Vertex();
  this.b = b || new FSS.Vertex();
  this.c = c || new FSS.Vertex();
  this.vertices = [this.a, this.b, this.c];
  this.u = FSS.Vector3.create();
  this.v = FSS.Vector3.create();
  this.centroid = FSS.Vector3.create();
  this.normal = FSS.Vector3.create();
  this.color = new FSS.Color();
  this.polygon = document.createElementNS(FSS.SVGNS, 'polygon');
  this.polygon.setAttributeNS(null, 'stroke-linejoin', 'round');
  this.polygon.setAttributeNS(null, 'stroke-miterlimit', '1');
  this.polygon.setAttributeNS(null, 'stroke-width', '1');
  this.computeCentroid();
  this.computeNormal();
};

FSS.Triangle.prototype = {
  computeCentroid: function() {
    this.centroid[0] = this.a.position[0] + this.b.position[0] + this.c.position[0];
    this.centroid[1] = this.a.position[1] + this.b.position[1] + this.c.position[1];
    this.centroid[2] = this.a.position[2] + this.b.position[2] + this.c.position[2];
    FSS.Vector3.divideScalar(this.centroid, 3);
    return this;
  },
  computeNormal: function() {
    FSS.Vector3.subtractVectors(this.u, this.b.position, this.a.position);
    FSS.Vector3.subtractVectors(this.v, this.c.position, this.a.position);
    FSS.Vector3.crossVectors(this.normal, this.u, this.v);
    FSS.Vector3.normalise(this.normal);
    return this;
  }
};

/**
 * @class Geometry
 * @author Matthew Wagerfield
 */
 FSS.Geometry = function() {
  this.vertices = [];
  this.triangles = [];
  this.dirty = false;
};

FSS.Geometry.prototype = {
  update: function() {
    if (this.dirty) {
      var t,triangle;
      for (t = this.triangles.length - 1; t >= 0; t--) {
        triangle = this.triangles[t];
        triangle.computeCentroid();
        triangle.computeNormal();
      }
      this.dirty = false;
    }
    return this;
  }
};

/**
 * @class Plane
 * @author Matthew Wagerfield
 */
 FSS.Plane = function(width, height, segments, slices) {
  FSS.Geometry.call(this);
  this.width = width || 100;
  this.height = height || 100;
  this.segments = segments || 4;
  this.slices = slices || 4;
  this.segmentWidth = this.width / this.segments;
  this.sliceHeight = this.height / this.slices;

  // Cache Variables
  var x, y, v0, v1, v2, v3,
  vertex, triangle, vertices = [],
  offsetX = this.width * -0.5,
  offsetY = this.height * 0.5;

  // Add Vertices
  for (x = 0; x <= this.segments; x++) {
    vertices.push([]);
    for (y = 0; y <= this.slices; y++) {
      vertex = new FSS.Vertex(offsetX + x*this.segmentWidth, offsetY - y*this.sliceHeight);
      vertices[x].push(vertex);
      this.vertices.push(vertex);
    }
  }

  // Add Triangles
  for (x = 0; x < this.segments; x++) {
    for (y = 0; y < this.slices; y++) {
      v0 = vertices[x+0][y+0];
      v1 = vertices[x+0][y+1];
      v2 = vertices[x+1][y+0];
      v3 = vertices[x+1][y+1];
      t0 = new FSS.Triangle(v0, v1, v2);
      t1 = new FSS.Triangle(v2, v1, v3);
      this.triangles.push(t0, t1);
    }
  }
};

FSS.Plane.prototype = Object.create(FSS.Geometry.prototype);

/**
 * @class Material
 * @author Matthew Wagerfield
 */
 FSS.Material = function(ambient, diffuse) {
  this.ambient = new FSS.Color(ambient || '#444444');
  this.diffuse = new FSS.Color(diffuse || '#444444');
  this.slave = new FSS.Color();
};

/**
 * @class Mesh
 * @author Matthew Wagerfield
 */
 FSS.Mesh = function(geometry, material) {
  FSS.Object.call(this);
  this.geometry = geometry || new FSS.Geometry();
  this.material = material || new FSS.Material();
  this.side = FSS.FRONT;
  this.visible = true;
};

FSS.Mesh.prototype = Object.create(FSS.Object.prototype);

FSS.Mesh.prototype.update = function(lights, calculate) {
  var t,triangle, l,light, illuminance;

  // Update Geometry
  this.geometry.update();

  // Calculate the triangle colors
  if (calculate) {

    // Iterate through Triangles
    for (t = this.geometry.triangles.length - 1; t >= 0; t--) {
      triangle = this.geometry.triangles[t];

      // Reset Triangle Color
      FSS.Vector4.set(triangle.color.rgba);

      // Iterate through Lights
      for (l = lights.length - 1; l >= 0; l--) {
        light = lights[l];

        // Calculate Illuminance
        FSS.Vector3.subtractVectors(light.ray, light.position, triangle.centroid);
        FSS.Vector3.normalise(light.ray);
        illuminance = FSS.Vector3.dot(triangle.normal, light.ray);
        if (this.side === FSS.FRONT) {
          illuminance = Math.max(illuminance, 0);
        } else if (this.side === FSS.BACK) {
          illuminance = Math.abs(Math.min(illuminance, 0));
        } else if (this.side === FSS.DOUBLE) {
          illuminance = Math.max(Math.abs(illuminance), 0);
        }

        // Calculate Ambient Light
        FSS.Vector4.multiplyVectors(this.material.slave.rgba, this.material.ambient.rgba, light.ambient.rgba);
        FSS.Vector4.add(triangle.color.rgba, this.material.slave.rgba);

        // Calculate Diffuse Light
        FSS.Vector4.multiplyVectors(this.material.slave.rgba, this.material.diffuse.rgba, light.diffuse.rgba);
        FSS.Vector4.multiplyScalar(this.material.slave.rgba, illuminance);
        FSS.Vector4.add(triangle.color.rgba, this.material.slave.rgba);
      }

      // Clamp & Format Color
      FSS.Vector4.clamp(triangle.color.rgba, 0, 1);
    }
  }
  return this;
};

/**
 * @class Scene
 * @author Matthew Wagerfield
 */
 FSS.Scene = function() {
  this.meshes = [];
  this.lights = [];
};

FSS.Scene.prototype = {
  add: function(object) {
    if (object instanceof FSS.Mesh && !~this.meshes.indexOf(object)) {
      this.meshes.push(object);
    } else if (object instanceof FSS.Light && !~this.lights.indexOf(object)) {
      this.lights.push(object);
    }
    return this;
  },
  remove: function(object) {
    if (object instanceof FSS.Mesh && ~this.meshes.indexOf(object)) {
      this.meshes.splice(this.meshes.indexOf(object), 1);
    } else if (object instanceof FSS.Light && ~this.lights.indexOf(object)) {
      this.lights.splice(this.lights.indexOf(object), 1);
    }
    return this;
  }
};

/**
 * @class Renderer
 * @author Matthew Wagerfield
 */
 FSS.Renderer = function() {
  this.width = 0;
  this.height = 0;
  this.halfWidth = 0;
  this.halfHeight = 0;
};

FSS.Renderer.prototype = {
  setSize: function(width, height) {
    if (this.width === width && this.height === height) return;
    this.width = width;
    this.height = height;
    this.halfWidth = this.width * 0.5;
    this.halfHeight = this.height * 0.5;
    return this;
  },
  clear: function() {
    return this;
  },
  render: function(scene) {
    return this;
  }
};

/**
 * @class Canvas Renderer
 * @author Matthew Wagerfield
 */
 FSS.CanvasRenderer = function() {
  FSS.Renderer.call(this);
  this.element = document.createElement('canvas');
  this.element.style.display = 'block';
  this.element.setAttribute("id", "myCanvas");
  this.context = this.element.getContext('2d');
  //this.element.style.filter = "blur(10px)";
  this.setSize(this.element.width, this.element.height);
};

FSS.CanvasRenderer.prototype = Object.create(FSS.Renderer.prototype);

FSS.CanvasRenderer.prototype.setSize = function(width, height) {
  FSS.Renderer.prototype.setSize.call(this, width, height);
  this.element.width = width;
  this.element.height = height;
  this.context.setTransform(1, 0, 0, -1, this.halfWidth, this.halfHeight);
  return this;
};

FSS.CanvasRenderer.prototype.clear = function() {
  FSS.Renderer.prototype.clear.call(this);
  this.context.clearRect(-this.halfWidth, -this.halfHeight, this.width, this.height);
  return this;
};

FSS.CanvasRenderer.prototype.render = function(scene) {
  FSS.Renderer.prototype.render.call(this, scene);
  var m,mesh, t,triangle, color;

  // Clear Context
  this.clear();

  // Configure Context
  this.context.lineJoin = 'round';
  this.context.lineWidth = 1;

  // Update Meshes
  for (m = scene.meshes.length - 1; m >= 0; m--) {
    mesh = scene.meshes[m];
    if (mesh.visible) {
      mesh.update(scene.lights, true);

      // Render Triangles
      for (t = mesh.geometry.triangles.length - 1; t >= 0; t--) {
        triangle = mesh.geometry.triangles[t];
        color = triangle.color.format();
        this.context.beginPath();
        this.context.moveTo(triangle.a.position[0], triangle.a.position[1]);
        this.context.lineTo(triangle.b.position[0], triangle.b.position[1]);
        this.context.lineTo(triangle.c.position[0], triangle.c.position[1]);
        this.context.closePath();
        this.context.strokeStyle = color;
        this.context.fillStyle = color;
        this.context.stroke();
        this.context.fill();
      }
    }
  }
  return this;
};

/**
 * @class WebGL Renderer
 * @author Matthew Wagerfield
 */
 FSS.WebGLRenderer = function() {
  FSS.Renderer.call(this);
  this.element = document.createElement('canvas');
  this.element.style.display = 'block';

  // Set initial vertex and light count
  this.vertices = null;
  this.lights = null;

  // Create parameters object
  var parameters = {
    preserveDrawingBuffer: false,
    premultipliedAlpha: true,
    antialias: true,
    stencil: true,
    alpha: true
  };

  // Create and configure the gl context
  this.gl = this.getContext(this.element, parameters);

  // Set the internal support flag
  this.unsupported = !this.gl;

  // Setup renderer
  if (this.unsupported) {
    return 'WebGL is not supported by your browser.';
  } else {
    this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.setSize(this.element.width, this.element.height);
  }
};

FSS.WebGLRenderer.prototype = Object.create(FSS.Renderer.prototype);

FSS.WebGLRenderer.prototype.getContext = function(canvas, parameters) {
  var context = false;
  try {
    if (!(context = canvas.getContext('experimental-webgl', parameters))) {
      throw 'Error creating WebGL context.';
    }
  } catch (error) {
    console.error(error);
  }
  return context;
};

FSS.WebGLRenderer.prototype.setSize = function(width, height) {
  FSS.Renderer.prototype.setSize.call(this, width, height);
  if (this.unsupported) return;

  // Set the size of the canvas element
  this.element.width = width;
  this.element.height = height;

  // Set the size of the gl viewport
  this.gl.viewport(0, 0, width, height);
  return this;
};

FSS.WebGLRenderer.prototype.clear = function() {
  FSS.Renderer.prototype.clear.call(this);
  if (this.unsupported) return;
  this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  return this;
};

FSS.WebGLRenderer.prototype.render = function(scene) {
  FSS.Renderer.prototype.render.call(this, scene);
  if (this.unsupported) return;
  var m,mesh, t,tl,triangle, l,light,
  attribute, uniform, buffer, data, location,
  update = false, lights = scene.lights.length,
  index, v,vl,vetex,vertices = 0;

  // Clear context
  this.clear();

  // Build the shader program
  if (this.lights !== lights) {
    this.lights = lights;
    if (this.lights > 0) {
      this.buildProgram(lights);
    } else {
      return;
    }
  }

  // Update program
  if (!!this.program) {

    // Increment vertex counter
    for (m = scene.meshes.length - 1; m >= 0; m--) {
      mesh = scene.meshes[m];
      if (mesh.geometry.dirty) update = true;
      mesh.update(scene.lights, false);
      vertices += mesh.geometry.triangles.length*3;
    }

    // Compare vertex counter
    if (update || this.vertices !== vertices) {
      this.vertices = vertices;

      // Build buffers
      for (attribute in this.program.attributes) {
        buffer = this.program.attributes[attribute];
        buffer.data = new FSS.Array(vertices*buffer.size);

        // Reset vertex index
        index = 0;

        // Update attribute buffer data
        for (m = scene.meshes.length - 1; m >= 0; m--) {
          mesh = scene.meshes[m];

          for (t = 0, tl = mesh.geometry.triangles.length; t < tl; t++) {
            triangle = mesh.geometry.triangles[t];

            for (v = 0, vl = triangle.vertices.length; v < vl; v++) {
              vertex = triangle.vertices[v];
              switch (attribute) {
                case 'side':
                this.setBufferData(index, buffer, mesh.side);
                break;
                case 'position':
                this.setBufferData(index, buffer, vertex.position);
                break;
                case 'centroid':
                this.setBufferData(index, buffer, triangle.centroid);
                break;
                case 'normal':
                this.setBufferData(index, buffer, triangle.normal);
                break;
                case 'ambient':
                this.setBufferData(index, buffer, mesh.material.ambient.rgba);
                break;
                case 'diffuse':
                this.setBufferData(index, buffer, mesh.material.diffuse.rgba);
                break;
              }
              index++;
            }
          }
        }

        // Upload attribute buffer data
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer.buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, buffer.data, this.gl.DYNAMIC_DRAW);
        this.gl.enableVertexAttribArray(buffer.location);
        this.gl.vertexAttribPointer(buffer.location, buffer.size, this.gl.FLOAT, false, 0, 0);
      }
    }

    // Build uniform buffers
    this.setBufferData(0, this.program.uniforms.resolution, [this.width, this.height, this.width]);
    for (l = lights-1; l >= 0; l--) {
      light = scene.lights[l];
      this.setBufferData(l, this.program.uniforms.lightPosition, light.position);
      this.setBufferData(l, this.program.uniforms.lightAmbient, light.ambient.rgba);
      this.setBufferData(l, this.program.uniforms.lightDiffuse, light.diffuse.rgba);
    }

    // Update uniforms
    for (uniform in this.program.uniforms) {
      buffer = this.program.uniforms[uniform];
      location = buffer.location;
      data = buffer.data;
      switch (buffer.structure) {
        case '3f':
        this.gl.uniform3f(location, data[0], data[1], data[2]);
        break;
        case '3fv':
        this.gl.uniform3fv(location, data);
        break;
        case '4fv':
        this.gl.uniform4fv(location, data);
        break;
      }
    }
  }

  // Draw those lovely triangles
  this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertices);
  return this;
};

FSS.WebGLRenderer.prototype.setBufferData = function(index, buffer, value) {
  if (FSS.Utils.isNumber(value)) {
    buffer.data[index*buffer.size] = value;
  } else {
    for (var i = value.length - 1; i >= 0; i--) {
      buffer.data[index*buffer.size+i] = value[i];
    }
  }
};

/**
 * Concepts taken from three.js WebGLRenderer
 * @see https://github.com/mrdoob/three.js/blob/master/src/renderers/WebGLRenderer.js
 */
 FSS.WebGLRenderer.prototype.buildProgram = function(lights) {
  if (this.unsupported) return;

  // Create shader source
  var vs = FSS.WebGLRenderer.VS(lights);
  var fs = FSS.WebGLRenderer.FS(lights);

  // Derive the shader fingerprint
  var code = vs + fs;

  // Check if the program has already been compiled
  if (!!this.program && this.program.code === code) return;

  // Create the program and shaders
  var program = this.gl.createProgram();
  var vertexShader = this.buildShader(this.gl.VERTEX_SHADER, vs);
  var fragmentShader = this.buildShader(this.gl.FRAGMENT_SHADER, fs);

  // Attach an link the shader
  this.gl.attachShader(program, vertexShader);
  this.gl.attachShader(program, fragmentShader);
  this.gl.linkProgram(program);

  // Add error handling
  if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
    var error = this.gl.getError();
    var status = this.gl.getProgramParameter(program, this.gl.VALIDATE_STATUS);
    console.error('Could not initialise shader.\nVALIDATE_STATUS: '+status+'\nERROR: '+error);
    return null;
  }

  // Delete the shader
  this.gl.deleteShader(fragmentShader);
  this.gl.deleteShader(vertexShader);

  // Set the program code
  program.code = code;

  // Add the program attributes
  program.attributes = {
    side:     this.buildBuffer(program, 'attribute', 'aSide',     1, 'f' ),
    position: this.buildBuffer(program, 'attribute', 'aPosition', 3, 'v3'),
    centroid: this.buildBuffer(program, 'attribute', 'aCentroid', 3, 'v3'),
    normal:   this.buildBuffer(program, 'attribute', 'aNormal',   3, 'v3'),
    ambient:  this.buildBuffer(program, 'attribute', 'aAmbient',  4, 'v4'),
    diffuse:  this.buildBuffer(program, 'attribute', 'aDiffuse',  4, 'v4')
  };

  // Add the program uniforms
  program.uniforms = {
    resolution:    this.buildBuffer(program, 'uniform', 'uResolution',    3, '3f',  1     ),
    lightPosition: this.buildBuffer(program, 'uniform', 'uLightPosition', 3, '3fv', lights),
    lightAmbient:  this.buildBuffer(program, 'uniform', 'uLightAmbient',  4, '4fv', lights),
    lightDiffuse:  this.buildBuffer(program, 'uniform', 'uLightDiffuse',  4, '4fv', lights)
  };

  // Set the renderer program
  this.program = program;

  // Enable program
  this.gl.useProgram(this.program);

  // Return the program
  return program;
};

FSS.WebGLRenderer.prototype.buildShader = function(type, source) {
  if (this.unsupported) return;

  // Create and compile shader
  var shader = this.gl.createShader(type);
  this.gl.shaderSource(shader, source);
  this.gl.compileShader(shader);

  // Add error handling
  if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
    console.error(this.gl.getShaderInfoLog(shader));
    return null;
  }

  // Return the shader
  return shader;
};

FSS.WebGLRenderer.prototype.buildBuffer = function(program, type, identifier, size, structure, count) {
  var buffer = {buffer:this.gl.createBuffer(), size:size, structure:structure, data:null};

  // Set the location
  switch (type) {
    case 'attribute':
    buffer.location = this.gl.getAttribLocation(program, identifier);
    break;
    case 'uniform':
    buffer.location = this.gl.getUniformLocation(program, identifier);
    break;
  }

  // Create the buffer if count is provided
  if (!!count) {
    buffer.data = new FSS.Array(count*size);
  }

  // Return the buffer
  return buffer;
};

FSS.WebGLRenderer.VS = function(lights) {
  var shader = [

  // Precision
  'precision mediump float;',

  // Lights
  '#define LIGHTS ' + lights,

  // Attributes
  'attribute float aSide;',
  'attribute vec3 aPosition;',
  'attribute vec3 aCentroid;',
  'attribute vec3 aNormal;',
  'attribute vec4 aAmbient;',
  'attribute vec4 aDiffuse;',

  // Uniforms
  'uniform vec3 uResolution;',
  'uniform vec3 uLightPosition[LIGHTS];',
  'uniform vec4 uLightAmbient[LIGHTS];',
  'uniform vec4 uLightDiffuse[LIGHTS];',

  // Varyings
  'varying vec4 vColor;',

  // Main
  'void main() {',

    // Create color
    'vColor = vec4(0.0);',

    // Calculate the vertex position
    'vec3 position = aPosition / uResolution * 2.0;',

    // Iterate through lights
    'for (int i = 0; i < LIGHTS; i++) {',
    'vec3 lightPosition = uLightPosition[i];',
    'vec4 lightAmbient = uLightAmbient[i];',
    'vec4 lightDiffuse = uLightDiffuse[i];',

      // Calculate illuminance
      'vec3 ray = normalize(lightPosition - aCentroid);',
      'float illuminance = dot(aNormal, ray);',
      'if (aSide == 0.0) {',
      'illuminance = max(illuminance, 0.0);',
      '} else if (aSide == 1.0) {',
      'illuminance = abs(min(illuminance, 0.0));',
      '} else if (aSide == 2.0) {',
      'illuminance = max(abs(illuminance), 0.0);',
      '}',

      // Calculate ambient light
      'vColor += aAmbient * lightAmbient;',

      // Calculate diffuse light
      'vColor += aDiffuse * lightDiffuse * illuminance;',
      '}',

    // Clamp color
    'vColor = clamp(vColor, 0.0, 1.0);',

    // Set gl_Position
    'gl_Position = vec4(position, 1.0);',

    '}'

  // Return the shader
  ].join('\n');
  return shader;
};

FSS.WebGLRenderer.FS = function(lights) {
  var shader = [

  // Precision
  'precision mediump float;',

  // Varyings
  'varying vec4 vColor;',

  // Main
  'void main() {',

    // Set gl_FragColor
    'gl_FragColor = vColor;',

    '}'

  // Return the shader
  ].join('\n');
  return shader;
};

/**
 * @class SVG Renderer
 * @author Matthew Wagerfield
 */
 FSS.SVGRenderer = function() {
  FSS.Renderer.call(this);
  this.element = document.createElementNS(FSS.SVGNS, 'svg');
  this.element.setAttribute('xmlns', FSS.SVGNS);
  this.element.setAttribute('version', '1.1');
  this.element.style.display = 'block';
  this.setSize(300, 150);
};

FSS.SVGRenderer.prototype = Object.create(FSS.Renderer.prototype);

FSS.SVGRenderer.prototype.setSize = function(width, height) {
  FSS.Renderer.prototype.setSize.call(this, width, height);
  this.element.setAttribute('width', width);
  this.element.setAttribute('height', height);
  return this;
};

FSS.SVGRenderer.prototype.clear = function() {
  FSS.Renderer.prototype.clear.call(this);
  for (var i = this.element.childNodes.length - 1; i >= 0; i--) {
    this.element.removeChild(this.element.childNodes[i]);
  }
  return this;
};

FSS.SVGRenderer.prototype.render = function(scene) {
  FSS.Renderer.prototype.render.call(this, scene);
  var m,mesh, t,triangle, points, style;

  // Update Meshes
  for (m = scene.meshes.length - 1; m >= 0; m--) {
    mesh = scene.meshes[m];
    if (mesh.visible) {
      mesh.update(scene.lights, true);

      // Render Triangles
      for (t = mesh.geometry.triangles.length - 1; t >= 0; t--) {
        triangle = mesh.geometry.triangles[t];
        if (triangle.polygon.parentNode !== this.element) {
          this.element.appendChild(triangle.polygon);
        }
        points  = this.formatPoint(triangle.a)+' ';
        points += this.formatPoint(triangle.b)+' ';
        points += this.formatPoint(triangle.c);
        style = this.formatStyle(triangle.color.format());
        triangle.polygon.setAttributeNS(null, 'points', points);
        triangle.polygon.setAttributeNS(null, 'style', style);
      }
    }
  }
  return this;
};

FSS.SVGRenderer.prototype.formatPoint = function(vertex) {
  return (this.halfWidth+vertex.position[0])+','+(this.halfHeight-vertex.position[1]);
};

FSS.SVGRenderer.prototype.formatStyle = function(color) {
  var style = 'fill:'+color+';';
  style += 'stroke:'+color+';';
  return style;
};



////////////////////////////////
////////////////////////////////
////////////////////////////////


(function(){

  //------------------------------
  // Mesh Properties
  //------------------------------
  var MESH = {
    width: 1.8,
    height: 1.8,
    depth: 4,
    segments: 8,
    slices: 4,
    xRange: 0.8,
    yRange: 0.1,
    zRange: 1.0,
    ambient: '#555555',
    diffuse: '#333333',
    speed: 0.0001
  };

  //------------------------------
  // Light Properties
  //------------------------------
  var LIGHT = {
    count: 2,
    xyScalar: 1,
    zOffset: 100,
    ambient: '#007bbb',
    diffuse: '#008fd1',
    speed: 2,
    gravity: 500,
    dampening: .15,
    minLimit: 10,
    maxLimit: null,
    minDistance: 20,
    maxDistance: 400,
    autopilot: true,
    draw: false,
    bounds: FSS.Vector3.create(),
    step: FSS.Vector3.create(
      Math.randomInRange(0.2, 1.0),
      Math.randomInRange(0.2, 1.0),
      Math.randomInRange(0.2, 1.0)
      )
  };

  //------------------------------
  // Render Properties
  //------------------------------

  var RENDER = {
    renderer: 'canvas'
  };

  //------------------------------
  // Global Properties
  //------------------------------
  var now, start = Date.now();
  var center = FSS.Vector3.create();
  var attractor = FSS.Vector3.create();
  var container = document.getElementById('poly-container');
  var output = document.getElementById('output');
  var renderer, scene, mesh, geometry, material;
  var canvasRenderer;
  var gui, autopilotController;

  //------------------------------
  // Methods
  //------------------------------
  function initialise() {
    createRenderer();
    createScene();
    createMesh();
    createLights();
    addEventListeners();
    resize(container.offsetWidth, container.offsetHeight);
    animate();
  }

  function createRenderer() {
    canvasRenderer = new FSS.CanvasRenderer();
    setRenderer(RENDER.renderer);
  }

  function setRenderer(index) {
    if (renderer) {
      output.removeChild(renderer.element);
    }

    renderer = canvasRenderer;

    renderer.setSize(container.offsetWidth, container.offsetHeight);
    output.appendChild(renderer.element);
  }

  function createScene() {
    scene = new FSS.Scene();
  }

  function createMesh() {
    scene.remove(mesh);
    renderer.clear();
    geometry = new FSS.Plane(MESH.width * renderer.width, MESH.height * renderer.height, MESH.segments, MESH.slices);
    material = new FSS.Material(MESH.ambient, MESH.diffuse);
    mesh = new FSS.Mesh(geometry, material);
    scene.add(mesh);

    // Augment vertices for animation
    var v, vertex;
    for (v = geometry.vertices.length - 1; v >= 0; v--) {
      vertex = geometry.vertices[v];
      vertex.anchor = FSS.Vector3.clone(vertex.position);
      vertex.step = FSS.Vector3.create(
        Math.randomInRange(0.2, 1.0),
        Math.randomInRange(0.2, 1.0),
        Math.randomInRange(0.2, 1.0)
        );
      vertex.time = Math.randomInRange(0, Math.PIM2);
    }
  }

  function createLights() {
    var l, light;
    for (l = scene.lights.length - 1; l >= 0; l--) {
      light = scene.lights[l];
      scene.remove(light);
    }
    renderer.clear();
    for (l = 0; l < LIGHT.count; l++) {
      light = new FSS.Light(LIGHT.ambient, LIGHT.diffuse);
      light.ambientHex = light.ambient.format();
      light.diffuseHex = light.diffuse.format();
      scene.add(light);

      // Augment light for animation
      light.mass = Math.randomInRange(0.5, 1);
      light.velocity = FSS.Vector3.create();
      light.acceleration = FSS.Vector3.create();
      light.force = FSS.Vector3.create();

      // Ring SVG Circle
      light.ring = document.createElementNS(FSS.SVGNS, 'circle');
      light.ring.setAttributeNS(null, 'stroke', light.ambientHex);
      light.ring.setAttributeNS(null, 'stroke-width', '0.5');
      light.ring.setAttributeNS(null, 'fill', 'none');
      light.ring.setAttributeNS(null, 'r', '10');

      // Core SVG Circle
      light.core = document.createElementNS(FSS.SVGNS, 'circle');
      light.core.setAttributeNS(null, 'fill', light.diffuseHex);
      light.core.setAttributeNS(null, 'r', '4');
    }
  }

  function resize(width, height) {
    renderer.setSize(width, height);
    FSS.Vector3.set(center, renderer.halfWidth, renderer.halfHeight);
    createMesh();
  }

  function animate() {
    now = Date.now() - start;
    update();
    render();
    requestAnimationFrame(animate);
  }

  function update() {
    var ox, oy, oz, l, light, v, vertex, offset = MESH.depth/2;

    // Update Bounds
    FSS.Vector3.copy(LIGHT.bounds, center);
    FSS.Vector3.multiplyScalar(LIGHT.bounds, LIGHT.xyScalar);

    // Update Attractor
    FSS.Vector3.setZ(attractor, LIGHT.zOffset);

    // Overwrite the Attractor position
    if (LIGHT.autopilot) {
      ox = Math.sin(LIGHT.step[0] * now * LIGHT.speed);
      oy = Math.cos(LIGHT.step[1] * now * LIGHT.speed);
      FSS.Vector3.set(attractor,
        LIGHT.bounds[0]*ox,
        LIGHT.bounds[1]*oy,
        LIGHT.zOffset);
    }

    // Animate Lights
    for (l = scene.lights.length - 1; l >= 0; l--) {
      light = scene.lights[l];

      // Reset the z position of the light
      FSS.Vector3.setZ(light.position, LIGHT.zOffset);

      // Calculate the force Luke!
      var D = Math.clamp(FSS.Vector3.distanceSquared(light.position, attractor), LIGHT.minDistance, LIGHT.maxDistance);
      var F = LIGHT.gravity * light.mass / D;
      FSS.Vector3.subtractVectors(light.force, attractor, light.position);
      FSS.Vector3.normalise(light.force);
      FSS.Vector3.multiplyScalar(light.force, F);

      // Update the light position
      FSS.Vector3.set(light.acceleration);
      FSS.Vector3.add(light.acceleration, light.force);
      FSS.Vector3.add(light.velocity, light.acceleration);
      FSS.Vector3.multiplyScalar(light.velocity, LIGHT.dampening);
      FSS.Vector3.limit(light.velocity, LIGHT.minLimit, LIGHT.maxLimit);
      FSS.Vector3.add(light.position, light.velocity);
    }

    // Animate Vertices
    for (v = geometry.vertices.length - 1; v >= 0; v--) {
      vertex = geometry.vertices[v];
      ox = Math.sin(vertex.time + vertex.step[0] * now * MESH.speed);
      oy = Math.cos(vertex.time + vertex.step[1] * now * MESH.speed);
      oz = Math.sin(vertex.time + vertex.step[2] * now * MESH.speed);
      FSS.Vector3.set(vertex.position,
        MESH.xRange*geometry.segmentWidth*ox,
        MESH.yRange*geometry.sliceHeight*oy,
        MESH.zRange*offset*oz - offset);
      FSS.Vector3.add(vertex.position, vertex.anchor);
    }

    // Set the Geometry to dirty
    geometry.dirty = true;
  }

  function render() {
    renderer.render(scene);

    // Draw Lights
    if (LIGHT.draw) {
      var l, lx, ly, light;
      for (l = scene.lights.length - 1; l >= 0; l--) {
        light = scene.lights[l];
        lx = light.position[0];
        ly = light.position[1];
        renderer.context.lineWidth = 0.5;
        renderer.context.beginPath();
        renderer.context.arc(lx, ly, 10, 0, Math.PIM2);
        renderer.context.strokeStyle = light.ambientHex;
        renderer.context.stroke();
        renderer.context.beginPath();
        renderer.context.arc(lx, ly, 4, 0, Math.PIM2);
        renderer.context.fillStyle = light.diffuseHex;
        renderer.context.fill();

      }
    }
  }

  function addEventListeners() {
    window.addEventListener('resize', onWindowResize);
    //container.addEventListener('mousemove', onMouseMove);
  }

  //------------------------------
  // Callbacks
  //------------------------------

  function onMouseMove(event) {
    FSS.Vector3.set(attractor, event.x, renderer.height - event.y);
    FSS.Vector3.subtract(attractor, center);
  }

  function onWindowResize(event) {
    resize(container.offsetWidth, container.offsetHeight);
    render();
  }






  if ($('body').hasClass('download')) {



   console.log('no poly mesh');
 }else{

  console.log('load poly mesh');
  // Let there be light!
  initialise();
}









})();
/*
                       _ _ _____                      _   _
                      | | |  __ \                    | | (_)
    ___  ___ _ __ ___ | | | |__) |_____   _____  __ _| |  _ ___
   / __|/ __| '__/ _ \| | |  _  // _ \ \ / / _ \/ _` | | | / __|
   \__ \ (__| | | (_) | | | | \ \  __/\ V /  __/ (_| | |_| \__ \
   |___/\___|_|  \___/|_|_|_|  \_\___| \_/ \___|\__,_|_(_) |___/ v2.3.0
                                                        _/ |
                                                       |__/

================================================================================

   scrollReveal.js (c) 2015 Julian Lloyd ( @julianlloyd )
   Licensed under MIT ( http://www.opensource.org/licenses/mit-license.php )

==============================================================================*/

window.scrollReveal = (function( window ){

  'use strict';

  var _requestAnimFrame;
  var _extend;
  var _handler;
  var self;

  function scrollReveal( config ){

    self         = this;
    self.elems   = {};
    self.serial  = 1;
    self.blocked = false;
    self.config  = _extend( self.defaults, config );

    if ( self.isMobile() && !self.config.mobile || !self.isSupported() ){
      self.destroy();
      return;
    }

    if ( self.config.viewport === window.document.documentElement ){

      window.addEventListener( 'scroll', _handler, false );
      window.addEventListener( 'resize', _handler, false );

    } else {
      self.config.viewport.addEventListener( 'scroll', _handler, false );
    }

    self.init( true );
  }

  scrollReveal.prototype = {

    defaults: {

      enter:    'bottom',
      move:     '8px',
      over:     '0.6s',
      wait:     '0s',
      easing:   'ease',

      scale:    { direction: 'up', power: '5%' },
      rotate:   { x: 0, y: 0, z: 0 },

      opacity:  0,
      mobile:   false,
      reset:    false,

      //        Expects a reference to a DOM node (the <html> node by default)
      //        which is used as the context when checking element visibility.
      viewport: window.document.documentElement,

      //        'always' — delay every time an animation resets
      //        'onload' - delay only for animations triggered by first load
      //        'once'   — delay only the first time an animation reveals
      delay:    'once',

      //        vFactor changes when an element is considered in the viewport.
      //        The default value of 0.60 means 60% of an element must be
      //        visible for its reveal animation to trigger.
      vFactor:  0.60,

      complete: function( el ){} // Note: reset animations do not complete.
    },

    // Queries the DOM, builds scrollReveal elements and triggers animation.
    // @param {boolean} flag — a hook for controlling delay on first load.
    init: function( flag ){

      var serial;
      var elem;
      var query;

      query = Array.prototype.slice.call( self.config.viewport.querySelectorAll('[data-sr]') );
      query.forEach(function( el ){

        serial      = self.serial++;
        elem        = self.elems[ serial ] = { domEl: el };
        elem.config = self.configFactory( elem );
        elem.styles = self.styleFactory( elem );
        elem.seen   = false;

        el.removeAttribute('data-sr');

        el.setAttribute( 'style',
            elem.styles.inline
          + elem.styles.initial
        );
      })

      self.scrolled = self.scrollY();
      self.animate( flag );
    },

    // Applies and removes appropriate styles.
    // @param {boolean} flag — a hook for controlling delay on first load.
    animate: function( flag ){

      var key;
      var elem;
      var visible;

      // Begin element store digest.
      for ( key in self.elems ){
        if ( self.elems.hasOwnProperty( key ) ){

          elem    = self.elems[ key ];
          visible = self.isElemInViewport( elem );

          if ( visible ){

            if ( self.config.delay === 'always'
            || ( self.config.delay === 'onload' && flag )
            || ( self.config.delay === 'once'   && !elem.seen ) ){

              // Use delay.
              elem.domEl.setAttribute( 'style',
                  elem.styles.inline
                + elem.styles.target
                + elem.styles.transition
              );

            } else {

              // Don’t use delay.
              elem.domEl.setAttribute( 'style',
                  elem.styles.inline
                + elem.styles.target
                + elem.styles.reset
              );
            }

            elem.seen = true;

            if ( !elem.config.reset && !elem.animating ){
              elem.animating = true;
              complete( key );
            }

          } else if ( !visible && elem.config.reset ){

            elem.domEl.setAttribute( 'style',
                elem.styles.inline
              + elem.styles.initial
              + elem.styles.reset
            );
          }
        }
      }

      // Digest complete, now un-block the event handler.
      self.blocked = false;

      // Cleans the DOM and removes completed elements from self.elems.
      // @param {integer} key — self.elems property key.
      function complete( key ){

        var elem = self.elems[ key ];

        setTimeout(function(){

          elem.domEl.setAttribute( 'style', elem.styles.inline );
          elem.config.complete( elem.domEl );
          delete self.elems[ key ];

        }, elem.styles.duration );
      }
    },

    // Parses an elements data-sr attribute, and returns a configuration object.
    // @param {object} elem — An object from self.elems.
    // @return {object}
    configFactory: function( elem ){

      var parsed = {};
      var config = {};
      var words  = elem.domEl.getAttribute('data-sr').split( /[, ]+/ );

      words.forEach(function( keyword, i ){
        switch ( keyword ){

          case 'enter':

            parsed.enter = words[ i + 1 ];
            break;

          case 'wait':

            parsed.wait = words[ i + 1 ];
            break;

          case 'move':

            parsed.move = words[ i + 1 ];
            break;

          case 'ease':

            parsed.move = words[ i + 1 ];
            parsed.ease = 'ease';
            break;

          case 'ease-in':

            if ( words[ i + 1 ] == 'up' || words[ i + 1 ] == 'down' ){

              parsed.scale.direction = words[ i + 1 ];
              parsed.scale.power     = words[ i + 2 ];
              parsed.easing          = 'ease-in';
              break;
            }

            parsed.move   = words[ i + 1 ];
            parsed.easing = 'ease-in';
            break;

          case 'ease-in-out':

            if ( words[ i + 1 ] == 'up' || words[ i + 1 ] == 'down' ){

              parsed.scale.direction = words[ i + 1 ];
              parsed.scale.power     = words[ i + 2 ];
              parsed.easing          = 'ease-in-out';
              break;
            }

            parsed.move   = words[ i + 1 ];
            parsed.easing = 'ease-in-out';
            break;

          case 'ease-out':

            if ( words[ i + 1 ] == 'up' || words[ i + 1 ] == 'down' ){

              parsed.scale.direction = words[ i + 1 ];
              parsed.scale.power     = words[ i + 2 ];
              parsed.easing          = 'ease-out';
              break;
            }

            parsed.move   = words[ i + 1 ];
            parsed.easing = 'ease-out';
            break;

          case 'hustle':

            if ( words[ i + 1 ] == 'up' || words[ i + 1 ] == 'down' ){

              parsed.scale.direction = words[ i + 1 ];
              parsed.scale.power     = words[ i + 2 ];
              parsed.easing          = 'cubic-bezier( 0.6, 0.2, 0.1, 1 )';
              break;
            }

            parsed.move   = words[ i + 1 ];
            parsed.easing = 'cubic-bezier( 0.6, 0.2, 0.1, 1 )';
            break;

          case 'over':

            parsed.over = words[ i + 1 ];
            break;

          case 'flip':
          case 'pitch':
            parsed.rotate   = parsed.rotate || {};
            parsed.rotate.x = words[ i + 1 ];
            break;

          case 'spin':
          case 'yaw':
            parsed.rotate   = parsed.rotate || {};
            parsed.rotate.y = words[ i + 1 ];
            break;

          case 'roll':
            parsed.rotate   = parsed.rotate || {};
            parsed.rotate.z = words[ i + 1 ];
            break;

          case 'reset':

            if ( words[ i - 1 ] == 'no' ){
              parsed.reset = false;
            } else {
              parsed.reset = true;
            }
            break;

          case 'scale':

            parsed.scale = {};

            if ( words[ i + 1 ] == 'up' || words[ i + 1 ] == 'down' ){

              parsed.scale.direction = words[ i + 1 ];
              parsed.scale.power     = words[ i + 2 ];
              break;
            }

            parsed.scale.power = words[ i + 1 ];
            break;

          case 'vFactor':
          case 'vF':
            parsed.vFactor = words[ i + 1 ];
            break;

          case 'opacity':
            parsed.opacity = words[ i + 1 ];
            break;

          default:
            return;
        }
      });

      // Build default config object, then apply any keywords parsed from the
      // data-sr attribute.
      config = _extend( config, self.config );
      config = _extend( config, parsed );

      if ( config.enter === 'top' || config.enter === 'bottom' ){
        config.axis = 'Y';
      } else if ( config.enter === 'left' || config.enter === 'right' ){
        config.axis = 'X';
      }

      // Let’s make sure our our pixel distances are negative for top and left.
      // e.g. "enter top and move 25px" starts at 'top: -25px' in CSS.
      if ( config.enter === 'top' || config.enter === 'left' ){
        config.move = '-' + config.move;
      }

      return config;
    },

    // Generates styles based on an elements configuration property.
    // @param {object} elem — An object from self.elems.
    // @return {object}
    styleFactory: function( elem ){

      var inline;
      var initial;
      var reset;
      var target;
      var transition;

      var cfg      = elem.config;
      var duration = ( parseFloat( cfg.over ) + parseFloat( cfg.wait ) ) * 1000;

      // Want to disable delay on mobile devices? Uncomment the line below.
      // if ( self.isMobile() && self.config.mobile ) cfg.wait = 0;

      if ( elem.domEl.getAttribute('style') ){
        inline = elem.domEl.getAttribute('style') + '; visibility: visible; ';
      } else {
        inline = 'visibility: visible; ';
      }

      transition = '-webkit-transition: -webkit-transform ' + cfg.over + ' ' + cfg.easing + ' ' + cfg.wait + ', opacity ' + cfg.over + ' ' + cfg.easing + ' ' + cfg.wait + '; ' +
                           'transition: transform '         + cfg.over + ' ' + cfg.easing + ' ' + cfg.wait + ', opacity ' + cfg.over + ' ' + cfg.easing + ' ' + cfg.wait + '; ' +
                  '-webkit-perspective: 1000;' +
          '-webkit-backface-visibility: hidden;';

      reset      = '-webkit-transition: -webkit-transform ' + cfg.over + ' ' + cfg.easing + ' 0s, opacity ' + cfg.over + ' ' + cfg.easing + ' 0s; ' +
                           'transition: transform '         + cfg.over + ' ' + cfg.easing + ' 0s, opacity ' + cfg.over + ' ' + cfg.easing + ' 0s; ' +
                  '-webkit-perspective: 1000; ' +
          '-webkit-backface-visibility: hidden; ';

      initial = 'transform:';
      target  = 'transform:';
      build();

      // Build again for webkit…
      initial += '-webkit-transform:';
      target  += '-webkit-transform:';
      build();

      return {
        transition: transition,
        initial:    initial,
        target:     target,
        reset:      reset,
        inline:     inline,
        duration:   duration
      };

      // Constructs initial and target styles.
      function build(){

        if ( parseInt( cfg.move ) !== 0 ){
          initial += ' translate' + cfg.axis + '(' + cfg.move + ')';
          target  += ' translate' + cfg.axis + '(0)';
        }

        if ( parseInt( cfg.scale.power ) !== 0 ){

          if ( cfg.scale.direction === 'up' ){
            cfg.scale.value = 1 - ( parseFloat( cfg.scale.power ) * 0.01 );
          } else if ( cfg.scale.direction === 'down' ){
            cfg.scale.value = 1 + ( parseFloat( cfg.scale.power ) * 0.01 );
          }

          initial += ' scale(' + cfg.scale.value + ')';
          target  += ' scale(1)';
        }

        if ( cfg.rotate.x ){
          initial += ' rotateX(' + cfg.rotate.x + ')';
          target  += ' rotateX(0)';
        }

        if ( cfg.rotate.y ){
          initial += ' rotateY(' + cfg.rotate.y + ')';
          target  += ' rotateY(0)';
        }

        if ( cfg.rotate.z ){
          initial += ' rotateZ(' + cfg.rotate.z + ')';
          target  += ' rotateZ(0)';
        }

        initial += '; opacity: ' + cfg.opacity + '; ';
        target  += '; opacity: 1; ';
      }
    },

    getViewportH: function(){

      var client = self.config.viewport['clientHeight'];
      var inner  = window['innerHeight'];

      if ( self.config.viewport === window.document.documentElement ){
        return ( client < inner ) ? inner : client;
      }

      return client;
    },

    scrollY: function(){
      if ( self.config.viewport === window.document.documentElement ){
        return window.pageYOffset;
      } else {
        return self.config.viewport.scrollTop + self.config.viewport.offsetTop;
      }
    },

    getOffset: function( el ){

      var offsetTop  = 0;
      var offsetLeft = 0;

      do {
        if ( !isNaN( el.offsetTop ) ){
          offsetTop  += el.offsetTop;
        }
        if ( !isNaN( el.offsetLeft ) ){
          offsetLeft += el.offsetLeft;
        }
      } while ( el = el.offsetParent );

      return {
        top: offsetTop,
        left: offsetLeft
      };
    },

    isElemInViewport: function( elem ){

      var elHeight = elem.domEl.offsetHeight;
      var elTop    = self.getOffset( elem.domEl ).top;
      var elBottom = elTop + elHeight;
      var vFactor  = elem.config.vFactor || 0;

      return ( confirmBounds() || isPositionFixed() );

      function confirmBounds(){

        var top        = elTop + elHeight * vFactor;
        var bottom     = elBottom - elHeight * vFactor;
        var viewBottom = self.scrolled + self.getViewportH();
        var viewTop    = self.scrolled;

        return ( top < viewBottom ) && ( bottom > viewTop );
      }

      function isPositionFixed(){

        var el    = elem.domEl;
        var style = el.currentStyle || window.getComputedStyle( el, null );

        return style.position === 'fixed';
      }
    },

    isMobile: function(){

      var agent = navigator.userAgent || navigator.vendor || window.opera;

      return (/(ipad|playbook|silk|android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test( agent )||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test( agent.substr( 0, 4 ))) ? true : false;
    },

    isSupported: function(){

      var sensor    = document.createElement('sensor');
      var cssPrefix = 'Webkit,Moz,O,'.split(',');
      var tests     = ( 'transition ' + cssPrefix.join('transition,') ).split(',');

      for ( var i = 0; i < tests.length; i++ ){
        if ( !sensor.style[tests[i]] === '' ){
          return false;
        }
      }

      return true;
    },

    destroy: function(){

      var node = self.config.viewport;
      var query = Array.prototype.slice.call( node.querySelectorAll('[data-sr]') );

      query.forEach(function( el ){
        el.removeAttribute('data-sr');
      });
    }
  } // End of the scrollReveal prototype ======================================|

  _handler = function( e ){

    if ( !self.blocked ){

      self.blocked  = true;
      self.scrolled = self.scrollY();

      _requestAnimFrame(function(){
        self.animate();
      });
    }
  }

  _extend = function( target, src ){

    for ( var prop in src ){
      if ( src.hasOwnProperty( prop ) ){
        target[ prop ] = src[ prop ];
      }
    }

    return target;
  }

  // RequestAnimationFrame polyfill.
  _requestAnimFrame = (function(){

    return window.requestAnimationFrame        ||
           window.webkitRequestAnimationFrame  ||
           window.mozRequestAnimationFrame     ||

          function( callback ){
            window.setTimeout( callback, 1000 / 60 );
          };
  }());

  return scrollReveal;

})( window );

/*!
 * headroom.js v0.7.0 - Give your page some headroom. Hide your header until you need it
 * Copyright (c) 2014 Nick Williams - http://wicky.nillia.ms/headroom.js
 * License: MIT
 */

(function(window, document) {

  'use strict';

  /* exported features */
  
  var features = {
    bind : !!(function(){}.bind),
    classList : 'classList' in document.documentElement,
    rAF : !!(window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame)
  };
  window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
  
  /**
   * Handles debouncing of events via requestAnimationFrame
   * @see http://www.html5rocks.com/en/tutorials/speed/animations/
   * @param {Function} callback The callback to handle whichever event
   */
  function Debouncer (callback) {
    this.callback = callback;
    this.ticking = false;
  }
  Debouncer.prototype = {
    constructor : Debouncer,
  
    /**
     * dispatches the event to the supplied callback
     * @private
     */
    update : function() {
      this.callback && this.callback();
      this.ticking = false;
    },
  
    /**
     * ensures events don't get stacked
     * @private
     */
    requestTick : function() {
      if(!this.ticking) {
        requestAnimationFrame(this.rafCallback || (this.rafCallback = this.update.bind(this)));
        this.ticking = true;
      }
    },
  
    /**
     * Attach this as the event listeners
     */
    handleEvent : function() {
      this.requestTick();
    }
  };
  /**
   * Check if object is part of the DOM
   * @constructor
   * @param {Object} obj element to check
   */
  function isDOMElement(obj) {
    return obj && typeof window !== 'undefined' && (obj === window || obj.nodeType);
  }
  
  /**
   * Helper function for extending objects
   */
  function extend (object /*, objectN ... */) {
    if(arguments.length <= 0) {
      throw new Error('Missing arguments in extend function');
    }
  
    var result = object || {},
        key,
        i;
  
    for (i = 1; i < arguments.length; i++) {
      var replacement = arguments[i] || {};
  
      for (key in replacement) {
        // Recurse into object except if the object is a DOM element
        if(typeof result[key] === 'object' && ! isDOMElement(result[key])) {
          result[key] = extend(result[key], replacement[key]);
        }
        else {
          result[key] = result[key] || replacement[key];
        }
      }
    }
  
    return result;
  }
  
  /**
   * Helper function for normalizing tolerance option to object format
   */
  function normalizeTolerance (t) {
    return t === Object(t) ? t : { down : t, up : t };
  }
  
  /**
   * UI enhancement for fixed headers.
   * Hides header when scrolling down
   * Shows header when scrolling up
   * @constructor
   * @param {DOMElement} elem the header element
   * @param {Object} options options for the widget
   */
  function Headroom (elem, options) {
    options = extend(options, Headroom.options);
  
    this.lastKnownScrollY = 0;
    this.elem             = elem;
    this.debouncer        = new Debouncer(this.update.bind(this));
    this.tolerance        = normalizeTolerance(options.tolerance);
    this.classes          = options.classes;
    this.offset           = options.offset;
    this.scroller         = options.scroller;
    this.initialised      = false;
    this.onPin            = options.onPin;
    this.onUnpin          = options.onUnpin;
    this.onTop            = options.onTop;
    this.onNotTop         = options.onNotTop;
  }
  Headroom.prototype = {
    constructor : Headroom,
  
    /**
     * Initialises the widget
     */
    init : function() {
      if(!Headroom.cutsTheMustard) {
        return;
      }
  
      this.elem.classList.add(this.classes.initial);
  
      // defer event registration to handle browser 
      // potentially restoring previous scroll position
      setTimeout(this.attachEvent.bind(this), 100);
  
      return this;
    },
  
    /**
     * Unattaches events and removes any classes that were added
     */
    destroy : function() {
      var classes = this.classes;
  
      this.initialised = false;
      this.elem.classList.remove(classes.unpinned, classes.pinned, classes.top, classes.initial);
      this.scroller.removeEventListener('scroll', this.debouncer, false);
    },
  
    /**
     * Attaches the scroll event
     * @private
     */
    attachEvent : function() {
      if(!this.initialised){
        this.lastKnownScrollY = this.getScrollY();
        this.initialised = true;
        this.scroller.addEventListener('scroll', this.debouncer, false);
  
        this.debouncer.handleEvent();
      }
    },
    
    /**
     * Unpins the header if it's currently pinned
     */
    unpin : function() {
      var classList = this.elem.classList,
        classes = this.classes;
      
      if(classList.contains(classes.pinned) || !classList.contains(classes.unpinned)) {
        classList.add(classes.unpinned);
        classList.remove(classes.pinned);
        this.onUnpin && this.onUnpin.call(this);
      }
    },
  
    /**
     * Pins the header if it's currently unpinned
     */
    pin : function() {
      var classList = this.elem.classList,
        classes = this.classes;
      
      if(classList.contains(classes.unpinned)) {
        classList.remove(classes.unpinned);
        classList.add(classes.pinned);
        this.onPin && this.onPin.call(this);
      }
    },
  
    /**
     * Handles the top states
     */
    top : function() {
      var classList = this.elem.classList,
        classes = this.classes;
      
      if(!classList.contains(classes.top)) {
        classList.add(classes.top);
        classList.remove(classes.notTop);
        this.onTop && this.onTop.call(this);
      }
    },
  
    /**
     * Handles the not top state
     */
    notTop : function() {
      var classList = this.elem.classList,
        classes = this.classes;
      
      if(!classList.contains(classes.notTop)) {
        classList.add(classes.notTop);
        classList.remove(classes.top);
        this.onNotTop && this.onNotTop.call(this);
      }
    },
  
    /**
     * Gets the Y scroll position
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Window.scrollY
     * @return {Number} pixels the page has scrolled along the Y-axis
     */
    getScrollY : function() {
      return (this.scroller.pageYOffset !== undefined)
        ? this.scroller.pageYOffset
        : (this.scroller.scrollTop !== undefined)
          ? this.scroller.scrollTop
          : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    },
  
    /**
     * Gets the height of the viewport
     * @see http://andylangton.co.uk/blog/development/get-viewport-size-width-and-height-javascript
     * @return {int} the height of the viewport in pixels
     */
    getViewportHeight : function () {
      return window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight;
    },
  
    /**
     * Gets the height of the document
     * @see http://james.padolsey.com/javascript/get-document-height-cross-browser/
     * @return {int} the height of the document in pixels
     */
    getDocumentHeight : function () {
      var body = document.body,
        documentElement = document.documentElement;
    
      return Math.max(
        body.scrollHeight, documentElement.scrollHeight,
        body.offsetHeight, documentElement.offsetHeight,
        body.clientHeight, documentElement.clientHeight
      );
    },
  
    /**
     * Gets the height of the DOM element
     * @param  {Object}  elm the element to calculate the height of which
     * @return {int}     the height of the element in pixels
     */
    getElementHeight : function (elm) {
      return Math.max(
        elm.scrollHeight,
        elm.offsetHeight,
        elm.clientHeight
      );
    },
  
    /**
     * Gets the height of the scroller element
     * @return {int} the height of the scroller element in pixels
     */
    getScrollerHeight : function () {
      return (this.scroller === window || this.scroller === document.body)
        ? this.getDocumentHeight()
        : this.getElementHeight(this.scroller);
    },
  
    /**
     * determines if the scroll position is outside of document boundaries
     * @param  {int}  currentScrollY the current y scroll position
     * @return {bool} true if out of bounds, false otherwise
     */
    isOutOfBounds : function (currentScrollY) {
      var pastTop  = currentScrollY < 0,
        pastBottom = currentScrollY + this.getViewportHeight() > this.getScrollerHeight();
      
      return pastTop || pastBottom;
    },
  
    /**
     * determines if the tolerance has been exceeded
     * @param  {int} currentScrollY the current scroll y position
     * @return {bool} true if tolerance exceeded, false otherwise
     */
    toleranceExceeded : function (currentScrollY, direction) {
      return Math.abs(currentScrollY-this.lastKnownScrollY) >= this.tolerance[direction];
    },
  
    /**
     * determine if it is appropriate to unpin
     * @param  {int} currentScrollY the current y scroll position
     * @param  {bool} toleranceExceeded has the tolerance been exceeded?
     * @return {bool} true if should unpin, false otherwise
     */
    shouldUnpin : function (currentScrollY, toleranceExceeded) {
      var scrollingDown = currentScrollY > this.lastKnownScrollY,
        pastOffset = currentScrollY >= this.offset;
  
      return scrollingDown && pastOffset && toleranceExceeded;
    },
  
    /**
     * determine if it is appropriate to pin
     * @param  {int} currentScrollY the current y scroll position
     * @param  {bool} toleranceExceeded has the tolerance been exceeded?
     * @return {bool} true if should pin, false otherwise
     */
    shouldPin : function (currentScrollY, toleranceExceeded) {
      var scrollingUp  = currentScrollY < this.lastKnownScrollY,
        pastOffset = currentScrollY <= this.offset;
  
      return (scrollingUp && toleranceExceeded) || pastOffset;
    },
  
    /**
     * Handles updating the state of the widget
     */
    update : function() {
      var currentScrollY  = this.getScrollY(),
        scrollDirection = currentScrollY > this.lastKnownScrollY ? 'down' : 'up',
        toleranceExceeded = this.toleranceExceeded(currentScrollY, scrollDirection);
  
      if(this.isOutOfBounds(currentScrollY)) { // Ignore bouncy scrolling in OSX
        return;
      }
  
      if (currentScrollY <= this.offset ) {
        this.top();
      } else {
        this.notTop();
      }
  
      if(this.shouldUnpin(currentScrollY, toleranceExceeded)) {
        this.unpin();
      }
      else if(this.shouldPin(currentScrollY, toleranceExceeded)) {
        this.pin();
      }
  
      this.lastKnownScrollY = currentScrollY;
    }
  };
  /**
   * Default options
   * @type {Object}
   */
  Headroom.options = {
    tolerance : {
      up : 0,
      down : 0
    },
    offset : 0,
    scroller: window,
    classes : {
      pinned : 'headroom--pinned',
      unpinned : 'headroom--unpinned',
      top : 'headroom--top',
      notTop : 'headroom--not-top',
      initial : 'headroom'
    }
  };
  Headroom.cutsTheMustard = typeof features !== 'undefined' && features.rAF && features.bind && features.classList;

  window.Headroom = Headroom;

}(window, document));
/*!
 * headroom.js v0.7.0 - Give your page some headroom. Hide your header until you need it
 * Copyright (c) 2014 Nick Williams - http://wicky.nillia.ms/headroom.js
 * License: MIT
 */

(function($) {

  if(!$) {
    return;
  }

  ////////////
  // Plugin //
  ////////////

  $.fn.headroom = function(option) {
    return this.each(function() {
      var $this   = $(this),
        data      = $this.data('headroom'),
        options   = typeof option === 'object' && option;

      options = $.extend(true, {}, Headroom.options, options);

      if (!data) {
        data = new Headroom(this, options);
        data.init();
        $this.data('headroom', data);
      }
      if (typeof option === 'string') {
        data[option]();
      }
    });
  };

  //////////////
  // Data API //
  //////////////

  $('[data-headroom]').each(function() {
    var $this = $(this);
    $this.headroom($this.data());
  });

}(window.Zepto || window.jQuery));
/*!
 * jQuery.scrollTo
 * Copyright (c) 2007-2015 Ariel Flesler - aflesler<a>gmail<d>com | http://flesler.blogspot.com
 * Licensed under MIT
 * http://flesler.blogspot.com/2007/10/jqueryscrollto.html
 * @projectDescription Easy element scrolling using jQuery.
 * @author Ariel Flesler
 * @version 2.1.0
 */
;(function(define) {
	'use strict';

	define(['jquery'], function($) {
		var $scrollTo = $.scrollTo = function(target, duration, settings) {
			return $(window).scrollTo(target, duration, settings);
		};

		$scrollTo.defaults = {
			axis:'xy',
			duration: 0,
			limit:true
		};

		function isWin(elem) {
			return !elem.nodeName ||
				$.inArray(elem.nodeName.toLowerCase(), ['iframe','#document','html','body']) !== -1;
		}		

		$.fn.scrollTo = function(target, duration, settings) {
			if (typeof duration === 'object') {
				settings = duration;
				duration = 0;
			}
			if (typeof settings === 'function') {
				settings = { onAfter:settings };
			}
			if (target === 'max') {
				target = 9e9;
			}

			settings = $.extend({}, $scrollTo.defaults, settings);
			// Speed is still recognized for backwards compatibility
			duration = duration || settings.duration;
			// Make sure the settings are given right
			var queue = settings.queue && settings.axis.length > 1;
			if (queue) {
				// Let's keep the overall duration
				duration /= 2;
			}
			settings.offset = both(settings.offset);
			settings.over = both(settings.over);

			return this.each(function() {
				// Null target yields nothing, just like jQuery does
				if (target === null) return;

				var win = isWin(this),
					elem = win ? this.contentWindow || window : this,
					$elem = $(elem),
					targ = target, 
					attr = {},
					toff;

				switch (typeof targ) {
					// A number will pass the regex
					case 'number':
					case 'string':
						if (/^([+-]=?)?\d+(\.\d+)?(px|%)?$/.test(targ)) {
							targ = both(targ);
							// We are done
							break;
						}
						// Relative/Absolute selector
						targ = win ? $(targ) : $(targ, elem);
						if (!targ.length) return;
						/* falls through */
					case 'object':
						// DOMElement / jQuery
						if (targ.is || targ.style) {
							// Get the real position of the target
							toff = (targ = $(targ)).offset();
						}
				}

				var offset = $.isFunction(settings.offset) && settings.offset(elem, targ) || settings.offset;

				$.each(settings.axis.split(''), function(i, axis) {
					var Pos	= axis === 'x' ? 'Left' : 'Top',
						pos = Pos.toLowerCase(),
						key = 'scroll' + Pos,
						prev = $elem[key](),
						max = $scrollTo.max(elem, axis);

					if (toff) {// jQuery / DOMElement
						attr[key] = toff[pos] + (win ? 0 : prev - $elem.offset()[pos]);

						// If it's a dom element, reduce the margin
						if (settings.margin) {
							attr[key] -= parseInt(targ.css('margin'+Pos), 10) || 0;
							attr[key] -= parseInt(targ.css('border'+Pos+'Width'), 10) || 0;
						}

						attr[key] += offset[pos] || 0;

						if (settings.over[pos]) {
							// Scroll to a fraction of its width/height
							attr[key] += targ[axis === 'x'?'width':'height']() * settings.over[pos];
						}
					} else {
						var val = targ[pos];
						// Handle percentage values
						attr[key] = val.slice && val.slice(-1) === '%' ?
							parseFloat(val) / 100 * max
							: val;
					}

					// Number or 'number'
					if (settings.limit && /^\d+$/.test(attr[key])) {
						// Check the limits
						attr[key] = attr[key] <= 0 ? 0 : Math.min(attr[key], max);
					}

					// Don't waste time animating, if there's no need.
					if (!i && settings.axis.length > 1) {
						if (prev === attr[key]) {
							// No animation needed
							attr = {};
						} else if (queue) {
							// Intermediate animation
							animate(settings.onAfterFirst);
							// Don't animate this axis again in the next iteration.
							attr = {};
						}
					}
				});

				animate(settings.onAfter);

				function animate(callback) {
					var opts = $.extend({}, settings, {
						// The queue setting conflicts with animate()
						// Force it to always be true
						queue: true,
						duration: duration,
						complete: callback && function() {
							callback.call(elem, targ, settings);
						}
					});
					$elem.animate(attr, opts);
				}
			});
		};

		// Max scrolling position, works on quirks mode
		// It only fails (not too badly) on IE, quirks mode.
		$scrollTo.max = function(elem, axis) {
			var Dim = axis === 'x' ? 'Width' : 'Height',
				scroll = 'scroll'+Dim;

			if (!isWin(elem))
				return elem[scroll] - $(elem)[Dim.toLowerCase()]();

			var size = 'client' + Dim,
				doc = elem.ownerDocument || elem.document,
				html = doc.documentElement,
				body = doc.body;

			return Math.max(html[scroll], body[scroll]) - Math.min(html[size], body[size]);
		};

		function both(val) {
			return $.isFunction(val) || $.isPlainObject(val) ? val : { top:val, left:val };
		}

		// Add special hooks so that window scroll properties can be animated
		$.Tween.propHooks.scrollLeft = 
		$.Tween.propHooks.scrollTop = {
			get: function(t) {
				return $(t.elem)[t.prop]();
			},
			set: function(t) {
				var curr = this.get(t);
				// If interrupt is true and user scrolled, stop animating
				if (t.options.interrupt && t._last && t._last !== curr) {
					return $(t.elem).stop();
				}
				var next = Math.round(t.now);
				// Don't waste CPU
				// Browsers don't render floating point scroll
				if (curr !== next) {
					$(t.elem)[t.prop](next);
					t._last = this.get(t);
				}
			}
		};

		// AMD requirement
		return $scrollTo;
	});
}(typeof define === 'function' && define.amd ? define : function(deps, factory) {
	'use strict';
	if (typeof module !== 'undefined' && module.exports) {
		// Node
		module.exports = factory(require('jquery'));
	} else {
		factory(jQuery);
	}
}));

/**
 * SVGInjector v1.1.2 - Fast, caching, dynamic inline SVG DOM injection library
 * https://github.com/iconic/SVGInjector
 *
 * Copyright (c) 2014 Waybury <hello@waybury.com>
 * @license MIT
 */
!function(t,e){"use strict";function r(t){t=t.split(" ");for(var e={},r=t.length,n=[];r--;)e.hasOwnProperty(t[r])||(e[t[r]]=1,n.unshift(t[r]));return n.join(" ")}var n="file:"===t.location.protocol,i=e.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure","1.1"),o=Array.prototype.forEach||function(t,e){if(void 0===this||null===this||"function"!=typeof t)throw new TypeError;var r,n=this.length>>>0;for(r=0;n>r;++r)r in this&&t.call(e,this[r],r,this)},a={},s=0,l=[],u=[],c={},f=function(t){return t.cloneNode(!0)},p=function(t,e){u[t]=u[t]||[],u[t].push(e)},d=function(t){for(var e=0,r=u[t].length;r>e;e++)!function(e){setTimeout(function(){u[t][e](f(a[t]))},0)}(e)},h=function(e,r){if(void 0!==a[e])a[e]instanceof SVGSVGElement?r(f(a[e])):p(e,r);else{if(!t.XMLHttpRequest)return r("Browser does not support XMLHttpRequest"),!1;a[e]={},p(e,r);var i=new XMLHttpRequest;i.onreadystatechange=function(){if(4===i.readyState){if(404===i.status||null===i.responseXML)return r("Unable to load SVG file: "+e),n&&r("Note: SVG injection ajax calls do not work locally without adjusting security setting in your browser. Or consider using a local webserver."),r(),!1;if(!(200===i.status||n&&0===i.status))return r("There was a problem injecting the SVG: "+i.status+" "+i.statusText),!1;if(i.responseXML instanceof Document)a[e]=i.responseXML.documentElement;else if(DOMParser&&DOMParser instanceof Function){var t;try{var o=new DOMParser;t=o.parseFromString(i.responseText,"text/xml")}catch(s){t=void 0}if(!t||t.getElementsByTagName("parsererror").length)return r("Unable to parse SVG file: "+e),!1;a[e]=t.documentElement}d(e)}},i.open("GET",e),i.overrideMimeType&&i.overrideMimeType("text/xml"),i.send()}},v=function(e,n,a,u){var f=e.getAttribute("data-src")||e.getAttribute("src");if(!/\.svg/i.test(f))return void u("Attempted to inject a file with a non-svg extension: "+f);if(!i){var p=e.getAttribute("data-fallback")||e.getAttribute("data-png");return void(p?(e.setAttribute("src",p),u(null)):a?(e.setAttribute("src",a+"/"+f.split("/").pop().replace(".svg",".png")),u(null)):u("This browser does not support SVG and no PNG fallback was defined."))}-1===l.indexOf(e)&&(l.push(e),e.setAttribute("src",""),h(f,function(i){if("undefined"==typeof i||"string"==typeof i)return u(i),!1;var a=e.getAttribute("id");a&&i.setAttribute("id",a);var p=e.getAttribute("title");p&&i.setAttribute("title",p);var d=[].concat(i.getAttribute("class")||[],"injected-svg",e.getAttribute("class")||[]).join(" ");i.setAttribute("class",r(d));var h=e.getAttribute("style");h&&i.setAttribute("style",h);var v=[].filter.call(e.attributes,function(t){return/^data-\w[\w\-]*$/.test(t.name)});o.call(v,function(t){t.name&&t.value&&i.setAttribute(t.name,t.value)});for(var g,b=i.querySelectorAll("defs clipPath[id]"),m=0,y=b.length;y>m;m++){g=b[m].id+"-"+s;for(var A=i.querySelectorAll('[clip-path*="'+b[m].id+'"]'),w=0,S=A.length;S>w;w++)A[w].setAttribute("clip-path","url(#"+g+")");b[m].id=g}for(var x,j=i.querySelectorAll("defs mask[id]"),T=0,G=j.length;G>T;T++){x=j[T].id+"-"+s;for(var M=i.querySelectorAll('[mask*="'+j[T].id+'"]'),V=0,q=M.length;q>V;V++)M[V].setAttribute("mask","url(#"+x+")");j[T].id=x}i.removeAttribute("xmlns:a");for(var k,E,O=i.querySelectorAll("script"),L=[],P=0,X=O.length;X>P;P++)E=O[P].getAttribute("type"),E&&"application/ecmascript"!==E&&"application/javascript"!==E||(k=O[P].innerText||O[P].textContent,L.push(k),i.removeChild(O[P]));if(L.length>0&&("always"===n||"once"===n&&!c[f])){for(var F=0,N=L.length;N>F;F++)new Function(L[F])(t);c[f]=!0}e.parentNode.replaceChild(i,e),delete l[l.indexOf(e)],e=null,s++,u(i)}))},g=function(t,e,r){e=e||{};var n=e.evalScripts||"always",i=e.pngFallback||!1,a=e.each;if(void 0!==t.length){var s=0;o.call(t,function(e){v(e,n,i,function(e){a&&"function"==typeof a&&a(e),r&&t.length===++s&&r(s)})})}else t?v(t,n,i,function(e){a&&"function"==typeof a&&a(e),r&&r(1),t=null}):r&&r(0)};"object"==typeof module&&"object"==typeof module.exports?module.exports=exports=g:"function"==typeof define&&define.amd?define(function(){return g}):"object"==typeof t&&(t.SVGInjector=g)}(window,document);
//# sourceMappingURL=svg-injector.map.js
/*  This jQuery plugin replaces SVG images in HTML 'img' elements (and optionally CSS in background-images) with
    PNG replacement images.  This is accomplished by the use of a remote image replacement service.
    
    Copyright © 2013-2014 - Authors:
    
    * Dirk Groenen [Bitlabs Development - dirk@bitlabs.nl]            Original author
    
    * Craig Fowler [CSF Software Limited - craig@csf-dev.com]         Redesign and enhancements

    Version 3.0.1
    
    ---

    Copyright 2013-2014 Dirk Groenen

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

		http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
*/

/**
 * Replaces matched SVG images in HTML 'img' elements (and optionally CSS background-image properties) with PNG
 * replacement images, generated by a remote server/service API.
 * 
 * -------
 * Options
 * -------
 * * temporaryHoldingImage    [string] This is a URI to an image which will be used as a "holding" image for the SVG
 *                            replacements until the URI of the appropriate PNG replacement has been retrieved from the
 *                            remote server. If set to null (the default behaviour) then no holding image will be used.
 * 
 * * forceReplacements        [boolean] If set to true then SVGMagic will replace SVG images even when the web browser
 *                            reports that it has native SVG support. If set to false (the default behaviour) then
 *                            replacement will only be performed when the web browser does not natively support SVG
 *                            images.
 * 
 * * handleBackgroundImages   [boolean] If set to true then SVGMagic will inspect the CSS background-image property of
 *                            matched elements.  If the background image is an SVG then replacement will additionally
 *                            be performed upon the background image.  If set to false (the default behaviour) then no
 *                            attempt will be made to detect and replace CSS background images.
 * 
 *                            Note that even when this option is enabled, background images are only detected on matched
 *                            elements.  No DOM search is performed to discover background images on (for example) child
 *                            nodes.
 * 
 * * additionalRequestData    [object] This is an object representing key/value pairs of information to send to the
 *                            remote server as part of the request.  The default is an empty object (resulting in no
 *                            additional data being sent).
 * 
 *                            This option is affected by the deprecated options 'secure' and 'dumpcache'.  Presently,
 *                            in order to preserve backwards-compatibility, the keys 'secure' and 'dumpcache' will
 *                            be added to the request data if they are not already present.  The values of these keys
 *                            will contain the respective values of those deprecated options.
 * 
 *                            Additionally, the key 'svgsources' is reserved and will always be overwritten with an
 *                            array of the URIs to the SVG images to be replaced. For this reason, the key 'svgsources'
 *                            must not be used within the additional request data.
 * 
 * * postReplacementCallback  [function(replacedImages)] This is a callback function which is executed after all of the
 *                            image replacement URIs have been retrieved from the remote server and the replacements
 *                            have been performed.
 * 
 *                            The parameter passed to this callback is a JavaScript array of objects which have the
 *                            following structure:
 *                            {
 *                              element             [object] A reference to the jQuery element node upon which the image
 *                                                  replacement has been performed.
 * 
 *                              isBackground        [boolean] True if the the replacement was made upon a CSS
 *                                                  background-image.  Otherwise this is an HTML 'img' element.
 * 
 *                              originalUri         [string] The original URI of the SVG image which has been replaced.
 * 
 *                              replacementUri      [string] The URI of the PNG replacement image.
 *                            }
 * 
 * * remoteServerUri          [string] This is the URI to the remote server API endpoint which converts SVG images into
 *                            PNGs and returns the list of URIs to those PNG replacements.  It is set by default to:
 *                            http://svgmagic.bitlabs.nl/converter.php
 * 
 *                            If you wish to host your own image-conversion server script/service then replace this with
 *                            the URI of your own API endpoint.
 * 
 * * remoteRequestType        [string] This is the type of HTTP request which will be used to communicate with the
 *                            remote server/service endpoint. By default this is set to 'POST'. Be careful if hosting
 *                            a service which accepts HTTP GET requests, as it could be vulnerable to CSRF attacks.
 * 
 * * remoteDataType           [string] This is the data-type sent to and received from the remote server.  By default
 *                            this is set to 'json'.
 * 
 * * replacementUriCreator    [function(jQueryElement, originalUri, isBackground)] If provided, this option alters the
 *                            behaviour of SVGMagic, short-cutting out the initial call to the remote server, to
 *                            retrieve the URIs to the replacement PNG images.  This is suitable for use in specialised
 *                            scenarios when the creation of the URI for the PNG replacements may be accomplished
 *                            entirely in JavaScript.  The server hosting those replacement PNG images must also be
 *                            capable of serving the correct image with only a single GET URI (as the server will not
 *                            have been pre-notified of the path to the SVG source file).  As such, it is most likely to
 *                            be used in hosted applications on a single domain, in which server-side logic has been
 *                            created to serve pre-ordained PNG replacement images.
 * 
 *                            The parameters which this function receives are:
 *                            * [object] A reference to the jQuery object representing the HTML node on which the
 *                              replacement is to be made.
 *                            * [string] The URI of the original SVG image to be replaced.
 *                            * [boolean] True if the replacement is a CSS background-image, false if it is an HTML
 *                              image element.
 * 
 *                            The function (if present) must return a string.  This string indicates the URI to the
 *                            PNG replacement image.  If null is returned then the replacement is skipped and the
 *                            original SVG image is left in-place.
 * 
 *                            The default behaviour (in which this function is null/not-provided) uses a call to a
 *                            remote server/API endpoint containing a list of the URIs of the SVG images to be replaced,
 *                            The response is parsed for the URIs of the replacement PNG images. 
 * 
 * * debug          [boolean] When enabled the script will provide usefull debug information. By default this option is
 *                            set to 'false'. Please remember to disable this option when in a production environment.
 * ------------------
 * Deprecated options
 * ------------------
 * * preloader                [string or boolean] This is the URI to an image file which is used as a "holding" image
 *                            for your SVG images while the PNG replacements load from the remote server.  If set to
 *                            boolean false (the default behaviour) then no such holding image is used.
 * 
 *                            DEPRECATED: Use 'temporaryHoldingImage' instead.  If 'temporaryHoldingImage' is set then
 *                            this option is ignored.
 * 
 * * testmode                 [boolean] If set to true then the SVG replacement will be forced on all browsers,
 *                            including those which report that they support SVG natively.  If set to false (the default
 *                            behaviour) then the SVG replacement will only be performed upon browsers which do not
 *                            support it natively.
 * 
 *                            DEPRECATED: Use 'forceReplacements' instead.
 * 
 * * secure                   [boolean] The value (true or false) of this option is passed to the remote SVG replacement
 *                            server as part of the HTTP POST parameters.  Whilst the server may honour it or not, it is
 *                            intended that if the value is true, then the remote server will return a series of HTTPS
 *                            URIs (for the PNG replacement images). If set to false (the default behaviour) then the
 *                            remote server should return HTTP (non-secured) URIs.
 * 
 *                            Regardless of the setting of this option - the initial call to the remote server will be
 *                            performed via unsecured HTTP.
 * 
 *                            DEPRECATED: Use 'additionalRequestData' instead, adding data which the server will
 *                            interpret in order to serve HTTPS image URIs.  The value of this option will be appended
 *                            to the additional request data before it is sent to the server.
 * 
 * * callback                 [function()] An optional callback function which executes once all of the PNG replacement
 *                            image URIs have been retrieved from the remote server and all of the SVG images have had
 *                            their URIs replaced.  This is not quite a callback which executes after the replacement
 *                            images have loaded.  If the value is set to false (the default behaviour) then no
 *                            additional callback is executed.  No parameters are passed to this callback.
 * 
 *                            DEPRECATED: Use 'postReplacementCallback' instead.  If 'postReplacementCallback' is set
 *                            then this option is ignored.
 * 
 * * backgroundimage          [boolean] If set to true then additional inspection will be performed upon all matched
 *                            elements in order to find a CSS background-image property.  If such a property is found
 *                            then it will be included in the replacement process.  If set to false (the default
 *                            behaviour) then no additional work will be performed to find background-images which are
 *                            SVG.
 * 
 *                            DEPRECATED: Use 'handleBackgroundImages' instead.
 * 
 * * dumpcache                [boolean] The value (true or false) of this option is passed to the remote SVG replacement
 *                            server as part of the HTTP POST parameters.  If set to true, then the server is requested
 *                            to clear any cached PNG copy of the replaced SVG image.  This will result in the remote
 *                            server re-generating the PNG replacement.  If set to false (the default behaviour) then
 *                            the remote server is expected to serve cached PNG replacement images where possible. 
 * 
 *                            DEPRECATED: Use 'additionalRequestData' instead, adding data which the server will
 *                            interpret as a request to drop its cache.  The value of this option will be appended
 *                            to the additional request data before it is sent to the server.
 */

(function($) {
    $.fn.svgmagic = function(givenOptions)
    {
        var
        defaultOptions = {
            // Deprecated options
            preloader:              false,
            testmode:               false,
            secure:                 false,
            callback:               false,
            backgroundimage:        false,
            dumpcache:              false,

            // Replacements for deprecated options
            temporaryHoldingImage:  null,
            forceReplacements:      false,
            handleBackgroundImages: false,
            additionalRequestData:  {},
            postReplacementCallback:null,

            // New options
            remoteServerUri:        'http://bitlabs.nl/svgmagic/converter/3/',
            remoteRequestType:      'POST',
            remoteDataType:         'jsonp',
            debug:                  false,
            
            // TODO: Implement this option
            replacementUriCreator:  null
        },
        untidyOptions = $.extend(defaultOptions, givenOptions),
        options = tidyOptions(untidyOptions),
        holdingImageTimeouts = {},
        matchedNodes = this,
        images = [],
        imgElementName = 'img',
        srcAttributeName = 'src',
        backgroundImagePropertyName = 'background-image',
        urlMatcher = /^url\(["']?([^"'()]+)["']?\)$/,
        svgExtension = /\.svg$/,
        svgDataUri = /^data:image\/svg\+xml/,
        holdingImageTimeoutDuration = 500,
        VERSION = 3.0;
    
        /**
         * Check if the remoteServerUri has to be replaced with https
         */
        if(window.location.protocol == "https:" || options.additionalRequestData.secure)
        {
            options.remoteServerUri = options.remoteServerUri.replace("http://", "https://");

        }

        log(false, "Using " + options.remoteServerUri + " as remote server");
    
        /**
         * The place where all magic starts
         */
        if(shouldPerformReplacement(options))
        {
            getReplacementUris(options, matchedNodes);
        }
    
        /**
         * Include JSON if it's not available in the browser
         */
        if (typeof JSON == 'undefined') {
            if(typeof JSON!=="object"){JSON={}}(function(){"use strict";function f(e){return e<10?"0"+e:e}function quote(e){escapable.lastIndex=0;return escapable.test(e)?'"'+e.replace(escapable,function(e){var t=meta[e];return typeof t==="string"?t:"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+e+'"'}function str(e,t){var n,r,i,s,o=gap,u,a=t[e];if(a&&typeof a==="object"&&typeof a.toJSON==="function"){a=a.toJSON(e)}if(typeof rep==="function"){a=rep.call(t,e,a)}switch(typeof a){case"string":return quote(a);case"number":return isFinite(a)?String(a):"null";case"boolean":case"null":return String(a);case"object":if(!a){return"null"}gap+=indent;u=[];if(Object.prototype.toString.apply(a)==="[object Array]"){s=a.length;for(n=0;n<s;n+=1){u[n]=str(n,a)||"null"}i=u.length===0?"[]":gap?"[\n"+gap+u.join(",\n"+gap)+"\n"+o+"]":"["+u.join(",")+"]";gap=o;return i}if(rep&&typeof rep==="object"){s=rep.length;for(n=0;n<s;n+=1){if(typeof rep[n]==="string"){r=rep[n];i=str(r,a);if(i){u.push(quote(r)+(gap?": ":":")+i)}}}}else{for(r in a){if(Object.prototype.hasOwnProperty.call(a,r)){i=str(r,a);if(i){u.push(quote(r)+(gap?": ":":")+i)}}}}i=u.length===0?"{}":gap?"{\n"+gap+u.join(",\n"+gap)+"\n"+o+"}":"{"+u.join(",")+"}";gap=o;return i}}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()}}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b"," ":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;if(typeof JSON.stringify!=="function"){JSON.stringify=function(e,t,n){var r;gap="";indent="";if(typeof n==="number"){for(r=0;r<n;r+=1){indent+=" "}}else if(typeof n==="string"){indent=n}rep=t;if(t&&typeof t!=="function"&&(typeof t!=="object"||typeof t.length!=="number")){throw new Error("JSON.stringify")}return str("",{"":e})}}if(typeof JSON.parse!=="function"){JSON.parse=function(text,reviver){function walk(e,t){var n,r,i=e[t];if(i&&typeof i==="object"){for(n in i){if(Object.prototype.hasOwnProperty.call(i,n)){r=walk(i,n);if(r!==undefined){i[n]=r}else{delete i[n]}}}}return reviver.call(e,t,i)}var j;text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(e){return"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")}}})()
        }
    
        /**
         * Determines whether or not image replacements should be performed.
         * 
         * @return [boolean] True if SVG replacements should be made, false if not.
         */
        function shouldPerformReplacement(opts)
        {
            return opts.forceReplacements || !document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1");
        }
    
        /**
         * Builds and returns an array of all of the matched image elements and 'elements which require background-image
         * replacements'.  These objects contain a reference to the element, as well as the image URI.
         * 
         * @return [array] - an array of objects containing information about the images to be replaced.  See
         *         'buildImageReference' for a specification of the contained objects.
         */
        function buildImageList(opts, nodes)
        {
            var output = [];
      
            nodes.each(function() {
                var timeout, $this = $(this);

                if($this.attr(srcAttributeName))
                {
                    var result = buildImageReference($this.attr(srcAttributeName), $this, false);
                    if(result)
                    {
                        output.push(result);

                        if(opts.temporaryHoldingImage)
                        {
                            timeout = setTimeout(function() {
                                $this.attr(srcAttributeName, opts.temporaryHoldingImage);
                            }, holdingImageTimeoutDuration);

                            holdingImageTimeouts[output.length - 1] = timeout;
                        }
                    }
                }

                if(opts.handleBackgroundImages && $this.css(backgroundImagePropertyName) && $this.css(backgroundImagePropertyName) != 'none')
                {
                    var result = buildImageReference(urlMatcher.exec($this.css(backgroundImagePropertyName))[1], $this, true);
                    if(result)
                    {
                        output.push(result);
                    }
                }
            });

            log(false, ["Builded image list", output]);
      
            return output;
        }
    
        /**
         * Builds a single image reference object, as would be returned as part of the array created by 'buildImageList'.
         * 
         * @return [object] An object containing information about a single SVG image to replace.
         */
        function buildImageReference(imageUri, element, isBackground)
        {
            var output = null;

            if(svgExtension.test(imageUri) || svgDataUri.test(imageUri))
            {
                var tempImage = new Image();
                tempImage.src = imageUri;

                output = {
                    element: element,
                    isBackground: isBackground,
                    originalUri: tempImage.src,
                    replacementUri: null
                };
            }

            return output;
        }
    
        /**
         * The core functionality of this plugin, which makes the call to the remote service endpoint with a collection of
         * SVG image URIs for which PNG replacements are required, and then proceeds to handle the result.
         */
        function getReplacementUris(opts, nodes)
        {
            var replacementFunction = opts.replacementUriCreator;
            images = buildImageList(opts, nodes);

            if(images.length > 0)
            {
                if(replacementFunction && typeof replacementFunction == 'function')
                {
                    for(var i = 0; i < images.length; i++)
                    {
                        var image = images[i];
                        image.replacementUri = replacementFunction(image.element, image.originalUri, image.isBackground);
                    }

                    performReplacements(opts);
                }
                else
                {
                    getReplacementUrisFromRemoteService(opts);
                }
            }
        }
    
        /**
         * Gets all of the replacement image URIs from a remote server using an API call.
         */
        function getReplacementUrisFromRemoteService(opts)
        {
            var
            sources = [],
            data = {};

            for(var i = 0; i < images.length; i++)
            {
                sources.push(images[i].originalUri);
            }

            // Get baseurl
            var baseUrl = window.location.href.split('/');
            $.extend(data, opts.additionalRequestData, { svgsources: sources, version: VERSION, origin: baseUrl[2] });

            $.ajax({
                dataType: opts.remoteDataType,
                method: opts.remoteRequestType,
                url: opts.remoteServerUri,
                data: data,
                timeout: 3000,
                success: function(response, textStatus, jqXHR) {
                    for(var i = 0; i < images.length; i++)
                    {
                        var image = images[i],
                            responseUri = response.images[i].image;

                        image.replacementUri = responseUri;
                        image.error = response.images[i].error;
                        image.responseMsg = response.images[i].msg;
                        image.filename = response.images[i].filename;
                    }

                    performReplacements(opts);
                },
                error: function(){
                    log(true, "The request took longer than 3 seconds to complete. No image were replaced. Use the developer tools to check wheter the server responded with an error.")
                }
            });
        }
    
        /**
         * Performs image replacements using the result from the remote replacement service.
         */
        function performReplacements(opts)
        {
            for(var i = 0; i < images.length; i++)
            {
                var image = images[i], newUri = image.replacementUri;

                if(!newUri)
                {
                    log(true, image.filename + ": No new url received");
                    continue;
                }
                else if(image.error)
                {
                    log(true, image.filename + ": " + image.responseMsg);
                    continue;
                }
                else if(!image.isBackground)
                {
                    log(false, image.filename + ": Image replaced. Server responded with: " + image.responseMsg);

                    if(opts.temporaryHoldingImage)
                    {
                        clearTimeout(holdingImageTimeouts[i]);
                    }
                    image.element.attr(srcAttributeName, newUri);
                }
                else
                {
                    log(false, image.filename + ": Background image replaced. Server responded with: " + image.responseMsg);
                    image.element.css(backgroundImagePropertyName, 'url("' + newUri + '")');
                }
            }

            if(opts.postReplacementCallback && typeof opts.postReplacementCallback == 'function')
            {
                opts.postReplacementCallback(images);
            }
        }
        
        /**
         * Tidies up an object containing options for this plugin.  Takes any deprecated options (where set) and writes
         * them into the equivalent replacement option.
         */
        function tidyOptions(originalOptions)
        {
            if(!originalOptions.temporaryHoldingImage && originalOptions.preloader && typeof originalOptions.preloader == 'string')
            {
                originalOptions.temporaryHoldingImage = originalOptions.preloader;
            }

            if(originalOptions.testmode && typeof originalOptions.testmode == 'boolean')
            {
                originalOptions.forceReplacements = true;
            }

            if(!originalOptions.postReplacementCallback && originalOptions.callback && typeof originalOptions.callback == 'function')
            {
                originalOptions.postReplacementCallback = function(replacedImages)
                {
                    originalOptions.callback();
                };
            }

            if(!originalOptions.additionalRequestData['secure'])
            {
                originalOptions.additionalRequestData.secure = originalOptions.secure;
            }
            if(!originalOptions.additionalRequestData['dumpcache'])
            {
                originalOptions.additionalRequestData.dumpcache = originalOptions.dumpcache;
            }

            return originalOptions;
        }

        /*
         * Create console log message of option has been enabled
         */
        function log(error, msg){
            if(options.debug){
                if(error)
                    console.error(msg)
                else
                    console.log(msg);
            }
        }

        // Return the original jQuery object, standard jQuery behaviour.
        return this;
    };
}(jQuery));

/*
 *  Vide - v0.3.4
 *  Easy as hell jQuery plugin for video backgrounds.
 *  http://vodkabears.github.io/vide/
 *
 *  Made by Ilya Makarov
 *  Under MIT License
 */
!(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    factory(require('jquery'));
  } else {
    factory(root.jQuery);
  }
})(this, function($) {

  'use strict';

  /**
   * Name of the plugin
   * @private
   * @const
   * @type {String}
   */
  var PLUGIN_NAME = 'vide';

  /**
   * Default settings
   * @private
   * @const
   * @type {Object}
   */
  var DEFAULTS = {
    volume: 1,
    playbackRate: 1,
    muted: true,
    loop: true,
    autoplay: true,
    position: '50% 50%',
    posterType: 'detect',
    resizing: true
  };

  /**
   * Parse a string with options
   * @private
   * @param {String} str
   * @returns {Object|String}
   */
  function parseOptions(str) {
    var obj = {};
    var delimiterIndex;
    var option;
    var prop;
    var val;
    var arr;
    var len;
    var i;

    // Remove spaces around delimiters and split
    arr = str.replace(/\s*:\s*/g, ':').replace(/\s*,\s*/g, ',').split(',');

    // Parse a string
    for (i = 0, len = arr.length; i < len; i++) {
      option = arr[i];

      // Ignore urls and a string without colon delimiters
      if (
        option.search(/^(http|https|ftp):\/\//) !== -1 ||
        option.search(':') === -1
      ) {
        break;
      }

      delimiterIndex = option.indexOf(':');
      prop = option.substring(0, delimiterIndex);
      val = option.substring(delimiterIndex + 1);

      // If val is an empty string, make it undefined
      if (!val) {
        val = undefined;
      }

      // Convert a string value if it is like a boolean
      if (typeof val === 'string') {
        val = val === 'true' || (val === 'false' ? false : val);
      }

      // Convert a string value if it is like a number
      if (typeof val === 'string') {
        val = !isNaN(val) ? +val : val;
      }

      obj[prop] = val;
    }

    // If nothing is parsed
    if (prop == null && val == null) {
      return str;
    }

    return obj;
  }

  /**
   * Parse a position option
   * @private
   * @param {String} str
   * @returns {Object}
   */
  function parsePosition(str) {
    str = '' + str;

    // Default value is a center
    var args = str.split(/\s+/);
    var x = '50%';
    var y = '50%';
    var len;
    var arg;
    var i;

    for (i = 0, len = args.length; i < len; i++) {
      arg = args[i];

      // Convert values
      if (arg === 'left') {
        x = '0%';
      } else if (arg === 'right') {
        x = '100%';
      } else if (arg === 'top') {
        y = '0%';
      } else if (arg === 'bottom') {
        y = '100%';
      } else if (arg === 'center') {
        if (i === 0) {
          x = '50%';
        } else {
          y = '50%';
        }
      } else {
        if (i === 0) {
          x = arg;
        } else {
          y = arg;
        }
      }
    }

    return { x: x, y: y };
  }

  /**
   * Search a poster
   * @private
   * @param {String} path
   * @param {Function} callback
   */
  function findPoster(path, callback) {
    var onLoad = function() {
      callback(this.src);
    };

    $('<img src="' + path + '.gif">').load(onLoad);
    $('<img src="' + path + '.jpg">').load(onLoad);
    $('<img src="' + path + '.jpeg">').load(onLoad);
    $('<img src="' + path + '.png">').load(onLoad);
  }

  /**
   * Vide constructor
   * @param {HTMLElement} element
   * @param {Object|String} path
   * @param {Object|String} options
   * @constructor
   */
  function Vide(element, path, options) {
    this.$element = $(element);

    // Parse path
    if (typeof path === 'string') {
      path = parseOptions(path);
    }

    // Parse options
    if (!options) {
      options = {};
    } else if (typeof options === 'string') {
      options = parseOptions(options);
    }

    // Remove an extension
    if (typeof path === 'string') {
      path = path.replace(/\.\w*$/, '');
    } else if (typeof path === 'object') {
      for (var i in path) {
        if (path.hasOwnProperty(i)) {
          path[i] = path[i].replace(/\.\w*$/, '');
        }
      }
    }

    this.settings = $.extend({}, DEFAULTS, options);
    this.path = path;

    this.init();
  }

  /**
   * Initialization
   * @public
   */
  Vide.prototype.init = function() {
    var vide = this;
    var position = parsePosition(vide.settings.position);
    var sources = '';
    var poster;

    // Set styles of a video wrapper
    vide.$wrapper = $('<div>').css({
      position: 'absolute',
      'z-index': -1,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      overflow: 'hidden',
      '-webkit-background-size': 'cover',
      '-moz-background-size': 'cover',
      '-o-background-size': 'cover',
      'background-size': 'cover',
      'background-repeat': 'no-repeat',
      'background-position': position.x + ' ' + position.y
    });

    // Get a poster path
    poster = vide.path;
    if (typeof vide.path === 'object') {
      if (vide.path.poster) {
        poster = vide.path.poster;
      } else {
        if (vide.path.mp4) {
          poster = vide.path.mp4;
        } else if (vide.path.webm) {
          poster = vide.path.webm;
        } else if (vide.path.ogv) {
          poster = vide.path.ogv;
        }
      }
    }

    // Set a video poster
    if (vide.settings.posterType === 'detect') {
      findPoster(poster, function(url) {
        vide.$wrapper.css('background-image', 'url(' + url + ')');
      });
    } else if (vide.settings.posterType !== 'none') {
      vide.$wrapper
        .css('background-image', 'url(' + poster + '.' + vide.settings.posterType + ')');
    }

    // If a parent element has a static position, make it relative
    if (vide.$element.css('position') === 'static') {
      vide.$element.css('position', 'relative');
    }

    vide.$element.prepend(vide.$wrapper);

    if (typeof vide.path === 'object') {
      if (vide.path.mp4) {
        sources += '<source src="' + vide.path.mp4 + '.mp4" type="video/mp4">';
      }

      if (vide.path.webm) {
        sources += '<source src="' + vide.path.webm + '.webm" type="video/webm">';
      }

      if (vide.path.ogv) {
        sources += '<source src="' + vide.path.ogv + '.ogv" type="video/ogv">';
      }

      vide.$video = $('<video>' + sources + '</video>');
    } else {
      vide.$video = $('<video>' +
        '<source src="' + vide.path + '.mp4" type="video/mp4">' +
        '<source src="' + vide.path + '.webm" type="video/webm">' +
        '<source src="' + vide.path + '.ogv" type="video/ogg">' +
        '</video>');
    }

    vide.$video

      // Set video properties
      .prop({
        autoplay: vide.settings.autoplay,
        loop: vide.settings.loop,
        volume: vide.settings.volume,
        muted: vide.settings.muted,
        defaultMuted: vide.settings.muted,
        playbackRate: vide.settings.playbackRate,
        defaultPlaybackRate: vide.settings.playbackRate
      })

      // Video alignment
      .css({
        margin: 'auto',
        position: 'absolute',
        'z-index': -1,
        top: position.y,
        left: position.x,
        '-webkit-transform': 'translate(-' + position.x + ', -' + position.y + ')',
        '-ms-transform': 'translate(-' + position.x + ', -' + position.y + ')',
        '-moz-transform': 'translate(-' + position.x + ', -' + position.y + ')',
        transform: 'translate(-' + position.x + ', -' + position.y + ')',

        // Disable visibility, while loading
        visibility: 'hidden'
      })

      // Resize a video, when it's loaded
      .on('canplaythrough.' + PLUGIN_NAME, function() {
        vide.$video.css('visibility', 'visible');
        vide.resize();
        vide.$wrapper.css('background-image', 'none');
      });

    // Resize event is available only for 'window'
    // Use another code solutions to detect DOM elements resizing
    vide.$element.on('resize.' + PLUGIN_NAME, function() {
      if (vide.settings.resizing) {
        vide.resize();
      }
    });

    // Append a video
    vide.$wrapper.append(vide.$video);
  };

  /**
   * Get a video element
   * @public
   * @returns {HTMLVideoElement}
   */
  Vide.prototype.getVideoObject = function() {
    return this.$video[0];
  };

  /**
   * Resize a video background
   * @public
   */
  Vide.prototype.resize = function() {
    if (!this.$video) {
      return;
    }

    // Get a native video size
    var videoHeight = this.$video[0].videoHeight;
    var videoWidth = this.$video[0].videoWidth;

    // Get a wrapper size
    var wrapperHeight = this.$wrapper.height();
    var wrapperWidth = this.$wrapper.width();

    if (wrapperWidth / videoWidth > wrapperHeight / videoHeight) {
      this.$video.css({

        // +2 pixels to prevent an empty space after transformation
        width: wrapperWidth + 2,
        height: 'auto'
      });
    } else {
      this.$video.css({
        width: 'auto',

        // +2 pixels to prevent an empty space after transformation
        height: wrapperHeight + 2
      });
    }
  };

  /**
   * Destroy a video background
   * @public
   */
  Vide.prototype.destroy = function() {
    this.$element.off(PLUGIN_NAME);

    if (this.$video) {
      this.$video.off(PLUGIN_NAME);
    }

    delete $[PLUGIN_NAME].lookup[this.index];
    this.$element.removeData(PLUGIN_NAME);
    this.$wrapper.remove();
  };

  /**
   * Special plugin object for instances.
   * @public
   * @type {Object}
   */
  $[PLUGIN_NAME] = {
    lookup: []
  };

  /**
   * Plugin constructor
   * @param {Object|String} path
   * @param {Object|String} options
   * @returns {JQuery}
   * @constructor
   */
  $.fn[PLUGIN_NAME] = function(path, options) {
    var instance;

    this.each(function() {
      instance = $.data(this, PLUGIN_NAME);

      if (instance) {

        // Destroy the plugin instance if exists
        instance.destroy();
      }

      // Create the plugin instance
      instance = new Vide(this, path, options);
      instance.index = $[PLUGIN_NAME].lookup.push(instance) - 1;
      $.data(this, PLUGIN_NAME, instance);
    });

    return this;
  };

  $(document).ready(function() {
    var $window = $(window);

    // Window resize event listener
    $window.on('resize.' + PLUGIN_NAME, function() {
      for (var len = $[PLUGIN_NAME].lookup.length, i = 0, instance; i < len; i++) {
        instance = $[PLUGIN_NAME].lookup[i];

        if (instance && instance.settings.resizing) {
          instance.resize();
        }
      }
    });

    // https://github.com/VodkaBears/Vide/issues/68
    $window.on('unload.' + PLUGIN_NAME, function() {
      return false;
    });

    // Auto initialization
    // Add 'data-vide-bg' attribute with a path to the video without extension
    // Also you can pass options throw the 'data-vide-options' attribute
    // 'data-vide-options' must be like 'muted: false, volume: 0.5'
    $(document).find('[data-' + PLUGIN_NAME + '-bg]').each(function(i, element) {
      var $element = $(element);
      var options = $element.data(PLUGIN_NAME + '-options');
      var path = $element.data(PLUGIN_NAME + '-bg');

      $element[PLUGIN_NAME](path, options);
    });
  });

});

/*! waitForImages jQuery Plugin - v2.0.0 - 2015-04-28
* https://github.com/alexanderdickson/waitForImages
* Copyright (c) 2015 Alex Dickson; Licensed MIT */
;(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    // Namespace all events.
    var eventNamespace = 'waitForImages';

    // CSS properties which contain references to images.
    $.waitForImages = {
        hasImageProperties: [
            'backgroundImage',
            'listStyleImage',
            'borderImage',
            'borderCornerImage',
            'cursor'
        ],
        hasImageAttributes: ['srcset']
    };

    // Custom selector to find `img` elements that have a valid `src`
    // attribute and have not already loaded.
    $.expr[':'].uncached = function (obj) {
        // Ensure we are dealing with an `img` element with a valid
        // `src` attribute.
        if (!$(obj).is('img[src][src!=""]')) {
            return false;
        }

        return !obj.complete;
    };

    $.fn.waitForImages = function () {

        var allImgsLength = 0;
        var allImgsLoaded = 0;
        var deferred = $.Deferred();

        var finishedCallback;
        var eachCallback;
        var waitForAll;

        // Handle options object (if passed).
        if ($.isPlainObject(arguments[0])) {

            waitForAll = arguments[0].waitForAll;
            eachCallback = arguments[0].each;
            finishedCallback = arguments[0].finished;

        } else {

            // Handle if using deferred object and only one param was passed in.
            if (arguments.length === 1 && $.type(arguments[0]) === 'boolean') {
                waitForAll = arguments[0];
            } else {
                finishedCallback = arguments[0];
                eachCallback = arguments[1];
                waitForAll = arguments[2];
            }

        }

        // Handle missing callbacks.
        finishedCallback = finishedCallback || $.noop;
        eachCallback = eachCallback || $.noop;

        // Convert waitForAll to Boolean
        waitForAll = !! waitForAll;

        // Ensure callbacks are functions.
        if (!$.isFunction(finishedCallback) || !$.isFunction(eachCallback)) {
            throw new TypeError('An invalid callback was supplied.');
        }

        this.each(function () {
            // Build a list of all imgs, dependent on what images will
            // be considered.
            var obj = $(this);
            var allImgs = [];
            // CSS properties which may contain an image.
            var hasImgProperties = $.waitForImages.hasImageProperties || [];
            // Element attributes which may contain an image.
            var hasImageAttributes = $.waitForImages.hasImageAttributes || [];
            // To match `url()` references.
            // Spec: http://www.w3.org/TR/CSS2/syndata.html#value-def-uri
            var matchUrl = /url\(\s*(['"]?)(.*?)\1\s*\)/g;

            if (waitForAll) {

                // Get all elements (including the original), as any one of
                // them could have a background image.
                obj.find('*').addBack().each(function () {
                    var element = $(this);

                    // If an `img` element, add it. But keep iterating in
                    // case it has a background image too.
                    if (element.is('img:uncached')) {
                        allImgs.push({
                            src: element.attr('src'),
                            element: element[0]
                        });
                    }

                    $.each(hasImgProperties, function (i, property) {
                        var propertyValue = element.css(property);
                        var match;

                        // If it doesn't contain this property, skip.
                        if (!propertyValue) {
                            return true;
                        }

                        // Get all url() of this element.
                        while (match = matchUrl.exec(propertyValue)) {
                            allImgs.push({
                                src: match[2],
                                element: element[0]
                            });
                        }
                    });

                    $.each(hasImageAttributes, function (i, attribute) {
                        var attributeValue = element.attr(attribute);
                        var attributeValues;

                        // If it doesn't contain this property, skip.
                        if (!attributeValue) {
                            return true;
                        }

                        // Check for multiple comma separated images
                        attributeValues = attributeValue.split(',');

                        $.each(attributeValues, function(i, value) {
                            // Trim value and get string before first
                            // whitespace (for use with srcset).
                            value = $.trim(value).split(' ')[0];
                            allImgs.push({
                                src: value,
                                element: element[0]
                            });
                        });
                    });
                });
            } else {
                // For images only, the task is simpler.
                obj.find('img:uncached')
                    .each(function () {
                    allImgs.push({
                        src: this.src,
                        element: this
                    });
                });
            }

            allImgsLength = allImgs.length;
            allImgsLoaded = 0;

            // If no images found, don't bother.
            if (allImgsLength === 0) {
                finishedCallback.call(obj[0]);
                deferred.resolveWith(obj[0]);
            }

            $.each(allImgs, function (i, img) {

                var image = new Image();
                var events =
                  'load.' + eventNamespace + ' error.' + eventNamespace;

                // Handle the image loading and error with the same callback.
                $(image).one(events, function me (event) {
                    // If an error occurred with loading the image, set the
                    // third argument accordingly.
                    var eachArguments = [
                        allImgsLoaded,
                        allImgsLength,
                        event.type == 'load'
                    ];
                    allImgsLoaded++;

                    eachCallback.apply(img.element, eachArguments);
                    deferred.notifyWith(img.element, eachArguments);

                    // Unbind the event listeners. I use this in addition to
                    // `one` as one of those events won't be called (either
                    // 'load' or 'error' will be called).
                    $(this).off(events, me);

                    if (allImgsLoaded == allImgsLength) {
                        finishedCallback.call(obj[0]);
                        deferred.resolveWith(obj[0]);
                        return false;
                    }

                });

                image.src = img.src;
            });
        });

        return deferred.promise();

    };
}));

(function($) {



  $('body').waitForImages().done(function() {
    // All descendant images have loaded, now slide up.
    $(this).addClass('is-loaded');
    console.log("welcome to freeman online");

  });



  function LowerThanAndroidVersion(testversion) {
    //var useragent = 'Mozilla/5.0 (Linux; U; Android 4.3.1; en-gb; GT-I9300 Build/IMM76D) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30';
    var useragent = navigator.userAgent;
    var androidpoint = useragent.indexOf('Android');
    if (androidpoint >= 0) {
      var rest = useragent.substring(androidpoint + 8, useragent.length);
      var version = rest.substring(0, rest.indexOf(';'));
      return (version < testversion) ? true : false;
    }
  }

  function containsWord(haystack, needle) {
    return (" " + haystack + " ").indexOf(" " + needle + " ") !== -1;
  }


  function loadMobileSlideshow() {
    console.log('slideshow-loaded');
    window.addEventListener('load', function() {
      var elm = new SlideShow('.slideshow', {
        timeout: 5000
      });
      $('.slideshow').addClass('is-vis');
    });

    var support = {
        animations: Modernizr.cssanimations
      },
      // container = document.getElementById( 'ip-container' ),
      // header = container.querySelector( '.welcome-logo' ),
      // loader = new PathLoader( document.getElementById( 'ip-loader-circle' ) ),
      animEndEventNames = {
        'WebkitAnimation': 'webkitAnimationEnd',
        'OAnimation': 'oAnimationEnd',
        'msAnimation': 'MSAnimationEnd',
        'animation': 'animationend'
      },
      // animation end event name
      animEndEventName = animEndEventNames[Modernizr.prefixed('animation')];
    //classie.add( container, 'loading' );

    $('.slideshow').waitForImages({

      finished: function() {
        console.log('complete');
        // classie.remove( container, 'loading' );
        // classie.add( container, 'loaded' );

      },
      each: function() {
        // ...
      },
      waitForAll: true
    }).progress(function(loaded, count, success) {
      //console.log(loaded + ' of ' + count + ' images has ' + (success ? 'loaded' : 'failed to load') +  '.');
      // $(this).addClass('loaded');

      // var inc = loaded+1,
      // ss_progress = 0,
      // ss_progress = Math.min( (10/count) * 0.1, 1 );

      // loader.setProgress( ss_progress * inc );

    });
  }



  //console.log('Device :::: ' + WURFL.complete_device_name);
  var deviceName = WURFL.complete_device_name;

  if (WURFL.is_mobile) {
    var droids = LowerThanAndroidVersion('4.4.4');

    loadMobileSlideshow();

    if (containsWord(deviceName, "Apple")) {
      $('#andriod-download').remove();

    } else {
      $('#apple-download').remove();
      var version = deviceName.replace(/[^\d.]/g, '');

      if (droids) {
        console.log("lower than android 4.4.4 ");

        $('body').addClass('andriod-jelly-bean');

      } else if (droids == undefined) {
        alert('no android')
      } else {
        console.log("android 4.4.4 or higher");

        $('body').addClass('andriod');
      }
    }

  } else {

    $('#andriod-download').remove();
    $('#apple-download').remove();

    $('.freeman-video').vide({
      mp4: 'vid/FreemanAppPhoneAnimation.mp4',
      poster: 'img/bg_spot.jpg'
    }, {
      playbackRate: 1,
      muted: true,
      loop: true,
      autoplay: true,
      position: '50% 50%', // Similar to the CSS `background-position` property.
      posterType: 'jpg', // Poster image type. "detect" — auto-detection; "none" — no poster; "jpg", "png", "gif",... - extensions.
      resizing: true // Auto-resizing, read: https://github.com/VodkaBears/Vide#resizing

    });

  }

  var mySVGsToInject = document.querySelectorAll('.svgs');


  $('img').svgmagic();
  $('header').headroom({
    "offset": 40,
    "tolerance": 5

  });
  var dialog = $('freeman-dialog');


  $('.learn-more').on('click', function(e) {
    e.preventDefault();

    var target = this.hash;
    target = target.replace('#', '');
    var $target = $('#' + target);
    console.log($target);

    $('html, body').stop().animate({
      'scrollTop': $target.offset().top - 80
    }, 700, 'swing', function() {
      //window.location.hash = '#' + target;
    });

  });



  $('.freeman-logo').on('click', function(e) {
    e.preventDefault();

    $('html, body').stop().animate({
      'scrollTop': (0, 0)
    }, 700, 'swing');

  });



  window.sr = new scrollReveal();

  var MQ = 768;



  if ($(window).width() <= MQ) {
    var touch_x, touch_y, obj_x, obj_y, speed_x = 0,
      speed_y = 0,
      scrollanim;



    $('.close-btn').on('click', function(e) {
      e.preventDefault();
      $('.freeman-dialog').removeClass('is-opened');
      $('.freeman-overlay').removeClass('is-opened');
      $('body').removeClass('is-fixed');
      activeScroll();
      $('.features-slider').children('li').removeClass('selected-mobile').prevAll();
      $('.freeman-dialog').find('.fre-full-width').detach();

    });


    function killScroll() {



    }

    function activeScroll() {


    }



    $('.fre-slider-nav li').on('click', function(e) {
      e.preventDefault();
      var selectedItem = $(this);
      var selectedPosition = selectedItem.index(),
        activePosition = $('.features-slider .selected').index();

      openDialog($('.features-slider'), $('.fre-slider-nav'), selectedPosition);


      function openDialog(container, pagination, n) {
        var visibleSlide = container.children('li').eq(n),
          navigationDot = pagination.find('.selected-mobile'),
          $html = container.children('li').eq(n).html();
        killScroll();



        $('.freeman-dialog').addClass('is-opened').find('img.service-img').addClass('is-loaded');
        $('.freeman-overlay').addClass('is-opened').css('height', $('body.is-loaded').height());
        $('body').addClass('is-fixed');



        $('.freeman-dialog').css('height', $('.freeman-features').height);

        $('.freeman-dialog').append($html);



        visibleSlide.removeClass('selected selected-mobile').addClass('is-moving').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
          visibleSlide.removeClass('is-moving');
        });

        container.children('li').eq(n).addClass('selected-mobile').prevAll();
        // pagination.find('li').eq(n).addClass('selected-mobile');

      }



    });


  } else {

    //change visible slide
    $('.fre-slider-nav li').on('click', function(e) {
      e.preventDefault();
      var selectedItem = $(this);
      if (!selectedItem.hasClass('selected')) {
        // if it's not already selected
        var selectedPosition = selectedItem.index(),
          activePosition = $('.features-slider .selected').index();
        if (activePosition < selectedPosition) {
          nextSlide($('.features-slider'), $('.fre-slider-nav'), selectedPosition);
        } else {
          prevSlide($('.features-slider'), $('.fre-slider-nav'), selectedPosition);
        }

        // updateNavigationMarker(selectedPosition+1);
      }
    });


    //change visible slide



    $(".fre-slider-nav li").hover(
      function(e) {
        var selectedItem = $(this);
        console.log(selectedItem);

        if (!selectedItem.hasClass('selected')) {
          // if it's not already selected
          var selectedPosition = selectedItem.index(),
            activePosition = $('.features-slider .selected').index();
          if (activePosition < selectedPosition) {
            nextSlide($('.features-slider'), $('.fre-slider-nav'), selectedPosition);
          } else {
            prevSlide($('.features-slider'), $('.fre-slider-nav'), selectedPosition);
          }

          // updateNavigationMarker(selectedPosition+1);
        }

      },
      function(e) {



      }
    );


    function nextSlide(container, pagination, n) {
      var visibleSlide = container.find('.selected'),
        navigationDot = pagination.find('.selected');

      visibleSlide.removeClass('selected from-left from-right').addClass('is-moving').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
        visibleSlide.removeClass('is-moving');
      });

      container.children('li').eq(n).addClass('selected from-right').prevAll().addClass('move-left');
      navigationDot.removeClass('selected')
      pagination.find('li').eq(n).addClass('selected');

    }

    function prevSlide(container, pagination, n) {
      var visibleSlide = container.find('.selected'),
        navigationDot = pagination.find('.selected');

      visibleSlide.removeClass('selected from-left from-right').addClass('is-moving').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
        visibleSlide.removeClass('is-moving');
      });

      container.children('li').eq(n).addClass('selected from-left').removeClass('move-left').nextAll().removeClass('move-left');
      navigationDot.removeClass('selected');
      pagination.find('li').eq(n).addClass('selected');

    }



  }



})(jQuery); // Fully reference jQuery after this point.
(function($) {


    $('body').waitForImages().done(function() {
        // All descendant images have loaded, now slide up.
        $(this).addClass('is-loaded');

    });
    console.log('WURFL' + WURFL.complete_device_name);


    if(WURFL.is_mobile){


    }

    var mySVGsToInject = document.querySelectorAll('.svgs');

    // Options
    var injectorOptions = {
        evalScripts: 'once',
        pngFallback: 'assets/png',
        each: function(svg) {
            // Callback after each SVG is injected
            console.log('SVG injected: ' + svg.getAttribute('id'));
        }
    };
    SVGInjector(mySVGsToInject, injectorOptions, function(totalSVGsInjected) {});

    $('img').svgmagic();
    $('header').headroom({
        "offset": 40,
        "tolerance": 5

    });
    var dialog = $('freeman-dialog');



})(jQuery); // Fully reference jQuery after this point.