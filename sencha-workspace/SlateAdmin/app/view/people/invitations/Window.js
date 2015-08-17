/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SlateAdmin.view.people.invitations.Window', {
    extend: 'Ext.Window',
    xtype: 'people-invitationswindow',
    requires: [
        'SlateAdmin.view.people.invitations.Panel'
    ],

    title: 'Review & Send Login Invitations',
    modal: true,
    width: 700,
    height: 600,

    layout: 'fit',
    items: [{
        xtype: 'people-invitationspanel'
    }]
});