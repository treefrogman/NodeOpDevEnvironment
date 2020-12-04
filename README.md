[About](#nøde) | [Roadmap](#roadmap) | [License](#license) | [Not Node.js](#not-nodejs) | [Contact](#contact)
# Nøde
The **Nøde Operating / Development Environment** is a general purpose visual dataflow programming language and development environment. Currently there is no backend to execute programs, and all development is focused on creating a simple, visually clean and consistent interface.

The fundamental design of the language is not fully solidified. My hope is that having a prototype of the visual interface will allow quick and easy illustration of use cases / thought experiments, and thereby help nail down some of the questions regarding the fundamental design.

Please take a look at [the visual interface in its current form](https://treefrogman.github.io/NodeOpDevEnvironment/). It's built for Google Chrome.

## Roadmap
*"Go as far as you can see. When you get there you will see farther."*  
—Attribution disputed

### Here's a rough sequence of action items that should build well upon each other:
- [x] **Implement** ~~or import~~ a drag-and-drop framework that can handle all the use-cases outlined below
    - [ ] Should allow grabbing an object and scrolling the page, while the object you're holding stays put
    - [ ] Should allow dragging off the edge of the screen to automatically scroll
    - I have rarely if ever experienced a smooth implementation of this feature, let's see if we can't do better
- [x] Make nødes draggable
    - [ ] Update the Model with the nøde's new position
- [x] Make søckets draggable
    - [x] The original søcket stays put
    - [x] Dragging produces a pseudo-søcket and a cønnector
- [ ] Make pseudo-søckets snap to eligible søckets
- If not snapped to an eligible søcket, create a pseudo-nøde where the pseudo-søcket was dropped
    - Pseudo-nøde offers selection interface to choose what nøde to put there
- [ ] When a pseudo-søcket is dropped on an eligible søcket
- Remove the pseudo-søcket
- Connect the cønnector to the eligible søcket
- Update the Model with the new cønnector
- Later, limitations may be imposed:
    - A søcket may only output to one cønnector?
    - A søcket may only input from one cønnector?
    - I feel like the latter is more likely, though both or neither may be true
    - Better for illustrating thought experiments if multi-connections are allowed on both ends
- [ ] Save state to localstorage
- Save and load json files?
- [ ] Drill down into child nødes
- Implement some way of backing out of a drill-down
    - Breadcrumb?
        - In Flash, there could be multiple instances of a symbol, and when editing the symbol the breadcrumb would reflect the context of the instance from which the editing was initiated
    - "Library" of all nødes?
- [ ] Implement renaming of nødes
- [ ] Implement relabeling of søckets
- [ ] Implement choosing of søcket types
- [ ] Implement adding and removing søckets

## License
I want Nøde to be open source. Currently it is not because I have not chosen a license for it. I want to choose the license carefully because I envision a profit model for professional or private use that coexists with free access for open source uses.

## Not Node.js
Despite the similarity of the name, this project has nothing to do with Node.js

## Contact
Miles Cooley - treefrogman@gmail.com

Project Link: https://github.com/treefrogman/NodeOpDevEnvironment/
