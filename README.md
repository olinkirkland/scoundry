# Scoundry

Scoundry is an easy-to-use character keeper web-app for Blades in the Dark. It's intended to be used to fill out playbooks step-by-step digitally, by choosing options from lists and responding to prompts, rather than only filling out the playbooks by hand. The idea is to consolidate the information from the playerkit (and some stuff from Deep Cuts like the new heritages and backgrounds) into a single, easy-to-use interface.

Finally, users can export their sheet as a PNG or JSON (JSON can be used to import the character back into Scoundry later or on another device, like by sharing).

## Stack

- VueJS is used, there is no server-side component. The app is hosted on GitHub Pages.
- RoughJS and Canvas are used to generate the character sheet as a PNG.