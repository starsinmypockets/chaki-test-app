/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SlateAdmin.controller.settings.Courses', {
    extend: 'Ext.app.Controller',


    // controller config
    views: [
        'settings.courses.Manager',
        'settings.courses.Form'
    ],

    stores: [
        'courses.Courses'
    ],

    models: [
        'course.Course'
    ],

    routes: {
        'settings/courses': 'showManager'
    },

    refs: [{
        ref: 'settingsNavPanel',
        selector: 'settings-navpanel'
    },{
        ref: 'manager',
        selector: 'courses-manager',
        autoCreate: true,

        xtype: 'courses-manager'
    },{
        ref: 'coursesFormWindow',
        selector: 'courses-form-window',
        autoCreate: true,

        xtype: 'courses-form-window'
    }],

	// controller template methods
    init: function() {
        var me = this;

        me.control({
            'courses-manager': {
                show: me.onManagerShow,
                edit: me.onCellEditorEdit,
                browsecoursesclick: me.onBrowseCoursesClick,
                deletecourseclick: me.onDeleteCourseClick
            },
            'courses-manager button[action=create-course]': {
                click: me.onCreateCourseClick
            },
            'courses-form-window button[action="save"]': {
                click: me.onSaveCourseClick
            },
            'courses-form-window form': {
                fieldvaliditychange: me.setFormValidity,
                fielderrorchange: me.setFormValidity
            }
        });
    },


    // route handlers
    showManager: function() {
        var me = this,
            navPanel = me.getSettingsNavPanel();

        Ext.suspendLayouts();

        Ext.util.History.suspendState();
        navPanel.setActiveLink('settings/courses');
        navPanel.expand(false);
        Ext.util.History.resumeState(false); // false to discard any changes to state

        me.application.getController('Viewport').loadCard(me.getManager());

        Ext.resumeLayouts(true);
    },


    // event handlers
    onManagerShow: function(managerPanel) {
        var store = Ext.getStore('courses.Courses');

        if (!store.isLoaded()) {
            managerPanel.setLoading('Loading courses&hellip;');
            store.load({
                callback: function() {
                    managerPanel.setLoading(false);
                }
            });
        }

        Ext.util.History.pushState('settings/courses', 'Courses &mdash; Settings');
    },

    onCreateCourseClick: function() {
        var me = this,
            win = me.getCoursesFormWindow(),
            form = win.down('form'),
            titleField = form.down('textfield[name="Title"]'),
            saveButton = win.down('button[action="save"]');

        form.suspendEvents();
        form.reset();
        form.resumeEvents();

        saveButton.disable();

        win.show(null,function() {
            titleField.focus();
        });
    },

    onSaveCourseClick: function() {
        var me = this,
            manager = me.getManager();
            win = me.getCoursesFormWindow(),
            form = win.down('form'),
            course = me.getCourseCourseModel().create(form.getValues());

        if (course.isValid()) {
            course.set('ID', null);

            course.save({
                success: function(rec) {
                    win.close();
                    me.getCoursesCoursesStore().add(course);
                    manager.getView().focusRow(rec);
                }
            });
        }
    },

    onDeleteCourseClick: function(grid,rec) {
        Ext.Msg.confirm('Deleting Course', 'Are you sure you want to delete this course?', function(btn) {
            if (btn == 'yes') {
                rec.erase();
            }
        });
    },

    onCellEditorEdit: function(editor, e) {
        var rec = e.record;

        if (rec.isValid()) {
            rec.save();
        }
    },

    onBrowseCoursesClick: function(grid,rec) {
        Ext.util.History.add(['course-sections', 'search', 'course:' + rec.get('Code')]);
    },

    setFormValidity: function(form) {
        var saveButton = form.up('window').down('button[action="save"]');

        if (form.isValid()) {
            saveButton.enable();
        } else {
            saveButton.disable();
        }
    }
});
