e1
==

The code in this repository provides a comprehensive blueprint for developing complex client-side web applications.

## Getting it running

The provisioning and building of the application has been automated using Vagrant, VirtualBox, npm, bower & grunt.

 1. **Check out this repo**

    ```
    git clone git@github.com:rthrfrd/e1.git
    ```

 2. **Install VirtualBox** - [https://www.virtualbox.org/wiki/Downloads]

    The virtual machine in which the application runs requires VirtualBox to provide the virtualisation.

 3. **Install Vagrant** - [http://www.vagrantup.com/downloads.html]

    Vagrant is used to automatically provision the virtual machine using a shell script.
    The provisioning installs all the required dependencies for developing the application, leaving your OS unaffected.

 3. **Provision the VM**

    From the command line, navigate to your cloned repository directory and run:
    ```
    vagrant up
    ```
    
 4. **Build the application**

    Once provisioning has been completed, we can log in to the VM and build the production version of the app:
    ```
    vagrant ssh
    cd /vagrant
    grunt
    ```
    You can call `grunt` to build the application at any time.
    
 5. **Use it**
    
    While logged into the VM, run (from the `/vagrant` directory):
    ```
    grunt serve
    ```
    The application will now be running at:
      * http://127.0.0.1:8891 - Source code (development)
      * http://127.0.0.1:8892 - Compiled code (production)

 6. **Destroy it**
    
    Log out of the VM (CTRL + D) and run `vagrant halt` to shutdown the VM, or `vagrant destroy` to completely remove it. You can bring it back again at any time by running `vagrant up`.

## What it does

This repo provides everything you need to:

  * Provision a VM completed with all dependencies for developing and building the app.
  * Develop an application using a full stack of front-end development libraries including:
    * __Package managers:__ npm, bower
    * __Dependency injection:__ require.js
    * __Framework (ish):__ backbone + marionette
    * __Templating:__ underscore
    * __CSS extensions:__ less
    * __Testing & building:__ jshint, jasmine, phantomjs, closure
    * __Task runner:__ grunt
    * __Vendor libraries:__
      * UI libraries such as Bootstrap for developing interfaces quickly.
      * Everything else...
  * Build the application from source and optimise for production, including:
    * Pre-processing source files to target different environments.
    * Compiling all JavaScript modules and dependencies into a single file and optimising.
    * Compiling all less (CSS) sheets and dependencies into a single file and optimising.
    * Pre-compiling and inling all templates into the single JavaScript file.
  * Run source *(development)* and compiled *(production)* versions of the app simultaneously.


## Notes

A few things to bear in mind:

  * The application is structured to run fully in its completely uncompiled state, so you do not need to compile during development, or run any 'watcher' commands in the background to automatically recompile scripts or styles.
  * Targets can be specified for the build. Their paramaters are defined in `package.json` and invoked by setting the `target` parameter, e.g. `grunt --target=production`.
  * The `server` code is not particularly relevant or complete and is only there to power the example.
  * If you see an npm error while provisioing the VM relating to 'graceful-fs' you probably don't need to worry about it.
  * More to come...

## To-do
  * Just like a real application, there aren't any tests demonstrating phantom and jasmine yet.
  * Annotate the code.
