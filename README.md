# powcraft.net

This is the source for my personal portfolio website. Since I work primarily as a data science researcher, this website exists to help me stay (somewhat) familiar with the ever evolving world of web development. My hope is that the tools used here show experience with the overall workflow many modern websites use, regardless of specific choice. Though this may not be a perfect example of these choices, my hope is that it shows an ability and willingness to learn a new technology in this rapidly changing space. 

## Tools Used

### How do you serve your website?
The site is node based, using its route files to resolve the correct views.  This node application is running on a Digital Ocean droplet, which I interact with through an SSH connection. 

### How do you manage dependencies?
I use the NPM ecosystem and its related tools to manage dependencies.

### How do you build your javascript files?
These are built using webpack. This then generates output bundles that are placed in the static public directory. Recently, I updated my workflow to rely on just rebuilding the bundles on the 'prod' droplet instead of shuffling around the raw bundles. Looking forward to integrating more best-practices like this. 

### How do you write/generate HTML/CSS?
I make use of the Jade templating system, but would like to experiment with others. The CSS is written starting from the bootstrap toolkit. 

## Current Goals
* Update workflow and git history to no longer track public files.
* Experiment with other templating solutions.
* Automate more of the deployment workflow. Currently requires manual pulls and script calls. 