# introduction to react
react is a javascript library that aims to simplify the devlopment of hight interactive interfaces.<br>
its primary goal is to make it easy to reason about an interface and its state at any point in time, by dividing the ui into a **collection of components**

so i can easly navigate react easly i need to know those concepts of the javascript 
* variables
* function, arraw function
* objects and arrays
* work with objects and arrays using **rest and spread**
* object and array destructing
* template literals
* callbacks
* ES modules

# React component
1. we can declare function and inside a function we can do something like fetch data, or inspect the current state of the application.
then we can return something from the function, and that will be rendered by React on the page.
2. component has some special characteristic : 
    * it must have a name that starts with a capital letter, like App
    * a component can have it own state, wish means that it encapsulate some variables that other component can't access unless this component exposes this state to the rest of the application.
    * it can also receive data from other component, and this case we can talks about **props**

## JSX