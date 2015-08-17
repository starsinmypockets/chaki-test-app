/*jslint browser: true ,undef: true *//*global Ext*/
Ext.define('SlateAdmin.API', {
    extend: 'Emergence.util.AbstractAPI',
    singleton: true,
    
    // example function
    getMySections: function(callback, scope) {
        this.request({
            url: '/sections/json',
            method: 'GET',
            params: {
                AllCourses: 'false'
            },
            success: callback,
            scope: scope
        });
    }
}, function(API) {
    var pageParams = Ext.Object.fromQueryString(location.search);

    // allow API host to be overridden via apiHost param
    if (pageParams.apiHost) {
        API.setHostname(pageParams.apiHost);
        API.setUseSSL(false);
    }
});