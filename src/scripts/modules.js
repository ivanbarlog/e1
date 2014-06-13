define([
    'module/data',
    'module/session',
    'module/gui',
    'module/index'
], function(
    DataModule,
    SessionModule,
    GuiModule,
    IndexModule
) {
    'use strict';
    
    return {
        // List of modules to load at app initialisation.
        init: {
            Data: DataModule,
            Session: SessionModule,
            Gui: GuiModule,
            Index: IndexModule
        }
    };
});