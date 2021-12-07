module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1635123148820, function(require, module, exports) {
void function(global) {

  

  //  ValueError :: String -> Error
  function ValueError(message) {
    var err = new Error(message);
    err.name = 'ValueError';
    return err;
  }

  //  create :: Object -> String,*... -> String
  function create(transformers) {
    return function(template) {
      var args = Array.prototype.slice.call(arguments, 1);
      var idx = 0;
      var state = 'UNDEFINED';

      return template.replace(
        /([{}])\1|[{](.*?)(?:!(.+?))?[}]/g,
        function(match, literal, _key, xf) {
          if (literal != null) {
            return literal;
          }
          var key = _key;
          if (key.length > 0) {
            if (state === 'IMPLICIT') {
              throw ValueError('cannot switch from ' +
                               'implicit to explicit numbering');
            }
            state = 'EXPLICIT';
          } else {
            if (state === 'EXPLICIT') {
              throw ValueError('cannot switch from ' +
                               'explicit to implicit numbering');
            }
            state = 'IMPLICIT';
            key = String(idx);
            idx += 1;
          }

          //  1.  Split the key into a lookup path.
          //  2.  If the first path component is not an index, prepend '0'.
          //  3.  Reduce the lookup path to a single result. If the lookup
          //      succeeds the result is a singleton array containing the
          //      value at the lookup path; otherwise the result is [].
          //  4.  Unwrap the result by reducing with '' as the default value.
          var path = key.split('.');
          var value = (/^\d+$/.test(path[0]) ? path : ['0'].concat(path))
            .reduce(function(maybe, key) {
              return maybe.reduce(function(_, x) {
                return x != null && key in Object(x) ?
                  [typeof x[key] === 'function' ? x[key]() : x[key]] :
                  [];
              }, []);
            }, [args])
            .reduce(function(_, x) { return x; }, '');

          if (xf == null) {
            return value;
          } else if (Object.prototype.hasOwnProperty.call(transformers, xf)) {
            return transformers[xf](value);
          } else {
            throw ValueError('no transformer named "' + xf + '"');
          }
        }
      );
    };
  }

  //  format :: String,*... -> String
  var format = create({});

  //  format.create :: Object -> String,*... -> String
  format.create = create;

  //  format.extend :: Object,Object -> ()
  format.extend = function(prototype, transformers) {
    var $format = create(transformers);
    prototype.format = function() {
      var args = Array.prototype.slice.call(arguments);
      args.unshift(this);
      return $format.apply(global, args);
    };
  };

  /* istanbul ignore else */
  if (typeof module !== 'undefined') {
    module.exports = format;
  } else if (typeof define === 'function' && define.amd) {
    define(function() { return format; });
  } else {
    global.format = format;
  }

}.call(this, this);

}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1635123148820);
})()
//miniprogram-npm-outsideDeps=[]
//# sourceMappingURL=index.js.map