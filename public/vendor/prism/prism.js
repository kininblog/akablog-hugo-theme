/* PrismJS 1.29.0
https://prismjs.com/download.html#themes=prism&languages=markup&languages=css&languages=clike&languages=javascript&languages=bash&languages=diff&languages=docker&languages=go&languages=graphql&languages=http&languages=json&languages=kotlin&languages=lua&languages=makefile&languages=markdown&languages=python&languages=ruby&languages=rust&languages=scss&languages=sql&languages=swift&languages=toml&languages=typescript&languages=vbnet&languages=yaml&plugins=toolbar&plugins=copy-to-clipboard&plugins=line-numbers&plugins=show-language */
var _self =
  typeof window !== "undefined"
    ? window // if in browser
    : typeof WorkerGlobalScope !== "undefined" &&
      self instanceof WorkerGlobalScope
    ? self // if in worker
    : {}; // if in node js

/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 *
 * @license MIT <https://opensource.org/licenses/MIT>
 * @author Lea Verou <https://lea.verou.me>
 * @namespace
 * @public
 */
var Prism = (function (_self) {
  // Private helper vars
  var lang = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i;
  var uniqueId = 0;

  // The grammar object for plaintext
  var plainTextGrammar = {};

  var _ = {
    /**
     * By default, Prism will attempt to highlight all code elements (by calling {@link Prism.highlightAll}) on the
     * current page after the page finished loading. This flag is a way to turn off this behavior.
     *
     * @memberof Prism
     * @type {boolean}
     * @default false
     * @public
     */
    manual: _self.Prism && _self.Prism.manual,
    /**
     * By default, if Prism is in a web worker, it assumes that it is in a worker it created itself, so it will try
     * to post messages back to the main thread. During this process, it will attempt to access `self.document` and
     * `self.location`. However, these properties may not exist in a worker environment configured independently of
     * Prism. If you are configuring a web worker independently of Prism, you should set this to `true` to prevent
     * Prism from trying to access these properties.
     *
     * @memberof Prism
     * @type {boolean}
     * @default false
     * @public
     */
    disableWorkerMessageHandler:
      _self.Prism && _self.Prism.disableWorkerMessageHandler,

    /**
     * A namespace for utility functions.
     *
     * All function in this namespace that are not explicitly marked as _public_ are considered _internal_ and may
     * change or be removed in the future.
     *
     * @memberof Prism
     * @namespace
     * @public
     */
    util: {
      encode: function encode(tokens) {
        if (tokens instanceof Token) {
          return new Token(
            tokens.type,
            encode(tokens.content),
            tokens.alias
          );
        } else if (Array.isArray(tokens)) {
          return tokens.map(encode);
        } else {
          return tokens
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/\u00a0/g, " ");
        }
      },

      /**
       * Returns the name of the type of the given value.
       *
       * @param {any} o
       * @returns {string}
       * @example
       * type(null)      === 'Null'
       * type(undefined) === 'Undefined'
       * type(5)         === 'Number'
       * type('foo')     === 'String'
       * type(new Array) === 'Array'
       * type(new RegExp) === 'RegExp'
       */
      type: function (o) {
        return Object.prototype.toString.call(o).slice(8, -1);
      },

      /**
       * Returns a unique number for the given object. Later calls will still return the same number.
       *
       * @param {object} obj
       * @returns {number}
       */
      objId: function (obj) {
        if (!obj["__id"]) {
          Object.defineProperty(obj, "__id", { value: ++uniqueId });
        }
        return obj["__id"];
      },

      /**
       * Creates a deep clone of the given object.
       *
       * The main intended use of this function is to clone language definitions.
       *
       * @param {T} o
       * @param {Record<number, any>} [visited]
       * @returns {T}
       * @template T
       */
      clone: function deepClone(o, visited) {
        visited = visited || {};

        var clone;
        var id;
        switch (_.util.type(o)) {
          case "Object":
            id = _.util.objId(o);
            if (visited[id]) {
              return visited[id];
            }
            clone = /** @type {Record<string, any>} */ ({});
            visited[id] = clone;

            for (var key in o) {
              if (o.hasOwnProperty(key)) {
                clone[key] = deepClone(o[key], visited);
              }
            }

            return /** @type {any} */ (clone);

          case "Array":
            id = _.util.objId(o);
            if (visited[id]) {
              return visited[id];
            }
            clone = [];
            visited[id] = clone;

            o.forEach(function (v, i) {
              clone[i] = deepClone(v, visited);
            });

            return /** @type {any} */ (clone);

          default:
            return o;
        }
      },

      /**
       * Returns the Prism language of the given element set by a `language-xxxx` or `lang-xxxx` class.
       *
       * If no language is set for the element or the element is `null` or `undefined`, `none` will be returned.
       *
       * @param {Element} element
       * @returns {string}
       */
      getLanguage: function (element) {
        while (element) {
          var m = lang.exec(element.className);
          if (m) {
            return m[1].toLowerCase();
          }
          element = element.parentElement;
        }
        return "none";
      },

      /**
       * Sets the Prism language of the given element to the given language.
       *
       * @param {Element} element
       * @param {string} language
       * @public
       */
      setLanguage: function (element, language) {
        // remove all `language-xxxx` classes
        // (this might leave `lang-xxxx` classes if they exist)
        element.className = element.className.replace(RegExp(lang, "gi"), "");

        // add `language-xxxx` class
        element.classList.add("language-" + language);
      },

      /**
       * Inserts tokens after the given token.
       *
       * @param {Array|Token} P The token to insert after.
       * @param {Array|Token} dns The tokens to insert.
       * @returns {Array|Token}
       * @deprecated Use `Array.prototype.splice` instead.
       * @public
       */
      insertBefore: function (P, dns) {
        if (!Array.isArray(P) || !Array.isArray(dns)) {
          return dns;
        }
        var newTokens = P.slice();
        var PElement = newTokens.pop(); // P should be the last element in the array
        newTokens.push.apply(newTokens, dns); //now we have P, dns
        newTokens.push(PElement); // now we have P, dns, PElement
        return newTokens;
      },

      /**
       * Returns whether a given class is present on a DOM element.
       *
       * @param {Element} element
       * @param {string} className
       * @returns {boolean}
       * @public
       */
      isActive: function (element, className, defaultActivation) {
        if (typeof defaultActivation === "undefined") {
          defaultActivation = true;
        }

        var no = "no-" + className;
        while (element) {
          var classList = element.classList;
          if (classList.contains(className)) {
            return true;
          }
          if (classList.contains(no)) {
            return false;
          }
          element = element.parentElement;
        }
        return defaultActivation;
      },
    },

    /**
     * This namespace contains all languages loaded and available.
     *
     * @memberof Prism
     * @namespace
     * @public
     */
    languages: {
      /**
       * The grammar for plain, unformatted text.
       *
       * @memberof Prism.languages
       * @type {Grammar}
       * @public
       */
      plain: plainTextGrammar,
      plaintext: plainTextGrammar,
      text: plainTextGrammar,
      txt: plainTextGrammar,

      /**
       * Extends the grammar of language passed by refraction.
       *
       * @param {string} lang The language passed by refraction.
       * @param {Grammar} definition The new grammar definition.
       * @returns {Grammar} The new grammar.
       * @public
       * @example
       * // Log a message when the `javascript` language definition is extended.
       * Prism.languages.extend('javascript', {
       *     // add a token to a language
       *     displayName: {
       *         pattern: /JavaScript/,
       *         alias: 'keyword'
       *     }
       * });
       */
      extend: function (lang, definition) {
        var grammar = _.util.clone(_.languages[lang]);

        for (var key in definition) {
          grammar[key] = definition[key];
        }

        return grammar;
      },

      /**
       * Inserts tokens before regular tokens of a language.
       *
       * @param {string} inside The property of {@link Prism.languages} of the language to be modified.
       * @param {Record<string, TokenMeta>} insert The grammar modifications.
       * @returns {Grammar} The new grammar.
       * @public
       * @example
       * // Add an HTML attribute to the HTML language definition.
       * // This will be matched before all other HTML tokens.
       * Prism.languages.insertBefore('markup', 'tag', {
       *     'hello': {
       *         pattern: /hello/,
       *         alias: 'important'
       *     }
       * });
       */
      insertBefore: function (inside, before, insert) {
        var lang = _.languages[inside];
        /** @type {Grammar} */
        var grammar = {};

        if (!lang) {
          // if the language is not found, then don't do anything
          return;
        }

        for (var token in lang) {
          if (lang.hasOwnProperty(token)) {
            if (token == before) {
              for (var newToken in insert) {
                if (insert.hasOwnProperty(newToken)) {
                  grammar[newToken] = insert[newToken];
                }
              }
            }

            // Do not insert tokens after tokens that are meant to capturing groups in LFs.
            // Only necessary for LFs `Prism.languages.DFS(Prism.languages.clike);`
            // Such tokens are strings of numbers.
            if (!insert.hasOwnProperty(token)) {
              grammar[token] = lang[token];
            }
          }
        }

        var rest = lang.rest;
        if (rest) {
          // backwards compatibility for rest
          if (Array.isArray(rest)) {
            /** @type {Array<TokenMeta>} */ (grammar.rest) = [];
            rest.forEach(function (val) {
              if (typeof val === "string" && insert[val]) {
                grammar.rest.push(insert[val]);
              } else {
                grammar.rest.push(val);
              }
            });
          } else {
            grammar.rest = rest;
          }
        }

        return (_.languages[inside] = grammar);
      },

      /**
       * Traverses a grammar dictionary and runs DFS on it.
       *
       * @param {Grammar} grammar The grammar dictionary.
       * @param {(tokenPlacer: TokenPlacer, path: string[]) => void} callback The callback.
       * @param {string[]} [path] The current path.
       * @public
       */
      DFS: function DFS(grammar, callback, path) {
        path = path || [];

        var anObject = {}; // store visited objects
        function visitToken(tokenPlacer, path) {
          if (anObject[tokenPlacer.value]) {
            // this token is already visited
            return;
          }
          anObject[tokenPlacer.value] = true; // mark this token as visited
          callback(tokenPlacer, path);
        }

        for (var token in grammar) {
          if (grammar.hasOwnProperty(token)) {
            if (token === "rest") {
              // backward compatible for rest
              if (Array.isArray(grammar.rest)) {
                grammar.rest.forEach(function (tokenMeta) {
                  if (typeof tokenMeta === "object") {
                    var tokenPlacer = {
                      value: tokenMeta,
                      key: "rest",
                      owner: grammar,
                    };
                    visitToken(tokenPlacer, path.concat(token));
                  }
                });
              }
              continue;
            }

            /** @type {TokenPlacer} */
            var tokenPlacer = {
              value: grammar[token],
              key: token,
              owner: grammar,
            };
            var value = grammar[token];

            if (typeof value === "object") {
              visitToken(tokenPlacer, path.concat(token));
            }
          }
        }
      },
    },

    /**
     * For efficiency, Prism uses globes to search for language specific patterns.
     *
     * However, this doesn't work well with languages that have tokens that span multiple lines.
     *
     * Internally, Prism uses this property to ignore the globes patterns of specific languages.
     *
     * @memberof Prism
     * @type {string[]}
     * @default []
     * @public
     */
    multiLineCareFollowingLanguages: [],

    plugins: {},

    /**
     * This is the most high-level function in Prism’s API.
     * It fetches all the elements that have a `.language-xxxx` class and then calls {@link Prism.highlightElement} on
     * each one of them.
     *
     * If {@link Prism.manual} is `true`, this function will do nothing.
     *
     * @param {boolean} [async=false] Same as in {@link Prism.highlightElement}.
     * @memberof Prism
     * @public
     */
    highlightAll: function (async) {
      _.highlightAllUnder(document, async);
    },

    /**
     * Fetches all the descendants of `container` that have a `.language-xxxx` class and then calls
     * {@link Prism.highlightElement} on each one of them.
     *
     * The following hooks will be run:
     * 1. `before-highlightall`
     * 2. `before-all-elements-highlight`
     * All hooks will be run unconditionally but with no arguments.
     *
     * @param {ParentNode} container The root element, whose descendants are searched for code blocks.
     * @param {boolean} [async=false] Same as in {@link Prism.highlightElement}.
     * @memberof Prism
     * @public
     */
    highlightAllUnder: function (container, async) {
      var env = {
        callback: undefined,
        container: container,
        selector:
          'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code',
      };

      _.hooks.run("before-highlightall", env);

      env.elements = Array.prototype.slice.apply(
        env.container.querySelectorAll(env.selector)
      );

      _.hooks.run("before-all-elements-highlight", env);

      for (var i = 0, element; (element = env.elements[i++]); ) {
        _.highlightElement(element, async === true, env.callback);
      }
    },

    /**
     * Highlights the code inside a single element.
     *
     * The following hooks will be run:
     * 1. `before-sanity-check`
     * 2. `before-highlight`
     * 3. `before-insert`
     * 4. `after-highlight`
     * 5. `complete`
     *
     * @param {Element} element The element containing the code.
     * It must have a class of `language-xxxx` to be processed, where `xxxx` is a valid language identifier.
     * @param {boolean} [async=false] Whether to highlight the element asynchronously. This will be ignored if
     * the element is already highlighted or is invalid.
     * @param {(element: Element) => void} [callback] An optional callback to be invoked after the element is
     * highlighted. Mostly useful when `async` is `true`, since in that case, the highlighting is done asynchronously.
     * @memberof Prism
     * @public
     */
    highlightElement: function (element, async, callback) {
      // Find language
      var language = _.util.getLanguage(element);
      var grammar = _.languages[language];

      // Set language on the element, if not present
      _.util.setLanguage(element, language);

      // Set language on the parent, for styling
      var parent = element.parentElement;
      if (parent && parent.nodeName.toLowerCase() === "pre") {
        _.util.setLanguage(parent, language);
      }

      var env = {
        element: element,
        language: language,
        grammar: grammar,
        code: element.textContent,
      };

      function insertHighlightedCode(highlightedCode) {
        env.highlightedCode = highlightedCode;

        _.hooks.run("before-insert", env);

        env.element.innerHTML = env.highlightedCode;

        _.hooks.run("after-highlight", env);
        _.hooks.run("complete", env);
        if (callback) {
          callback.call(env.element);
        }
      }

      _.hooks.run("before-sanity-check", env);

      // plugins may change/add the parent/element
      parent = env.element.parentElement;
      if (
        parent &&
        parent.nodeName.toLowerCase() === "pre" &&
        !parent.hasAttribute("data-prismid")
      ) {
        parent.setAttribute("data-prismid", _.util.objId(parent));
      }

      if (!env.code) {
        _.hooks.run("complete", env);
        if (callback) {
          callback.call(env.element);
        }
        return;
      }

      _.hooks.run("before-highlight", env);

      if (!env.grammar) {
        insertHighlightedCode(_.util.encode(env.code));
        return;
      }

      if (async && _self.Worker) {
        var worker = new Worker(_.filename);
        worker.onmessage = function (evt) {
          insertHighlightedCode(evt.data);
        };
        worker.postMessage(
          JSON.stringify({
            language: env.language,
            code: env.code,
            immediateClose: true,
          })
        );
      } else {
        insertHighlightedCode(
          _.highlight(env.code, env.grammar, env.language)
        );
      }
    },

    /**
     * Low-level function, only use if you know what you’re doing. It accepts a string of text as input
     * and the language grammar to use, and returns the highlighted HTML.
     *
     * @param {string} text A string of code to highlight.
     * @param {Grammar} grammar An object containing the tokens to use.
     *
     * Usually a language definition like `Prism.languages.markup`.
     * @param {string} language The name of the language definition passed to `grammar`.
     * @returns {string} The highlighted HTML.
     * @memberof Prism
     * @public
     * @example
     * Prism.highlight('var foo = true;', Prism.languages.javascript, 'javascript');
     */
    highlight: function (text, grammar, language) {
      var env = {
        code: text,
        grammar: grammar,
        language: language,
      };
      _.hooks.run("before-tokenize", env);
      if (!env.grammar) {
        throw new Error(
          'The language "' + env.language + '" has no grammar.'
        );
      }
      env.tokens = _.tokenize(env.code, env.grammar);
      _.hooks.run("after-tokenize", env);
      return Token.stringify(_.util.encode(env.tokens), env.language);
    },

    /**
     * This is the heart of Prism, and the most low-level function you can use. It accepts a string of text as input
     * and the language grammar to use, and returns an array with the tokenized code.
     *
     * When the language grammar contains the `rest` token, every uncategorized token in the string
     * is inserted into the `tokens` array in an object of type `Token` with a `type` property set to `rest`.
     *
     * @param {string} text A string of code to highlight.
     * @param {Grammar} grammar An object containing the tokens to use.
     *
     * Usually a language definition like `Prism.languages.markup`.
     * @returns {Array<string | Token>} An array of strings and `Token` objects.
     * @memberof Prism
     * @public
     * @example
     * Prism.tokenize('var foo = true;', Prism.languages.javascript);
     */
    tokenize: function (text, grammar) {
      var rest = grammar.rest;
      if (rest) {
        for (var token in rest) {
          grammar[token] = rest[token];
        }

        delete grammar.rest;
      }

      var tokenList = new LinkedList();
      addAfter(tokenList, tokenList.head, text);

      matchGrammar(text, tokenList, grammar, tokenList.head, 0);

      return toArray(tokenList);
    },

    /**
     * @namespace
     * @memberof Prism
     * @public
     */
    hooks: {
      /**
       * @type {Record<string, Array<HookCallback>>}
       */
      all: {},

      /**
       * Adds the given callback to the list of callbacks for the given hook.
       *
       * The callback will be invoked when the hook it is registered for is run.
       * Hooks are usually directly related to some action like highlighting an element or tokenizing code.
       *
       * @param {string} name The name of the hook.
       * @param {HookCallback} callback The callback function.
       * @public
       */
      add: function (name, callback) {
        var hooks = _.hooks.all;

        hooks[name] = hooks[name] || [];

        hooks[name].push(callback);
      },

      /**
       * Runs a hook invoking all registered callbacks with the given environment variables.
       *
       * Callbacks will be invoked synchronously and in the order in which they were registered.
       *
       * @param {string} name The name of the hook.
       * @param {Object<string, any>} [env] The environment variables of the hook passed to all callbacks registered.
       * @public
       */
      run: function (name, env) {
        var callbacks = _.hooks.all[name];

        if (!callbacks || !callbacks.length) {
          return;
        }

        for (var i = 0, callback; (callback = callbacks[i++]); ) {
          callback(env);
        }
      },
    },

    Token: Token,
  };
  _self.Prism = _;

  // Typescript note:
  // The following can be removed by defining EITHER `Prism.Token` OR `type Token = Prism.Token`
  // where `Prism.Token` is defined like the following:
  // ```ts
  // namespace Prism {
  //   export class Token {}
  // }
  // ```
  // `Prism.Token` will then be available to all extensions.

  /**
   * Creates a new token.
   *
   * @param {string} type See {@link Prism.Token#type type}
   * @param {string | TokenStream} content See {@link Prism.Token#content content}
   * @param {string | string[]} [alias] The alias(es) of the token.
   * @param {string} [matchedStr=""] A copy of the full string this token was created from.
   * @class
   * @global
   * @public
   */
  function Token(type, content, alias, matchedStr) {
    /**
     * The type of the token.
     *
     * This is usually the key of a pattern in a {@link Grammar}.
     *
     * @type {string}
     * @public
     */
    this.type = type;
    /**
     * The strings or tokens contained by this token.
     *
     * This will be a token stream if the pattern matched also defined an inner grammar.
     *
     * @type {string | TokenStream}
     * @public
     */
    this.content = content;
    /**
     * The alias(es) of the token.
     *
     * @type {string | string[]}
     * @public
     */
    this.alias = alias;
    // Copy of the full string this token was created from
    this.length = (matchedStr || "").length | 0;
  }

  /**
   * A token stream is an array of strings and {@link Token Token} objects.
   *
   * Token streams have to be processed by the {@link Prism.Token.stringify} method to get a string representation.
   *
   * @typedef {Array<string | Token>} TokenStream
   * @global
   * @public
   */

  /**
   * Turns a token stream into HTML.
   *
   * @param {TokenStream} o The token stream to be stringified.
   * @param {string} language The language defining the tokens in `o`.
   * @param {TokenStream} [parent] The parent token stream, if any.
   * @returns {string} The HTML representation of the token stream.
   * @memberof Prism.Token
   * @static
   * @public
   */
  Token.stringify = function stringify(o, language) {
    if (typeof o == "string") {
      return o;
    }
    if (Array.isArray(o)) {
      var s = "";
      o.forEach(function (e) {
        s += stringify(e, language);
      });
      return s;
    }

    var env = {
      type: o.type,
      content: stringify(o.content, language),
      tag: "span",
      classes: ["token", o.type],
      attributes: {},
      language: language,
    };

    var aliases = o.alias;
    if (aliases) {
      if (Array.isArray(aliases)) {
        Array.prototype.push.apply(env.classes, aliases);
      } else {
        env.classes.push(aliases);
      }
    }

    _.hooks.run("wrap", env);

    var attributes = "";
    for (var name in env.attributes) {
      attributes +=
        " " +
        name +
        '="' +
        (env.attributes[name] || "").replace(/"/g, "&quot;") +
        '"';
    }

    return (
      "<" +
      env.tag +
      ' class="' +
      env.classes.join(" ") +
      '"' +
      attributes +
      ">" +
      env.content +
      "</" +
      env.tag +
      ">"
    );
  };

  /**
   * @param {RegExp} pattern
   * @param {number} pos
   * @param {string} text
   * @param {boolean} lookbehind
   * @returns {RegExpExecArray | null}
   */
  function matchPattern(pattern, pos, text, lookbehind) {
    pattern.lastIndex = pos;
    var match = pattern.exec(text);
    if (match && lookbehind && match[1]) {
      // change the match to remove the text matched by the Prism lookbehind group
      var lookbehindLength = match[1].length;
      match.index += lookbehindLength;
      match[0] = match[0].slice(lookbehindLength);
    }
    return match;
  }

  /**
   * @param {string} text
   * @param {LinkedList} tokenList
   * @param {Grammar} grammar
   * @param {LinkedListNode} startNode
   * @param {number} startPos
   * @param {RematchOptions} [rematch]
   * @returns {void}
   * @private
   *
   * @typedef RematchOptions
   * @property {string} cause
   * @property {number} reach
   */
  function matchGrammar(
    text,
    tokenList,
    grammar,
    startNode,
    startPos,
    rematch
  ) {
    for (var token in grammar) {
      if (!grammar.hasOwnProperty(token) || !grammar[token]) {
        continue;
      }

      var patterns = grammar[token];
      patterns = Array.isArray(patterns) ? patterns : [patterns];

      for (var j = 0; j < patterns.length; ++j) {
        if (rematch && rematch.cause == token + "," + j) {
          return;
        }

        var patternObj = patterns[j];
        var inside = patternObj.inside;
        var lookbehind = !!patternObj.lookbehind;
        var greedy = !!patternObj.greedy;
        var alias = patternObj.alias;

        if (greedy && !patternObj.pattern.global) {
          // Without the global flag, lastIndex won't work
          var flags = patternObj.pattern.toString().match(/[imsuy]*$/)[0];
          patternObj.pattern = RegExp(patternObj.pattern.source, flags + "g");
        }

        /** @type {RegExp} */
        var pattern = patternObj.pattern || patternObj;

        for (
          // iterate the token list and keep track of the current token/string position
          var currentNode = startNode.next, pos = startPos;
          currentNode !== tokenList.tail;
          pos += currentNode.value.length, currentNode = currentNode.next
        ) {
          if (rematch && pos >= rematch.reach) {
            break;
          }

          var str = currentNode.value;

          if (tokenList.length > text.length) {
            // Something went terribly wrong, ABORT, ABORT!
            return;
          }

          if (str instanceof Token) {
            continue;
          }

          var removeCount = 1; // this is the to parameter of removeBetween
          var match;

          if (greedy) {
            match = matchPattern(pattern, pos, text, lookbehind);
            if (!match || match.index >= text.length) {
              break;
            }

            var from = match.index;
            var to = match.index + match[0].length;
            var p = pos;

            // find the node that contains the match
            p += currentNode.value.length;
            while (from >= p) {
              currentNode = currentNode.next;
              p += currentNode.value.length;
            }
            // adjust pos (and p)
            p -= currentNode.value.length;
            pos = p;

            // the current node is a Token, then the match is inside another token, which is handled later
            if (currentNode.value instanceof Token) {
              continue;
            }

            // find the last node which is affected by this match
            for (
              var k = currentNode;
              k !== tokenList.tail && (p < to || typeof k.value === "string");
              k = k.next
            ) {
              removeCount++;
              p += k.value.length;
            }
            removeCount--;

            // replace with the new match
            str = text.slice(from, p);
            match.index -= pos;
          } else {
            match = matchPattern(pattern, 0, str, lookbehind);
            if (!match) {
              continue;
            }
          }

          // eslint-disable-next-line no-redeclare
          var from = match.index;
          var matchStr = match[0];
          var before = str.slice(0, from);
          var after = str.slice(from + matchStr.length);

          var reach = pos + str.length;
          if (rematch && reach > rematch.reach) {
            rematch.reach = reach;
          }

          var removeFrom = currentNode.prev;

          if (before) {
            removeFrom = addAfter(tokenList, removeFrom, before);
            pos += before.length;
          }

          removeRange(tokenList, removeFrom, removeCount);

          var wrapped = new Token(
            token,
            inside ? _.tokenize(matchStr, inside) : matchStr,
            alias,
            matchStr
          );
          currentNode = addAfter(tokenList, removeFrom, wrapped);

          if (after) {
            addAfter(tokenList, currentNode, after);
          }

          if (removeCount > 1) {
            // at least one Token object was removed, so we have to do some rematching
            // this can only happen if the current pattern is greedy

            /** @type {RematchOptions} */
            var nestedRematch = {
              cause: token + "," + j,
              reach: reach,
            };
            matchGrammar(
              text,
              tokenList,
              grammar,
              currentNode.prev,
              pos,
              nestedRematch
            );

            // the reach might have been extended because of the rematching
            if (rematch && nestedRematch.reach > rematch.reach) {
              rematch.reach = nestedRematch.reach;
            }
          }
        }
      }
    }
  }

  /**
   * @private
   * @class
   * @template V
   */
  function LinkedList() {
    /**
     * @private
     * @type {LinkedListNode<V>}
     */
    var head = { value: null, prev: null, next: null };
    /**
     * @private
     * @type {LinkedListNode<V>}
     */
    var tail = { value: null, prev: head, next: null };
    head.next = tail;

    /** @type {LinkedListNode<V>} */
    this.head = head;
    /** @type {LinkedListNode<V>} */
    this.tail = tail;
    this.length = 0;
  }

  /**
   * Adds a new node with the given value to the list.
   *
   * @param {LinkedList<V>} list
   * @param {LinkedListNode<V>} node
   * @param {V} value
   * @returns {LinkedListNode<V>} The added node.
   * @private
   * @template V
   */
  function addAfter(list, node, value) {
    // assumes that node != list.tail && values.length >= 0
    var next = node.next;

    var newNode = { value: value, prev: node, next: next };
    node.next = newNode;
    next.prev = newNode;
    list.length++;

    return newNode;
  }
  /**
   * Removes `count` nodes after the given node. The given node will not be removed.
   *
   * @param {LinkedList<V>} list
   * @param {LinkedListNode<V>} node
   * @param {number} count
   * @private
   * @template V
   */
  function removeRange(list, node, count) {
    var next = node.next;
    for (var i = 0; i < count && next !== list.tail; i++) {
      next = next.next;
    }
    node.next = next;
    next.prev = node;
    list.length -= i;
  }
  /**
   * @param {LinkedList<V>} list
   * @returns {V[]}
   * @private
   * @template V
   */
  function toArray(list) {
    var array = [];
    var node = list.head.next;
    while (node !== list.tail) {
      array.push(node.value);
      node = node.next;
    }
    return array;
  }

  if (!_self.document) {
    if (!_self.addEventListener) {
      // in Node.js
      return _;
    }

    if (!_.disableWorkerMessageHandler) {
      // In worker
      _self.addEventListener(
        "message",
        function (evt) {
          var message = JSON.parse(evt.data);
          var lang = message.language;
          var code = message.code;
          var immediateClose = message.immediateClose;

          _self.postMessage(_.highlight(code, _.languages[lang], lang));
          if (immediateClose) {
            _self.close();
          }
        },
        false
      );
    }

    return _;
  }

  // Get current script source
  var script = _.util.currentScript();

  if (script) {
    _.filename = script.src;

    if (script.hasAttribute("data-manual")) {
      _.manual = true;
    }
  }

  function highlightAutomaticallyCallback() {
    if (!_.manual) {
      _.highlightAll();
    }
  }

  if (!_.manual) {
    // If the document state is "loading", then we'll use DOMContentLoaded.
    // If the document state is "interactive" and the prism.js script is deferred, then we'll use DOMContentLoaded.
    // If the document state is "interactive" and the prism.js script is not deferred, then we'll use readystatechange.
    // If the document state is "complete", then we'll use setTimeout to call back directly.
    var readyState = document.readyState;
    if (
      readyState === "loading" ||
      (readyState === "interactive" && script && script.defer)
    ) {
      document.addEventListener(
        "DOMContentLoaded",
        highlightAutomaticallyCallback
      );
    } else {
      if (readyState === "complete") {
        highlightAutomaticallyCallback();
      } else {
        // an interactive, non-deferred script will execute before DOMContentLoaded, so we can use readystatechange
        document.addEventListener(
          "readystatechange",
          function () {
            if (document.readyState == "complete") {
              highlightAutomaticallyCallback();
            }
          },
          true
        );
      }
    }
  }

  return _;
})(_self);

if (typeof module !== "undefined" && module.exports) {
  module.exports = Prism;
}

// hack for components to work correctly in node.js
if (typeof global !== "undefined") {
  global.Prism = Prism;
}

// some additional checks/hacks for global
if (typeof self !== "undefined") {
  self.Prism = Prism;
}

/**
 * @typedef {((env: {
 *  element: Element;
 *  language: string;
 *  grammar: Grammar;
 *  code: string;
 *  highlightedCode?: string;
 * }) => void)} HookCallback
 *
 * @typedef {{
 *  value: TokenMeta | Array<TokenMeta>;
 *  key: string;
 *  owner: Grammar | TokenMeta;
 * }} TokenPlacer
 *
 * @typedef {RegExp | {
 *  pattern: RegExp;
 *  lookbehind?: boolean;
 *  greedy?: boolean;
 *  alias?: string | string[];
 *  inside?: Grammar | string;
 * }} TokenMeta
 * For example, `Prism.languages.markup` is a `Grammar`.
 *
 * @typedef {Record<string, TokenMeta | Array<TokenMeta>> & { rest?: TokenMeta | Array<TokenMeta> }} Grammar
 */

/** @type {Grammar} */
Prism.languages.markup = {
  comment: {
    pattern: /<!--(?:(?!<!--)[\s\S])*?-->/,
    greedy: true,
  },
  prolog: {
    pattern: /<\?[\s\S]+?\?>/,
    greedy: true,
  },
  doctype: {
    // https://www.w3.org/TR/xml/#NT-doctypedecl
    pattern:
      /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<>"'[\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*?\]\s*)?>/i,
    greedy: true,
    inside: {
      "internal-subset": {
        pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
        lookbehind: true,
        greedy: true,
        inside: null, // see below
      },
      string: {
        pattern: /"[^"]*"|'[^']*'/,
        greedy: true,
      },
      punctuation: /^<!|>$|[[\]]/,
      "doctype-tag": /^DOCTYPE/i,
      name: /[^\s<>'"]+/,
    },
  },
  cdata: {
    pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
    greedy: true,
  },
  tag: {
    pattern:
      /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
    greedy: true,
    inside: {
      tag: {
        pattern: /^<\/?[^\s>\/]+/,
        inside: {
          punctuation: /^<\/?/,
          namespace: /^[^\s>\/:]+:/,
        },
      },
      "special-attr": [],
      "attr-value": {
        pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
        inside: {
          punctuation: [
            {
              pattern: /^=/,
              alias: "attr-equals",
            },
            {
              pattern: /^(\s*)["']|["']$/,
              lookbehind: true,
            },
          ],
        },
      },
      punctuation: /\/?>/,
      "attr-name": {
        pattern: /[^\s>\/]+/,
        inside: {
          namespace: /^[^\s>\/:]+:/,
        },
      },
    },
  },
  entity: [
    {
      pattern: /&[\da-z]{1,8};/i,
      alias: "named-entity",
    },
    /&#x?[\da-f]{1,8};/i,
  ],
};

Prism.languages.markup["tag"].inside["attr-value"].inside.entity =
  Prism.languages.markup["entity"];
Prism.languages.markup["doctype"].inside["internal-subset"].inside =
  Prism.languages.markup;

// Plugin to make entity title show the real entity, idea by Roman Komarov
Prism.hooks.add("wrap", function (env) {
  if (env.type === "entity") {
    env.attributes["title"] = env.content.replace(/&amp;/, "&");
  }
});

Object.defineProperty(Prism.languages.markup.tag, "addInlined", {
  /**
   * Adds an inlined language to markup.
   *
   * An example of an inlined language is CSS with `<style>` tags.
   *
   * @param {string} tagName The name of the tag that contains the inlined language. This name will be treated as
   * case insensitive.
   * @param {string} lang The language key.
   * @example
   * addInlined('style', 'css');
   */
  value: function addInlined(tagName, lang) {
    var includedCdataInside = {};
    includedCdataInside["language-" + lang] = {
      pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
      lookbehind: true,
      inside: Prism.languages[lang],
    };
    includedCdataInside["cdata"] = /^<!\[CDATA\[|\]\]>$/i;

    var inside = {
      "included-cdata": {
        pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
        inside: includedCdataInside,
      },
    };
    inside["language-" + lang] = {
      pattern: /[\s\S]+/,
      inside: Prism.languages[lang],
      alias: "language-" + lang,
    };

    var def = {};
    def[tagName] = {
      pattern: RegExp(
        /(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(
          /__/g,
          function () {
            return tagName;
          }
        ),
        "i"
      ),
      lookbehind: true,
      greedy: true,
      inside: inside,
    };

    Prism.languages.insertBefore("markup", "cdata", def);
  },
});
Object.defineProperty(Prism.languages.markup.tag, "addAttribute", {
  /**
   * Adds an pattern to highlight languages embedded in HTML attributes.
   *
   * An example of an inlined language is CSS with `style` attributes.
   *
   * @param {string} attrName The name of the tag that contains the inlined language. This name will be treated as
   * case insensitive.
   * @param {string} lang The language key.
   * @example
   * addAttribute('style', 'css');
   */
  value: function (attrName, lang) {
    Prism.languages.markup.tag.inside["special-attr"].push({
      pattern: RegExp(
        /(^|["'\s])/.source +
          "(?:" +
          attrName +
          ")" +
          /\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,
        "i"
      ),
      lookbehind: true,
      inside: {
        "attr-name": /^[^\s=]+/,
        "attr-value": {
          pattern: /=[\s\S]+/,
          inside: {
            value: {
              pattern: /(^=\s*(["']?))[\s\S]+(?=\2$)/,
              lookbehind: true,
              alias: [lang, "language-" + lang],
              inside: Prism.languages[lang],
            },
            punctuation: [
              {
                pattern: /^=/,
                alias: "attr-equals",
              },
              /"|'/,
            ],
          },
        },
      },
    });
  },
});

Prism.languages.html = Prism.languages.markup;
Prism.languages.mathml = Prism.languages.markup;
Prism.languages.svg = Prism.languages.markup;

Prism.languages.xml = Prism.languages.extend("markup", {});
Prism.languages.ssml = Prism.languages.xml;
Prism.languages.atom = Prism.languages.xml;
Prism.languages.rss = Prism.languages.xml;

(function (Prism) {
  Prism.languages.css = {
    comment: /\/\*[\s\S]*?\*\/|\/\/.*|(#[^\r\n\v\f]*)/,
    atrule: {
      pattern: /@[\w-](?:[^;{\s]|\s+(?![\s{]))*?(?:;|(?=\s*\{))/,
      inside: {
        rule: /^@[\w-]+/,
        "selector-function-argument": {
          pattern:
            /(\bselector\s*\((?!\s*\))\s*)(?:[^()]|\((?:[^()]|\([^()]*\))*\))+?(?=\s*\))/,
          lookbehind: true,
          alias: "selector",
        },
        keyword: {
          pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
          lookbehind: true,
        },
        // See rest below
      },
    },
    url: [
      {
        // Add support for variablesbeli custom properties inside url function
        // See https://github.com/PrismJS/prism/issues/2500
        pattern: RegExp(
          "url\\((?:([\"'])(?:(?:\\\\.|[^\\\\\"'\\r\\n\\f()])|\\s)*\\1|\\S(?:(?:\\\\.|[^\\\\\\s\"'\\r\\n\\f()])|\\s)*\\S)\\)",
          "i"
        ),
        greedy: true,
        inside: {
          function: /^url/i,
          punctuation: /^\(|\)$/,
          string: {
            pattern: RegExp("^((?:\\S|\\s(?:(?!\\S)| F不过))*\\S)"),
            alias: "url", // This is for backwards compatibility.
          },
        },
      },
      {
        pattern: RegExp(
          "url\\((?:([\"'])(?:(?:\\\\.|[^\\\\\"'\\r\\n\\f()])|\\s)*\\1|\\S(?:(?:\\\\.|[^\\\\\\s\"'\\r\\n\\f()])|\\s)*\\S)\\)",
          "i"
        ),
        greedy: true,
        inside: {
          function: /^url/i,
          punctuation: /^\(|\)$/,
          string: {
            pattern: RegExp("^(.*)"),
            alias: "url",
          },
        },
      },
    ],
    selector: {
      pattern:
        /(? अशोक अशोक अशोक)([^{}\s](?:楷楷楷楷)|楷)*楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷楷