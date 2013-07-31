/*
 * jquery.flot.tooltip
 * 
 * description: easy-to-use tooltips for Flot charts
 * version: 0.6.1
 * author: Krzysztof Urbas @krzysu [myviews.pl]
 * website: https://github.com/krzysu/flot.tooltip
 * 
 * build on 2013-07-10
 * released under MIT License, 2012
*/ 
(function ($) {

    // plugin options, default values
    var defaultOptions = {
        tooltip: false,
        tooltipOpts: {
            content: "%s | X: %x | Y: %y",
            // allowed templates are:
            // %s -> series label,
            // %x -> X value,
            // %y -> Y value,
            // %x.2 -> precision of X value,
            // %p -> percent
            xDateFormat: null,
            yDateFormat: null,
            shifts: {
                x: 10,
                y: 20
            },
            defaultTheme: true,

            // callbacks
            onHover: function(flotItem, $tooltipEl) {}
        }
    };

    // object
    var FlotTooltip = function(plot) {

        // variables
        this.tipPosition = {x: 0, y: 0};

        this.init(plot);
    };

    // main plugin function
    FlotTooltip.prototype.init = function(plot) {

        var that = this;

        plot.hooks.bindEvents.push(function (plot, eventHolder) {

            // get plot options
            that.plotOptions = plot.getOptions();

            // if not enabled return
            if (that.plotOptions.tooltip === false || typeof that.plotOptions.tooltip === 'undefined') return;

            // shortcut to access tooltip options
            that.tooltipOptions = that.plotOptions.tooltipOpts;

            // create tooltip DOM element
            var $tip = that.getDomElement();

            // bind event
            $( plot.getPlaceholder() ).bind("plothover", function (event, pos, item) {
                if (item) {
                    var tipText;

                    // convert tooltip content template to real tipText
                    tipText = that.stringFormat(that.tooltipOptions.content, item);

                    $tip.html( tipText );
                    that.updateTooltipPosition({ x: item.pageX, y: item.pageX });
                    $tip.css({
                            left: that.tipPosition.x + that.tooltipOptions.shifts.x,
                            top: that.tipPosition.y + that.tooltipOptions.shifts.y
                        })
                        .show();

                    // run callback
                    if(typeof that.tooltipOptions.onHover === 'function') {
                        that.tooltipOptions.onHover(item, $tip);
                    }
                }
                else {
                    $tip.hide().html('');
                }
            });
        });
    };

    /**
     * get or create tooltip DOM element
     * @return jQuery object
     */
    FlotTooltip.prototype.getDomElement = function() {
        var $tip;

        if( $('#flotTip').length > 0 ){
            $tip = $('#flotTip');
        }
        else {
            $tip = $('<div />').attr('id', 'flotTip');
            $tip.appendTo('body').hide().css({position: 'absolute'});
        }

        return $tip;
    };

    // as the name says
    FlotTooltip.prototype.updateTooltipPosition = function(pos) {
        var tipWidth = $("#flotTip").outerWidth() / 2;
        var tipHeight = $("#flotTip").outerHeight() / 2;
        
        this.tipPosition.x = pos.x - tipWidth + this.tooltipOptions.shifts.x;
        this.tipPosition.y = pos.y - tipHeight + this.tooltipOptions.shifts.y;
    };

    /**
     * core function, create tooltip content
     * @param  {string} content - template with tooltip content
     * @param  {object} item - Flot item
     * @return {string} real tooltip content for current item
     */
    FlotTooltip.prototype.stringFormat = function(content, item) {
        if( typeof(content) === 'function' ) {
            content = content(item.series.label, item.series.data[item.dataIndex][0], item.series.data[item.dataIndex][1]);
        }
        
        return content;
    };

    // helpers just for readability
    FlotTooltip.prototype.isTimeMode = function(axisName, item) {
        return (typeof item.series[axisName].options.mode !== 'undefined' && item.series[axisName].options.mode === 'time');
    };

    FlotTooltip.prototype.isXDateFormat = function(item) {
        return (typeof this.tooltipOptions.xDateFormat !== 'undefined' && this.tooltipOptions.xDateFormat !== null);
    };

    FlotTooltip.prototype.isYDateFormat = function(item) {
        return (typeof this.tooltipOptions.yDateFormat !== 'undefined' && this.tooltipOptions.yDateFormat !== null);
    };

    //
    FlotTooltip.prototype.timestampToDate = function(tmst, dateFormat) {
        var theDate = new Date(tmst);
        return $.plot.formatDate(theDate, dateFormat);
    };

    //
    var init = function(plot) {
      new FlotTooltip(plot);
    };

    // define Flot plugin
    $.plot.plugins.push({
        init: init,
        options: defaultOptions,
        name: 'tooltip',
        version: '0.6.1'
    });

})(jQuery);
