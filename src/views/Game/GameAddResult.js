/*globals define*/
define(function(require, exports, module) {

    var Engine = require('famous/core/Engine');
    var View = require('famous/core/View');
    var ScrollView = require('famous/views/Scrollview');
    var SequentialLayout = require('famous/views/SequentialLayout');
    var RenderController = require('famous/views/RenderController');
    var Lightbox = require('famous/views/Lightbox');
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Transitionable     = require('famous/transitions/Transitionable');
    var Transform = require('famous/core/Transform');
    var Matrix = require('famous/core/Transform');
    var RenderNode         = require('famous/core/RenderNode')

    var ContainerSurface    = require("famous/surfaces/ContainerSurface");

    var Utility = require('famous/utilities/Utility');

    var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');
    var NavigationBar = require('famous/widgets/NavigationBar');
    var GridLayout = require("famous/views/GridLayout");

    // Views
    var StandardHeader = require('views/common/StandardHeader');

    // Subviews (types of result inputs)
    var GameAddResult_WinLoseTieView = require('./GameAddResult_WinLoseTie');
    var GameAddResult_PlacesView = require('./GameAddResult_Places');

    // Extras
    var Utils = require('utils');

    // Models
    var SportModel = require('models/sport');

    function PageView(params) {
        var that = this;
        View.apply(this, arguments);
        this.params = params;

        if(!this.params.App.Cache.ResultOptions){
            App.history.back();
            return;
        }

        // Add to new ".passed" params, separate from this.params.App and other root-level arguments/objects
        this.params.passed = _.extend({
            title: 'Enter Results',
            back_to_default_hint: true
        }, App.Cache.ResultOptions || {});

        // Create according to the model's "result_type"
        this.model = this.params.App.Cache.ResultOptions.sport;
        switch(this.model.get('result_type')){
            case '1v1':
                if(this.model.get('ties_allowed') === true){
                    var subView = new GameAddResult_WinLoseTieView(this.params);
                    this.add(subView);
                }
                break;
            case 'free-for-all':
                if(this.model.get('ties_allowed') === true){
                    var subView = new GameAddResult_PlacesView(this.params);
                    this.add(subView);
                }
                break;
            default:
                alert('Failed loading type of sport');
                return;
        }

    };

    PageView.prototype = Object.create(View.prototype);
    PageView.prototype.constructor = PageView;

    PageView.prototype.inOutTransition = function(direction, otherViewName, transitionOptions, delayShowing, otherView, goingBack){
        var that = this;

        this._eventOutput.emit('inOutTransition', arguments);

        switch(direction){
            case 'hiding':
                switch(otherViewName){

                    default:
                        // Overwriting and using default identity
                        transitionOptions.outTransform = Transform.identity;

                        break;
                }

                break;
            case 'showing':
                if(this._refreshData){
                    window.setTimeout(this.refreshData.bind(this), 1000);
                }
                this._refreshData = true;
                switch(otherViewName){

                    default:

                        // No animation by default
                        transitionOptions.inTransform = Transform.identity;

                        break;
                }
                break;
        }
        
        return transitionOptions;
    };



    PageView.DEFAULT_OPTIONS = {
        header: {
            size: [undefined, 50],
            // inTransition: true,
            // outTransition: true,
            // look: {
            //     size: [undefined, 50]
            // }
        },
        footer: {
            size: [undefined, 0]
        },
        content: {
            size: [undefined, undefined],
            inTransition: true,
            outTransition: true,
            overlap: true
        }
    };

    module.exports = PageView;

});
