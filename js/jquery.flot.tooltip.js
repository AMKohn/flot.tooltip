/*
 * jquery.flot.tooltip
 * 
 * description: easy-to-use tooltips for Flot charts
 * version: 0.7
 * modified by Avi kohn
 * 
 * built on 2013-07-31
*/ 
(function ($) {
    var defaultOptions = {
        tooltip: false,
        tooltipOpts: {
            content: "%s | X: %x | Y: %y",
            shifts: {
                x: 0,
                y: 0
            },
            onHover: function(flotItem, $tooltipEl) {}
        }
    };

    var FlotTooltip = function(plot) {
        this.tipPosition = {x: 0, y: 0};

        this.init(plot);
    };

    FlotTooltip.prototype.init = function(plot) {

        var that = this;

        plot.hooks.bindEvents.push(function (plot, eventHolder) {
            that.plotOptions = plot.getOptions();

            if (that.plotOptions.tooltip === false || typeof that.plotOptions.tooltip === 'undefined') return;

            that.tooltipOptions = that.plotOptions.tooltipOpts;

            var $tip = that.getDomElement(plot.getPlaceholder());

            plot.getPlaceholder().bind("plothover", function (event, pos, item) {
                if (item) {
                    var tipText;

                    tipText = that.stringFormat(that.tooltipOptions.content, item);

                    $tip.html(tipText);
                    that.updateTooltipPosition({ x: item.pageX - plot.getPlaceholder().offset().left, y: item.pageY - plot.getPlaceholder().offset().top }, plot.getPlaceholder());
                    $tip.css({
                            left: that.tipPosition.x + that.tooltipOptions.shifts.x,
                            top: that.tipPosition.y + that.tooltipOptions.shifts.y
                        }).show();

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

    FlotTooltip.prototype.getDomElement = function(elm) {
        var $tip;

        if( $('#flotTip').length > 0 ){
            $tip = elm.next('#flotTip');
        }
        else {
            $tip = $('<div />').attr('id', 'flotTip');
            $tip.appendTo(elm).hide().css({position: 'absolute'});
        }

        return $tip;
    };

    FlotTooltip.prototype.updateTooltipPosition = function(pos, elm) {
        var tipWidth = $("#flotTip").outerWidth() / 2,
            tipHeight = $("#flotTip").outerHeight(),
        	elmWidth = elm.outerWidth(),
        	elmHeight = elm.outerHeight();

	    this.tipPosition.x = pos.x - tipWidth + this.tooltipOptions.shifts.x;
	    this.tipPosition.y = pos.y - tipHeight - 15 + this.tooltipOptions.shifts.y;

        while (this.tipPosition.x + tipWidth * 2 > elm.outerWidth()) this.tipPosition.x--;
        while (this.tipPosition.y + tipHeight > elm.outerHeight()) this.tipPosition.y--;

        if (this.tipPosition.x < 0) this.tipPosition.x = 0;
        if (this.tipPosition.y < 0) this.tipPosition.y = pos.y + 15 + this.tooltipOptions.shifts.y;
    };

    FlotTooltip.prototype.stringFormat = function(content, item) {
        content = content(item.series.label, item.series.data[item.dataIndex][0], item.series.data[item.dataIndex][1]);

        return content;
    };

    var init = function(plot) {
      new FlotTooltip(plot);
    };

    $.plot.plugins.push({
        init: init,
        options: defaultOptions,
        name: 'tooltip',
        version: '0.7'
    });

})(jQuery);
