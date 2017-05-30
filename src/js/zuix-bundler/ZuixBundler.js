/**
 * Copyright 2015-2017 G-Labs. All Rights Reserved.
 *         https://genielabs.github.io/zuix
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 *
 *  This file is part of
 *  ZUIX, Javascript library for component-based development.
 *        https://genielabs.github.io/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 */

"use strict";

var fileSaver = require('./FileSaver');
var serialize = require('./Serializer');

/**
 * Create application bundle containing all components
 * and resources used in the app. This method can be called
 * from the browser developer console. When using lazy-loading
 * only components loaded so far will be bundled (incremental bundle).
 * To force inclusion of all components/resources
 * disable lazy-loading first by calling
 * `zuix.lazyLoad(false)` and then `zuix.saveBundle()`.
 * After the bundle is created it will be downloaded
 * by the browser as 'app.bundle.js' file that you can
 * then compress, copy and include in your app.
 * This will speed-up resource loading and improve
 * user experience.
 *
 */
function saveBundle() {
    var bundle = serialize(zuix.bundle());
    // revert loaded status before exporting
    bundle = bundle.replace(/data-ui-loaded=\\"true\\"/g, 'data-ui-loaded=\\"false\\"');
    bundle = bundle.replace(/zuix-loaded=\\"true\\"/g, 'zuix-loaded=\\"false\\"');
    // save bundle
    var blob = new Blob(['zuix.bundle(' + bundle + ');'], {type: "text/plain;charset=utf-8"});
    fileSaver.saveAs(blob, "app.bundle.js");
    return bundle;
}

module.exports = function (root) {
    if (zuix == null) {
        alert('Error: ZuixBundler requires Zuix to be included first.');
        return;
    }
    zuix.saveBundle = saveBundle;
    return zuix;
};
