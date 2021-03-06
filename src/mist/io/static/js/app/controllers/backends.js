define('app/controllers/backends', [
    'app/models/backend',
    'ember'
    ],
    /**
     * Backends controller
     *
     * @returns Class
     */
    function(Backend) {
        return Ember.ArrayController.extend({
            content: [],
            machineCount: 0,
            imageCount: 0,
            // TODO make this property dynamic according to all backends states
            state: "waiting",
            ok: false,

            isOK: function() {
                if(this.state == 'state-ok'){
                    this.set('ok', true);
                } else {
                    this.set('ok', false);
                }
            }.observes('state'),

            getMachineCount: function(){
                var count = 0;
                this.content.forEach(function(item){
                    count = count + item.machines.content.length;
                });
                this.set('machineCount', count);
            },

            getSelectedMachineCount: function() {
                var count = 0;
                this.content.forEach(function(item){
                    count = count + item.machines.filterProperty('selected', true).get('length');
                });
                this.set('selectedMachineCount', count);
            },

            getImageCount: function() {
                var count = 0;
                this.content.forEach(function(item){
                    count = count + item.images.get('length');
                });
                this.set('imageCount', count);
            },

            checkMonitoring: function(){
                if (!Mist.authenticated){
                    return
                }
                        
                $.ajax({
                    url: '/monitoring',
                    type: 'GET',
                    dataType: 'json',
                    headers: { "cache-control": "no-cache" },
                    success: function(data){
                        warn(data);
                        data.forEach(function(machine_tuple){
                            var b,m;
                            backend_id = machine_tuple[0];
                            machine_id = machine_tuple[1];
                            for (b=0; b < Mist.backendsController.content.length; b++) {
                                if (Mist.backendsController.content[b]['id'] == backend_id)
                                    break;
                            }

                            if (b == Mist.backendsController.content.length) {
                                return false;
                            }

                            for (m=0; m < Mist.backendsController.content[b].machines.content.length; m++){
                                if (Mist.backendsController.content[b]['machines'].content[m]['id'] == machine_id)
                                    break;
                            }

                            if (m < Mist.backendsController.content[b].machines.content.length)  {
                                Mist.backendsController.content[b].machines.content[m].set('hasMonitoring', true);
                            }
                        })
                    },
                    error: function(){
                        Mist.notificationController.notify('Error checking monitoring');
                    }
                });

            },

            init: function() {
                this._super();

                var that = this;

                that.addObserver('length', function() {
                    that.getMachineCount();
                    that.getSelectedMachineCount();
                    that.getImageCount();
                });

                Ember.run.next(function(){
                    $.getJSON('/backends', function(data) {
                        data.forEach(function(item){
                            that.pushObject(Backend.create(item));
                        });
                        that.content.forEach(function(item){
                            item.machines.addObserver('length', function() {
                                that.getMachineCount();
                            });

                            item.machines.addObserver('@each.selected', function() {
                                that.getSelectedMachineCount();
                            });

                            item.images.addObserver('length', function() {
                                that.getImageCount();
                            });

                            item.addObserver('state', function(){
                                var waiting = false;
                                var state = "ok";

                                that.content.forEach(function(backend){
                                    if (backend.error) {
                                        state = 'error';
                                    } else if(backend.state == 'waiting'){
                                        waiting = true;
                                    } else if(backend.state == 'offline'){
                                        state = 'down';
                                    }
                                });

                                if(waiting){
                                    state = 'state-wait-' + state;
                                } else {
                                    state = 'state-' + state;
                                }
                                that.set('state', state);
                            });
                        });
                    }).error(function() {
                        Mist.notificationController.notify("Error loading backends");
                    });

                    setTimeout(function(){
                        Ember.run.next(function(){
                            try {
                                $('#home-menu').listview('refresh');
                            } catch(e) { $('#home-menu').listview(); }
                        });
                        Mist.backendsController.checkMonitoring();
                    }, 5000);

                });
            }
        });
    }
);
