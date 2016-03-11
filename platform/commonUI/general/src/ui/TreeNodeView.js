/*****************************************************************************
 * Open MCT Web, Copyright (c) 2014-2015, United States Government
 * as represented by the Administrator of the National Aeronautics and Space
 * Administration. All rights reserved.
 *
 * Open MCT Web is licensed under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * Open MCT Web includes source code licensed under additional open source
 * licenses. See the Open Source Licenses file (LICENSES.md) included with
 * this source code distribution or the Licensing information page available
 * at runtime from the About dialog for additional information.
 *****************************************************************************/
/*global define*/

define([
    'angular',
    'text!../../res/templates/tree/node.html',
    './ToggleView',
    './TreeLabelView'
], function (angular, nodeTemplate, ToggleView, TreeLabelView) {
    'use strict';

    var $ = angular.element.bind(angular);

    function TreeNodeView(subtreeFactory) {
        this.li = $('<li>');

        this.toggleView = new ToggleView(false);
        this.toggleView.observe(function (state) {
            if (state) {
                if (!this.subtreeView) {
                    this.subtreeView = subtreeFactory();
                    this.subtreeView.model(this.activeObject);
                }
                $(this.subtreeView.elements()).removeClass('hidden');
            } else if (this.subtreeView) {
                $(this.subtreeView.elements()).addClass('hidden');
            }
        }.bind(this));

        this.labelView = new TreeLabelView();

        this.li.append($(nodeTemplate));
        this.li.find('span').eq(0)
            .append(this.toggleView.elements())
            .append(this.labelView.elements());

        this.model(undefined);
    }

    TreeNodeView.prototype.model = function (domainObject) {
        if (this.unlisten) {
            this.unlisten();
        }

        this.activeObject = domainObject;

        if (domainObject && domainObject.hasCapability('composition')) {
            $(this.toggleView.elements()).addClass('has-children');
        } else {
            $(this.toggleView.elements()).removeClass('has-children');
        }

        this.labelView.model(domainObject);
        if (this.subtreeView) {
            this.subtreeView.model(domainObject);
        }
    };

    /**
     *
     * @returns {HTMLElement[]}
     */
    TreeNodeView.prototype.elements = function () {
        return this.li;
    };


    return TreeNodeView;
});