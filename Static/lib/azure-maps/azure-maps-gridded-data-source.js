/*
MIT License

    Copyright (c) Microsoft Corporation.

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE
*/

(function (exports, azmaps) {
    'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    /**
     * Helper class for merging namespaces.
     */
    var Namespace = /** @class */ (function () {
        function Namespace() {
        }
        Namespace.merge = function (namespace, base) {
            var context = window || global;
            var parts = namespace.split(".");
            for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
                var part = parts_1[_i];
                if (context[part]) {
                    context = context[part];
                }
                else {
                    return base;
                }
            }
            return __assign(__assign({}, context), base);
        };
        return Namespace;
    }());

    /*
      Supported:

        ['get', string]
        ['get', string, object]
        ['has', string]
        ['has', string, object]
        ['literal', array | object]
        ['typeof', value]

        ['at', number, array]
        ['length', string | array]
        ['in', boolean | string | number, array]
        ['in', substring, string]
        ['index-of', boolean | string | number, array | string]
        ['slice', array | string, number]
        ['slice', array | string, number, number]
        ['index-of', boolean | string | number, array | string]
        ['index-of', boolean | string | number, array | string, number]

        ['!', boolean]
        ['!=', value, value]
        ['<', value, value]
        ['<=', value, value]
        ['==', value, value]
        ['>', value, value]
        ['>=' value, value]
        ['all', boolean, boolean]
        ['any', boolean, boolean]

        ['to-boolean', value]
        ['to-number', value]
        ['to-string', value]

        ['+', number, number]
        ['-', number]
        ['-', number, number]
        ['*', number, number]
        ['/', number, number]
        ['%', number, number]
        ['^', number, number]
        ['abs', number]
        ['acos', number]
        ['asin', number]
        ['atan', number]
        ['ceil', number]
        ['cos', number]
        ['e']
        ['floor', number]
        ['ln', number]
        ['ln2']
        ['log10', number]
        ['log2', number]
        ['max', number, number]
        ['min', number, number]
        ['pi']
        ['round', number]
        ['sin', number]
        ['sqrt', number]
        ['tan', number]
        
        [
            'case',
            condition1: boolean,
            output1: value,
            condition2: boolean,
            output2: value,
            ...,
            fallback: value
        ]

        [
            'match',
            input: number | string,
            label1: number | string | (number | string)[],
            output1: value,
            label2: number | string | (number | string)[],
            output2: value,
            ...,
            fallback: value
        ]

        [
          'step',
          input: number,
          output0: value0,
          stop1: number,
          output1: value1,
          stop2: number,
          output2: value2,
          ...
        ]


        Future:
        interpolate

    */
    var Expression = /** @class */ (function () {
        function Expression() {
        }
        Expression.parse = function (exp) {
            if (Array.isArray(exp)) {
                if (exp.length > 0) {
                    var e = Expressions[exp[0]];
                    if (e) {
                        return e.parse(exp);
                    }
                }
            }
            else {
                return new Expressions.literal(exp);
            }
            throw 'Invalid expression';
        };
        return Expression;
    }());
    var ComparisonExp = /** @class */ (function () {
        function ComparisonExp(comp, e1, e2) {
            var self = this;
            self._c = comp;
            self._e1 = e1;
            self._e2 = e2;
        }
        ComparisonExp.parse = function (exp) {
            if (exp.length >= 3) {
                return new ComparisonExp(exp[0], Expression.parse(exp[1]), Expression.parse(exp[2]));
            }
            throw "Invalid '" + exp[1] + "' expression.";
        };
        ComparisonExp.prototype.eval = function (val) {
            var self = this;
            var v1 = self._e1.eval(val);
            var v2 = self._e2.eval(val);
            switch (self._c) {
                case '<':
                    return v1 < v2;
                case '<=':
                    return v1 <= v2;
                case '==':
                    return v1 == v2;
                case '!=':
                    return v1 != v2;
                case '>':
                    return v1 > v2;
                case '>=':
                    return v1 >= v2;
                case '>':
                    return v1 > v2;
            }
            throw 'Invalid comparison';
        };
        return ComparisonExp;
    }());
    var MathExp = /** @class */ (function () {
        function MathExp(operation, e) {
            this._o = operation;
            this._e = e;
        }
        MathExp.parse = function (exp) {
            if (exp.length >= 3) {
                var conditions = [];
                for (var i = 1, len = exp.length; i < len; i++) {
                    if (Array.isArray(exp[1])) {
                        conditions.push(Expression.parse(exp[i]));
                    }
                    else {
                        conditions.push(exp[i]);
                    }
                }
                return new MathExp(exp[0], conditions);
            }
            throw "Invalid '" + exp[0] + "' expression.";
        };
        MathExp.prototype.eval = function (val) {
            var self = this;
            var math = Math;
            var v1 = (self._e.length >= 1) ? self._getValue(val, self._e[0]) : 0;
            var v2 = (self._e.length >= 2) ? self._getValue(val, self._e[1]) : 0;
            switch (self._o) {
                case '+':
                case '*':
                case 'min':
                case 'max':
                    self._evalArray(val);
                    break;
                case '-':
                    return v2 - v1;
                case '/':
                    return v1 / v2;
                case '%':
                    return v1 % v2;
                case '^':
                    return math.pow(v1, v2);
                case 'abs':
                    return math.abs(v1);
                case 'acos':
                    return math.acos(v1);
                case 'asin':
                    return math.asin(v1);
                case 'atan':
                    return math.atan(v1);
                case 'ceil':
                    return math.ceil(v1);
                case 'cos':
                    return math.cos(v1);
                case 'e':
                    return math.exp(v1);
                case 'floor':
                    return math.floor(v1);
                case 'ln':
                    return math.log(v1);
                case 'ln2':
                    return math.LN2;
                case 'log10':
                    return math.log(v1) / math.LN10;
                case 'log2':
                    return math.log(v1) / math.LN2;
                case 'pi':
                    return math.PI;
                case 'round':
                    return math.round(v1);
                case 'sin':
                    return math.sin(v1);
                case 'sqrt':
                    return math.sqrt(v1);
                case 'tan':
                    return math.tan(v1);
            }
            throw "Invalid '" + self._o + "' expression.";
        };
        MathExp.prototype._evalArray = function (val) {
            var self = this;
            var f;
            var init = 0;
            switch (self._o) {
                case '+':
                    f = function (total, arg) { return total + self._getValue(val, arg); };
                    break;
                case '*':
                    init = 1;
                    f = function (total, arg) { return total * self._getValue(val, arg); };
                    break;
                case 'max':
                    init = self._getValue(val, self._e[0]);
                    f = function (total, arg) { return Math.max(total, self._getValue(val, arg)); };
                    break;
                case 'min':
                    init = self._getValue(val, self._e[0]);
                    f = function (total, arg) { return Math.min(total, self._getValue(val, arg)); };
                    break;
            }
            return self._e.reduce(f, init);
        };
        MathExp.prototype._getValue = function (val, e) {
            return (typeof e === 'number') ? e : e.eval(val);
        };
        return MathExp;
    }());
    //[operator: string, mapExpression: Expression]
    //[operator: string, initialValue: boolean | number, mapExpression: Expression]
    var CellAggregateExpression = /** @class */ (function () {
        function CellAggregateExpression(operator, e, init) {
            var self = this;
            self._o = operator;
            self._e = e;
            self._i = init;
        }
        CellAggregateExpression.parse = function (exp) {
            if (exp.length >= 3) {
                return new CellAggregateExpression(exp[0], Expression.parse(exp[2]), exp[1]);
            }
            else if (exp.length === 2) {
                return new CellAggregateExpression(exp[0], Expression.parse(exp[1]));
            }
            throw "Invalid 'CellAggregateExpression'.";
        };
        CellAggregateExpression.prototype.eval = function (val) {
            return this._e.eval(val);
        };
        CellAggregateExpression.prototype.finalize = function (properties, key) {
            if (properties.aggregateProperties) {
                var self_1 = this;
                var val = properties.aggregateProperties[key];
                var init = self_1._i;
                if (typeof init !== 'undefined') {
                    switch (self_1._o) {
                        case 'max':
                            val = Math.max(init, val);
                            break;
                        case 'min':
                            val = Math.min(init, val);
                            break;
                        case '+':
                            //Sum values and we will devide by point count in finialize stage to get average.
                            val = init + val;
                            break;
                        case '*':
                            val = init * val;
                            break;
                        case 'all':
                            val = init && val;
                            break;
                        case 'any':
                            val = init || val;
                            break;
                    }
                }
                properties.aggregateProperties[key] = val;
            }
        };
        return CellAggregateExpression;
    }());
    var Expressions = {
        //['get', string]
        //['get', string, object]
        get: /** @class */ (function () {
            function Get(name, e) {
                this._n = name;
                this._e = e;
            }
            Get.parse = function (exp) {
                var e = (exp.length >= 3) ? Expression.parse(exp[2]) : undefined;
                if (exp.length >= 2) {
                    return new Get(exp[1], e);
                }
                throw "Invalid 'get' expression.";
            };
            Get.prototype.eval = function (val) {
                var o = val;
                if (this._e) {
                    o = this._e.eval(val);
                }
                return o[this._n];
            };
            return Get;
        }()),
        //['has', string]
        //['has', string, object]
        has: /** @class */ (function () {
            function Has(name, e) {
                this._n = name;
                this._e = e;
            }
            Has.parse = function (exp) {
                var e = (exp.length >= 3) ? Expression.parse(exp[2]) : undefined;
                if (exp.length >= 2) {
                    return new Has(exp[1], e);
                }
                throw "Invalid 'has' expression.";
            };
            Has.prototype.eval = function (val) {
                var o = val;
                if (this._e) {
                    o = this._e.eval(val)[this._n];
                }
                return Object.keys(o).indexOf(this._n) > -1;
            };
            return Has;
        }()),
        //['literal', array | object]
        literal: /** @class */ (function () {
            function Literal(val) {
                this._v = val;
            }
            Literal.parse = function (exp) {
                if (exp.length >= 2) {
                    return new Literal(exp[1]);
                }
                throw "Invalid 'literal' expression.";
            };
            Literal.prototype.eval = function (val) {
                return this._v;
            };
            return Literal;
        }()),
        //['at', number, array]
        at: /** @class */ (function () {
            function At(idx, e) {
                this._i = idx;
                this._e = e;
            }
            At.parse = function (exp) {
                if (exp.length >= 3) {
                    return new At(exp[1], Expression.parse(exp[2]));
                }
                throw "Invalid 'at' expression.";
            };
            At.prototype.eval = function (val) {
                return this._e.eval(val)[this._i];
            };
            return At;
        }()),
        //['index-of', boolean | string | number, array | string]
        //['index-of', boolean | string | number, array | string, number]
        'index-of': /** @class */ (function () {
            function IndexOf(value, e, idx) {
                var self = this;
                self._v = value;
                self._e = e;
                self._i = idx;
            }
            IndexOf.parse = function (exp) {
                var idx = 0;
                if (exp.length >= 4) {
                    idx = exp[3];
                }
                if (exp.length >= 3) {
                    return new IndexOf(exp[1], Expression.parse(exp[2]), idx);
                }
                throw "Invalid 'index-of' expression.";
            };
            IndexOf.prototype.eval = function (val) {
                var self = this;
                return self._e.eval(val).indexOf(self._v, self._i);
            };
            return IndexOf;
        }()),
        //['length', string | array]
        length: /** @class */ (function () {
            function Length(arr) {
                this._e = arr;
            }
            Length.parse = function (exp) {
                if (exp.length >= 3) {
                    return new Length(Expression.parse(exp[1]));
                }
                throw "Invalid 'length' expression.";
            };
            Length.prototype.eval = function (val) {
                return this._e.eval(val).length;
            };
            return Length;
        }()),
        //['slice', array | string, number]
        //['slice', array | string, number, number]
        slice: /** @class */ (function () {
            function Slice(value, start, end) {
                var self = this;
                self._v = value;
                self._s = start;
                self._e = end;
            }
            Slice.parse = function (exp) {
                var idx;
                if (exp.length >= 4) {
                    idx = exp[3];
                }
                if (exp.length >= 3) {
                    return new Slice(Expression.parse(exp[1]), exp[2], idx);
                }
                throw "Invalid 'index-of' expression.";
            };
            Slice.prototype.eval = function (val) {
                var self = this;
                return self._v.eval(val).slice(self._s, self._e);
            };
            return Slice;
        }()),
        //['!', boolean]
        '!': /** @class */ (function () {
            function Not(e) {
                this._e = e;
            }
            Not.parse = function (exp) {
                if (exp.length >= 2) {
                    return new Not(Expression.parse(exp[1]));
                }
                throw "Invalid '!' expression.";
            };
            Not.prototype.eval = function (val) {
                return !this._e.eval(val);
            };
            return Not;
        }()),
        //['!=', value, value]
        '!=': ComparisonExp,
        //['<!=>', value, value]
        '<': ComparisonExp,
        //['<=', value, value]
        '<=': ComparisonExp,
        //['==', value, value]
        '==': ComparisonExp,
        //['>', value, value]
        '>': ComparisonExp,
        //['>=', value, value]
        '>=': ComparisonExp,
        // ['to-boolean', value]
        'to-boolean': /** @class */ (function () {
            function toBoolean(e) {
                this._e = e;
            }
            toBoolean.parse = function (exp) {
                if (exp.length >= 2) {
                    return new toBoolean(Expression.parse(exp[1]));
                }
                throw "Invalid 'to-boolean' expression.";
            };
            toBoolean.prototype.eval = function (val) {
                var v = this._e.eval(val);
                if (typeof v === 'boolean') {
                    return v;
                }
                else if (typeof v === 'string') {
                    return ['true', 'yes', 'on', '1'].indexOf(v.toLowerCase()) > -1;
                }
                else if (typeof v === 'number') {
                    return v === 1;
                }
                return false;
            };
            return toBoolean;
        }()),
        //['to-number', value]
        'to-number': /** @class */ (function () {
            function toNumber(e) {
                this._e = e;
            }
            toNumber.parse = function (exp) {
                if (exp.length >= 2) {
                    return new toNumber(Expression.parse(exp[1]));
                }
                throw "Invalid 'to-number' expression.";
            };
            toNumber.prototype.eval = function (val) {
                var v = this._e.eval(val);
                if (typeof v === 'boolean') {
                    return (v) ? 1 : 0;
                }
                else if (typeof v === 'string') {
                    return Number.parseFloat(v);
                }
                else if (typeof v === 'number') {
                    return v;
                }
                return Number.NaN;
            };
            return toNumber;
        }()),
        //['to-string', value]
        'to-string': /** @class */ (function () {
            function toString(e) {
                this._e = e;
            }
            toString.parse = function (exp) {
                if (exp.length >= 2) {
                    return new toString(Expression.parse(exp[1]));
                }
                throw "Invalid 'to-number' expression.";
            };
            toString.prototype.eval = function (val) {
                var v = this._e.eval(val);
                if (v.toString) {
                    return v.toString();
                }
                return Number.NaN;
            };
            return toString;
        }()),
        //['typeof', value]
        typeof: /** @class */ (function () {
            function TypeOf(e) {
                this._e = e;
            }
            TypeOf.parse = function (exp) {
                if (exp.length >= 2) {
                    return new TypeOf(Expression.parse(exp[1]));
                }
                throw "Invalid 'typeOf' expression.";
            };
            TypeOf.prototype.eval = function (val) {
                return typeof this._e.eval(val);
            };
            return TypeOf;
        }()),
        /*
          [
              'case',
              condition1: boolean,
              output1: value,
              condition2: boolean,
              output2: value,
              ...,
              fallback: value
          ]
        */
        case: /** @class */ (function () {
            function Case(conditions, outputs, fallback) {
                var self = this;
                self._e = conditions;
                self._o = outputs;
                self._f = fallback;
            }
            Case.parse = function (exp) {
                if (exp.length >= 3 && exp.length % 2 === 0) {
                    var conditions = [];
                    var outputs = [];
                    for (var i = 1, len = exp.length; i < len; i += 2) {
                        conditions.push(Expression.parse(exp[i]));
                        outputs.push(exp[i + 1]);
                    }
                    return new Case(conditions, outputs, exp[exp.length - 1]);
                }
                throw "Invalid 'case' expression.";
            };
            Case.prototype.eval = function (val) {
                var self = this;
                var c;
                for (var i = 0, len = self._e.length; i < len; i++) {
                    c = self._e[i].eval(val);
                    if (c) {
                        return self._o[i];
                    }
                }
                return self._f;
            };
            return Case;
        }()),
        /*
          [
              'match',
              input: number | string,
              label1: number | string | (number | string)[],
              output1: value,
              label2: number | string | (number | string)[],
              output2: value,
              ...,
              fallback: value
          ]
        */
        match: /** @class */ (function () {
            function Match(input, labels, outputs, fallback) {
                var self = this;
                self._i = input;
                self._l = labels;
                self._o = outputs;
                self._f = fallback;
            }
            Match.parse = function (exp) {
                if (exp.length >= 5 && exp.length % 2 === 1) {
                    var input = Expression.parse(exp[1]);
                    var labels = [];
                    var outputs = [];
                    for (var i = 2, len = exp.length - 1; i < len; i += 2) {
                        labels.push(exp[i]);
                        outputs.push(exp[i + 1]);
                    }
                    return new Match(input, labels, outputs, exp[exp.length - 1]);
                }
                throw "Invalid 'match' expression.";
            };
            Match.prototype.eval = function (val) {
                var self = this;
                var v = self._i.eval(val);
                for (var i = 0, len = self._l.length; i < len; i++) {
                    if (self._l[i] === v) {
                        return self._o[i];
                    }
                }
                return self._f;
            };
            return Match;
        }()),
        /*
          [
            'step',
            input: number,
            output0: value0,
            stop1: number,
            output1: value1,
            stop2: number,
            output2: value2,
            ...
          ]
        */
        step: /** @class */ (function () {
            function Step(input, labels, outputs) {
                var self = this;
                self._i = input;
                self._l = labels;
                self._o = outputs;
            }
            Step.parse = function (exp) {
                if (exp.length >= 5 && exp.length % 2 === 1) {
                    var input = Expression.parse(exp[1]);
                    var labels = [];
                    var outputs = [];
                    //Add the base
                    outputs.push(exp[2]);
                    for (var i = 3, len = exp.length; i < len; i += 2) {
                        labels.push(exp[i]);
                        outputs.push(exp[i + 1]);
                    }
                    return new Step(input, labels, outputs);
                }
                throw "Invalid 'step' expression.";
            };
            Step.prototype.eval = function (val) {
                var self = this;
                var v = self._i.eval(val);
                for (var i = 0, len = self._l.length; i < len; i++) {
                    if (v <= self._l[i]) {
                        return self._o[i];
                    }
                }
                return self._o[self._o.length - 1];
            };
            return Step;
        }()),
        //['in', boolean | string | number, array]
        //['in', substring, string]
        in: /** @class */ (function () {
            function In(idx, e) {
                this._i = idx;
                this._e = e;
            }
            In.parse = function (exp) {
                if (exp.length >= 3) {
                    return new In(exp[1], Expression.parse(exp[2]));
                }
                throw "Invalid 'at' expression.";
            };
            In.prototype.eval = function (val) {
                return this._e.eval(val).indexOf(this._i) > -1;
            };
            return In;
        }()),
        //['all', boolean, boolean, …]  
        all: /** @class */ (function () {
            function All(e) {
                this._e = e;
            }
            All.parse = function (exp) {
                if (exp.length >= 3 && exp.length % 2 === 0) {
                    var conditions = [];
                    for (var i = 1, len = exp.length; i < len; i++) {
                        conditions.push(Expression.parse(exp[i]));
                    }
                    return new All(conditions);
                }
                throw "Invalid 'all' expression.";
            };
            All.prototype.eval = function (val) {
                var state = true;
                this._e.forEach(function (e) {
                    state = state && e.eval(val);
                });
                return state;
            };
            return All;
        }()),
        //['any', boolean, boolean, …]
        any: /** @class */ (function () {
            function Any(e) {
                this._e = e;
            }
            Any.parse = function (exp) {
                if (exp.length >= 3 && exp.length % 2 === 0) {
                    var conditions = [];
                    for (var i = 1, len = exp.length; i < len; i++) {
                        conditions.push(Expression.parse(exp[i]));
                    }
                    return new Any(conditions);
                }
                throw "Invalid 'any' expression.";
            };
            Any.prototype.eval = function (val) {
                var state = false;
                this._e.forEach(function (e) {
                    state = state || e.eval(val);
                });
                return state;
            };
            return Any;
        }()),
        '+': MathExp,
        '*': MathExp,
        'min': MathExp,
        'max': MathExp,
        '-': MathExp,
        '/': MathExp,
        '%': MathExp,
        '^': MathExp,
        'abs': MathExp,
        'acos': MathExp,
        'asin': MathExp,
        'atan': MathExp,
        'ceil': MathExp,
        'cos': MathExp,
        'e': MathExp,
        'floor': MathExp,
        'ln': MathExp,
        'ln2': MathExp,
        'log10': MathExp,
        'log2': MathExp,
        'pi': MathExp,
        'round': MathExp,
        'sin': MathExp,
        'sqrt': MathExp,
        'tan': MathExp
    };

    /** A static class of grid based calculations. */
    var GridMath = /** @class */ (function () {
        function GridMath() {
        }
        /**
         * Aggregates points into a grid system.
         * @param points Points to aggregate.
         * @param pixels Pixels values for the points at zoom level 22. Precalculating and storing this help with updates when grid options changes but the points don't.
         * @param options Options for the grid system.
         */
        GridMath.calculateGrid = function (points, pixels, options) {
            var self = this;
            //Combine options with defaults.
            options = Object.assign({
                gridType: 'hexagon',
                cellWidth: 25000,
                distanceUnits: 'meters',
                coverage: 1,
                minCellWidth: 0,
                scaleExpression: self.LinearPointCountScaleExpression
            }, options || {});
            points = points || [];
            //centerLatitude
            /* The pixel width of the cell to create. This is the spatial distance, converted to a pixel distance at the centerLatitude and zoom level 22. */
            var groundResolution = self._getGroundResolutionZ22(options.centerLatitude);
            var width = azmaps.math.convertDistance(options.cellWidth, options.distanceUnits, 'meters') / groundResolution;
            var minCellWidth = azmaps.math.convertDistance(Math.min(options.minCellWidth, options.cellWidth), options.distanceUnits, 'meters') / groundResolution;
            //Determine if there are aggregate expressions to calculate.
            var hasAggregates = options.aggregateProperties && Object.keys(options.aggregateProperties).length > 0;
            //Parse the map expressions for aggregates.
            var mapExpressions = (hasAggregates) ? self._parseMapExpressions(options.aggregateProperties) : {};
            //Parse the scale expression.
            var scaleExpression = Expression.parse(options.scaleExpression || self.LinearPointCountScaleExpression);
            //Precalculate arc angle values for cell polygon generation.
            var arcAngles = self._getArcAngles(options.gridType);
            var sqrt3 = Math.sqrt(3);
            var height;
            switch (options.gridType) {
                case 'pointyHexagon':
                    height = 2 * width / sqrt3;
                    break;
                case 'hexagon':
                case 'hexCircle':
                    height = sqrt3 * width * 0.5;
                    break;
                case 'triangle':
                    height = sqrt3 * 0.5 * width;
                    break;
                default:
                    //Square grid system used. 
                    height = width;
                    break;
            }
            //Initialized grid info.
            var gridInfo = {
                cells: [],
                cellLookupTable: {},
                pointLookupTable: {},
                width: width,
                height: height
            };
            //Calculated cubic coordinate.
            var coord = { col: 0, row: 0, z: 0 };
            //Loop through the array of points and sort them into their respective bins.
            for (var i = 0, len = points.length; i < len; i++) {
                //Calculate the pixel location of a point at zoom level 22. 
                var pixel = pixels[i];
                //Calculate the cubic coordinate for the data bin that contains the points pixel coordinate.
                self._getCellCoord(pixel, width, height, options.gridType, coord, sqrt3);
                //Create a unique id for the bin using the x, y and z, parameters of the cubic coordinate.
                var cellId = "x" + coord.col + "y" + coord.row + "z" + coord.z;
                var cell = self._getGridCell(cellId, coord, i, gridInfo, width, height, options.gridType, hasAggregates);
                //Calculate aggregates and metrics for cell.
                self._incrementCellInfo(cell.properties, points[i], options.aggregateProperties, mapExpressions);
            }
            self._finalizeGrid(gridInfo, width, height, options, mapExpressions, scaleExpression, minCellWidth, arcAngles);
            return gridInfo;
        };
        /**
         * Recalulates the coordinates of all grid cells. This can occur when;
         * - the scaleProperty equals null or point_count.
         * - scaleCallback changes.
         * - the grid type changes between two types that use the same grid square/circle, hexagon/hexCircle.
         * @param gridInfo Previously calculated grid information.
         * @param options Options for the grid calculation.
         */
        GridMath.recalculateCoords = function (gridInfo, options) {
            var self = this;
            //Parse the scale expression.
            var scaleExpression = Expression.parse(options.scaleExpression || self.LinearPointCountScaleExpression);
            var minCellWidth = azmaps.math.convertDistance(Math.min(options.minCellWidth, options.cellWidth), options.distanceUnits, 'meters') / self._getGroundResolutionZ22(options.centerLatitude);
            for (var i = 0, len = gridInfo.cells.length; i < len; i++) {
                gridInfo.cells[i].geometry.coordinates = self.createGridPolygon(gridInfo.cells[i].properties, options, gridInfo.width, gridInfo.height, self._getArcAngles(options.gridType), minCellWidth, scaleExpression, gridInfo.scaleMetrics);
            }
        };
        /**
         * Converts a position to a mercator pixel at zoom level 22.
         * @param pos Position value to convert.
         */
        GridMath.toPixel22 = function (pos) {
            //Calculate the pixel location of a point at zoom level 22. 
            var sinLatitude = Math.sin(pos[1] * this.PI_By_180);
            var mapSize = this.MapSize22;
            return [
                (pos[0] + 180) / 360 * mapSize,
                (0.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (Math.PI * 4)) * mapSize
            ];
        };
        /***********************************
         * Private functions
         ***********************************/
        /**
         * Calculates the cell coordinate for a pixel.
         * @param pixel Pixel to calculate cell for.
         * @param width Width of cell.
         * @param height Height of cell.
         * @param gridType Grid type.
         * @param coord Coordinate to update values on.
         * @param sqrt3 Constant for square root of 3.
         */
        GridMath._getCellCoord = function (pixel, width, height, gridType, coord, sqrt3) {
            var self = this;
            //Calculate the cubic coordinate for the data bin that contains the points pixel coordinate.
            switch (gridType) {
                case 'pointyHexagon':
                    self._rotatedHexCellCoord(pixel, width, height, coord, sqrt3);
                    break;
                case 'hexagon':
                case 'hexCircle':
                    self._hexCellCoord(pixel, width, height, coord, sqrt3);
                    break;
                case 'triangle':
                    self._triangleCellCoord(pixel, width, height, coord, sqrt3);
                    break;
                default:
                    //Square grid system used. 
                    coord.col = Math.floor(pixel[0] / width);
                    coord.row = Math.floor(pixel[1] / height);
                    break;
            }
        };
        /**
          * Ground resolution in meters per pixel for zoom level 22 at the equator for 512x512 size tile system.
          * @param centerLatitude The latitude value to calculate the ground resolution for.
          */
        GridMath._getGroundResolutionZ22 = function (centerLatitude) {
            return Math.cos(centerLatitude * this.PI_By_180) * 2 * Math.PI * 6378137 / this.MapSize22;
        };
        /**
         * Gets a grid cell for the specified grid type.
         * @param cellId The id of the cell to retrieve from the specified grid system.
         * @param coord The cell cordinate.
         * @param i The index of the point looking for the cell. This will be added to the cells index of points within.
         * @param gridInfo The grid info to retrieve/add the cell info.
         * @param width The width of the cell.
         * @param height The height of the cell.
         * @param gridType The type of grid system being calculated.
         * @param hasAggregates Specifies if aggregates are being calculated.
         */
        GridMath._getGridCell = function (cellId, coord, i, gridInfo, width, height, gridType, hasAggregates) {
            //Check to see if the bin has already been created and indexed.
            var cellIdx = gridInfo.cellLookupTable[cellId];
            if (cellIdx !== undefined) {
                //If the bin exists, add the point index to pointLookupTable of the bin.
                gridInfo.pointLookupTable[cellId].push(i);
                //Get reference to cell.
                return gridInfo.cells[cellIdx];
            }
            //Create a grid cell for the specified cubic coordinates.
            var cell = this._createCellFromCubeCoord(cellId, coord, gridType, width, height, hasAggregates);
            //Add the cell information to the grid.
            gridInfo.pointLookupTable[cellId] = [i];
            gridInfo.cells.push(cell);
            gridInfo.cellLookupTable[cellId] = gridInfo.cells.length - 1;
            return cell;
        };
        /***********************************
         * Cell coordinate functions
         ***********************************/
        /**
         * Calculates the cubic cooridate of a hexagon that is intersected by the specified pixel coordinate.
         * @param pixel A pixel coordinate that intersects the hexagon.
         * @param width The width of the cell.
         * @param height The height of the cell.
         * @param coord A cubic coordinate object to set the values on.
         * @param sqrt3 The constant square rott of 3.
         */
        GridMath._hexCellCoord = function (pixel, width, height, coord, sqrt3) {
            coord.col = pixel[0] * 4 / (3 * width);
            coord.z = (pixel[1] - pixel[0] / sqrt3) / height;
            coord.row = -coord.col - coord.z;
            /*var radius = width * 0.5;

            coord.col = pixel[0] * 2 / 3 / radius;
            coord.z = (-pixel[0] + pixel[1] * sqrt3) / 3 / radius;
            coord.row = -coord.col - coord.z;*/
            GridMath._roundCubeCoord(coord);
        };
        /**
         * Calculates the cubic cooridate of a rotated hexagon that is intersected by the specified pixel coordinate.
         * @param pixel A pixel coordinate that intersects the rotated hexagon.
         * @param width The width of the cell.
         * @param height The height of the cell.
         * @param coord A cubic coordinate object to set the values on.
         * @param sqrt3 The constant square rott of 3.
         */
        GridMath._rotatedHexCellCoord = function (pixel, width, height, coord, sqrt3) {
            coord.col = (pixel[0] - pixel[1] / sqrt3) / width;
            coord.z = 4 * pixel[1] / (3 * height);
            coord.row = -coord.col - coord.z;
            return GridMath._roundCubeCoord(coord);
        };
        /**
         * Given the x, y, and z parameters of a cubic coordinate, this function rounds them off in cubic coordinate space.
         * @param coord A cubic coordinate object to set the values on.
         */
        GridMath._roundCubeCoord = function (coord) {
            var mathRound = Math.round;
            var mathAbs = Math.abs;
            var rx = mathRound(coord.col);
            var ry = mathRound(coord.row);
            var rz = mathRound(coord.z);
            var x_diff = mathAbs(rx - coord.col);
            var y_diff = mathAbs(ry - coord.row);
            var z_diff = mathAbs(rz - coord.z);
            if (x_diff > y_diff && x_diff > z_diff) {
                rx = -ry - rz;
            }
            else if (y_diff > z_diff) {
                ry = -rx - rz;
            }
            else {
                rz = -rx - ry;
            }
            coord.col = rx;
            coord.row = ry;
            coord.z = rz;
        };
        /**
         * Calculates the cell coordinate for a triangle. This is the top left corner of a triangle if pointing down or bottom left if pointing up.
         * @param pixel The pixel cooridnate.
         * @param width The width of the triangle cell.
         * @param height The height of the triangle cell.
         * @param coord The coordinate object to set the row/col values on.
         * @param sqrt3 A constant for the square root 3.
         */
        GridMath._triangleCellCoord = function (pixel, width, height, coord, sqrt3) {
            //Round values.
            coord.row = Math.floor(pixel[1] / height);
            coord.col = Math.floor(pixel[0] / width);
            var dy = (coord.row + 1) * height - pixel[1];
            var dx = pixel[0] - coord.col * width;
            if (coord.row % 2 === 1) {
                dy = height - dy;
            }
            if (dy > 1) {
                if (dx < width * 0.5) {
                    // Left half of triangle.
                    var ratio = dx / dy;
                    if (ratio < 1 / sqrt3) {
                        coord.col -= 0.5;
                    }
                }
                else {
                    // Right half of triangle.
                    var ratio = (width - dx) / dy;
                    if (ratio < 1 / sqrt3) {
                        coord.col += 0.5;
                    }
                }
            }
        };
        /**
        * Creates an empty polygon feature with CellInfo object from it's center pixel coordinates from the specified cubic coordinate for a hexagon.
        * @param cellId: ID of the cell.
        * @param cube The cubic coordinate of the hexagon.
        * @param gridType The gird type.
        * @param width The width of the cell.
        * @param height The height of the cell.
        * @returns A cell polygon object for a hexagon.
        */
        GridMath._createCellFromCubeCoord = function (cellId, cube, gridType, width, height, hasAggregates) {
            //Center pixel coordinate value.
            var cx;
            var cy;
            var rightSideUp;
            //Calculate center of the bin in pixel coordinates.
            switch (gridType) {
                case 'pointyHexagon':
                    cx = width * (cube.col + cube.z * 0.5);
                    cy = 0.75 * height * cube.z;
                    break;
                case 'hexagon':
                case 'hexCircle':
                    cx = 0.75 * width * cube.col;
                    cy = height * (cube.z + cube.col * 0.5);
                    break;
                case 'triangle':
                    cy = Math.floor(cube.row * height);
                    cx = Math.floor((cube.col + 0.5) * width);
                    // See if this triangle should be drawn
                    // right-side up or upside down.
                    var whole_col = (Math.abs(cube.col - Math.round(cube.col)) < 0.1);
                    if (Math.round(cube.row) % 2 == 0) {
                        // Even row.
                        rightSideUp = whole_col;
                    }
                    else {
                        // Odd row.
                        rightSideUp = !whole_col;
                    }
                    break;
                default: //Square and circle based on square grid.
                    cx = (cube.col + 0.5) * width;
                    cy = (cube.row + 0.5) * height;
                    break;
            }
            //Create a data bin object.
            return this._createCell(cellId, cx, cy, rightSideUp, hasAggregates);
        };
        /***********************************
         * Common private functions
         ***********************************/
        /**
         * Gets arc angles from cahced for a grid type or calculates them if needed.
         * @param gridType Grid type
         */
        GridMath._getArcAngles = function (gridType) {
            var self = GridMath;
            var calculateArcAngles = self._calculateArcAngles;
            //Precalculate arc angle values for cell polygon generation.
            var arcAngles = self._arcAngles[gridType];
            if (!arcAngles) {
                switch (gridType) {
                    case 'circle':
                    case 'hexCircle':
                        arcAngles = calculateArcAngles(36);
                        break;
                    case 'pointyHexagon':
                        arcAngles = calculateArcAngles(6);
                        break;
                    case 'hexagon':
                        arcAngles = calculateArcAngles(6, 30);
                        break;
                }
                //Cache for faste lookups later.
                self._arcAngles[gridType] = arcAngles;
            }
            return arcAngles;
        };
        /**
         * Calculate the arc angles for a regular polygon.
         * @param numNodes Number of nodes in regular polygon.
         * @param offset Offset angle in degrees.
         */
        GridMath._calculateArcAngles = function (numNodes, offset) {
            //Default the offset value to 0 if not set.
            offset = (offset) ? offset : 0;
            //The number of degrees between each node.
            var centralAngle = 360 / numNodes;
            //The from the first node to the current node in radians.
            var arcAngleRadians;
            var sinArcAngles = [];
            var cosArcAngles = [];
            for (var i = 0; i < numNodes; i++) {
                //Calcualte the arc angle from the first node to the current node in radians.
                arcAngleRadians = (i * centralAngle + offset) * GridMath.PI_By_180;
                sinArcAngles.push(Math.sin(arcAngleRadians));
                cosArcAngles.push(Math.cos(arcAngleRadians));
            }
            return {
                sin: sinArcAngles,
                cos: cosArcAngles
            };
        };
        /**
         * Converts a mercator pixel at zoom level 22 to a position.
         * @param pixel Pixel value to convert.
         */
        GridMath._toPosition22 = function (pixel) {
            var mapSize = GridMath.MapSize22;
            var math = Math;
            return [
                360 * ((pixel[0] / mapSize) - 0.5),
                90 - 360 * math.atan(math.exp(((pixel[1] / mapSize) - 0.5) * math.PI * 2)) / math.PI
            ];
        };
        /**
         * Parses the map expressions from aggregate expressions.
         * @param aggregateProperties Aggregate expressions to parse.
         */
        GridMath._parseMapExpressions = function (aggregateProperties) {
            var mapExpressions = {};
            if (aggregateProperties) {
                var agg_1;
                Object.keys(aggregateProperties).forEach(function (key) {
                    agg_1 = aggregateProperties[key];
                    //Aggregate expression has the format [operator: string, initialValue: boolean | number, mapExpression: Expression] or [operator: string, mapExpression: Expression]
                    if (agg_1 && agg_1.length >= 2) {
                        try {
                            mapExpressions[key] = CellAggregateExpression.parse(agg_1);
                        }
                        catch (_a) {
                            //Expression is invalid, remove aggregate.
                            aggregateProperties[key] = undefined;
                        }
                    }
                    else {
                        //Expression is invalid, remove aggregate.
                        aggregateProperties[key] = undefined;
                    }
                });
            }
            return mapExpressions;
        };
        /**
         * Increments point_count, calculates aggregate expression for point and increments cell info accordingly.
         * @param cellInfo Cell info to increment.
         * @param point Point feature to use with aggregates.
         * @param aggregateProperties Aggregate expression properties.
         * @param mapExpressions Parsed map expressions for aggregates.
         */
        GridMath._incrementCellInfo = function (cellInfo, point, aggregateProperties, mapExpressions) {
            cellInfo.point_count++;
            if (aggregateProperties) {
                var count_1 = cellInfo.point_count;
                var prevValue_1;
                var newValue_1;
                var props_1 = cellInfo.aggregateProperties || {};
                Object.keys(aggregateProperties).forEach(function (key) {
                    var agg = aggregateProperties[key];
                    var mapExp = mapExpressions[key];
                    if (mapExp) {
                        newValue_1 = mapExp.eval(point.properties);
                        //If only one point in the data, we need to initialize the property.
                        if (count_1 === 1) {
                            if (Array.isArray(agg[1])) {
                                //Expression value is the initializer.
                                prevValue_1 = null;
                            }
                            else {
                                //Second value is the initial value. 
                                prevValue_1 = agg[1];
                            }
                        }
                        else {
                            //Get any previous calculated value.
                            prevValue_1 = props_1[key];
                        }
                        if (prevValue_1 !== null) {
                            switch (agg[0]) {
                                case 'max':
                                    newValue_1 = (prevValue_1 > newValue_1) ? prevValue_1 : newValue_1;
                                    break;
                                case 'min':
                                    newValue_1 = (prevValue_1 < newValue_1) ? prevValue_1 : newValue_1;
                                    break;
                                case '+':
                                    newValue_1 = prevValue_1 + newValue_1;
                                    break;
                                case '*':
                                    newValue_1 = prevValue_1 * newValue_1;
                                    break;
                                case 'all':
                                    newValue_1 = prevValue_1 && newValue_1;
                                    break;
                                case 'any':
                                    newValue_1 = prevValue_1 || newValue_1;
                                    break;
                            }
                        }
                        if (newValue_1 !== null) {
                            props_1[key] = newValue_1;
                        }
                    }
                    cellInfo.aggregateProperties = props_1;
                });
            }
        };
        /**
         * Finalizes cell info by formatting point_count_abbreviated, accounting for init values in aggregates, and extracting scale range values.
         * @param cellInfo The cell info to finalize.
         * @param aggregateExpressions The aggregate expressions to apply.
         * @param scaleMetrics Scale metrics to merge with.
         * @param scaleProperty Property to scale on.
         */
        GridMath._finalizeCellInfo = function (cellInfo, aggregateExpressions, scaleMetrics, scaleProperty) {
            var count = cellInfo.point_count;
            //Generate an abbreviated version of the point count.
            var abbrv = count.toString();
            if (count >= 1000000) {
                abbrv = Math.round(count / 1000000) + "M";
            }
            else if (count >= 1000) {
                abbrv = Math.round(count / 1000) + "k";
            }
            cellInfo.point_count_abbreviated = abbrv;
            var scaleVal = count;
            if (aggregateExpressions) {
                //Finalize all mapped aggregate expressions.
                Object.keys(aggregateExpressions).forEach(function (key) {
                    aggregateExpressions[key].finalize(cellInfo, key);
                });
                if (scaleProperty && typeof cellInfo.aggregateProperties[scaleProperty] !== 'undefined') {
                    scaleVal = cellInfo.aggregateProperties[scaleProperty];
                }
            }
            if (scaleMetrics) {
                if (typeof scaleMetrics.min === 'undefined') {
                    scaleMetrics.min = scaleVal;
                    scaleMetrics.max = scaleVal;
                }
                else {
                    scaleMetrics.min = Math.min(scaleMetrics.min, scaleVal);
                    scaleMetrics.max = Math.max(scaleMetrics.max, scaleVal);
                }
            }
        };
        /**
         * Creates an empty polygon feature with CellInfo object from it's center pixel coordinates.
         * @param cx Center x pixel coordinate of data bin.
         * @param cy Center y pixel coordinate of data bin.
         * @param rightSideUp If the cell represents a triangle, specifies if it pointing up or not.
         * @param hasAggregates Specifies if aggregates are being calculated.
         * @returns A CellInfo object for the specified center pixel coordinates.
         */
        GridMath._createCell = function (cell_id, cx, cy, rightSideUp, hasAggregates) {
            return {
                type: 'Feature',
                properties: {
                    cell_id: cell_id,
                    aggregateProperties: hasAggregates ? {} : undefined,
                    _x: cx,
                    _y: cy,
                    _rightSideUp: rightSideUp,
                    point_count: 0,
                    point_count_abbreviated: '0'
                },
                geometry: {
                    type: 'Polygon',
                    coordinates: []
                }
            };
        };
        /**
        * Creates the data bin polygon for the specified bin.
        * @param cellInfo Information about the cell.
        * @param gridType The type of grid polygon to create.
        * @param width The width of the cell.
        * @param height The height of the cell.
        * @param arcAngles Pre-calculate arc angles for regular polygon creation.
        * @param scaleMetrics Min/max metric value for scaling.
        * @param scaleCallback Scaling callback function.
        * @returns A polygon that represents the data bin.
        */
        GridMath.createGridPolygon = function (cellInfo, options, width, height, arcAngles, minCellWidth, scaleExp, scaleMetrics) {
            var self = GridMath;
            var scale = options.coverage || 1;
            //Get the scale value for the data bin if the user has specified a scale callback function.
            if (options.scaleProperty && scaleMetrics) {
                var s = scaleExp.eval(Object.assign({
                    min: scaleMetrics.min,
                    max: scaleMetrics.max,
                }, cellInfo));
                if (!isNaN(s) && typeof s === 'number') {
                    scale *= s;
                }
            }
            var getRegularPolygon = self._getRegularPolygon;
            //Generate the polygon for the data bin.
            switch (options.gridType) {
                case 'square':
                    return self._getSquare(cellInfo, width, scale, minCellWidth);
                case 'hexCircle':
                    //For hex cicles we want the inner radius of the hexagon which is calculated as Math.cos(30 * Math.PI / 180) * pixelRadius = 0.8660254037844387 * pixelRadius
                    return getRegularPolygon(cellInfo, self.InnerRadiusScale * width * 0.5 * scale, arcAngles, minCellWidth);
                case 'triangle':
                    return self._getTriangle(cellInfo, width, height, scale, minCellWidth);
                case 'pointyHexagon':
                    //Create a flat hexagon by rotating it 30 degrees.
                    return getRegularPolygon(cellInfo, height * 0.5 * scale, arcAngles, minCellWidth);
                //case 'hexagon':
                //case 'circle':
                default:
                    //Create a flat hexagon by rotating it 30 degrees.
                    return getRegularPolygon(cellInfo, width * 0.5 * scale, arcAngles, minCellWidth);
            }
        };
        /**
         * Generates a cell polygon that has the shape of a regular polygon (hexagon, approximated circle...).
         * @param cellInfo The cell information for the polygon.
         * @param radius The radius of the regular polygon to create in pixels at zoom level 22.
         * @param arcAngles Pre-calculate arc angles for regular polygon creation.
         * @returns A data bin polygon that can be displayed on the map.
         */
        GridMath._getRegularPolygon = function (cellInfo, radius, arcAngles, minCellWidth) {
            var self = GridMath;
            //The x and y pixel coordinates of each node.
            var dx;
            var dy;
            var pos = [];
            var mapSize = self.MapSize22;
            if (radius * 2 < minCellWidth) {
                radius = minCellWidth * 0.5;
            }
            //Using forEach as there is never more than 36 nodes in the polygons.
            arcAngles.sin.forEach(function (sinArcAngle, i) {
                //Calculate the pixel coordinates of each node.
                dx = Math.min(Math.max(cellInfo._x + radius * sinArcAngle, 0), mapSize);
                dy = cellInfo._y + radius * arcAngles.cos[i];
                //Convert the pixel value into position at zoom level 22.
                pos.push(self._toPosition22([dx, dy]));
            });
            //Close the ring.
            pos.push(pos[0]);
            //Create a data cell polygon from the array of positions.
            return [pos];
        };
        /**
         * Calculates a polygon that is the shape of a square, where scaledPixelRadius is the distance from the center the an edge of the square.
         * @param cellInfo Information about the cell on a square grid.
         * @param width The scaled radius in pixels.
         */
        GridMath._getSquare = function (cellInfo, width, scale, minCellWidth) {
            var self = this;
            var scaledHalfWidth = Math.max(width * scale, minCellWidth) * 0.5;
            //Shape is a square.
            var top = cellInfo._y - scaledHalfWidth;
            var bottom = cellInfo._y + scaledHalfWidth;
            var left = Math.max(cellInfo._x - scaledHalfWidth, 0);
            var right = Math.min(cellInfo._x + scaledHalfWidth, self.MapSize22);
            var toPosition22 = self._toPosition22;
            //Create the four corners of the square.        
            //Convert the pixel values into positions at zoom level 22.
            var pos = [
                toPosition22([left, top]),
                toPosition22([left, bottom]),
                toPosition22([right, bottom]),
                toPosition22([right, top])
            ];
            //Close the polygon ring.
            pos.push(pos[0]);
            //Create a data cell polygon from the array of positions.
            return [pos];
        };
        /**
         * Calculates the points of a triangular cell.
         * @param cellInfo Information about the cell on a triangular grid.
         * @param width Width of each cell.
         * @param height Height of each cell.
         * @param scale Scale to apply to the polygon.
         */
        GridMath._getTriangle = function (cellInfo, width, height, scale, minCellWidth) {
            var pos;
            //Cache the x offset to reduce lookups and allow for better minification.
            var offsetX = cellInfo._x;
            //Need to offset vertically to account for scale so that the triangle appears near the center of the grid cell.
            var offsetY = cellInfo._y + (height - height * scale) * 0.5;
            //Scale the width/height values.
            width *= scale;
            height *= scale;
            if (width < minCellWidth) {
                height *= minCellWidth / width;
            }
            //Calculate the half with
            var halfWidth = width * 0.5;
            var mapSize = this.MapSize22;
            var x1 = offsetX;
            var x2 = offsetX + halfWidth;
            var x3 = offsetX - halfWidth;
            var mathMax = Math.max;
            var mathMin = Math.min;
            //Clamp the triangle coordinates to a single globe and clip at the anti-Meridian. 
            if (x3 < 0) {
                x1 = mathMax(x1, 0);
                x2 = mathMax(x2, 0);
                x3 = mathMax(x3, 0);
            }
            else if (x2 > mapSize) {
                x1 = mathMin(x1, mapSize);
                x2 = mathMin(x2, mapSize);
                x3 = mathMin(x3, mapSize);
            }
            var toPosition22 = this._toPosition22;
            //Calculate points of the triangle.
            if (cellInfo._rightSideUp) {
                pos = [
                    toPosition22([x1, offsetY]),
                    toPosition22([x2, height + offsetY]),
                    toPosition22([x3, height + offsetY])
                ];
            }
            else {
                pos = [
                    toPosition22([x1, height + offsetY]),
                    toPosition22([x2, offsetY]),
                    toPosition22([x3, offsetY])
                ];
            }
            //Close the polygon ring.
            pos.push(pos[0]);
            //Create a 2D array of positions for use as a Polygon.
            return [pos];
        };
        /**
         * Finalizes grid by calculating aggregate calculations, point_count_abbreviated and scale metrics then creating polygons.
         * @param gridInfo Grid infor to finalize.
         * @param width The width of the cell.
         * @param height The height of the cell.
         * @param minCellWidth The min width of the cell when scaling.
         * @param options Options for the grid.
         * @param aggregateExpressions Aggregate data value expressions.
         * @param scaleExpression The scaling expression to apply.
         * @param arcAngles Pre-calculate arc angles for regular polygon creation.
         */
        GridMath._finalizeGrid = function (gridInfo, width, height, options, aggregateExpressions, scaleExpression, minCellWidth, arcAngles) {
            var scaleMetrics = {};
            var len = gridInfo.cells.length;
            var self = this;
            //Finish aggregate calculations, calculate point_count_abbreviated and scale metrics.
            if (options.scaleProperty) {
                //If there is a scaleProperty, we must finalize all cells before we calculate coordinates. 
                for (var i = 0; i < len; i++) {
                    self._finalizeCellInfo(gridInfo.cells[i].properties, aggregateExpressions, scaleMetrics, options.scaleProperty);
                }
                //Calculate polygon coordinates for cell.
                for (var i = 0; i < len; i++) {
                    gridInfo.cells[i].geometry.coordinates = self.createGridPolygon(gridInfo.cells[i].properties, options, width, height, arcAngles, minCellWidth, scaleExpression, scaleMetrics);
                }
            }
            else {
                //If there is no scaleProperty, we can finalize cells and calculate polygons at the same time.
                for (var i = 0; i < len; i++) {
                    self._finalizeCellInfo(gridInfo.cells[i].properties, aggregateExpressions, scaleMetrics, options.scaleProperty);
                    //Calculate polygon coordinates for cell.
                    gridInfo.cells[i].geometry.coordinates = self.createGridPolygon(gridInfo.cells[i].properties, options, width, height, arcAngles, minCellWidth, scaleExpression, scaleMetrics);
                }
            }
            gridInfo.scaleMetrics = scaleMetrics;
        };
        GridMath.PI_By_180 = Math.PI / 180;
        GridMath.MapSize22 = 512 * Math.pow(2, 22);
        GridMath.InnerRadiusScale = Math.cos(30 * Math.PI / 180);
        GridMath.LinearPointCountScaleExpression = ['/', ['-', ['get', 'point_count'], ['get', 'min']], ['-', ['get', 'max'], ['get', 'min']]];
        //Cached calculations for arc angle values for cell polygon generation.
        GridMath._arcAngles = {};
        return GridMath;
    }());

    /**
     * A data source for aggregating point data into cells of a grid system.
     * Point features will be extracted from atlas.Shape objects, but this shape will not be data bound.
     */
    var GriddedDataSource = /** @class */ (function (_super) {
        __extends(GriddedDataSource, _super);
        /***********************************
         * Constructor
         ***********************************/
        /**
          * A data source class that makes it easy to manage shapes data that will be displayed on the map.
          * A data source must be added to a layer before it is visible on the map.
          * The `DataSource` class may be used with the `SymbolLayer`, `LineLayer`, `PolygonLayer`, `BubbleLayer`, and `HeatMapLayer`.
          * @param id a unique id that the user assigns to the data source. If this is not specified, then the data source will automatically be assigned an id.
          * @param options the options for the data source.
          */
        function GriddedDataSource(id, options) {
            var _this = _super.call(this, id) || this;
            /***********************************
             * Private properties
             ***********************************/
            /** Options for the data source. */
            _this._options = {
                maxZoom: 18,
                cellWidth: 25000,
                minCellWidth: 0,
                distanceUnits: 'meters',
                gridType: 'hexagon',
                coverage: 1,
                centerLatitude: 0
            };
            /** The points in the data source. */
            _this._points = [];
            /** The pixels of each point. */
            _this._pixels = [];
            if (options) {
                Object.assign(_this._options, options);
                //Set the buffer to 8 since the data 
                _super.prototype.setOptions.call(_this, Object.assign({ buffer: 8, tolerance: 0 }, options));
            }
            return _this;
        }
        /***********************************
         * Public functions
         ***********************************/
        /**
         * Adds points to the data source.
         * @param points The points to add to the data source.
         */
        GriddedDataSource.prototype.add = function (points) {
            this._addPoints(points);
            this._recalculate();
        };
        /**
         * Removes all data in the data source.
         */
        GriddedDataSource.prototype.clear = function () {
            this._points = [];
            this._pixels = [];
            _super.prototype.clear.call(this);
        };
        /**
         * Cleans up any resources this data source is consuming.
         */
        GriddedDataSource.prototype.dispose = function () {
            var _this = this;
            this.clear();
            _super.prototype.dispose.call(this);
            Object.keys(this).forEach(function (k) { return _this[k] = null; });
        };
        /**
         * Gets all points that are within the specified grid cell.
         * @param cell_id The grid cell id.
         */
        GriddedDataSource.prototype.getCellChildren = function (cell_id) {
            var pointIdx = this._gridInfo.pointLookupTable[cell_id];
            var points = [];
            if (pointIdx) {
                for (var i = 0, len = pointIdx.length; i < len; i++) {
                    points.push(this._points[pointIdx[i]]);
                }
            }
            return JSON.parse(JSON.stringify(points));
        };
        /**
         * Gets all grid cell polygons as a GeoJSON FeatureCollection.
         */
        GriddedDataSource.prototype.getGridCells = function () {
            return _super.prototype.toJson.call(this);
        };
        /**
         * Gets the options used by the data source.
         */
        GriddedDataSource.prototype.getOptions = function () {
            return Object.assign({}, this._options);
        };
        /**
         * Gets all points as a GeoJSON FeatureCollection.
         */
        GriddedDataSource.prototype.getPoints = function () {
            return new azmaps.data.FeatureCollection(JSON.parse(JSON.stringify(this._points)));
        };
        /**
         * Downloads a GeoJSON document and imports its data into the data source.
         * The GeoJSON document must be on the same domain or accessible using CORS.
         * @param url The URL to the GeoJSON document.
         */
        GriddedDataSource.prototype.importDataFromUrl = function (url) {
            var _this = this;
            var self = this;
            return new Promise(function (resolve, reject) {
                _super.prototype.clear.call(_this);
                _super.prototype.importDataFromUrl.call(_this, url).then(function () {
                    //Grab the data as GeoJSON and pass it into the add function.
                    self._addPoints(_super.prototype.toJson.call(_this));
                    self._recalculate();
                    resolve();
                }, function () { reject(); });
            });
        };
        /**
         * Removes one or more points from the data source.
         * If a string is passed in, it is assumed to be an id.
         * If a number is passed in, removes the point at that index.
         * @param point The point(s), point id(s), or feature(s) to be removed
         */
        GriddedDataSource.prototype.remove = function (point) {
            this._remove(point);
            this._recalculate();
        };
        /**
         * Removes one or more points from the datasource based on its id.
         * @param shape shape id
         */
        GriddedDataSource.prototype.removeById = function (id) {
            this._remove(id);
            this._recalculate();
        };
        /**
         * Sets the data source options.
         * The data source will retain its current values for any option not specified in the supplied options.
         * @param options The options to be set.
         */
        GriddedDataSource.prototype.setOptions = function (options) {
            if (options) {
                var self_1 = this;
                var opt = self_1._options;
                var superOptions = {};
                var coordCalcNeeded = false;
                var fullCalcNeeded = false;
                if (typeof options.maxZoom === 'number' && options.maxZoom >= 0 && options.maxZoom < 25 && options.maxZoom !== opt.maxZoom) {
                    opt.maxZoom = options.maxZoom;
                    superOptions.maxZoom = options.maxZoom;
                    //No recalculation required.
                }
                if (typeof options.cellWidth === 'number' && options.cellWidth > 0 && options.cellWidth !== opt.cellWidth) {
                    opt.cellWidth = options.cellWidth;
                    //Requires a full recalulation.
                    fullCalcNeeded = true;
                }
                if (typeof options.minCellWidth === 'number' && options.minCellWidth >= 0 && options.minCellWidth !== opt.minCellWidth) {
                    opt.minCellWidth = options.minCellWidth;
                    //Only requires recalculating coordinates of cell.
                    coordCalcNeeded = true;
                }
                if (options.centerLatitude !== undefined && options.centerLatitude !== opt.centerLatitude) {
                    opt.centerLatitude = options.centerLatitude;
                    //Requires a full recalulation.
                    fullCalcNeeded = true;
                }
                if (options.distanceUnits && options.distanceUnits !== opt.distanceUnits) {
                    opt.distanceUnits = options.distanceUnits;
                    //Requires a full recalulation.
                    fullCalcNeeded = true;
                }
                if (options.gridType && options.gridType !== opt.gridType) {
                    var sq = ['square', 'circle'];
                    var hx = ['hexagon', 'hexCircle'];
                    //Check to see if old and new grid types are based on the same grid system. Such as square/circle, or hexagon/hexCircle.
                    if ((hx.indexOf(opt.gridType) > -1 && hx.indexOf(options.gridType) > -1) ||
                        (sq.indexOf(opt.gridType) > -1 && sq.indexOf(options.gridType) > -1)) {
                        //Only need to recalculate coords.
                        coordCalcNeeded = true;
                    }
                    else {
                        //Requires a full recalulation.
                        fullCalcNeeded = true;
                    }
                    opt.gridType = options.gridType;
                }
                if (options.aggregateProperties !== undefined) {
                    opt.aggregateProperties = options.aggregateProperties;
                    //Requires a full recalulation. 
                    fullCalcNeeded = true;
                }
                if (options.scaleExpression !== undefined && options.scaleExpression !== opt.scaleExpression) {
                    opt.scaleExpression = options.scaleExpression;
                    //Only need to recalculate coords if, the scaleProperty is set or will be set.
                    if (options.scaleProperty || opt.scaleProperty) {
                        coordCalcNeeded = true;
                    }
                }
                if (options.scaleProperty !== undefined && options.scaleProperty !== opt.scaleProperty) {
                    opt.scaleProperty = options.scaleProperty;
                    if (options.scaleProperty === null || options.scaleProperty === 'point_count') {
                        //Only need to recalculate coords.
                        coordCalcNeeded = true;
                    }
                    else {
                        //Requires a full recalulation.
                        fullCalcNeeded = true;
                    }
                }
                if (options.coverage !== undefined && options.coverage !== opt.coverage) {
                    opt.coverage = options.coverage;
                    //Only need to recalculate coords.
                    coordCalcNeeded = true;
                }
                if (Object.keys(superOptions).length > 0) {
                    _super.prototype.setOptions.call(this, superOptions);
                }
                if (fullCalcNeeded || !self_1._gridInfo) {
                    self_1._recalculate();
                }
                else if (coordCalcNeeded) {
                    self_1._recalculateCoords();
                }
            }
        };
        /**
         * Overwrites all points in the data source with the new array of points.
         * @param points The new points to add.
         */
        GriddedDataSource.prototype.setPoints = function (points) {
            var self = this;
            self._points = [];
            self._pixels = [];
            self._addPoints(points);
            self._recalculate();
        };
        /***********************************
         * Private functions
         ***********************************/
        /**
         * Adds points to the data source.
         * @param points The points to add to the data source.
         * @param recalculate Specifies if the data bins should be recalculated.
         */
        GriddedDataSource.prototype._addPoints = function (points) {
            var self = this;
            var pt = self._points;
            var px = self._pixels;
            var normalize = self._normalizeGetPixel22;
            if (points.type === 'FeatureCollection') {
                points = points.features;
            }
            if (Array.isArray(points)) {
                //Filter the data in the array and only add point geometry features.
                for (var i = 0, len = points.length; i < len; i++) {
                    self._addPoints(points[i]);
                }
            }
            else if (points instanceof azmaps.Shape) {
                if (points.getType() === 'Point') {
                    px.push(normalize(points.getCoordinates()));
                    pt.push(points.toJson());
                }
            }
            else if (points.type === 'Feature' && points.geometry.type === 'Point') {
                var f = points;
                px.push(normalize(f.geometry.coordinates));
                pt.push(f);
            }
            else if (points.type === 'Point') {
                //Convert raw points into features.
                var p = points;
                px.push(normalize(p.coordinates));
                pt.push(new azmaps.data.Feature(p));
            }
        };
        /**
         * Normalizes the coordinates of a point and returns the pixel value at zoom 22.
         * @param pos Position to normalize.
         */
        GriddedDataSource.prototype._normalizeGetPixel22 = function (pos) {
            pos[0] = azmaps.math.normalizeLongitude(pos[0]);
            pos[1] = azmaps.math.normalizeLatitude(pos[1]);
            return GridMath.toPixel22(pos);
        };
        /**
         * Removes one or more points from the data source.
         * If a string is passed in, it is assumed to be an id.
         * If a number is passed in, removes the point at that index.
         * @param point The point(s), point id(s), or feature(s) to be removed
         * @param recalculate Specifies if the data bins should be recalculated.
         */
        GriddedDataSource.prototype._remove = function (point) {
            var self = this;
            var pt = self._points;
            if (Array.isArray(point)) {
                for (var i = 0, len = point.length; i < len; i++) {
                    self._remove(point[i]);
                }
            }
            else if (point instanceof azmaps.Shape) {
                var id = point.getId();
                for (var i = 0, len = pt.length; i < len; i++) {
                    if (pt[i].id === id) {
                        self._remove(i);
                        break;
                    }
                }
            }
            else if (typeof point === 'number') {
                if (point < pt.length) {
                    pt.splice(point, 1);
                }
            }
            else if (typeof point === 'string') {
                for (var i = 0, len = pt.length; i < len; i++) {
                    if (pt[i].id === point) {
                        self._remove(i);
                        break;
                    }
                }
            }
            else if (point.type === 'Feature') {
                var idx = pt.indexOf(point);
                self._remove(idx);
            }
        };
        /**
         * Recalculates the grid.
         */
        GriddedDataSource.prototype._recalculate = function () {
            var self = this;
            //Throttling logic to prevent performance issues caused by multiple recalulation requests in a short period of time. i.e. Calling the add function in a loop.
            if (this._requestId !== undefined) {
                return;
            }
            else {
                self._requestId = requestAnimationFrame(function () {
                    self._gridInfo = GridMath.calculateGrid(self._points, self._pixels, self._options);
                    self._updateCells();
                    self._requestId = undefined;
                });
            }
        };
        /**
         * Recalculates the cell coordinates. This is done when the same grid system is used, and the only change is related to scaling or representing cells differently (hex -> hex circle)
         */
        GriddedDataSource.prototype._recalculateCoords = function () {
            var self = this;
            GridMath.recalculateCoords(self._gridInfo, self._options);
            self._updateCells();
        };
        /** Updates the data source with the newly calculated cells. */
        GriddedDataSource.prototype._updateCells = function () {
            _super.prototype['_clearNoUpdate'].call(this);
            _super.prototype.add.call(this, this._gridInfo.cells);
        };
        return GriddedDataSource;
    }(azmaps.source.DataSource));



    var baseSource = /*#__PURE__*/Object.freeze({
        __proto__: null,
        GriddedDataSource: GriddedDataSource
    });

    /**
    * Specifies how data is rendered wintin a grid system.
    */
    (function (GridType) {
        /* Renders data within a square grid as circles. */
        GridType["circle"] = "circle";
        /* Renders data within a hexagons grid. */
        GridType["hexagon"] = "hexagon";
        /* Renders data within a hexagon grid as circles. */
        GridType["hexCircle"] = "hexCircle";
        /* Renders data within a rotate hexagon grid. */
        GridType["pointyHexagon"] = "pointyHexagon";
        /* Renders data within a square grid. */
        GridType["square"] = "square";
        /** Renders data within a triangular grid. */
        GridType["triangle"] = "triangle";
    })(exports.GridType || (exports.GridType = {}));

    var source = Namespace.merge("atlas.source", baseSource);

    exports.source = source;

}(this.atlas = this.atlas || {}, atlas));
