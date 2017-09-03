
# My Todo

This project was part of training at <a href='http://www.nagarro.com/en'>Nagarro</a> which was provided by <a href='https://codingblocks.com/'>Codingblocks.</a> 
This is a simple Todo application with both backend and frontend code.

</br>


<img src='http://i.imgur.com/9kvmcD4.png'/>

## OCD Triggers

<b>Too much useles rendering.</b></br>
In current implementation, list is re-rendered for <b>ALL</b> items for <b>ANY</b> request. 
This needs fixing.

</br>

<b>No batch requests</b>
Server does not accept batch requests, as of now. To activate/complete/delete multiple items, multiple requests are sent.
Due to above poor implementation, each response re-renders entire list again.
What should have been 1 request, 1 response, 1 render, turns to be multiple request, response and tons of useless rendering.

</br>

<b>Poor frontend interface</b>
Too many functions perform same operation, but over different datasets. Instead of making multiple functions, functions should accept the dataset as parameter.

```javascript
//CURRENT INTERFACE
onActivate, onComplete, onDeleteActive, onDeleteComplete 

//POSSIBLY BETTER INTERFACE
setStatus(STATUS, [dataset]); 
```

</br>

<b>Non Context Aware Components</b>
Currently the DOM elements are not aware of context, hence reqiring redundant functions for similar task.

```
handleCompleteCheckboxClick, handleActiveCheckboxClick
```

These two functions perform same task but on different but similar DOM elements. Need to find a way to make a generic function that works for both.

</br>

## Built With

* [Node.js](https://nodejs.org/en/) - Runtime for Backend Code.
* [Express.js](https://expressjs.com) - Backend API Routes.
* [Bootstrap](https://getbootstrap.com/) - Frontend Responsive Webpage.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details
