location.hash = '#splash';

// Define libraries
require.config({
    baseUrl: 'static/js/',
    paths: {
        mocha: 'lib/mocha-1.4.2',
        chai: 'lib/chai-1.2.0',
        jquery: 'lib/jquery-1.8.3',
        jqueryUi: 'lib/jquery-ui-1.9.1.custom',
        text: 'lib/require/text',
        ember: 'lib/ember-1.0.0-pre.2',
        handlebars: 'lib/handlebars-1.0.rc.1',
        mobile: 'lib/jquery.mobile-1.2.0',
        d3: 'lib/d3-2.10.1',
        cubism: 'lib/cubism-1.2.2',
        md5: 'lib/md5',
        sha256: 'lib/sha256'
    },
    shim: {
        'ember': {
            deps: ['handlebars', 'text', 'jquery', 'md5', 'sha256']
        },
        'jqueryUi': {
            deps: ['jquery']
        },
        'mobile': {
           deps: ['ember']
        },
        'd3': {
            deps: ['jquery']
        },
        'cubism':{
            deps: ['d3']
        }
    }
});

// Load our app
define( 'app', [
    'jquery',
    'jqueryUi',
    'd3',
    'app/controllers/backends',
    'app/controllers/confirmation',
    'app/controllers/notification',
    'app/controllers/backend_add',
    'app/controllers/machine_add',
    'app/controllers/key_add',
    'app/controllers/select_machines',
    'app/controllers/select_images',
    'app/controllers/keys',
    'app/controllers/rules',   
    'app/views/home',
    'app/views/count',
    'app/views/backend_button',
    'app/views/backend_add',
    'app/views/backend_edit',
    'app/views/machine_list_item',
    'app/views/image_list_item',
    'app/views/machine_add_dialog',
    'app/views/machine',
    'app/views/machine_list',
    'app/views/machine_key_list_item',
    'app/views/confirmation_dialog',
    'app/views/machine_actions_dialog',
    'app/views/single_machine_actions_dialog',
    'app/views/shell',
    'app/views/image_list',
    'app/views/delete_tag',
    'app/views/machine_tags_dialog',
    'app/views/machine_monitoring_dialog',
    'app/views/key_list_item',
    'app/views/key_list',
    'app/views/key',
    'app/views/key_add_dialog',
    'app/views/key_associate_dialog',
    'app/views/key_priv_dialog',
    'app/views/key_machine_list_item',
    'app/views/rule',
    'app/views/user_menu',
    'mobile',
    'cubism',
    'ember'
    ], function($,
                jQueryUI,
                d3,
                BackendsController,
                ConfirmationController,
                NotificationController,
                BackendAddController,
                MachineAddController,
                KeyAddController,
                SelectMachinesController,
                SelectImagesController,
                KeysController,
                RulesController,
                Home,
                Count,
                BackendButton,
                AddBackend,
                EditBackend,
                MachineListItem,
                ImageListItem,
                MachineAddDialog,
                MachineView,
                MachineListView,
                MachineKeyListItem,
                ConfirmationDialog,
                MachineActionsDialog,
                SingleMachineActionsDialog,
                Shell,
                ImageListView,
                DeleteTagView,
                MachineTagsDialog,
                MachineMonitoringDialog,
                KeyList,
                KeyListView,
                KeyView,
                KeyAddDialog,
                KeyAssociateDialog,
                KeyPrivDialog,
                KeyMachineListItem,
                RuleView,
                UserMenuView,
                Mobile,
                cubism
                ) {

        var mobileinit = false;
        $(document).bind('pageinit', function() {
            if (mobileinit){
                return
            }

            mobileinit = true;

            var App = Ember.Application.create({

                VERSION: '0.3-ember',

                // Sets up mocha to run some integration tests
                specsRunner: function( chai ) {
                    // Create placeholder for mocha output
                    $( document.body ).before( '<div id="mocha"></div>' );

                    // Setup mocha and expose chai matchers
                    window.expect = chai.expect;
                    mocha.setup('bdd');

                    // Load testsuite
                    require([
                        'app/specs/templates/basic_acceptance'
                    ], function() {
                            mocha.run().globals( [ '$', 'Ember', 'Mist' ] );
                        }
                    );
                },

                // Constructor
                init: function() {
                    this._super();

                    this.set(
                        'backendsController',
                        BackendsController.create()
                    );

                    this.set(
                        'backendAddController',
                        BackendAddController.create()
                    );

                    this.set(
                        'confirmationController',
                        ConfirmationController.create()
                    );

                    this.set(
                        'notificationController',
                           NotificationController.create()
                    );

                    this.set(
                        'machineAddController',
                        MachineAddController.create()
                    );

                    this.set(
                        'selectMachinesController',
                        SelectMachinesController.create()
                    );

                    this.set(
                        'selectImagesController',
                        SelectImagesController.create()
                    );

                    this.set(
                            'keysController',
                            KeysController.create()
                        );
                        
                    this.set(
                            'rulesController',
                            RulesController.create()
                        );                        

                    this.set(
                            'keyAddController',
                            KeyAddController.create()
                        );

                    this.set(
                            'authenticated',
                            URL_PREFIX==''?true:false
                        );

                    this.set(
                            'email',
                            ''
                        );

                     this.set(
                            'password',
                            ''
                        );

                    // Run specs if asked
                    if ( location.hash.match( /specs/ ) ) {
                        require( [ 'chai', 'mocha' ], this.specsRunner );
                    }
                    
                    setTimeout(function(){
                        $.mobile.changePage('#home', { transition: 'fade' });
                        Mist.emailReady();
                        if (EMAIL != '') {
                            Mist.set('authenticated', true);
                        }
                    }, 2000);


                },
                
                emailReady: function(){
                    if (this.email && this.password){
                        $('#auth-ok').button('enable');
                    } else {
                        try{
                            $('#auth-ok').button('disable');
                        } catch(e){
                            $('#auth-ok').button();
                            $('#auth-ok').button('disable');
                        }
                    }
                }.observes('email'),
                
                passReady: function(){
                    this.emailReady();
                }.observes('password')
                              
            });
            
            $(document).on( 'pagebeforeshow', '#machines', function() {
                $('#machines-list').listview('refresh');
            });

            $(document).on( 'popupbeforeposition', '#dialog-power', function() {
                $("#dialog-power a").button();
            });

            $(document).on( 'popupbeforeposition', '#dialog-single-power', function() {
                $("#dialog-single-power a").button();
            });

            $(document).on( 'popupbeforeposition', '#monitoring-dialog', function() {
                $("#single-machine").trigger('pagecreate');
            });

            $(document).on( 'pagebeforeshow', '#images', function() {
                $("#images-list").listview('refresh');
            });

            $(document).on( 'pagebeforeshow', '#single-machine', function() {
                Mist.set('graphPolling', true);
            });

            $(document).on( 'pageshow', '#single-machine', function() {
                $(".monitoring-button").button();
            });

            $(document).on( 'pagebeforehide', '#single-machine', function() {
                Mist.set('graphPolling', false);
                Mist.set('machine', null);
            });

            // Console toggle behavior
            $(document).ready(function() {
                $('#shell-return').on('click', '.command', function() {
                    var out = $(this).next('.output');
                    if (out.is(':visible')) {
                        out.slideUp(300);
                        $(this).parent().addClass('contracted').removeClass('expanded');
                    } else {
                        out.slideDown(200);
                        $(this).parent().removeClass('contracted').addClass('expanded');
                    }
                });
            });

            function showRuleSlider(){
                    $(this).parent().children('.ui-slider').fadeIn(100);
                    return false;
            }
            function hideRuleSlider(){
                    $('.ui-slider').fadeOut(100);
            }

            // monitoring rule slider toggle
            $('input.rule-value').live('mouseover', showRuleSlider);
            $('input.rule-value').live('click', showRuleSlider);

            $('.rule-box').live('mouseleave', hideRuleSlider)
            $('#single-machine').live('tap', hideRuleSlider);

            App.Select = Ember.Select.extend({
                attributeBindings: [
                    'name',
                    'data-theme',
                    'data-icon',
                    'data-native-menu',
                    'disabled'
                ],
            });

            App.TextField = Ember.TextField.extend({
                attributeBindings: [
                    'name',
                    'data-theme'
                ]
            });

            App.ShellTextField = Ember.TextField.extend({
                attributeBindings: [
                    'name',
                    'data-theme',
                    'autocapitalize'
                ],

                insertNewline: function() {
                    this._parentView.submit();
                }
            });

            App.Checkbox = Ember.Checkbox.extend({
                attributeBindings: [
                    'name',
                    'id',
                    'data-inline'
                ],
            });

            Ember.TextArea.reopen({
                attributeBindings: ["name", "placeholder", "id"]
              });
            
            App.HomeView = Home;
            App.CountView = Count;
            App.BackendButtonView = BackendButton;
            App.AddBackendView = AddBackend;
            App.EditBackendView = EditBackend;
            App.MachineListItemView = MachineListItem;
            App.ImageListItemView = ImageListItem;
            App.DeleteTagView = DeleteTagView;
            App.KeyListView = KeyList;
            App.RuleView = RuleView;
            App.UserMenuView = UserMenuView;
            App.KeyMachineListItemView = KeyMachineListItem;
            App.MachineKeyListItemView = MachineKeyListItem;

            var homeView = Home.create();
            homeView.append();
            
            var machineView = MachineView.create();
            machineView.append();

            var confirmationDialog = ConfirmationDialog.create();
            confirmationDialog.append();

            var dialog = SingleMachineActionsDialog.create();
            dialog.appendTo("#single-machine");
            var shellDialog = Shell.create();
            shellDialog.appendTo("#single-machine");
            var machineTagsDialog = MachineTagsDialog.create();
            machineTagsDialog.appendTo("#single-machine");

            var machineListView = MachineListView.create();
            machineListView.append();
            var addDialog = MachineAddDialog.create();
            addDialog.append();
            shellDialog = Shell.create();
            shellDialog.appendTo("#machines");
            var machineActionsDialog = MachineActionsDialog.create();
            machineActionsDialog.appendTo("#machines");
            machineTagsDialog = MachineTagsDialog.create();
            machineTagsDialog.appendTo("#machines");

            var imageListView = ImageListView.create();
            imageListView.append();

            var machineMonitoringDialog = MachineMonitoringDialog.create();
            machineMonitoringDialog.appendTo("#single-machine");

            $(document).on( 'pagebeforeshow', '#dialog-add', function(){
                $('#dialog-add').trigger('create');
            });

            var keyListView = KeyListView.create();
            keyListView.append();

            var keyView = KeyView.create();
            keyView.append();

            var keyPrivDialog = KeyPrivDialog.create();
            keyPrivDialog.append();

            var keyAddDialog = KeyAddDialog.create();
            keyAddDialog.appendTo("#keys");

            var keyAssociateDialog = KeyAssociateDialog.create();
            keyAssociateDialog.append();

            // Expose the application globally
            window.Mist = App;
            App.initialize();
            return App
        });
    }
);

//LOGLEVEL comes from home python view and home.pt
function log() {
    try {
        if (LOGLEVEL > 3) {
            return console.log.apply(console, arguments);
        }
    } catch(err) {console.log(err);}
}

function info() {
    try {
        if (LOGLEVEL > 2) {
            return console.info.apply(console, arguments);
        }
    } catch(err) {console.log(err);}
}

function warn() {
    try {
        if (LOGLEVEL > 1) {
            return console.warn.apply(console, arguments);
        }
    } catch(err) {console.log(err);}
}

function error() {
    try {
        if (LOGLEVEL > 0) {
            return console.error.apply(console, arguments);
        }
    } catch(err) {console.log(err);}
}

var collectd_install_target = false, collectd_uninstall_target = false, collectd_lastlog="";

function appendShell(data){
    var line = data.trim();
    
    if (data.length){
        warn(Date() + ': ' + data);
    }
    
    if (collectd_install_target) {
        if (line != '<br/>') {
            collectd_lastlog = line;
        }
        // TODO: display collectd install output        
    } else if (collectd_uninstall_target){
        if (line != '<br/>') {
            collectd_lastlog = line;
        }
        // TODO: display collectd uninstall output        
    } else {
        var target_page = $($.mobile.activePage);
        var output = target_page.find('.shell-return .output').first();
        if (data.length) {
            output.append(data);
            output.scrollTop(10000);
        } else {
            that.set('pendingShell', false);
            target_page.find('.shell-return .pending').removeClass('pending');
        }          
    }
}

function completeShell(ret){
    $('iframe').remove();
    Mist.machine.set('pendingShell', false);
    $('.shell-return .pending').removeClass('pending');
    if (collectd_install_target) {
        if (collectd_lastlog.search('root') == -1){
            // TODO: display instruction for manual installation
            // alert('collectd install failed');
        }        
        collectd_install_target.set('hasMonitoring', true);                        
        collectd_install_target.set('pendingMonitoring', false);
        $('.pending-monitoring h1').text('Enabling monitoring');          
        collectd_install_target = false;
    } else if (collectd_uninstall_target) {
        collectd_uninstall_target.set('hasMonitoring', false);                        
        collectd_uninstall_target.set('pendingMonitoring', false);
        $('.pending-monitoring h1').text('Enabling monitoring');          
        collectd_uninstall_target = false;
    }
    $('body').append('<iframe id="hidden-shell-iframe"></iframe');
}
