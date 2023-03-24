var dwl_Tags = {
    'tags' : [],
    'tagsToDisplay' : [],
    'grps' : [],
    'categories' : [],
    'chromeTree' : [],
    'trees' : {},
    'folders' : [],
    'rules' : {},

    'getTags' : function(tree, params){
        var _this = this;

        if(typeof(params) === 'undefined') {
            params = {};
        }

        if(typeof(params.depth) === 'undefined' || params.depth == null) {
            params.depth = -1;
        }
        params.depth++;

        if(typeof(params.limit) !== 'undefined') {
            level = params.limit;
        }

        tags = [];
        _.each(tree, function(element, index, list) {
            tags = tags.concat(bookmarker.getBookmarkTags(element.title));
             if(typeof(element.children) !== 'undefined' && element.children.length > 0 && (typeof(level) === 'undefined' || level > depth)) {
                 tags = tags.concat(_this.getTags(element.children, params));
             }
        },tags);

        return tags.unique();

    },

    'addTree' : function(tree){
        var _this = this;
        _this.trees[tree.title] = {
            'id' : tree.id,
            'title' : tree.title,
            'children' : tree.children.length
        };
    },

    /* INSTANTIATE */
    'instantiate' : function() {
        var _this = this;
        var d = $.Deferred();


        if(typeof(bookmarker) !== 'undefined' && bookmarker.initialized) {

            _this.rules = bookmarker.rules;
            bookmarker.getChromeTrees().then(function(trees){
                _this.chromeTree = trees;
                var root = _this.chromeTree[0];
                root.title = 'root';
                _this.addTree(root);

                for (var i = 0; i < root.children.length; i++) {
                    _this.addTree(root.children[i]);
                    _this.folders.push({title : root.children[i].title});
                };
                _this.tags = _this.getTags(_this.chromeTree);
                var tagsToDisplayDetails = bookmarker.getTagsToDisplay(_this.tags);
                _this.tagsToDisplay = tagsToDisplayDetails.tagsToDisplay
                _this.grps = tagsToDisplayDetails.grps
                _this.categories = tagsToDisplayDetails.categories
                d.resolve(true);
            });

        } else {
            d.resolve(true);
        }

        return d;
    },

    'init' : function() {
        var _this = this;

        return _this.instantiate();
    }

};

