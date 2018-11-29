var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * A class for creating Pie Charts as Markers on a map.
 */
var PieChartMarker = /** @class */ (function (_super) {
    __extends(PieChartMarker, _super);
    /**
     * Creates an HTML Marker in the shape of a pie chart.
     * @param options Options for rendering the Pie Chart marker.
     * @param tooltipCallback A callback handler which defines the value of a tooltip for a slice of the pie.
     */
    function PieChartMarker(options, tooltipCallback) {
        var _this = _super.call(this, options) || this;
        _this.chartOptions = {
            values: [],
            radius: 40,
            colors: ['#3366CC', '#DC3912', '#FF9900', '#109618', '#990099'],
            strokeThickness: 0,
            strokeColor: '#666666'
        };
        _this.totalValue = 0;
        _super.prototype.setOptions.call(_this, {
            htmlContent: document.createElement('div'),
            pixelOffset: [0, 0]
        });
        _this.tooltipCallback = tooltipCallback;
        _this.tooltip = document.createElement('div');
        _this.tooltip.id = 'pieChartTooltip_' + PieChartMarker.__idCounter++;
        _this.tooltip.style.position = 'absolute';
        _this.tooltip.style.display = 'none';
        _this.tooltip.className = 'pieChartTooltip';
        document.body.appendChild(_this.tooltip);
        var tooltipClass = document.createElement('style');
        tooltipClass.innerHTML = '.pieChartTooltip {background: white;border: 1px solid black;border-radius: 5px;padding: 5px;}';
        document.body.appendChild(tooltipClass);
        _this.setOptions(options);
        return _this;
    }
    PieChartMarker.prototype.getTotalValue = function () {
        return this.totalValue;
    };
    PieChartMarker.prototype.getSliceValue = function (idx) {
        return (idx >= 0 && idx < this.chartOptions.values.length) ? this.chartOptions.values[idx] : 0;
    };
    PieChartMarker.prototype.getSlicePercentage = function (idx) {
        return (this.totalValue > 0) ? Math.round(this.getSliceValue(idx) / this.totalValue * 10000) / 100 : 0;
    };
    PieChartMarker.prototype.getOptions = function () {
        return this.merge_options(_super.prototype.getOptions.call(this), this.chartOptions);
    };
    PieChartMarker.prototype.setOptions = function (options) {
        var rerender = false;
        if (options.radius && options.radius > 0 && options.radius != this.chartOptions.radius) {
            this.chartOptions.radius = options.radius;
            rerender = true;
        }
        if (options.strokeThickness && options.strokeThickness > 0 && options.strokeThickness != this.chartOptions.strokeThickness) {
            this.chartOptions.strokeThickness = options.strokeThickness;
            rerender = true;
        }
        if (options.colors && JSON.stringify(options.colors) !== JSON.stringify(this.chartOptions.colors)) {
            this.chartOptions.colors = options.colors;
            rerender = true;
        }
        if (options.values && JSON.stringify(options.values) !== JSON.stringify(this.chartOptions.values)) {
            this.chartOptions.values = options.values;
            rerender = true;
        }
        if (options.strokeColor && options.strokeColor !== this.chartOptions.strokeColor) {
            this.chartOptions.strokeColor = options.strokeColor;
            rerender = true;
        }
        if (options.tooltipCallback !== undefined && this.tooltipCallback != options.tooltipCallback) {
            this.tooltipCallback = options.tooltipCallback;
        }
        if (options.metadata !== undefined) {
            this.chartOptions.metadata = options.metadata;
        }
        if (options.htmlContent !== undefined) {
            options.htmlContent = null;
        }
        if (rerender) {
            this.render();
        }
        _super.prototype.setOptions.call(this, options);
    };
    PieChartMarker.prototype.render = function () {
        var startAngle = 0, angle = 0;
        var data = this.chartOptions.values;
        var radius = this.chartOptions.radius;
        if (data) {
            this.totalValue = data.reduce(function (a, b) {
                return a + b;
            }, 0);
            var diameter = 2 * (radius + this.chartOptions.strokeThickness);
            var svg = ['<svg xmlns="http://www.w3.org/2000/svg" width="', diameter, 'px" height="', diameter, 'px" style="cursor:pointer">'];
            var cx = radius + this.chartOptions.strokeThickness, cy = radius + this.chartOptions.strokeThickness;
            var tooltip = '';
            for (var i = 0; i < data.length; i++) {
                angle = (Math.PI * 2 * (data[i] / this.totalValue));
                if (this.tooltipCallback) {
                    tooltip = this.tooltipCallback(this, i);
                }
                svg.push(this.createArc(cx, cy, radius, startAngle, angle, this.chartOptions.colors[i], tooltip));
                startAngle += angle;
            }
            svg.push('</svg>');
            _super.prototype.getOptions.call(this).htmlContent.innerHTML = svg.join('');
        }
    };
    PieChartMarker.prototype.createArc = function (cx, cy, r, startAngle, angle, fillColor, tooltip) {
        var x1 = cx + r * Math.sin(startAngle);
        var y1 = cy - r * Math.cos(startAngle);
        var x2 = cx + r * Math.sin(startAngle + angle);
        var y2 = cy - r * Math.cos(startAngle + angle);
        //Flag for when arcs are larger than 180 degrees in radians.
        var big = 0;
        if (angle > Math.PI) {
            big = 1;
        }
        var path = ['<path d="M ', cx, ' ', cy, ' L ', x1, ' ', y1, ' A ', r, ',', r, ' 0 ', big, ' 1 ', x2, ' ', y2,
            ' Z" style="fill:', fillColor,
            ';stroke:', this.chartOptions.strokeColor,
            ';stroke-width:', this.chartOptions.strokeThickness,
            'px;" onmousemove="PieChartMarker.__showTooltip(\'', this.tooltip.id, '\', evt, \'', tooltip,
            '\');" onmouseout="PieChartMarker.__hideTooltip(\'', this.tooltip.id, '\');" /> '];
        return path.join('');
    };
    /**
     * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
     * @param obj1
     * @param obj2
     * @returns obj3 a new object based on obj1 and obj2
     */
    PieChartMarker.prototype.merge_options = function (obj1, obj2) {
        var obj3 = {};
        for (var attrname in obj1) {
            obj3[attrname] = obj1[attrname];
        }
        for (var attrname in obj2) {
            obj3[attrname] = obj2[attrname];
        }
        return obj3;
    };
    PieChartMarker.__showTooltip = function (id, evt, text) {
        if (text) {
            var tooltip = document.getElementById(id);
            tooltip.innerHTML = text;
            tooltip.style.display = 'block';
            tooltip.style.left = evt.pageX + 10 + 'px';
            tooltip.style.top = evt.pageY + 10 + 'px';
        }
    };
    PieChartMarker.__hideTooltip = function (id) {
        var tooltip = document.getElementById(id);
        tooltip.style.display = 'none';
    };
    PieChartMarker.__idCounter = 0;
    return PieChartMarker;
}(atlas.HtmlMarker));
//# sourceMappingURL=PieChartMarker.js.map